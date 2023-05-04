import { Injectable } from '@angular/core';
import { Observable, from, of, BehaviorSubject, forkJoin, EMPTY } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as platformClient from 'purecloud-platform-client-v2';
//import { triggerModel } from './trigger-details/triggerModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

// Keys for localStorage
const LANGUAGE_KEY = 'gc_language';
const ENV_KEY = 'gc_environment'

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  private client = platformClient.ApiClient.instance;
  private usersApi = new platformClient.UsersApi();
  private presenceApi = new platformClient.PresenceApi();
  private routingApi = new platformClient.RoutingApi();
  private analyticsApi = new platformClient.AnalyticsApi();
  private tokensApi = new platformClient.TokensApi();
  private architectApi = new platformClient.ArchitectApi();
  private processAutomationApi = new platformClient.ProcessAutomationApi();
  private notificationsApi = new platformClient.NotificationsApi();


  // Authorization values
  language: string = 'en-us';
  environment: string = 'mypurecloud.ie';
  accessToken = '';
  isAuthorized = new BehaviorSubject<boolean>(false);

  // Cache for presence definitions
  presenceDefinitions = new BehaviorSubject<platformClient.Models.OrganizationPresence[]>([]);
  offlinePresenceId = '';

  // Persist search values
  lastUserSearchValue = '';
  lastQueueSearchValue = '';
  lastTriggerSearchValue = '';
  lastDatatableSearchValue = '';

  constructor(private http: HttpClient) {
    // Try to get saved language and environment information from localstorage
    this.language = localStorage.getItem(LANGUAGE_KEY) || this.language;
    this.environment = localStorage.getItem(ENV_KEY) || this.environment;
  }

  private loginImplicitGrant(): Observable<platformClient.AuthData> {
    return from(this.client.loginImplicitGrant(environment.GENESYS_CLOUD_CLIENT_ID, environment.REDIRECT_URI))
      .pipe(
        map(data => {
          this.accessToken = data.accessToken;
          this.isAuthorized.next(true);
          console.log('User authorized.');
          return data;
        })
      );
  }

  initialize(): Observable<any> {
    this.client.setPersistSettings(true);
    this.client.setEnvironment(this.environment);

    return this.loginImplicitGrant().pipe(
      mergeMap(data => from(this.presenceApi.getPresencedefinitions())),
      tap(data => {
        if (!data.entities) return;

        // Get the ID of the Offline Presence
        this.offlinePresenceId = data.entities
          .find(p => p.systemPresence === 'Offline')!.id!;

        // Get the list for the other presences
        this.presenceDefinitions.next(
          data.entities.filter(p => !(p.systemPresence === 'Offline' || p.systemPresence === 'Idle'))
        );
      }),
    );
  }

  setLanguage(language: string | null): void {
    if (language) {
      this.language = language;
      localStorage.setItem(LANGUAGE_KEY, this.language);
    }
  }

  setEnvironment(environment: string | null): void {
    if (environment) {
      this.environment = environment;
      localStorage.setItem(ENV_KEY, this.environment);
    }
  }

  getUserDetails(id: string): Observable<platformClient.Models.User> {
    return from(this.usersApi.getUser(id, {
      expand: ['routingStatus', 'presence'],
    }));
  }

  getUserMe(): Observable<platformClient.Models.UserMe> {
    return from(this.usersApi.getUsersMe({
      expand: ['routingStatus', 'presence'],
    }));
  }

  getUserQueues(userId: string): Observable<platformClient.Models.UserQueue[]> {
    return from(this.routingApi.getUserQueues(userId, {}))
      .pipe(map(data => data.entities || []));
  }

  getQueueObservations(queueId: string): Observable<platformClient.Models.QueueObservationDataContainer> {
    return from(this.analyticsApi.postAnalyticsQueuesObservationsQuery({
      filter: {
        type: 'or',
        predicates: [
          {
            type: 'dimension',
            dimension: 'queueId',
            operator: 'matches',
            value: queueId
          }
        ]
      },
      metrics: ['oOnQueueUsers', 'oActiveUsers']
    }))
      .pipe(
        map(data => {
          const result = data.results ?.find(r => r.group ?.queueId === queueId);
          if (!result) throw new Error(`No results queried for ${queueId}`);

          return result;
        }),
    );
  }

  setUserPresence(userId: string, presenceId: string): Observable<platformClient.Models.UserPresence> {
    return from(this.presenceApi.patchUserPresencesPurecloud(
      userId,
      { presenceDefinition: { id: presenceId } }
    ));
  }

  logoutUser(userId: string): Observable<any> {
    return forkJoin({
      deletetoken: from(this.tokensApi.deleteToken(userId)),
      setOffline: from(this.presenceApi.patchUserPresence(userId, 'PURECLOUD', {
        presenceDefinition: { id: this.offlinePresenceId }
      })),
    });
  }

  /**
  * Logout users belonging to the queue. This includes agents that are not
  * 'on-queue'. For this sample app, we'd just take the first 100 members.
  * In order, to get ALL agents, paging of the results is needed.
  * @param queueId The Genesys Cloud Queue Id
  */
  logoutUsersFromQueue(queueId: string): Observable<any> {
    return from(this.routingApi.getRoutingQueueMembers(queueId))
      .pipe(
        mergeMap(result => {
          if (!result.entities) return EMPTY;

          const userLogoutArr = result.entities.map(user => this.logoutUser(user.id!));
          const observables = Object.assign({}, (userLogoutArr));
          console.log(observables)

          return forkJoin(observables);
        })
      )
  }


  searchUsers(term: string): Observable<platformClient.Models.User[]> {
    if (!term.trim()) {
      return of([]);
    }

    let searchBody = {
      sortOrder: 'SCORE',
      pageSize: 25,
      pageNumber: 1,
      expand: ['routingStatus', 'presence'],
      query: [{
        type: 'TERM',
        fields: ['name', 'email'],
        value: term,
        operator: 'AND'
      }]
    };

    return from(this.usersApi.postUsersSearch(searchBody))
      .pipe(map(data => data.results || []));
  }

  // DataTable functions

  getFlowsDatatables(datatatableId: string): Observable<platformClient.Models.DataTable> {
    return from(this.architectApi.getFlowsDatatable(datatatableId))
  }

  searchDatatables(term: string): Observable<platformClient.Models.DataTablesDomainEntityListing[]> {

    return from(this.architectApi.getFlowsDatatables({
      pageSize: 10, divisionId: ["f156ed3b-d99b-4e33-835d-ab624cc94828"]
    }))
      .pipe(
        map(data => data.entities || [])
      );
  }

  // Queues function
  searchQueues(term: string): Observable<platformClient.Models.Queue[]> {
    return from(this.routingApi.getRoutingQueues({
      pageSize: 10, name: `*${term}*`,
    }))
      .pipe(
        map(data => data.entities || [])
      );
  }

  activateFromQueue(joined: boolean, userId: string, queue: platformClient.Models.UserQueue): Observable<any> {
    queue.joined = joined;
    return from(this.usersApi.patchUserQueues(userId, [queue]))
      .pipe(
        map(data => data.entities || [])
      );
  }

  // Trigger functions

  getNotificationsAvailabletopics(): Observable<platformClient.Models.AvailableTopic[]> {
    let opts = {
      "expand": [], // [String] | Which fields, if any, to expand
      "includePreview": true // Boolean | Whether or not to include Preview topics
    };

    return from(this.notificationsApi.getNotificationsAvailabletopics(opts))
      .pipe(
        map(data => data.entities || [])
      );;
  }

  getTriggertopics(): Observable<string[]> {
    let opts = {
      'before': "", // String | The cursor that points to the start of the set of entities that has been returned.
      'after': "", // String | The cursor that points to the end of the set of entities that has been returned.
      'pageSize': "" // String | Number of entities to return. Maximum of 200.
    };

    return from(this.processAutomationApi.getProcessautomationTriggersTopics(opts))
      .pipe(
        map(data => data.entities || [])
      );;
  }

  searchTriggers(term: string): Observable<platformClient.Models.Trigger[]> {

    let opts = {
      'before': "", // String | The cursor that points to the start of the set of entities that has been returned.
      'after': "", // String | The cursor that points to the end of the set of entities that has been returned.
      'pageSize': "", // String | Number of entities to return. Maximum of 200.
      'topicName': term, // String | Topic name(s). Separated by commas
      //'enabled': true, // Boolean | Boolean indicating desired enabled state of triggers
      'hasDelayBy': false // Boolean | Boolean to filter based on delayBySeconds being set in triggers. Default returns all, true returns only those with delayBySeconds set, false returns those without delayBySeconds set.
    };

    return from(this.processAutomationApi.getProcessautomationTriggers(opts))
      .pipe(
        map(data => data.entities || [])
      );;
  }

  createTrigger(name: string, topicName: string): Observable<platformClient.Models.Trigger> {
    let body = {
      name: name,
      topicName: topicName,
      enabled: true,
      target: {
        type: "workflow",
        id: "788ac0b1-d14c-45f4-997e-01c66c2af303"
      },
    }; // Object | Input used to create a Trigger.

    // Create a Trigger
    return from(this.processAutomationApi.postProcessautomationTriggers(body))
  }

  updateTrigger(enabled: boolean, currentTrigger: platformClient.Models.Trigger): Observable<platformClient.Models.Trigger> {
    if (!currentTrigger ?.id) throw new Error('Empty trigger');
    currentTrigger.enabled = enabled;

    let body = {
      version: currentTrigger.version!,
      name: currentTrigger.name!,
      topicName: currentTrigger.topicName!,
      "enabled": enabled,
      target: currentTrigger.target!
    }; // Object | Input to update Trigger. (topicName cannot be updated, a new trigger must be created to use a new topicName)

    return from(this.processAutomationApi.putProcessautomationTrigger(currentTrigger.id, body));

  }

  deleteTrigger(triggerId: string) {
    let body = triggerId;
    // Delete a Trigger
    return from(this.processAutomationApi.deleteProcessautomationTrigger(body))
  }

}

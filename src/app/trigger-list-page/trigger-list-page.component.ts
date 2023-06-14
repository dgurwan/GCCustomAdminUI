import { APP_INITIALIZER, NgModule } from '@angular/core';

import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

import { debounceTime, distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';

import { FormControl, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ModalService } from '../modal/_services';


@Component({
  selector: 'app-trigger-list-page',
  templateUrl: './trigger-list-page.component.html',
  styleUrls: ['./trigger-list-page.component.css']
})


export class TriggerListPageComponent implements OnInit {

  triggers$!: Observable<platformClient.Models.Trigger[]>
  searchTerm = new BehaviorSubject<string>('');
  fetching = false;

  searchTopic!: string;

  topics!: Observable<string[]>;
  workflowsList!: Observable<platformClient.Models.Flow[]>;

  workflowsMap = new Map();

  //workflowsMap?: Map<string, string>;

  searchText: string;
  errors : string;




  currentTriggerId: string;
  currentTrigger: Observable<platformClient.Models.Trigger>;


  triggerForm = new FormGroup({
    triggerName: new FormControl('', Validators.required),
    selectedTopicCreation: new FormControl('', Validators.required),
    selectedWorkflowCreation: new FormControl('', Validators.required),
    triggerMatchingCriteria: new FormControl('{\n\"jsonPath\": \"<change here>\",\n \"operator\": \"<change here>\",\n \"value\": \"<change here>\"\n}', [Validators.required, this.validMatchingCriteria()])
  });

  selectedTopicCreation!: string;
  selectedWorkflowCreation!: string;


  constructor(
    private genesysCloudService: GenesysCloudService,
    protected modalService: ModalService
  ) { }

  ngOnInit(): void {

    this.searchText = "";
    this.init()
  }

  async init() {
    await this.builddWorkflowList();
    await this.buildTriggersList();
  }

  validMatchingCriteria(): ValidatorFn {
  console.log("called ValidatorFn");

  return (control: AbstractControl): ValidationErrors | null => {
    const error: ValidationErrors = { jsonInvalid: true };

    try {
      JSON.parse(control.value);
    } catch (e) {
      control.setErrors(error);
      return error;
    }

    control.setErrors(null);
    return null;
  };
}


  buildTriggersList() {
    console.log("calling buildTriggersData");
    this.triggers$ = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.fetching = true; }),
      switchMap((term: string) => this.genesysCloudService.searchTriggers(term)),
      tap(() => { this.fetching = false; })
    );

    this.topics = this.genesysCloudService.getTriggertopics();

    // Set the last searched term
    this.searchTerm.subscribe(term => {
      if (term) this.genesysCloudService.lastTriggerSearchValue = term;
    });

    // If there is a previoulsy searched term, display the results
    if (this.genesysCloudService.lastTriggerSearchValue) {
      console.log("SearchTrigger - lastTriggerSearchValue : ", this.genesysCloudService.lastTriggerSearchValue);
      this.searchTerm.next(this.genesysCloudService.lastTriggerSearchValue);
    }

    console.log("End buildTriggersData");

    return Promise.resolve({
      topics: this.topics
    });
  }

  builddWorkflowList() {
    console.log("calling builddWorkflowData");
    this.workflowsList = this.genesysCloudService.getWorkflows();

    this.workflowsList.forEach(flows => {
      flows.forEach(flow => {
        this.workflowsMap.set(flow.id, flow.name);
      });
    });
    console.log('workflowsMap is ', this.workflowsMap);
    console.log("End builddWorkflowData");

  }

  searchTrigger(term: string): void {
    this.searchTerm.next(term);
    console.log("SearchTrigger - term : ", term);
  }

  createTrigger(name: string | null | undefined, topicName: string, workflowId: string, matchingCriteria: string): void {
    if (name === null || name === undefined) { }
    else {
      console.log("createTrigger : ", matchingCriteria);

      this.genesysCloudService.createTrigger(name, topicName, workflowId, matchingCriteria).subscribe(data => {
        // Handle result
       console.log(data)
      }, error => {
        this.errors = error;
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
        this.ngOnInit();
        //this.triggerForm.controls['triggerName'].reset()
        this.triggerForm.reset()
      });
    }
  }

  confirmDelete(triggerId) {
    console.log("Trigger Event deleted received!", triggerId);
    this.modalService.open("modalDeleteTrigger");
    this.currentTriggerId = triggerId;
  }

  deleteTrigger() {
    console.log("receive : ", this.currentTriggerId);
    this.genesysCloudService.deleteTrigger(this.currentTriggerId)
      .subscribe(data => {
        console.log("Trigger deleted!");
        this.modalService.close();
        this.ngOnInit();
      });
  }

  editTrigger(trigger) {
    console.log("Trigger Event edit received!", trigger.name);
    this.currentTrigger = trigger;
    this.modalService.open("modalEditTrigger");
  }

  getFlowName(flowId): String {
    return this.workflowsMap.get(flowId);
  }

  refresh(event) {
    console.log("Trigger Event deletionConfirmation received!");
    this.ngOnInit();
  }

  onSubmit() {
    if (this.triggerForm.valid) {
      console.log("Form Submitted!", this.triggerForm);
      if (this.triggerForm === null || this.triggerForm === undefined) {
        console.log("name is null or undefined");
      }
      else {
        if (this.triggerForm === null || this.triggerForm === undefined) {
          console.log("name is null or undefined");
        }
        this.createTrigger(this.triggerForm.get('triggerName') ?.value, this.selectedTopicCreation, this.selectedWorkflowCreation, this.triggerForm.get('triggerMatchingCriteria') ?.value);
        this.modalService.close();
      }

    }
  }

}

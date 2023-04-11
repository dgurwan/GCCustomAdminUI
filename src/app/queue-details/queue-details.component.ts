import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-queue-details',
  templateUrl: './queue-details.component.html',
  styleUrls: ['./queue-details.component.css']
})
export class QueueDetailsComponent implements OnInit, OnChanges {
  @Input() queue?: platformClient.Models.UserQueue;
  @Input() user?: platformClient.Models.UserMe;
  @Input() hidden?: boolean = false;
  onQueueAgents = 0;
  totalAgents = 0;
  fetching = true;
  joined?: boolean = false;


  constructor(private genesysCloudService: GenesysCloudService) {
  }

  ngOnInit(): void {
    this.getQueueObservations();
    this.joined = this.queue?.joined;

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  getQueueObservations() {
    if (!this.queue) throw Error('Invalid queue.');
    this.fetching = true;

    this.genesysCloudService.getQueueObservations(this.queue.id!)
      .subscribe(result => {
        if (!result.data) throw new Error('Error in getting observations.')

        this.onQueueAgents = result.data
          .filter(d => d.metric === 'oOnQueueUsers')
          .reduce((acc, d) => acc + d.stats!.count!, 0)
        this.totalAgents = result.data
          .find(d => d.metric === 'oActiveUsers')!.stats!.count || 0;

        this.fetching = false;
      });
  }

  logoutAgents() {
    if (!this.queue ?.id) throw new Error('Empty queue');
    this.fetching = true;

    this.genesysCloudService.logoutUsersFromQueue(this.queue.id)
      .subscribe(data => {
        console.log(`Logged out all agents of ${this.queue ?.name}`);
        this.getQueueObservations();
      });
  }

  toogleActivation(userId) {
    console.log(userId);
        if (!this.queue?.id) throw new Error('Empty queue');
    this.fetching = true;
    this.joined = !this.joined;
    this.genesysCloudService.activateFromQueue(this.joined, userId, this.queue).subscribe(data => {
      console.log(data);
      if (data[0].joined) console.log(`Join ${data[0].name}`);
      else console.log(`Leave ${data[0].name}`);
      this.getQueueObservations();
    });
  }



}

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-user-queue-details',
  templateUrl: './user-queue-details.component.html',
  styleUrls: ['../queue-details/queue-details.component.css']
})
export class UserQueueDetailsComponent implements OnInit, OnChanges {
  @Input() queue?: platformClient.Models.UserQueue;
  @Input() user?: platformClient.Models.UserMe;
  @Input() hidden?: boolean = false;
  fetching = true;
  joined?: boolean = false;


  constructor(private genesysCloudService: GenesysCloudService) {
  }

  ngOnInit(): void {
    this.getQueueObservations();
    this.joined = this.queue?.joined;

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
  }

  getQueueObservations() {
    if (!this.queue) throw Error('Invalid queue.');
    this.fetching = true;

    this.genesysCloudService.getQueueObservations(this.queue.id!)
      .subscribe(result => {
        if (!result.data) throw new Error('Error in getting observations.')
        this.fetching = false;
      });
  }

  toogleActivation(userId) {
    console.log(userId);
        if (!this.queue ?.id) throw new Error('Empty queue');
    this.fetching = true;
    this.joined = !this.joined;
    this.genesysCloudService.activateFromQueue(this.joined, userId, this.queue).subscribe(data => {
      console.log(data);
      if (data[0].joined) console.log(`Left ${data[0].name}`);
      else console.log(`joined ${data[0].name}`);
      this.getQueueObservations();
    });
  }

}

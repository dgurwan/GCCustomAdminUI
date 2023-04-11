import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';

import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-trigger-details',
  templateUrl: './trigger-details.component.html',
  styleUrls: ['./trigger-details.component.css']
})
export class TriggerDetailsComponent implements OnInit, OnChanges {
    @Input() trigger?: platformClient.Models.Trigger;
    enabled?: boolean = false;

  fetching = true;

  constructor(private genesysCloudService: GenesysCloudService) {
  }

  ngOnInit(): void {
    this.getTriggerObservations();
      this.enabled = this.trigger?.enabled;
  }

  ngOnChanges(changes: SimpleChanges) {
  //  console.log(changes);
  }

  getTriggerObservations() {
    if (!this.trigger) throw Error('Invalid trigger.');
    this.fetching = true;
  }

  toogleActivation(trigger) {
    console.log("TriggerID : "+trigger?.Id);
    if (!this.trigger?.id) throw new Error('Empty queue');
    this.fetching = true;
    this.enabled = !this.enabled;

    this.genesysCloudService.updateTrigger(this.enabled, trigger).subscribe(data => {
      console.log(data);
    });
  }





}

import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import { mergeMap, map, tap } from 'rxjs/operators';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


import * as platformClient from 'purecloud-platform-client-v2';


@Component({
  selector: 'app-trigger-details',
  templateUrl: './trigger-details.component.html',
  styleUrls: ['./trigger-details.component.css']
})
export class TriggerDetailsComponent implements OnInit, OnChanges {
  @Input() trigger: platformClient.Models.Trigger;
  @Output() deleted = new EventEmitter();

  enabled: boolean = false;
  version: number;

  faCopy = faCopy;

  fetching = true;

  constructor(private genesysCloudService: GenesysCloudService) {
  }

  ngOnInit(): void {
    this.enabled = this.trigger.enabled;
    this.version = this.trigger.version;

    this.getTriggerObservations();

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
  }

  currentId(): string{
    return this.trigger.id ?? ""
  }

  getTriggerObservations() {
    if (!this.trigger) throw Error('Invalid trigger.');
    this.fetching = true;
  }

  toogleActivation(trigger) {
    if (!this.trigger.id) throw new Error('Empty Trigger');
    this.fetching = true;
    this.enabled = !this.enabled;

    this.genesysCloudService.updateTrigger(this.enabled, trigger).subscribe(data => {
      this.trigger!.version = data.version;
    });
  }

  deleteTrigger(trigger): void {
    this.genesysCloudService.deleteTrigger(trigger.id)
      .subscribe(data => {
        this.deleted.emit();
      });

    console.log("Waiting for deletion ");
  }
}

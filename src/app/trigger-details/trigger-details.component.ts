import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';

import { GenesysCloudService } from '../genesys-cloud.service';

import * as platformClient from 'purecloud-platform-client-v2';

import { ModalService } from '../modal/_services';

@Component({
  selector: 'app-trigger-details',
  templateUrl: './trigger-details.component.html',
  styleUrls: ['./trigger-details.component.css']
})
export class TriggerDetailsComponent implements OnInit, OnChanges {
  @Input() trigger: platformClient.Models.Trigger;
  @Input() workflowName: String;

  @Output() deleted = new EventEmitter();
  @Output() deletionConfirmation = new EventEmitter();
  @Output() editRequest = new EventEmitter();

  enabled: boolean = false;
  version: number;

  fetching = true;

  constructor(
    private genesysCloudService: GenesysCloudService,
    protected modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.enabled = this.trigger.enabled;
    this.version = this.trigger.version;

    this.getTriggerObservations();

  }

  ngOnChanges(changes: SimpleChanges) {
  //  console.log(changes);
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

  confirmDeleteTrigger(triggerId): void {
    console.log("triggerID :", triggerId);
    this.deletionConfirmation.emit(triggerId);
    console.log("Deletion Confirmaton Required ");
  }

  editTrigger(trigger): void {
    console.log("trigger :", this.trigger);
    this.editRequest.emit(this.trigger);
    console.log("Edit Trigger Required ");
  }


  deleteTrigger(triggerId): void {
    this.genesysCloudService.deleteTrigger(triggerId)
      .subscribe(data => {
        this.deleted.emit();
      });

    console.log("Waiting for deletion ");
  }
}

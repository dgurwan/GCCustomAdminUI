import { APP_INITIALIZER, NgModule } from '@angular/core';

import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';
import { triggerModel } from '../trigger-details/triggerModel';
import { debounceTime, distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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

  faCirclePlus = faCirclePlus;

  selectedTopic!: string;
  topics!: Observable<string[]>;

  searchText: string;


  triggerForm = new FormGroup({
    triggerName: new FormControl('', Validators.required),
    selectedTopicCreation:new FormControl('', Validators.required)
  });

selectedTopicCreation!: string;

  /* getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }*/

  constructor(
    private genesysCloudService: GenesysCloudService,
    protected modalService: ModalService
  ) { }



  ngOnInit(): void {

    this.searchText ="";

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

  }

  searchTrigger(term: string): void {
    this.searchTerm.next(term);
    console.log("SearchTrigger - term : ", term);
  }

  createTrigger(name: string | null | undefined, topicName: string): void {
    if (name === null || name === undefined) { }
    else {
      this.genesysCloudService.createTrigger(name, topicName).subscribe(data => {
        this.ngOnInit();
        //this.triggerForm.controls['triggerName'].reset()
        this.triggerForm.reset()

      });
    }
  }

  refresh(event) {
    console.log("Trigger Event received!");
    console.log(this.selectedTopic);
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
        this.createTrigger(this.triggerForm.get('triggerName')?.value, this.selectedTopicCreation);
        this.modalService.close();
      }

    }
  }

}

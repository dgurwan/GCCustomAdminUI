import { APP_INITIALIZER, NgModule } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';
import { triggerModel } from '../trigger-details/triggerModel';
import { debounceTime, distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-trigger-list-page',
  templateUrl: './trigger-list-page.component.html',
  styleUrls: ['./trigger-list-page.component.css']
})


export class TriggerListPageComponent implements OnInit {
  triggers$!: Observable<platformClient.Models.Trigger[]>
  searchTerm = new BehaviorSubject<string>('');
  fetching = false;

  selectedTopic!: string;
  topics!:Observable<string[]>;

  constructor(
    private genesysCloudService: GenesysCloudService,
  ) {
    this.loadScripts();
  }

  // Method to dynamically load JavaScript
   loadScripts() {

     // This array contains all the files/CDNs
     const dynamicScripts = [
        'assets/load.js'
     ];
     for (let i = 0; i < dynamicScripts.length; i++) {
       const node = document.createElement('script');
       node.src = dynamicScripts[i];
       node.type = 'text/javascript';
       node.async = false;
       document.getElementsByTagName('head')[0].appendChild(node);
     }
  }

  ngOnInit(): void {

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
      if(term) this.genesysCloudService.lastTriggerSearchValue = term;
    });

    // If there is a previoulsy searched term, display the results
    if(this.genesysCloudService.lastTriggerSearchValue){
      this.searchTerm.next(this.genesysCloudService.lastTriggerSearchValue);
    }

  }

  searchTrigger(term: string): void {
    this.searchTerm.next(term);
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-datatable-list-page',
  templateUrl: './datatable-list-page.component.html',
  styleUrls: ['./datatable-list-page.component.css']
})
export class DatatableListPageComponent implements OnInit {
  searchTerm = new BehaviorSubject<string>('');
  datatables$!: Observable<platformClient.Models.DataTable[]>
  fetching = false;

  constructor(
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
    this.datatables$ = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.fetching = true; }),
      switchMap((term: string) => this.genesysCloudService.searchDatatables(term)),
      tap(() => { this.fetching = false; })
    );

    // Set the last searched term
    this.searchTerm.subscribe(term => {
      if(term) this.genesysCloudService.lastDatatableSearchValue = term;
    });

    // If there is a previoulsy searched term, display the results
    if(this.genesysCloudService.lastDatatableSearchValue){
      this.searchTerm.next(this.genesysCloudService.lastDatatableSearchValue);
    }
  }

  searchDatatables(term: string): void {
    this.searchTerm.next(term);
  }
}

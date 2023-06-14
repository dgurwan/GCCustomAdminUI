import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from  '@angular/platform-browser/animations';


import { UserDetailsComponent } from './user-details/user-details.component';
import { UserQueueDetailsComponent } from './user-details/user-queue-details.component';
import { AgentManagerComponent } from './agent-manager/agent-manager.component';
import { UserListEntryComponent } from './user-list-entry/user-list-entry.component';
import { HomeComponent } from './home/home.component';
import { QueueDetailsComponent } from './queue-details/queue-details.component';
import { PresencePickerComponent } from './presence-picker/presence-picker.component';
import { QueueListPageComponent } from './queue-list-page/queue-list-page.component';
import { DatatableDetailsComponent } from './datatable-details/datatable-details.component';
import { DatatableListPageComponent } from './datatable-list-page/datatable-list-page.component';
import { TriggerListPageComponent } from './trigger-list-page/trigger-list-page.component';
import { TriggerDetailsComponent } from './trigger-details/trigger-details.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ClipboardModule } from '@angular/cdk/clipboard';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { NgSelectModule } from '@ng-select/ng-select';

import { ModalComponent } from './modal/_component';

import { SearchFilterPipe } from './shared/pipes/search-filter.pipe';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';



@NgModule({
  declarations: [
    AppComponent,
    UserDetailsComponent,
    AgentManagerComponent,
    UserListEntryComponent,
    UserQueueDetailsComponent,
    HomeComponent,
    QueueDetailsComponent,
    PresencePickerComponent,
    QueueListPageComponent,
    DatatableDetailsComponent,
    DatatableListPageComponent,
    TriggerListPageComponent,
    TriggerDetailsComponent,
    ModalComponent,
    SearchFilterPipe // declaration of search filetr pipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    NgbModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

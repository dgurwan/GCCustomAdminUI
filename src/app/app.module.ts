import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
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

import { NgSelectModule } from '@ng-select/ng-select';

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
    TriggerDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}

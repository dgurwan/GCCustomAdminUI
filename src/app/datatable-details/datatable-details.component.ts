import { Component, Input, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-datatable-details',
  templateUrl: './datatable-details.component.html',
  styleUrls: ['./datatable-details.component.css']
})
export class DatatableDetailsComponent implements OnInit {
  @Input() datatable?: platformClient.Models.DataTable;

  constructor(
    private genesysCloudService: GenesysCloudService
  ) { }

  ngOnInit(): void {

  }

}

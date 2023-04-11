import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as platformClient from 'purecloud-platform-client-v2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userId?: string | null;
  userDetails?: platformClient.Models.UserMe;
  userQueues?: platformClient.Models.UserQueue[];
  userAvatar: string = 'assets/default-face.png';
  masterSelected: boolean = false;
  checkedList: any;
  checklist: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private genesysCloudService: GenesysCloudService,
  ) {
    this.masterSelected = false;
    this.checklist = [];
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    this.getUserDetails();
    this.getUserQueues();
}

  getUserDetails() {
    if (!this.userId) throw Error('Invalid userID.');

    this.genesysCloudService.getUserDetails(this.userId)
      .subscribe(userDetails => {
        this.userDetails = userDetails
        this.userAvatar = userDetails.images ?.[userDetails.images.length - 1]
          .imageUri || this.userAvatar;
      });
  }

  getUserQueues() {
    if (!this.userId) throw Error('Invalid userID.');

    this.genesysCloudService.getUserQueues(this.userId)
      .subscribe(userQueues => {
        this.userQueues = userQueues;
        this.userQueues.forEach(element => this.checklist.push({ id: element.id, value: element.name, isSelected: element.joined }));
        this.getCheckedItemList();
      });

  }

  goBack() {
    this.location.back();
  }


  // The master checkbox will check/ uncheck all items
    checkUncheckAll() {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].isSelected = this.masterSelected;
      }
      this.getCheckedItemList();
    }

    // Check All Checkbox Checked
    isAllSelected() {
      this.masterSelected = this.checklist.every(function(item:any) {
          return item.isSelected == true;
        })
      this.getCheckedItemList();
    }

    // Get List of Checked Items
    getCheckedItemList(){
      this.checkedList = [];
      for (var i = 0; i < this.checklist.length; i++) {
        if(this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i].id);
      }
      this.checkedList = JSON.stringify(this.checkedList);
    }


}

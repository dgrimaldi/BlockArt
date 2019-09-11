import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../user-service/user.service';
import {FormBuilder} from '@angular/forms';
import Web3 from 'web3';
// @ts-ignore
import * as DiscussionManager from '../../../blockart-blockchain/build/contracts/DiscussionManager.json';
import {DiscussionsService} from '../discussions-service/discussions.service';
import {Discussion} from '../discussions-service/discussion';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  addForm;
  // string with username of logged user
  username: string;
  // number with reputaion value of logged user
  reputation: number;
  // address of the user
  address;
  // discussion structure
  discussion: Discussion;
  // array of discussion
  discussions: Discussion[];
  // number of discussion
  numDis: number;


  constructor(private serviceU: UserService, private formBuilder: FormBuilder, private serviceD: DiscussionsService) {
    this.addForm = this.formBuilder.group({
      title: ''
    });
  }

  async ngOnInit() {
    this.address = this.serviceU.address;
    await this.serviceU.getUsername().then(res => {
      this.username = res;
    });
    await this.serviceU.getReputation().then(res => {
      this.reputation = res;
    });

    await this.serviceD.getNumDis().then(ev => {
      this.numDis = ev- 1;
    });

    this.discussions = [];
    for (let i = 1; i <= this.numDis; i++) {
      await this.serviceD.getDiscussion(i).then(ev => {
        this.discussion = {
          title: ev[0],
          initiator: ev[1],
          comments: ev[2],
        };
        this.discussions.push(this.discussion);
      });
    }
    // start watching for a new register discussion event
    await this.serviceD.discussionEvent().then(ev => {
      console.log("SONO QUI TRIGGERED");
      this.discussion = {
        title: ev,
        initiator: this.address,
        comments: '',
      };
      this.discussions.push(this.discussion);
    });
  }
    // match if two string are equal
    /*
    if (this.discussion[1].match(this.address) == this.address) {
      console.log('sono uguali');
    } else {
      console.log('sono diverse');
    }*/


  onSubmit(data) {
    this.serviceD.addDiscussion(data, this.address);
  }

}

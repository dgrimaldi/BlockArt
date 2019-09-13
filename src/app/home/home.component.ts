import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../user-service/user.service';
import {FormBuilder} from '@angular/forms';
import {DiscussionsService} from '../discussions-service/discussions.service';
import {Discussion} from '../discussions-service/discussion';
import {Observable} from 'rxjs';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';


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
  discussions: Promise<Discussion[]>;
  discussion: Discussion;
  private numDis: number;
  private discussionsAs: Discussion[];
  private myService;

  // discussion structure
  // discussion: Discussion;
  // array of discussion
  // discussions: Discussion[];
  // number of discussion
  // numDis: number;


  constructor(private serviceU: UserService,
              private formBuilder: FormBuilder,
              private serviceD: DiscussionsService,
              @Inject(BlockchainInjectionService) private web3: Web3) {
    this.addForm = this.formBuilder.group({
      title: ''
    });
  }

  async ngOnInit() {
    this.address = this.serviceU.address;
    await this.serviceU.getUsername(this.address).then(res => {
      this.username = res;
    });
    await this.serviceU.getReputation().then(res => {
      this.reputation = res;
    });
    this.discussions = this.getDiscussionsUI();

    /* start watching for a new register discussion event
    await this.serviceD.discussionEvent().then(ev => {
      console.log('SONO QUI TRIGGERED');
      this.discussion = {
        title: ev,
        initiator: this.address,
        comments: '',
      };
      this.discussions.push(this.discussion);
    });*/
  }

  // match if two string are equal
  /*
  if (this.discussion[1].match(this.address) == this.address) {
    console.log('sono uguali');
  } else {
    console.log('sono diverse');
  }*/


  onSubmit(data) {
    this.discussions = this.newDiscussion(data);
  }

  private async getDiscussionsUI() {
    await this.serviceD.getNumDis().then(ev => {
      this.numDis = ev - 1;
    });
    this.discussionsAs = [];
    for (let i = 1; i <= this.numDis; i++) {
      await this.serviceD.getDiscussion(i).then(ev => {
        this.discussion = new Discussion(
          this.web3.toAscii(ev[0]).replace(/\u0000/g, ''),
          ev[1],
          ''
        );
        this.discussionsAs.push(this.discussion);
      });
    }
    for (let m = 0; m <= this.numDis; m++) {
      try {
        await this.serviceU.getUsername(this.discussionsAs[m].initiator).then(ev => {
          this.discussionsAs[m].initiator = ev;
        });
      } catch (e) {
        console.log(e);
      }
    }
    return this.discussionsAs;
  }

  private async newDiscussion(data) {
    // start watching for a new register discussion event
    await this.serviceD.addDiscussion(data, this.address).then(value => {
      this.discussion = new Discussion(
        data.title,
        this.username,
        ''
      );
      this.discussionsAs.push(this.discussion);
    });
    return this.discussionsAs;
  }

}

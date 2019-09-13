import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DiscussionsService} from '../discussions-service/discussions.service';
import {Comment} from '../discussion-service/comment';
import {CommentsService} from '../discussion-service/comments.service';
import {UserService} from '../user-service/user.service';
import {FormBuilder} from '@angular/forms';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';
import {Participant} from '../discussion-service/participant';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  // discussion title
  discussionTitle;
  myUsername;
  subscription;
  addCommentForm;
  private address: string;
  comments: Promise<Comment[]>;
  comment: Comment;
  private numCom: number;
  private commentsAs: Comment[];

  private participants: Participant[];
  private participant: Participant;
  private participantsAS: Promise<Participant[]>;

  constructor(private _Activedroute: ActivatedRoute,
              private serviceD: DiscussionsService,
              private serviceC: CommentsService,
              private formBuilder: FormBuilder,
              private serviceU: UserService,
              @Inject(BlockchainInjectionService) private web3: Web3) {
    this.addCommentForm = this.formBuilder.group({
      title: '',
      content: '',
    });
  }

  async ngOnInit() {
    this.subscription = this._Activedroute.paramMap.subscribe(params => {
      this.discussionTitle = params.get('id');
    });
    this.address = this.serviceU.address;
    this.serviceU.getUsername(this.address).then(r => {
      this.myUsername = r;
    });
    this.comments = this.getCommentsUI();
    this.participantsAS = this.getParticipantsUI();
  }


  onSubmit(data) {
    this.comments = this.addCommentUI(data);
    this.serviceD.addParticipant(this.address, this.discussionTitle, 0);
  }
  onAddVote(data: Comment, isPositive: boolean, pos: number) {
    this.comments = this.addVote(data, isPositive, pos);
  }

  private async getCommentsUI() {
    await this.serviceC.getNumComments().then(ev => {
      this.numCom = ev - 1;
    });
    //
    // this.commentsAs = [new Comment('', '', '', 0, 0, '', this.serviceU)];
    this.commentsAs = [];
    for (let i = 0; i <= this.numCom; i++) {
      await this.serviceC.getComments(i).then(ev => {
        if (this.web3.toAscii(ev[5]).replace(/\u0000/g, '') === this.discussionTitle) {
          this.comment = new Comment(
            ev[0],
            this.web3.toAscii(ev[1]).replace(/\u0000/g, ''),
            ev[2],
            ev[3],
            ev[4],
            this.web3.toAscii(ev[5]).replace(/\u0000/g, ''),
            ''
          );
          this.commentsAs.push(this.comment);
        }
      });
    }
    for (let m = 0; m <= this.numCom; m++) {
      try {
        await this.serviceU.getUsername(this.commentsAs[m].author).then(ev => {
          this.commentsAs[m].username = ev;
        });
      } catch (e) {
        console.log(e);
      }
    }
    return this.commentsAs;
  }


  private async addCommentUI(data) {
    await this.serviceC.addComment(data, this.address, this.discussionTitle).then(result => {
      this.comment = new Comment(
        this.myUsername,
        data.title,
        data.content,
        0,
        0,
        this.discussionTitle,
        this.myUsername
      );
      this.commentsAs.push(this.comment);
    });
    return this.commentsAs;
  }

  private async getParticipantsUI() {
    this.participants = [];
    await this.serviceC.getNumComments().then(ev => {
      this.numCom = ev - 1;
    });
    for (let i = 0; i <= this.numCom; i++) {
      await this.serviceC.getComments(i).then(ev => {
        if (this.web3.toAscii(ev[5]).replace(/\u0000/g, '') === this.discussionTitle) {
          this.participant = new Participant(
            ev[0],
            0,
            ''
          );
          let bool = false;
          if (this.participants.length !== 0) {
            for (let m = 0; m < this.participants.length; m++) {
              if (this.participants[m].address === this.participant.address) {
                return;
              } else {
                bool = false;
              }
            }
          } else {
            this.participants.push(this.participant);
            bool = true;
          }
          if (!bool) {
            this.participants.push(this.participant);
          }
        }
      });
    }
    for (let m = 0; m < this.participants.length; m++) {
      await this.serviceD.getParticipantPerUI(this.participants[m].address, this.discussionTitle).then(res => {
        this.participants[m].percentage =  res;
      });
    }
    for (let m = 0; m <= this.participants.length; m++) {
      try {
        await this.serviceU.getUsername(this.participants[m].address).then(ev => {
          this.participants[m].username = ev;
        });
      } catch (e) {
        console.log(e);
      }
    }
    return this.participants;
  }

  async addVote(data: Comment, b: boolean, pos: number) {
    await this.serviceC.addVote(data.author, data.title, this.discussionTitle, this.address, b).then(res => {
      console.log( 'IIIIIIIIII' + pos + ' ' + res );
      if (b)
        this.commentsAs[pos].numPosRecVote += 1;
      else
        this.commentsAs[pos].numNegRecVote += 1;
    });
    return this.commentsAs;
  }
}

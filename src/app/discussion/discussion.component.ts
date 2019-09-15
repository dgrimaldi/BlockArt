import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DiscussionsService} from '../discussions-service/discussions.service';
import {Comment} from '../comments-service/comment';
import {CommentsService} from '../comments-service/comments.service';
import {UserService} from '../user-service/user.service';
import {FormBuilder} from '@angular/forms';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';
import {Participant} from '../participants-service/participant';
import {ParticipantService} from '../participants-service/participant.service';

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

  private participants: Promise<Participant[]>;
  private participant: Participant;
  private participantsAS: Participant[];
  private numPar: number;
  private positionDiscussion: boolean[];

  constructor(private _Activedroute: ActivatedRoute,
              private serviceD: DiscussionsService,
              private serviceC: CommentsService,
              private formBuilder: FormBuilder,
              private serviceU: UserService,
              private serviceP: ParticipantService,
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
    this.participants = this.getParticipantsUI();
  }


  onSubmit(data) {
    this.comments = this.addCommentUI(data);
  }

  onAddVote(data: Comment, isPositive: boolean, pos: number) {
    this.participants = this.getAddedPercentage(isPositive, pos, data.author);
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

  private async getParticipantsUI() {
    await this.serviceP.getNumParticipants().then(ev => {
      console.log(ev);
      this.numPar = ev - 1;
    });
    this.positionDiscussion = [];
    for (let i = 0; i <= this.numPar; i++) {
      await this.serviceP.getIsParticipants(i, this.discussionTitle).then(res => {
        console.log(res + ' ' + this.discussionTitle);
        this.positionDiscussion.push(res);
      });
    }
    this.participantsAS = [];
    for (let i = 0; i <= this.numPar; i++) {
      if (this.positionDiscussion[i]) {
        try {
          await this.serviceP.getParticipants(i).then(res => {
            console.log('QUESTA è address: ' + res[0] + 'Questa è la percentage: ' + res[1]);
            this.participant = new Participant(
              res[0],
              res[1],
              ''
            );
          });
        } catch (e) {
          console.log('ERRORE SUL GETPARTICIPANS' + e);
        }
        this.participantsAS.push(this.participant);
      }
    }
    for (let m = 0; m < this.numPar; m++) {
      try {
        await this.serviceU.getUsername(this.participantsAS[m].address).then(res => {
          this.participantsAS[m].username = res;
        });
      } catch (e) {
        console.log(e);
      }
    }
    return this.participantsAS;
  }


  private async addCommentUI(data) {
    await this.serviceC.addComment(data, this.address, this.discussionTitle).then(result => {
      this.comment = new Comment(
        this.address,
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


  private async getAddedPercentage(isPositive: boolean, pos: number, addressRec: string) {
    await this.serviceP.givesVoteUI(this.address, isPositive, addressRec, this.discussionTitle).then(res => {
      // this.participantsAS[pos].percentage = res;
    });
    return this.participantsAS;
  }

  private async addVote(data: Comment, isPositive: boolean, pos: number) {
    await this.serviceC.addVote(data.author, data.title, this.discussionTitle, this.address, isPositive).then(res => {
      if (isPositive) {
        this.commentsAs[pos].numPosRecVote = +1;
      } else {
        this.commentsAs[pos].numNegRecVote = +1;
      }
    });
    return this.commentsAs;
  }

  // private async getParticipantsUI() {
  //   this.participants = [];
  //   await this.serviceC.getNumComments().then(ev => {
  //     this.numCom = ev - 1;
  //   });
  //   for (let i = 0; i <= this.numCom; i++) {
  //     await this.serviceC.getComments(i).then(ev => {
  //       if (this.web3.toAscii(ev[5]).replace(/\u0000/g, '') === this.discussionTitle) {
  //         this.participant = new Participant(
  //           ev[0],
  //           0,
  //           ''
  //         );
  //         // Remove double insert of commenter
  //         let bool = false;
  //         if (this.participants.length !== 0) {
  //           for (let m = 0; m < this.participants.length; m++) {
  //             if (this.participants[m].address === this.participant.address) {
  //               return;
  //             } else {
  //               bool = false;
  //             }
  //           }
  //         } else {
  //           this.participants.push(this.participant);
  //           bool = true;
  //         }
  //         if (!bool) {
  //           this.participants.push(this.participant);
  //         }
  //       }
  //     });
  //   }
  //   // this.participant have all of participants one time
  //
  //   for (let m = 0; m < this.participants.length; m++) {
  //     await this.serviceD.getParticipantPerUI(this.participants[m].address, this.discussionTitle).then(res => {
  //       this.participants[m].percentage = this.web3.toAscii(res).replace(/\u0000/g, '');
  //     });
  //   }
  //   for (let m = 0; m <= this.participants.length; m++) {
  //     try {
  //       await this.serviceU.getUsername(this.participants[m].address).then(ev => {
  //         this.participants[m].username = ev;
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   for (let m = 0; m <= this.participants.length; m++) {
  //     try {
  //       console.log('VVVVVV' + this.participants[m].username + ' ' + this.participants[m].percentage);
  //     } catch (e) {
  //     }
  //   }
  //   return this.participants;
  // }

  // async addVote(data: Comment, b: boolean, pos: number) {
  //   await this.serviceC.addVote(data.author, data.title, this.discussionTitle, this.address, b).then(res => {
  //     console.log('IIIIIIIIII' + pos + ' ' + res);
  //     if (b) {
  //       this.commentsAs[pos].numPosRecVote += 1;
  //     } else {
  //       this.commentsAs[pos].numNegRecVote += 1;
  //     }
  //   });
  //   return this.commentsAs;
  // }
  //
  // private async getPercentage(data: Comment, pos: number) {
  //   await this.serviceD.getaddPer(data.author, this.discussionTitle).then(res => {
  //     console.log('SONO ENTRATO NEL component SOTTO');
  //     this.participants[pos].percentage = res;
  //   });
  //   return this.participants;
  // }
}

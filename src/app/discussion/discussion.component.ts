import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Discussion} from '../discussions-service/discussion';
import {DiscussionsService} from '../discussions-service/discussions.service';
import {Comment} from '../discussion-service/comment';
import {CommentsService} from '../discussion-service/comments.service';
import {UserService} from '../user-service/user.service';
import {FormBuilder} from '@angular/forms';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  // discussion title
  discussionTitle;
  subscription;
  addCommentForm;
  private address: string;
  comments: Promise<Comment[]>;
  comment: Comment;
  private numCom: number;
  private commentsAs: Comment[];

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
    const a = await this.serviceC.getComments(1).then(res => {
      console.log(res);
    });
    this.comments = this.getCommentsUI();

  }

  onSubmit(data) {
    this.serviceC.addComment(data, this.address, this.discussionTitle);
    // this.discussions = this.serviceD.startWatchingDiscussionEvent();
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
            this.web3.toAscii(ev[5]).replace(/\u0000/g, '')
          );
          this.commentsAs.push(this.comment);
        }
      });
    };
    for (let m = 0; m <= this.numCom; m++) {
      try {
        await this.serviceU.getUsername(this.commentsAs[m].author).then(ev => {
          this.commentsAs[m].author = ev;
        });
      } catch (e) {
        console.log(e);
      }
    }
    return this.commentsAs;
  }
}

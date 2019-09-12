import {UserService} from '../user-service/user.service';

export class Comment {

  author: string;
  title: string;
  content: string;
  numPosRecVote: number;
  numNegRecVote: number;
  disTitle: string;
  username: string;

  constructor(author: string,
              title: string,
              content: string,
              numPosRecVote: number,
              numNegRecVote: number,
              disTitle: string) {

    this.author = author;
    this.title = title;
    this.content = content;
    this.numPosRecVote = numPosRecVote;
    this.numNegRecVote = numNegRecVote;
    this.disTitle = disTitle;
  }

  private async getUsername(author: string) {

  }

}

import {Inject, Injectable} from '@angular/core';
// @ts-ignore
import * as CommentManager from '../../../blockart-blockchain/build/contracts/CommentManager.json';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private contract;

  constructor(@Inject(BlockchainInjectionService) private web3: Web3) {
    this.contractInizilization();

  }

  private contractInizilization() {
    // define the abi of the contract, the Contract Application Binary Interface (ABI) is
    // the standard way to interact with contracts in the Ethereum ecosystem.
    const abi = CommentManager.abi;
    // set the address of the contract
    const adddressUs = CommentManager.networks[5777].address;
    // creation contract object
    const contractIn = this.web3.eth.contract(abi);
    // initiate contract to the declared address
    // this.contract = new this.web3.eth(abi);
    // old method
    this.contract = contractIn.at(adddressUs);
  }

  /**
   * bytes32 _author,bytes32 _title,string memory _content, bytes32 _discussionTitle)
   // tslint:disable-next-line:no-redundant-jsdoc
   * @param data title and content of comment
   * @param address of author of the comment
   * @param discussionTitle title of the discussion
   */
  public async addComment(data, address: string, discussionTitle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.contract.registerComment(address, data.title, data.content, discussionTitle, (e, r) => {
        if (!e) {
          resolve(r);
          console.log(r);
        } else {
          console.log(e);
          reject();
        }
      });
    });
  }

  public async getComments(pos: number): Promise<string> {
    return new Promise((res, rej) => {
      this.contract.getComment(pos, (error, result) => {
        if (!error) {
          //
          console.log(result);
          res(result);
        } else {
          rej();
        }
      });
    });
  }

  public async getNumComments(): Promise<number> {
    return new Promise((res, rej) => {
      this.contract.getNumComments((err, result) => {
        if (!err) {
          console.log(result);
          res(result);
        }
      });
    });
  }



  /**
   * addVoter to comment
   * @param author of the comment
   * @param commentTitle The title of the comment
   * @param discussionTitle The title of the discussion
   * @param voter of the comment
   * @param vote true if the vote is positive and false if the vote is negative
   */
  public async addVote(author: string,
                       commentTitle: string,
                       discussionTitle: string,
                       voter: string,
                       vote: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
      this.contract.registerVote(author, commentTitle, discussionTitle, voter, vote, (e, r) => {
          if (!e) {
            resolve(r);
          } else {
            reject();
          }
        }
      )
      ;
    });
  }


}

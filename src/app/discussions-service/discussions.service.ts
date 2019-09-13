import {Inject, Injectable} from '@angular/core';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';
// @ts-ignore
import * as DiscussionManager from '../../../blockart-blockchain/build/contracts/DiscussionManager.json';
import {Discussion} from './discussion';
import {el} from '@angular/platform-browser/testing/src/browser_util';


@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {
  contract;
  discussion: Discussion;
  discussions: Discussion[];
  private numDis: number;

  constructor(@Inject(BlockchainInjectionService) private web3: Web3) {
    this.contractInizilization();
  }

  private contractInizilization() {
    // define the abi of the contract, the Contract Application Binary Interface (ABI) is
    // the standard way to interact with contracts in the Ethereum ecosystem.
    const abi = DiscussionManager.abi;
    // set the address of the contract
    const adddressUs = DiscussionManager.networks[5777].address;
    // creation contract object
    const contractIn = this.web3.eth.contract(abi);
    // initiate contract to the declared address
    // this.contract = new this.web3.eth(abi);
    // old method
    this.contract = contractIn.at(adddressUs);
  }

  public async addDiscussion(data, address): Promise<string> {
    return new Promise((res, rej) => {
      this.contract.registerDiscussion(data.title, address, (e, r) => {
        if (!e) {
          res(r);
        } else {
          rej();
        }
      });
    });
  }

  public async getDiscussion(pos: number): Promise<string> {
    return new Promise((res, rej) => {
      this.contract.getDiscussions(pos, (error, result) => {
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

  public async addParticipant(address: string, discussionId: string, percentage: number) {
    this.contract.setParticipantPer(address, discussionId, percentage, function (e, r) {
      if (!e) {
        console.log(r);
      }
    });
  }

  public async getNumDis(): Promise<number> {
    return new Promise((res, rej) => {
      this.contract.getNumDiscussion((err, result) => {
        if (!err) {
          console.log(result);
          res(result);
        }
      });
    });
  }

  public async getParticipantPerUI(address: string, discussionTitle: string): Promise<number> {
    return new Promise((resolve, rej) => {
      this.contract.getParticipantPer(address, discussionTitle, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          rej();
        }
      });
    });
  }
}

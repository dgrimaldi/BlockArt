import {Inject, Injectable} from '@angular/core';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';
// @ts-ignore
import * as DiscussionManager from '../../../blockart-blockchain/build/contracts/DiscussionManager.json';
import {Discussion} from './discussion';


@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {
  contract;
  discussions: Discussion[];

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

  public addDiscussion(data, address) {
    this.contract.registerDiscussion(data.title, address, function (e, r) {
      if (!e) {
        console.log(r);
      }
    });
  }

  public getDiscussion(pos): Promise<string> {
    return new Promise((res, rej) => {
      this.contract.getDiscussions(pos, (error, result) => {
        if (!error) {
          res(result);
        } else {
          rej();
        }
      });
    });
  }

  getNumDis(): Promise<number> {
    return new Promise((res, rej) => {
      this.contract.getNumDiscussion((err, result) => {
        if (!err)
          res(result);
      });
    });
  }
}

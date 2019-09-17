import {Inject, Injectable} from '@angular/core';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
// @ts-ignore
import * as ParticipantManager from '../../../blockart-blockchain/build/contracts/ParticipantManager.json';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private contract;

  constructor(@Inject(BlockchainInjectionService) private web3: Web3) {
    this.contractInizilization();

  }

  private contractInizilization() {
    // define the abi of the contract, the Contract Application Binary Interface (ABI) is
    // the standard way to interact with contracts in the Ethereum ecosystem.
    const abi = ParticipantManager.abi;
    // set the address of the contract
    const adddressUs = ParticipantManager.networks[5777].address;
    // creation contract object
    const contractIn = this.web3.eth.contract(abi);
    // initiate contract to the declared address
    // this.contract = new this.web3.eth(abi);
    // old method
    this.contract = contractIn.at(adddressUs);
  }

  /**
   * add participant to the participants of the discussion
   * @param address of author of the participant
   * @param discussionTitle title of the discussion
   */
  public async addParticipant(address: string, discussionTitle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.contract.registerParticipant(address, discussionTitle, (e, r) => {
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

  // do try because the pos discussionTitle in the contract is required
  public async getParticipants(pos: number): Promise<string> {
    return new Promise((res, rej) => {
      this.contract.getParticipantPercentage(pos, (error, result) => {
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

  public async getNumParticipants(): Promise<number> {
    return new Promise((res, rej) => {
      this.contract.numAllParticipants((err, result) => {
        if (!err) {
          console.log(result);
          res(result);
        }
      });
    });
  }

  async givesVoteUI(addressSen: string, isPositive: boolean, addressRec: string, discussionTitle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('ECCO COSA SUCCEDE QUI' + addressSen + isPositive + addressRec + discussionTitle);
      this.contract.givesVote(addressSen, isPositive, addressRec, discussionTitle, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          console.log(res);
          reject();
        }
      });
    });
  }

  async getIsParticipants(position: number, discussionTitle: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.contract.isKeyPresent(position, discussionTitle, (e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject();
        }
      });
    });
  }

  async getReamingVotes(address: string, discussionTitle: string): Promise<number> {
    return new Promise(((resolve, reject) => {
      this.contract.getRemaingVote(address, discussionTitle, (e, r) => {
        if (!e) {
          resolve(r);
        }
      })
    }))
  }

  /**
   * function isParticipantPresent(bytes32 _disucssionTitle, bytes32 _participant)
   */
  async ifParticipantExist(discussionTitle: string, participant: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.contract.isParticipantPresent(discussionTitle, participant, (e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject();
        }
      });
    });
  }
}

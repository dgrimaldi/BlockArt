import {Inject, Injectable} from '@angular/core';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';
// @ts-ignore
import * as UserManager from '../../../blockart-blockchain/build/contracts/UserManager.json';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  address;
  contract;
  username;
  reputation;

  constructor(@Inject(BlockchainInjectionService) private web3: Web3) {
    this.getAddress();
    this.getContract();

  }

  private getAddress() {
    // read the list of accounts of the node
    const accounts = this.web3.eth.accounts;
    // set declared account the logged account
    this.address = accounts[0];
    // check if the user is logged
    if (this.address !== '' || this.address != null) {
      // set account as default account (send transaction and call contract)
      this.web3.eth.defaultAccount = this.address;
    }
  }

  private async getContract() {
    // define the abi of the contract, the Contract Application Binary Interface (ABI) is
    // the standard way to interact with contracts in the Ethereum ecosystem.
    const abi = UserManager.abi;
    // set the address of the contract
    const adddressUs = UserManager.networks[5777].address;
    // creation contract object
    const contractIn = this.web3.eth.contract(abi);
    // initiate contract to the declared address
    // this.contract = new this.web3.eth(abi);
    // old method
    this.contract = contractIn.at(adddressUs);

  }

  public async getUsername(addressU: string): Promise<string> {
    return new Promise((resolve, rejecct) => {
      this.contract.getName(addressU, (err, res) => {
        console.log('i am here');
        if (!err) {
          resolve(res);
          console.log(resolve(res) + ' ' + res);
        } else {
          resolve('___');
        }
      });
    });
  }

  public async getReputation(): Promise<number> {
    console.log(this.contract + '&&' + this.address);
    return new Promise((res, rej) => {
      this.contract.getReputation(this.address, (error, result) => {
        if (!error) {
          res(result);
        } else {
          rej();
        }
      });
    });
  }
  public async eventNewUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.contract.newUserRegistered().watch((err, res) => {
        if (!err) {
          resolve(res.args.username);
        } else {
          reject();
        }
      });
    });
  }

  public async isNotPresentEvent(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.contract.isNotRegisteredEvent().watch((e, r) => {
        if (!e) {
          resolve(r.args.isNotregistered);
          console.log(resolve(r.args.isNotregistered));
        } else {
          reject();
        }
      });
    });
  }
}

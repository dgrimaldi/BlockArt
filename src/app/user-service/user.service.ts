import {Inject, Injectable} from '@angular/core';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import Web3 from 'web3';
// @ts-ignore
import * as UserManager from '../../../blockart-blockchain/build/contracts/UserManager.json';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  address;
  contract;
  private username;

  constructor(@Inject(BlockchainInjectionService) private web3: Web3) {
    this.getAdress();
    this.getContract();
  }

  private getAdress() {
    // read the list of accounts of the node
    const accounts = this.web3.eth.accounts;
    // set declared account the logged account
    this.address = accounts[0];
  }

  private getContract() {
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

  getUsername() {

  }
}

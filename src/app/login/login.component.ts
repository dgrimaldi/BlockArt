import {Component, Inject, OnInit} from '@angular/core';
import {BlockchainInjectionService} from '../injection-service/blockchain-injection-service.service';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../user-service/user.service';
import Web3 from 'web3';

@Component({
  // the login page component's CSS element selector
  selector: 'app-login',
  // the location of the login page component's template file.
  templateUrl: './login.component.html',
  // the location of the login page component's private CSS styles.
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // declaration of the information about web.eth.account
  account;
  // declaration of the information about contract object
  contractIns;
  // declaration of layer to help with creating custom form controls
  loginForm;
  // declaration of the boolean to manage ngIf in html part
  value: boolean;
  //
  username: string;
  isNotPresent: boolean;

  /**
   *
   * @param web3 is used to inject web3 library (from the service
   *        BlockchainInjectionService) in login-page.component
   * @param formBuilder the objects that
   *        live in the component to store and manage the form
   */
  constructor(@Inject(BlockchainInjectionService) private web3: Web3, private formBuilder: FormBuilder, private service: UserService) {
    this.loginForm = this.formBuilder.group({
      username: ''
    });
  }

  async ngOnInit() {
    // initialized user address
    this.account = this.service.address;
    console.log(this.account);
    // initialized contract
    this.contractIns = this.service.contract;
    // check if the user is logged
    // and set #loading in ng-template in html template file
    if (this.account === '' || this.account == null) {
      this.value = false;
    } else {
      this.value = true;
    }
    // call async method getUsername() from user.service
    await this.service.getUsername().then(username => {
      // set the username of the logged user
      this.username = username;
    });
    // check if the user have a username
    // then set *ngIf in html
    if (this.username === '' || this.username === '___') {
      // there isn't any registered user(user isNotPresent)
      this.isNotPresent = true;
      // start watching if there is an username through solidity event
      await this.service.eventNewUser().then(event => {
        this.username = event;
      });
    } else {
      // there is a registered user (user !isNotPresent)
      this.isNotPresent = false;
      console.log(this.isNotPresent);
    }
    // start watching if there is an user through solidity event
    await this.service.isNotPresentEvent().then(event => {
      this.isNotPresent = event;
      console.log(this.isNotPresent);
      //
    });
  }

  /**
   * call the function of the contract registerUser(username, address)
   * Web3 works with asynchronous request, you must pass an optional
   * callback as the last parameter to most functions.
   */
  onSubmit(data) {
    console.log(data + '' + this.contractIns);
    this.contractIns.registerUser(data.username, this.account, function (error, result) {
      if (!error) {
        console.log(result);
      }
    });
  }
}

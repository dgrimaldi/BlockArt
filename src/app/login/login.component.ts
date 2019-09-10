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
  value;
  //
  isNotPresent;
//
  //
  username;

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
    this.account = this.service.address;
    console.log(this.contractIns + ' ' + this.account);
    if (this.account === '' || this.account == null) {
      // set #loading in ng-template in html template file
      this.value = false;
    } else {
      // set account as default account (send transaction and call contract)
      this.web3.eth.defaultAccount = this.account;
    }
    this.contractIns = this.service.contract;

    // read the list of accounts the node control
    // this.contractIns = this.service.contract;
    // const name = this.contractIns.getName(this.service.address);
    // console.log(name);
    // this.contractIns.methods.getName(this.service.address).call().then(console.log);
    await this.getUsername().then(username => {
      console.log(username);
    });
    console.log(this.username);
  }


  onSubmit(data) {
    /**
     * call the function of the contract registerUser(username, address)
     * Web3 works with asynchronous request, you must pass an optional
     * callback as the last parameter to most functions.
     */
    console.log(data);
    this.contractIns.registerUser(data.username, this.account, function (error, result) {
      if (!error) {
        console.log(result);
      }
    });
  }

  public async getUsername(): Promise<string> {
    return new Promise((resolve, rejecct) => {
      this.contractIns.getName(this.account, (err, res) =>{
        console.log('i am here');
        if (!err) {
          this.username = res;
          resolve(res);
          console.log(resolve(res) + ' ' + res);
        } else {
          this.username = '';
          rejecct();
        }
      });
    });
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {BlockchainInjectionService} from './injection-service/blockchain-injection-service.service';
import Web3 from 'web3';

@Component({
  // the app component's CSS element selector
  selector: 'app-root',
  // the location of the app component's template file.
  templateUrl: './app.component.html',
  // the location of the app component's private CSS styles.
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  /**
   * Import web3 library
   * @param web3 is used to inject web3 library (from the service
   * BlockchainInjectionService) in app.component
   */
  constructor(@Inject(BlockchainInjectionService) private web3: Web3) {
  }



  /**
   * @ngOnInit A callback method that is invoked immediately after the default
   * change detector has checked the directive's data-bound properties
   */
  async ngOnInit() {
    // check first if the web3 provider is available
    if ('enable' in this.web3.currentProvider) {
      // and then create a web3 instance with the provider
      await this.web3.currentProvider.enable();
    }
  }
  title = 'block-art';
}

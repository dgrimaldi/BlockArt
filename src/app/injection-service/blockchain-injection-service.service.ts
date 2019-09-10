/**
 * Service is a broad category encompassing any value, function,
 * or feature that an app needs. A service is typically a class
 * with a narrow, well-defined purpose.
 *
 * blockchain-injection service encapsulate the Promise based
 * functions you want to use in your app with an Observable
 * structure
 */

import {InjectionToken} from '@angular/core';
import Web3 from 'web3';

/**
 *  Create an injection, named BlockchainInjectionService, Token with web3
 *  We create an injection token WEB3 that could be used to get the instance of Web3 in our Injector.
 */
export const BlockchainInjectionService = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  /**
   *  When using web3.js in an Ethereum compatible browser,
   *  it will set with the current native provider by that browser.
   *  Will return the given provider by the (browser) environment, otherwise null
   */
  factory: () => {
    try {
      // use the given Provider, e.g in Mist or Metamask, installed in the browser
      const provider = ('ethereum' in window) ? window['ethereum'] : Web3.givenProvider;
      // return provider object
      return new Web3(provider);
    } catch (err) {
      // NO Mist or Metamask installed in the browser
      throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
    }
  }
});

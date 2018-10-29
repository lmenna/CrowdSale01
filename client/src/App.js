import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ZepToken from "./contracts/ZepToken.json";
import ZepTokenCrowdsale from "./contracts/ZepTokenCrowdsale.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    // Get these when migrating the contract
    TokenAddress: "0xf9bc9efc6a856c45fe3738ebf49fbe0d86a63a59",
    CrowdsaleAddress: "0x3b26516b190a6f7ecf153b2ccb0b86b51f54e463"
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("Accounts:", accounts);

      // Get the contract instance.
      console.log("Get instance of SimpleStorageContract.")
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      console.log("SimpleStorageContract:", instance);

      // Get the token contract instance.
      console.log("Get instance of ZepToken.")
      const Token = truffleContract(ZepToken);
      Token.setProvider(web3.currentProvider);
      console.log("Token.at(", this.state.TokenAddress, ")");
      const tokenInstance = await Token.at(this.state.TokenAddress);
      console.log("ZepTokenInstance:", tokenInstance);
      // Check some values in the token.
      var symbol = await tokenInstance.symbol.call();
      var name = await tokenInstance.name.call();
      console.log("Symbol:", symbol, "Name:", name);
      // var totalSupply = await tokenInstance.totalSupply.call();

      // Get the crowdsale contract instance.
      const Crowdsale = truffleContract(ZepTokenCrowdsale);
      Crowdsale.setProvider(web3.currentProvider);
      console.log(Crowdsale);
      console.log("Get crowdSaleInstance");
      const crowdSaleInstance = await Crowdsale.at(this.state.CrowdsaleAddress);
      console.log("crowdSaleInstance:", crowdSaleInstance);
      //const foundersFundAddr = crowdSaleInstance.foundersFundAddr;
      const foundersFundAddr = crowdSaleInstance.address;
      console.log("foundersFundAddr:", foundersFundAddr);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.set(5, { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    // Update state with the result.
    this.setState({ storageValue: response.toNumber() });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 37</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;

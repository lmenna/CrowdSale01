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
    tokenSymbol: "",
    tokenName: "",
    communityPercentage: 0,
    foundersPercentage: 0,
    partnersPercentage: 0,
    developersPercentage: 0,
    // Addresses for the distribution
    foundersFundAddr: null,
    foundersTimelockAddr: null,
    partnersFundAddr: null,
    developersFundAddr: null,
    // Get these when migrating the contract
    TokenAddress: "0x0b57a3e6231c2a7ba23e8579849dbc5bc617bd7c",
    CrowdsaleAddress: "0x6114133ae8bf64c7ed60aef4f7f979fb7de58edb"
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
      // Get percentages for crowdsale distribution
      const communityPercentage = await crowdSaleInstance.communityPercentage.call();
      console.log("communityPercentage:", communityPercentage);
      const foundersPercentage = await crowdSaleInstance.foundersPercentage.call();
      console.log("foundersPercentage:", foundersPercentage);
      const partnersPercentage = await crowdSaleInstance.partnersPercentage.call();
      console.log("partnersPercentage:", partnersPercentage);
      const developersPercentage = await crowdSaleInstance.developersPercentage.call();
      console.log("developersPercentage:", developersPercentage);
      // Get addresses from crowdsale distribution
      const foundersFundAddr = await crowdSaleInstance.foundersFundAddr.call();
      console.log("foundersFundAddr:", foundersFundAddr);
      const partnersFundAddr = await crowdSaleInstance.partnersFundAddr.call();
      console.log("partnersFundAddr:", partnersFundAddr);
      const developersFundAddr = await crowdSaleInstance.developersFundAddr.call();
      console.log("developersFundAddr:", developersFundAddr);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract:     instance,
        tokenName:    name,
        tokenSymbol:  symbol,
        communityPercentage: communityPercentage.toNumber(),
        foundersPercentage: foundersPercentage.toNumber(),
        partnersPercentage: partnersPercentage.toNumber(),
        developersPercentage: developersPercentage.toNumber(),
        // Addresses for the distribution
        foundersFundAddr
      },
      this.runExample);
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
        <br/>
        <div><b>ZepToken Details</b></div>
        <div>Symbol: {this.state.tokenSymbol}</div>
        <div>Name: {this.state.tokenName}</div>
        <br/>
        <div><b>Crowdsale Details</b></div>
        <div>Community Percentage: {this.state.communityPercentage}</div>
        <div>Founders Percentage: {this.state.foundersPercentage}</div>
        <div>Partners Percentage: {this.state.partnersPercentage}</div>
        <div>Developers Percentage: {this.state.developersPercentage}</div>
        <div>Founders Fund Address: {this.state.foundersFundAddr}</div>
      </div>
    );
  }
}

export default App;

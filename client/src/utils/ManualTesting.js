const JSONFileForToken = "../../../build/contracts/ZepToken.json";
const JSONFileForCrowdsale = "../../../build/contracts/ZepTokenCrowdsale.json";

console.clear();
console.log("->> ZepToken ManualTesting.  Only used to supplement unit test run via truffle test.");
const Web3 = require("web3");
const EthServer = "http://127.0.0.1:8545";
console.log("->> Initialize Web3.");
console.log("->> Connecting to server:", EthServer);
const web3 = new Web3(EthServer);
console.log("web3.version:", web3.version);
const version = web3.version;
if (version != "1.0.0-beta.36") {
  console.log("grr: WARNING: Incorrect version of Web3 is being used.  You are using:", version);
  console.log("grr: If you see errors like: TypeError: this.provider.sendAsync is not a function then change to 1.0.0-beta.36");
}
else {
  console.log("->> GOOD: Web3 API version being used is:", version);
}
console.log("->> Retrieve basic account information from the server:", EthServer);
var AllAccounts = [];
web3.eth.getAccounts( (err, AllAccounts) => {
  // Process only the first 5 Accounts
  AllAccounts = AllAccounts.slice(0,5);
  console.log("->> Accounts:", AllAccounts);
  AllBals = AllAccounts.map(acct => {
    web3.eth.getBalance(acct, (err, bal) => {
      console.log("->>", acct, " has a balance of ", web3.utils.fromWei(bal, "ether"));
      return(bal);
    });
  });
});
console.log("->> Get access to contract in ", JSONFileForToken);
var fs = require("fs");
var JSONStrForToken = fs.readFileSync(JSONFileForToken, 'utf8');
var JSONForToken = JSON.parse(JSONStrForToken);
var ABIForToken = JSONForToken.abi;
var ByteCodeForToken = JSONForToken.bytecode;

var NetworksForToken = JSONForToken.networks;
if (typeof NetworksForToken === 'undefined') {
  console.log("grr: NetworksForToken:", NetworksForToken);
  console.log("grr: Shutting down process", NetworksForToken);
  process.exit(1);
}
const CodeForAddress = '1540333043372';
var AddressForToken = ((typeof NetworksForToken[CodeForAddress] === 'undefined') ? AddressForToken = null : NetworksForToken[CodeForAddress].address);
if (AddressForToken===null) {
  console.log("grr: No Address was found for the Token");
  console.log("grr: Was lookingfor the address in the networks section of ", JSONFileForToken, " in position ", CodeForAddress);
  console.log("grr: Perhaps the address moved to a different entry.");
  console.log("grr: Here is what the JSON looked like:", NetworksForToken);
  process.exit(1);
}
// console.log("Address of ZepToken:", AddressForToken);
// var tokenContract = new web3.eth.Contract(ABIForToken, AddressForToken);

// Create token contract
var tokenContract = new web3.eth.Contract(ABIForToken, {from: web3.eth.accounts[0], data: ByteCodeForToken});
tokenContract.options.address = '0xe2c11cff4b438e8e3e984abf7a6174ed5a84f67d';
tokenContract.methods.symbol().call((err, result) => {
  console.log("symbol: ", result);
});
tokenContract.methods.name().call((err, result) => {
  console.log("name: ", result);
});
tokenContract.methods.totalSupply().call((err, result) => {
  console.log("totalSupply: ", result);
});
tokenContract.methods.balanceOf(AllAccounts[0]).call((err, result) => {
 console.log("balanceOf account1 ", AllAccounts[0], " is ", result);
});

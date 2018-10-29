const ZepToken = artifacts.require("./ZepToken.sol");
const ZepTokenCrowdsale = artifacts.require("./ZepTokenCrowdsale.sol");

// Helper code used to deploy the crowdsale contract
const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};

module.exports = async function(deployer, network, accounts) {
  console.log("accounts:", accounts);

  // deploy the zep token
  const _name = "ZepToken";
  const _symbol = "ZEP";
  const _decimals = 18;
  await deployer.deploy(ZepToken, _name, _symbol, _decimals);
  console.log("Deployed ZepToken at", ZepToken.address);

  // deploy the zep crowdsale
  const wallet = accounts[0];
  const foundersFund    = accounts[0];
  const partnersFund    = accounts[0];
  const developersFund  = accounts[0];
  const preICORate = 250;
  const publicICORate = 500;
  const cap = ether(5000);
  const goal = ether(200);
  const investorMinCap = ether(0.01);
  const investorHardCap = ether(250);
  // Config for the TimedCrowdsale
  const latestTime = (new Date).getTime();
  const openingTime = latestTime + duration.minutes(1);
  const closingTime = openingTime + duration.minutes(10);
  const releaseTime = closingTime + duration.minutes(30);
  console.log("ZepTokenCrowdsale(",
  "preICORate=", preICORate,
  "wallet=", wallet,
  "ZepToken=", ZepToken.address,
  "cap=", cap,
  "goal=", goal,
  "openingTime=", openingTime,
  "closingTime=", closingTime,
  "foundersFund=", foundersFund,
  "partnersFund=", partnersFund,
  "developersFund=", developersFund,
  "releaseTime=", releaseTime,
  ")");
  zepCrowdsale = await deployer.deploy(
    ZepTokenCrowdsale,
    preICORate,
    wallet,
    ZepToken.address,
    cap,
    goal,
    openingTime,
    closingTime,
    foundersFund,
    partnersFund,
    developersFund,
    releaseTime
    );
    console.log("Deployed ZepTokenCrowdsale at", zepCrowdsale.address)

};

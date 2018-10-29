cp ../DappUniversity/ZepCoin/contracts/*.sol ./contracts/.
cp ../DappUniversity/ZepCoin/migrations/2_deploy_zeptoken.js ./migrations/3_deploy_zeptoken.js
cp -r ../DappUniversity/ZepCoin/test/. test/.
truffle migrate --reset
truffle test

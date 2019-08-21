const Log = require('./log.js');
const { Api} = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const { TextDecoder, TextEncoder } = require('util');               // node only
const write_log = Log.write_log;

// @ const user_struct = 
// {
//   account: "account",
//   public_key: "public_key",
//   private_key: "private_key"
// };

exports.User_API = class User_API{
    constructor(user, rpc){
      write_log("Setting Up User " + String(user.account));
      this.user = user;
      this.rpc = rpc;
      this.user.account = String(user.account);
      this.user.private_key = String(user.private_key);
      this.user.public_key = String(user.public_key);

      let privateKeys = [this.user.private_key];
      let signatureProvider = new JsSignatureProvider(privateKeys);    
      this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
      write_log("Set User... Done");
    }

    async validate(){
      write_log("Validate Account " + this.user.account);
        try{
          write_log("Trying to get account info " + this.user.account);
          let account_info = await this.rpc.get_account(this.user.account);

          write_log("Getting Account Success, Account has been on BlockChain");
          write_log("account_name: " + account_info.account_name + " | created: " + account_info.created + " | " + "last_code_update: " + account_info.last_code_update);
          write_log("Use account: " + this.user.account);
          write_log("Use public key: " + this.user.public_key);
          write_log("Use private key: " + this.user.private_key);
        }catch(err){
          write_log("ERROR: Getting Account Fail");
          write_log(err);
        }
    }

    async eos_push_transaction(account, name, args, expireSeconds){
      write_log("Forming Data");
        let accountStr = String(account);
        let nameStr = String(name);
        let actor = String(this.user.account);
        let expireSecondsNum = Number(expireSeconds);
      write_log("Calling EOSJS API api.transact");
        const result = await this.api.transact({
            actions: [{
              account: accountStr,
              name: nameStr,
              authorization: [{
                actor: actor,
                permission: 'active',
              }],
              data: args,
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: expireSecondsNum,
          });
    
        return result;
    }
}
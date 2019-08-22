const User = require('./user_api.js');
const Log = require('./log.js');
const User_API = User.User_API;
const write_log = Log.write_log;

exports.upload = async function upload(user_api, hostConfig, author, title, content){
    write_log("Contract API Upload");
    const contract_account = hostConfig.account;
    const contract_action = "upload";

    write_log("Forming Contract Argument");
    var now = new Date();
    var time_upload = now.toISOString();
    
    var arg = {
        user: user_api.user.account,
        author: author,
        title: title,
        content: content,
        time_upload: time_upload
    };
    write_log(`Data: ${JSON.stringify(arg)}`);
    write_log("Calling User_API eos_push_transaction");
    var re = await user_api.eos_push_transaction(contract_account, contract_action, arg, 60);
    return re;
}
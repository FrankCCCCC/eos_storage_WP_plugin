// For build server
const Express = require('express');

// Functionality
const Log = require('./src/log.js');
const Init = require('./src/initializer.js');
const User = require('./src/user_api.js');
const Contract = require('./src/contract_api');
const Load_Page = require('./src/load_page.js');
const write_log = Log.write_log;
const User_API = User.User_API;
const upload = Contract.upload;
const load_page = Load_Page.load_page;

// Some Global Parameter
var hostConfig = {
    port: "", // Server Port
    endpoint: "", // Blockchain Network Endpoint
    account: "", // Contract Account
    public_key: "", // Contract Account Public Key
    private_key: "" // Contract Account Private Key
}
var hostRpc = {};
var hostApi = {};
const app = Express();

function get_user_struct(account, public_key, private_key){
    return {account: account, public_key: public_key, private_key: private_key};
}

app.use(Express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    write_log("Recieve GET Request: /");
    try{
        let msg = 'Here is EOS Storage Plugin of Wordpress Backend'; 
        res.send(msg);
        write_log("Already Send Response: " + msg);
    }catch(err){
        write_log("ERROR: Sending Response Fail");
        write_log(err);
    }
    
});
app.all('/get_article', (req, res) => {
    write_log("Recieve POST Request: /get_article");
    write_log("HTTP Body: " + JSON.stringify(req.query));

    let param = req.query;
    let accountStr = String(param.account);
    let authorStr = String(param.author);
    let titleStr = String(param.title);
    let limitNum = Number(10000);
    const async_get_table = async () => {
        let table = await hostRpc.get_table_rows({
            json: true,              // Get the response as json
            code: hostConfig.account,     // Contract that we target
            scope: hostConfig.account,         // Account that owns the data
            table: 'setm',        // Table name
            limit: limitNum, 
        });
        let article = {};
        for(var i = 0; i < table.rows.length; i++){
            // console.log(table.rows[i]);
            if(String(table.rows[i].user) == accountStr && String(table.rows[i].author) == authorStr && String(table.rows[i].title) == titleStr){
                article = table.rows[i];
            }
        }
        
        let lt = load_page('page.html', article);
        res.set('Content-Type', 'text/html');
        res.send(lt);
        return table;
    };
    const table = async_get_table();
    
    
});
app.post('/upload', (req, res) => {
    write_log("Recieve POST Request: /upload");
    write_log("HTTP Body: " + JSON.stringify(req.body));
    let titleStr = String(req.body.title);
    let authorStr = String(req.body.author);
    let contentStr = String(req.body.content);
    let accountStr = String(req.body.account);
    let publicKeyStr = String(req.body.public_key);
    let privateKeyStr = String(req.body.private_key);
    // let accountStr = String("jwqnka13noaq");
    // let publicKeyStr = String("EOS5adzeBDm18Qg44reD9BxydmHX8F1tyPsDxCBUxsaWunUjpVp3E");
    // let privateKeyStr = String("5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X");
    let user_struct = get_user_struct(accountStr, publicKeyStr, privateKeyStr);
    let trx = "none";
    var form_query_object = (account, author, title) => {
        write_log('Forming url query Object...Done');
        return {
            account: accountStr,
            author: authorStr,
            title: titleStr
        };
    }
    var form_url_query = (obj) => {
        var arr = [];
        for(x in obj){
            arr.push(`${x}=${obj[x]}`);
        }
        let query = arr.join('&');
        write_log('Forming url query...Done');
        return '?' + query;
    };
    var form_link = (account, author, title) => {
        let baseUrl = req.protocol + '://' + req.get('host') + '/get_article';
        let query = form_url_query(form_query_object(accountStr, authorStr, titleStr));
        let link = baseUrl + query;
        write_log(`Forming Link: ${link}...Done`);
        return String(link);
    }
    let link = form_link(accountStr, authorStr, titleStr);
    let user_api = new User_API(user_struct, hostRpc);
    // await user_api.validate();

    new Promise((resolve, reject) => {
        write_log("Call Contract API Action Upload");
        trx = upload(user_api, hostConfig, authorStr, titleStr, contentStr);
        resolve(trx);
    }).then((trx) => {
        write_log("Transaction Success:");
        let resMsg = {
            msg: "Upload Success",
            transaction: trx,
            link: link
        };
        write_log("Send Response: msg= " + resMsg + " Transaction ID= " + trx.transaction_id);
        res.send(resMsg);
        // resolve(resMsg);
    }).then(() => {
        write_log(`Delete User_API of ${user_struct.account}`);
        delete user_api;
    }).catch((err) => {
        write_log("ERROR: Transaction Fail");
        write_log(err);
        let resMsg = {
            msg: "Upload Fail",
            transaction: err
        };
        write_log("Send Response: " + JSON.stringify(resMsg));
        res.send(resMsg);
    });
});

async function start_server(){
    hostRpc = await Init.init();
    hostConfig = Init.config;
    // console.log(hostRpc);
    hostApi = new User_API(get_user_struct(hostConfig.account, hostConfig.public_key, hostConfig.private_key), hostRpc);
    await hostApi.validate();
    app.listen(hostConfig.port, () => {
        write_log(`Here is Node JS and Express running on port ${hostConfig.port}`);
    });
}

start_server();


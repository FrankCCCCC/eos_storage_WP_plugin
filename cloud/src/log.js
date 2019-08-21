const Fs = require('fs');
const log_file = "server.log";
exports.log_file = log_file;
exports.write_log = function write_log(log, is_show_log){
    let logStr = String(log);
    let now = new Date();
    let logT = now.toGMTString() + "  " + logStr + "\n";
    let path = "./" + log_file;
    console.log(now.toGMTString() + "  " + logStr);
    Fs.appendFile(path, logT, function(err){
        if(err) throw err;
        if(is_show_log){
            console.log('Error: ' + logStr);
        }
    });
}
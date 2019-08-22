const Log = require('./log.js');
const Fs = require('fs');
const write_log = Log.write_log;

exports.load_page = function load_page(file, args){
    write_log('Loading Page Template...');
    const template_file_path = './src/' + file;
    const page_template = Fs.readFileSync(template_file_path, 'utf-8');
    write_log('Loading Page Template...Done');
    write_log('Declaring Variables in Template...');
    for(x in args){
        eval(`var ${x} = \"${args[x]}\"`);
    }
    write_log('Declaring Variables in Template...Done');
    write_log('Evaluate Template');
    var template = eval('`' + page_template + '`');
    return template;
}
// const obj = {name: "jame", age: 18, stuff: "Stuff Again"};
// var html = load_page("page.html", obj);
// console.log(html);
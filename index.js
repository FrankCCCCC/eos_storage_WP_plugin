const reso = 
[ { pkey: 0,
    author: 'EOS Studio',
    title: 'studio_T',
    content: 'studio_C',
    time_upload: 'studio_TIME',
    user: 'eosjs' },
  { pkey: 1,
    author: 'eosjsTest.js',
    title: 'eosjsTest_T',
    content: 'eosjsTest_C',
    time_upload: 'eosjsTest_TIME',
    user: 'eosjstest' },
  { pkey: 2,
    author: 'eosjsTest.js',
    title: 'eosjsTest_T',
    content: 'eosjsTest_Cttttttttttttdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    time_upload: 'eosjsTest_TIME',
    user: 'eosjstest' },
  { pkey: 3,
    author: 'eosjsTest.js',
    title: 'eosjsTest_T',
    content: 'eosjsTest_C',
    time_upload: 'eosjsTest_TIME',
    user: 'eosjstest' } ];

const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
// const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
const rpc = new JsonRpc('http://jungle2.cryptolions.io:80', { fetch });


async function eos_get_table_rows(code, scope, table, limit){
    codeStr= String(code);
    scopeStr = String(scope);
    tableStr = String(table);
    limitNum = String(limit);

    const resp = await rpc.get_table_rows({
        json: true,              // Get the response as json
        code: codeStr,     // Contract that we target
        scope: scopeStr,         // Account that owns the data
        table: tableStr,        // Table name
        limit: limitNum,               // Maximum number of rows that we want to get
        // reverse = false,         // Optional: Get reversed data
        // show_payer = false,      // Optional: Show ram payer
    });
    
    console.log(resp.rows);
    return resp.rows;
}

    window.onload = function(){
        console.log("Hello World\n");

        var isFirstLoad = true;
        var res = {};
        var fetchData = new Promise((resolve, reject) => {
            res = {};
            res = eos_get_table_rows("jwqnka13noaq", "jwqnka13noaq", "setm", 10);
            resolve(res);
        });
        fetchData.then((res) => {
            make_list(res);
            set_onClick(res);
            if(isFirstLoad){set_article(res[0]);}
        }).catch(()=>{});

        function make_list(res){
            $(".tbale_body").empty();
            const len = res.length;
            for(var i=0; i<len; i++){
                $(".table_body").append(`
                <tr class=\"table_row\" id=\"table_row_${res[i].pkey}\">
                    <th scope=\"col\" class=\"pkey\" val=\"${res[i].pkey}\">${res[i].pkey}</th>
                    <th scope=\"col\" class=\"author\" val=\"${res[i].author}\">${res[i].author.length > 20? res[i].author.slice(0, 20)+"...":res[i].author}</th>
                    <th scope=\"col\" class=\"title\" val=\"${res[i].title}\">${res[i].title.length > 20? res[i].title.slice(0, 20)+"...":res[i].title}</th>
                    <th scope=\"col\" class=\"content\" val=\"${res[i].content}\">${res[i].content.length > 20? res[i].content.slice(0, 20)+"...":res[i].content}</th>
                    <th scope=\"col\" class=\"time_upload\" val=\"${res[i].time_upload}\">${res[i].time_upload}</th>
                    <th scope=\"col\" class=\"user val=\"${res[i].user}\">${res[i].user}</th>
                </tr>
                `);
            }
        }
        function set_article(row){
            $(".pin_title").text(row.title);
            $(".pin_content").text(row.content);
            $(".pin_author").text(row.author);
            $(".pin_user").text(row.user);
            $(".pin_time_upload").text(row.time_upload);
        }

        function set_onClick(res){
            $("#main_table .table_body tr").click(function(){
                console.log($(this).find(".pkey").text());
                console.log($(".pkey").text());
    
                var pkey = $(this).find(".pkey").text();
                var author = res[pkey].author;
                var title = res[pkey].title;
                var content = res[pkey].content;
                var user = res[pkey].user;
                var time_upload = res[pkey].time_uplaod;
    
                $(".pin_title").text(title);
                $(".pin_content").text(content);
                $(".pin_author").text(author);
                $(".pin_user").text(user);
                $(".pin_time_upload").text(time_upload);
            });
        }
    };


const res = 
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

    window.onload = function(){
        console.log("Hello World\n");

        // const table_body = document.getElementsByClassName("table_body");
        const len = res.length;
        for(var i=0; i<len; i++){
            $(".table_body").append(`
            <tr class=\"table_row\" id=\"table_row_${res[i].pkey}\">
                <th scope=\"col\" class=\"table_ele\">${res[i].pkey}</th>
                <th scope=\"col\" class=\"table_ele\">${res[i].author.slice(0, 20)}</th>
                <th scope=\"col\" class=\"table_ele\">${res[i].title.slice(0, 20)}</th>
                <th scope=\"col\" class=\"table_ele\">${res[i].content.slice(0, 20)}</th>
                <th scope=\"col\" class=\"table_ele\">${res[i].time_upload}</th>
                <th scope=\"col\" class=\"table_ele\">${res[i].user}</th>
            </tr>
        `);
        }

        $(".table_row").click(function(){
            console.log($(".table_row")[0]);
        });
    };


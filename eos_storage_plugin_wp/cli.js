var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

// xhr.addEventListener("readystatechange", function () {
//   if (this.readyState === 4) {
//     console.log(this.responseText);
//   }
// });

xhr.open("POST", "http://localhost:4900/?user=postman_local&author=postman-author_localkkkk&title=postman_T_local&content=postman_C_local&time_upload=postman_TIME_local");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
// xhr.setRequestHeader("cache-control", "no-cache");
// xhr.setRequestHeader("postman-token", "46494449-3902-2cd0-5db7-7f9efac1d9f5");

xhr.send(data);
// xhr.close();
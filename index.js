"use strict";

const fs = require('fs');
const http = require('http');
const async = require('async');
let newsData = [];

const URI = 'localhost';
const PORT = 5000;

fs.readFile('./newsdata.csv', 'utf-8', (err, data) => {
   if (err) throw err;
   console.log('file loaded');
   let dataArr = data.split("\n");
   newsData = dataArr.splice(-dataArr.length - 1);
   post(newsData);
 //http_post(JSON.stringify({"texts": ["this is good"]})).then( data => console.log(data));
});


function post(arr){
	console.log(arr);
   async.eachLimit(arr, 1000, async(headline) => {
	let title = [];
	title.push(headline.split(',')[1]);
	let postData = JSON.stringify({"texts": title});
	let text = await http_post(postData);
	console.log(title[0], text);   
   }, (err) => {
      if (err) throw err;
   } );
}



function http_post(data) {
    const options = {
        hostname: URI,
        port: PORT,
        path: '/predict',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };


    return new Promise( (resolve, reject) => {
		//let headline = JSON.parse(data).texts[0];
       const req = http.request(options, (res) => {
          res.on('data', (d) => (resolve( d.toString('utf-8'))));
       });
      req.on('error', (e) => reject(e));
	  req.write(data);
      req.end();
    });
      
}

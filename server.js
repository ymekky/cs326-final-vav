import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync} from 'fs';

"use strict";

const fs = require("fs"),
  url = require("url"),
  http = require("http");

const dataFile = "datafile.json", 
  port = 8080; 

function process(request, response, options) {
  const headerText = { "content-type": "text/json" }, 
    parsed = url.parse(request.url, true); 

  if (parsed.pathname === "/user/new") {
    dataStore[options.name] = {"name": options.name, "email": options.word, "password": options.score}

    response.writeHead(200, headerText); 
    response.write(JSON.stringify({ key: options.name, action: "create" })); 
    response.end(); 

    fs.writeFile(dataFile, JSON.stringify(dataStore), err => {}); 
    return; 
  }
}

  let dataStore = fs.existsSync(dataFile)
  ? JSON.parse(fs.readFileSync(dataFile))
  : {};

http
  .createServer((request, response) => {
    if (request.method === "GET") {
      process(
        request,
        response,
        url.parse(request.url, true).query 
      );
    } else {
      let requestBody = ""; 

      request.on("data", data => {
        requestBody += data; 
      });
      request.on("end", () => {
        process(request, response, JSON.parse(requestBody)); 
      });
    }
  })
  .listen(port); 

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const path = require('path');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname));
//app.get('/', (req, res) => {res.sendFile(path.join(__dirname + '/index.html'))});
const port = 8000;

let database;
if (fs.existsSync("database.json")) {
    database = JSON.parse(fs.readFileSync("database.json"));
} else {
    database = {
        Users: [],
        Rides: []
    };
}

app.get('/', (req, res) => {
  res.send('Hello World!')
});
//   curl -d '{ "value" : "12" }' -H "Content-Type: application/json" http://localhost:3000/read/x
app.get('/user', (req, res) => {
    const k = req.query.USERID;
    const v = req.query.name;
    datastore[k] = v;
    console.log(`Set ${k} to ${v}`);
    res.send('Set.');
});

// /user/rides/pending/new?user_id=12&ride_id=702
app.get('/user/rides/pending/new', (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = {};
    for(let ride in database.Rides) {
        console.log(database.Rides[ride]);
        console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = database.Rides[ride];
        }
    }
    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === user_id) {
            console.log(my_ride);
            database.Users[user]["Rides"]['pending'] = my_ride;
        }
    }
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    res.send(`Added ride ${ride_id} to ${user_id}'s pending rides`);
});
app.get('/read/:key', (req, res) => {
    const k = req.params['key'];
    const v = datastore[k];
    res.send(`key = ${k}, value = ${v}`);
});
//   curl -d '{ "user_id" : "123", "ride_id" : "232", "date": "12/02/2020", "time": "2:30PM"}' -H "Content-Type: application/json" http://localhost:3000/ride/new
app.post('/ride/new', (req, res) => {
    const user_id = req.body["user_id"];
    const ride_id = req.body["ride_id"];
    const date = req.body["date"];
    const time = req.body["time"];
    database.Rides.push({
        id: ride_id,
        date: date,
        time: time,
        driver: user_id
    });
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    console.log(`Created ride ${ride_id} with driver ${user_id}`);
    res.send('Set.');
});
  
//   curl -d '{ "id" : "123", "name" : "jane doe", "email": "jdoe@umass.edu", "password": "123"}' -H "Content-Type: application/json" http://localhost:8000/user/new
app.post('/user/new', (req, res) => {
    const id = req.body["id"];
    const name = req.body["name"];
    const email = req.body["email"];
    const password = req.body["password"];
    database.Users.push({
        id: id,
        name: name,
        email: email,
        password: password,
        Rides: {},
        Chatters: []
    });
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    console.log(`Set ${id} to ${name}, body = ${JSON.stringify(req.body)}`);
    res.send('Set.');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
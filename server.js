require('dotenv').config();

const fs = require('fs');
const express = require('express');
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy

const app = express();
const bodyParser  = require('body-parser');
const path = require('path');
const utils = require('./database');
const cors = require('cors');
const port = process.env.PORT || 8080;

let secrets;
let uri; 
if (!process.env.URI) {
    secrets = require('./secrets.json');
    uri = secrets.uri;
} else {
    uri = process.env.URI;
}
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
    const db = client.db('umass-ride');
    const user_collection = db.collection('users');
    const ride_collection = db.collection('ride'); 

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/', express.static('client'));
//app.get('/', (req, res) => {res.sendFile(path.join(__dirname + '/client/index.html'))});
app.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/login.html'));
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/register.html'));
})
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/account.html'));
})

let database;
if (fs.existsSync("database.json")) {
    database = JSON.parse(fs.readFileSync("database.json"));
} else {
    database = {
        Users: [],
        Rides: []
    };
}


// /user/rides/view?user_id=12
app.get('/user/rides/view', (req, res) => {
    let my_rides = {};

/*
    for(let ride in database.Rides) {
        //console.log(database.Rides[ride]);
        //console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = database.Rides[ride];
        }
    }
    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === user_id) {
            res.json({"rides" : database.Users[user]["Rides"]});
        }
    }
*/
//fake
    res.json({"active": {"id":232,"date":"12/11/2020","time":"2:30PM","starting":"UMASS","destination":"Boston Logan Airport", "driver": {'id': 72,'name': "John Smith", "email":"johnsmith@umass.edu"}},
            "pending": [{"id":280,"date":"12/11/2020","time":"5:30PM","starting":"UMASS","destination":"Boston Logan Airport", "driver": {'id': 83,'name': "Jane Smith", "email":"jsmith@umass.edu"}},
                        {"id":281,"date":"13/11/2020","time":"2:30PM","starting":"UMASS","destination":"Boston Logan Airport","driver": {'id': 281,'name': "Jane Doe", "email":"jdoe@umass.edu"}}],
            "completed": [{"id":1719,"date":"01/09/2020","time":"1:00AM","destination":"UMASS","starting":"Boston Logan Airport", "driver":{'id': 72,'name': "John Smith","email":"johnsmith@umass.edu"}}],
            "cancelled": []});
});

// /user/rides/pending?user_id=12&ride_id=702 //searching
app.get('/user/rides/pending', (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = {};
    for(let ride in database.Rides) {
        //console.log(database.Rides[ride]);
        //console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = database.Rides[ride];
        }
    }
    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === user_id) {
            //console.log(my_ride);
            if(!database.Users[user]["Rides"]['pending']) {
                database.Users[user]["Rides"]['pending'] = [];
            }
            database.Users[user]["Rides"]['pending'].push(my_ride);
        }
    }
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    res.send(`Added ride ${ride_id} to ${user_id}'s pending rides`);
});

// /user/rides/active?user_id=12&ride_id=702  //request accepted
app.get('/user/rides/active', (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = utils.findRide(ride_id,database); //{};
    /*
    for(let ride in database.Rides) {
        //console.log(database.Rides[ride]);
        //console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = database.Rides[ride];
        }
    }*/

  for(let user in database.Users){
        if(parseInt(database.Users[user].id) === user_id) {
            //console.log(my_ride);
            my_ride.riders.push(database.Users[user].name); // add user name to ride
            database.Users[user]["Rides"]['active'] = my_ride;

            //utils.addToRide(ride_id,database,database.Users[user]);

            const pendingRides = database.Users[user]["Rides"]['pending'];
            for(let ride in pendingRides) {
                if(pendingRides[ride]) { 
                    if(pendingRides[ride].id === ride_id) {
                        delete pendingRides[ride];
                    }
                }
            }

        }
    }
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    res.send(`Added ride ${ride_id} to ${user_id}'s active rides`);
});

// /user/rides/completed?user_id=12&ride_id=702 //done 
app.get('/user/rides/completed', (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = {}; //too much repetition; should make a function
    for(let ride in database.Rides) {
        //console.log(database.Rides[ride]);
        //console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = database.Rides[ride];
        }
    }

    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === user_id) {
            //console.log(my_ride);
            if(!database.Users[user]["Rides"]['completed']) {
                database.Users[user]["Rides"]['completed'] = [];
            }
            database.Users[user]["Rides"]['completed'].push(my_ride); //add to completed rides

            const aciveRides = database.Users[user]["Rides"]['active'];
            for(let ride in aciveRides) { //remove from active rides 
                if(aciveRides[ride].id === ride_id) {
                    delete aciveRides[ride];
                }
            }
        }
    }
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    res.send(`Added ride ${ride_id} to ${user_id}'s completed rides`);
});

// /user/rides/delete?user_id=12&ride_id=702
app.get('/user/rides/delete', (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = {};
    for(let ride in database.Rides) {
        //console.log(database.Rides[ride]);
        //console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = database.Rides[ride];
        }
    }

    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === user_id) {
            //console.log(my_ride);
            if(!database.Users[user]["Rides"]['cancelled']) {
                database.Users[user]["Rides"]['cancelled'] = [];
            }
            database.Users[user]["Rides"]['cancelled'].push(my_ride); //add to completed rides


            //TODO
            const aciveRides = database.Users[user]["Rides"]['active'];
            const pendingRides = database.Users[user]["Rides"]['pending'];
            for(let ride in aciveRides) { //remove from active rides 
                if(aciveRides[ride].id === ride_id) {
                    delete aciveRides[ride];
                }
            }
        }
    }
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    res.send(`Added ride ${ride_id} to ${user_id}'s completed rides`);
});

//   curl -d '{ "user_id" : "123", "ride_id" : "232", "date": "12/02/2020", "time": "2:30PM","name":"JSJ"}' -H "Content-Type: application/json" http://localhost:3000/ride/new
app.post('/ride/new', (req, res) => {
    //const user_id = req.body["user_id"];
    //console.log(req.body);
    const ride_id = req.body["id"];
    const date = req.body["date"];
    const time = req.body["time"];
    const name = req.body["name"];
    const starting = req.body["starting"];
    const destination = req.body["destination"];
    const driver = req.body["driver"];
    if(!database.Rides) {
        database.Rides = [];
    }
    database.Rides.push({
        id: ride_id,
        date: date,
        time: time,
        starting: starting,
        destination: destination,
        driver: driver
    });
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    //console.log(`Created ride ${ride_id} with driver ${user_id}`);
    res.send('Set.');
});

// ride/delete?ride_id=702
app.get('ride/delete', (req, res) => {
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = {};
    for(let ride in database.Rides) {
        //console.log(database.Rides[ride]);
        //console.log(ride_id);
        if (parseInt(database.Rides[ride].id) === ride_id) {
            my_ride = JSON.stringify(database.Rides[ride]);
            delete database.Rides[ride];
        }
    }

    for(let user in database.Users){
        if(JSON.parse(my_ride) in database.Users[user].Rides) { //might not work 
            //TODO
        }
    }
    fs.writeFile("database.json", JSON.stringify(database), err => {
        if (err) {
            console.err(err);}
    });
    res.send(`Deleted ${ride_id} from list of rides`);
});

//available rides
app.get('/rides/view', (req, res) => {
    const rides = [];//[{"id":280,"date":"12/11/2020","time":"5:30PM","starting":"UMASS","destination":"Boston Logan Airport", "driver": {'id': 83,'name': "Jane Smith", "email":"jsmith@umass.edu"}}]; 
    rides.push({"id":700,"date":"12/11/2020","time":"1:00PM","starting":"UMASS","destination":"Boston Logan Airport", "driver": {'id': 172,'name': "Sarah Joe", "email":"sjoe@umass.edu"}});
    for(let ride of database.Rides){
        rides.push(ride);
    }
    res.json({available: rides});
});
  
//   curl -d '{ "id" : "123", "name" : "jane doe", "email": "jdoe@umass.edu", "password": "123"}' -H "Content-Type: application/json" http://localhost:8000/user/new
app.post('/user/new', (req, res) => {
    const id = Math.floor(Math.random() * 10000);
    //const id = req.body["id"];
    const name = req.body["name"];
    const email = req.body["email"];
    const password = req.body["password"];

    let user = {
        id: id,
        name: name,
        email: email,
        password: password,
        my_rides: {},
        notifications: []
    };

    try {
       user_collection.insertOne(user);
       res.json({me: user, 'success':true});
    } catch (e) {
       console.log(e);
       res.sendStatus(500);
    };
});

// login?email=jdoe@umass.edu&password=123
app.get('/login', async function(req, res) {
    const _email = req.query.email;
    const password = req.query.password;
    let user = await user_collection.findOne({"email": _email}, {_id: 0});
    console.log(user);

    if(user !== null){
        if(password === user.password){
            res.json({me: user});
        }
        else {
            res.status(400).json({error: "Incorrect password."});
        }
    } else {
        res.status(400).json({error: "Email not found."});
    }
});

// /notify?from=123&to=321
app.get('/notify', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    let me = {};

    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === parseInt(from)) {
            me = database.Users[user];
        }
    }

    for(let user in database.Users){
        //console.log(parseInt(database.Users[user].id));
        //console.log(parseInt(to));
        if(parseInt(database.Users[user].id) === parseInt(to)) {
            if(!database.Users[user]["notifications"]) {
                database.Users[user]["notifications"] = [];
            }
            database.Users[user]["notifications"].push({"name": me.name, "id": me.id, "email": me.email});
            //console.log(database.Users[user]["notifications"]);
            fs.writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);}
            });
        }
    }
    res.send('Set.');
});
// /notifs?id=321
app.get('/notifs', (req, res) => {
    const user_id = req.query.id;

    for(let user in database.Users){
        if(parseInt(database.Users[user].id) === parseInt(user_id)) {
            //console.log("here");
            if(!database.Users[user].notifications ||  database.Users[user].notifications.length === 0){
                res.send('None');
                break;
            }
            res.json({"notifications": database.Users[user].notifications});
        }
    }
});

app.listen(port, () => {
    console.log(`Rideshare app listening at http://localhost:${port}`);
});
})
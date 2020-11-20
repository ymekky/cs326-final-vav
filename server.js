require("dotenv").config();

const fs = require("fs");
const express = require("express");
const expressSession = require("express-session"); // for managing session state
const passport = require("passport"); // handles authentication
const LocalStrategy = require("passport-local").Strategy; // username/password strategy

const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const utils = require("./database");
const cors = require("cors");
const port = process.env.PORT || 8080;
const mc = require("./miniCrypt");
const miniCrypt = new mc();

var MongoDBStore = require('connect-mongodb-session')(expressSession);

function checkLoggedIn(req, res, next) {
  console.log(req.user, req.isAuthenticated());
  if (req.isAuthenticated()) {
    // If we are authenticated, run the next route.
    next();
  } else {
    // Otherwise, redirect to the login page.
    res.redirect("/loginpage");
  }
}


// Passport configuration

let secrets;
let uri;
if (!process.env.URI) {
  secrets = require("./secrets.json");
  uri = secrets.uri;
} else {
  uri = process.env.URI;
}
var store = new MongoDBStore({
  uri: uri,
  collection: 'sessions'
});

// Session configuration
const session = {
  secret: process.env.SECRET || "SECRET", // set this encryption key in Heroku config (never in GitHub)!
  resave: false,
  saveUninitialized: true,
  store: store
};

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  
  const db = client.db("umass-ride");
  const user_collection = db.collection("users");
  const rides_collection = db.collection("rides");
  const driver_collection = db.collection("drivers");
  const notifications_collection = db.collection("notifications");
  const strategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    
    async (email, password, done) => {
    console.log('here?', email, password);
    const user = await user_collection.findOne({email});
    if (!user) {
      return done(null, false, { message: "Wrong email" });
    }
    if (!miniCrypt.check(password, user.password[0], user.password[1])) {
      console.log('called2')
      // invalid password
      // should disable logins after N messages
      // delay return to rate-limit brute-force attacks
      await new Promise((r) => setTimeout(r, 2000)); // two second delay
      return done(null, false, { message: "Wrong password" });
    }
    console.log('called3')
    // success!
    // should create a user object here, associated with a unique identifier
    return done(null, {_id: user._id, email, name: user.name});
  });
  app.use("/", express.static("client"));
  app.use(expressSession(session));
  passport.use(strategy);
  app.use(passport.initialize());
  app.use(passport.session());

  // Convert user object to a unique identifier.
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // Convert a unique identifier to a user object.
  passport.deserializeUser((uid, done) => {
    done(null, uid);
  });
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({ credentials: true}));
  app.get("/loginpage", (req, res) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.sendFile(path.join(__dirname + "/client/login.html"));
  });
  app.get("/register", (req, res) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.sendFile(path.join(__dirname + "/client/register.html"));
  });
  app.get("/account", (req, res) => {
    //res.header('Access-Control-Allow-Credentials', true);
    res.sendFile(path.join(__dirname + "/client/account.html"));
    console.log('here? account', req.user);
    res.status(200).json(req.user);
  });

  // /user/rides/view?user_id=12
  app.get("/user/rides/view", checkLoggedIn, async function (req, res) {
    const user_id = parseInt(req.query.user_id);
    const user = await user_collection.findOne({ _id: user_id });
    let my_rides = {};

    if (user !== null) {
      my_rides = user.my_rides;
    }

    res.json(my_rides);
  });

  // /user/rides/pending?user_id=12&ride_id=702 //searching
  app.get("/user/rides/pending", checkLoggedIn, async (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = await rides_collection.findOne({ _id: ride_id });

    const pending = await user_collection.updateOne(
      { _id: user_id },
      { $push: { "my_rides.pending": my_ride } }
    );

    res.send(`Added ride ${ride_id} to ${user_id}'s pending rides`);
  });

  // /user/rides/active?user_id=12&ride_id=702  //request accepted
  app.get("/user/rides/active", checkLoggedIn, async (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    let my_ride = await rides_collection.findOne({ _id: ride_id });
    await user_collection.updateOne(
      { _id: user_id },
      { $pull: { "my_rides.pending": my_ride } }
    );
    await user_collection.updateOne(
      { _id: user_id },
      { $push: { "my_rides.active": my_ride } }
    );

    res.send(`Added ride ${ride_id} to ${user_id}'s active rides`);
  });

  // /user/rides/completed?user_id=12&ride_id=702 //done
  app.get("/user/rides/completed", checkLoggedIn, async (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    const my_ride = await rides_collection.findOne({ _id: ride_id });
    await user_collection.updateOne(
      { _id: user_id },
      { $pull: { "my_rides.active": my_ride } }
    );
    await user_collection.updateOne(
      { _id: user_id },
      { $push: { "my_rides.completed": my_ride } }
    );
    res.send(`Added ride ${ride_id} to ${user_id}'s completed rides`);
  });

  // /user/rides/delete?user_id=12&ride_id=702
  app.get("/user/rides/delete", checkLoggedIn, async (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const ride_id = parseInt(req.query.ride_id);

    const my_ride = await rides_collection.findOne({ _id: ride_id });

    if (user_id === my_ride.driver._id) {
      await user_collection.updateMany(
        {},
        { $pull: { "my_rides.active": { _id: ride_id } } }
      ); //removes ride from everyone's existing rides
      await user_collection.updateMany(
        {},
        { $pull: { "my_rides.pending": { _id: ride_id } } }
      );
      await rides_collection.deleteOne({ _id: ride_id });
      await user_collection.updateOne(
        { _id: my_ride.driver._id },
        { $pull: { notifications: { ride_id: ride_id } } }
      ); //remove notification for driver
    } else {
      await user_collection.updateOne(
        { _id: user_id },
        { $pull: { "my_rides.active": { _id: ride_id } } }
      );
      await user_collection.updateOne(
        { _id: user_id },
        { $pull: { "my_rides.pending": { _id: ride_id } } }
      );
      await user_collection.updateOne(
        { _id: my_ride.driver._id },
        { $pull: { notifications: { _id: user_id } } }
      ); //remove notification for driver
    }
    res.send(`Removed ride ${ride_id} from ${user_id}'s active rides`);
  });

  //   curl -d '{ "driver" : {}, date": "12/02/2020", "time": "2:30PM","from":"umass", "to":"BOS"}' -H "Content-Type: application/json" http://localhost:3000/346
  app.post("/ride/new", checkLoggedIn, async (req, res) => {
    const driver = req.body["driver"];
    const date = req.body["date"];
    let time = req.body["time"];
    let hour = time.slice(0, 2);

    if (parseInt(hour) >= 13) {
      hour = parseInt(hour) - 12;
      time = JSON.stringify(hour) + time.slice(2, 5) + "PM";
    }
    else if(parseInt(hour) < 12){
      time = time + "AM";
    }
    else { //12 NOON
      time = time + "PM";
    }

    const from = req.body["from"];
    const to = req.body["to"];
    const ride_id = Math.floor(Math.random() * 10000);

    const ride = {
      _id: ride_id,
      date: date,
      time: time,
      from: from,
      to: to,
      driver: driver,
    };
    try{
      const returnedRide = await rides_collection.insertOne(ride);
    } catch(e) {
      console.error(e);
      res.sendStatus(500);
    }
    try{
      const newRide = await user_collection.updateOne({ "_id": driver._id }, { $push: { "my_rides.active": ride } } );
    } catch (e){
      console.error(e);
      res.sendStatus(500);
    }

    res.sendStatus(200);
  });

  //available rides
  app.get("/rides/view", checkLoggedIn, async function (req, res) {
    const rides = await rides_collection.find({}).toArray();
    res.json({ available: rides });
  });

  //   curl -d '{ "id" : "123", "name" : "jane doe", "email": "jdoe@umass.edu", "password": "123"}' -H "Content-Type: application/json" http://localhost:8000/user/new
  app.post("/user/new", async (req, res) => {
    const id = Math.floor(Math.random() * 10000);
    const name = req.body["name"];
    const email = req.body["email"];
    const password = req.body["password"];

    const check = await user_collection.countDocuments(
      { email: email },
      { limit: 1 }
    );
    if (check > 0) {
      //email already exists
      res.sendStatus(403);
      return;
    }

    const hashedPassword = miniCrypt.hash(password);

    let user = {
      _id: id,
      name: name,
      email: email,
      password: hashedPassword,
      my_rides: {},
      notifications: [],
    };

    try {
      user_collection.insertOne(user);
      //res.json({ me: user, success: true });
      res.redirect('/login.html');
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  // /user/password?user_id=3727&new=12372
  app.get("/user/password", checkLoggedIn, async function (req, res) {
    const user_id = parseInt(req.query.user_id);
    const newpwd = req.query.new;
    const hashedPassword = miniCrypt.hash(newpwd);
    const user = await user_collection.findOne({ _id: user_id });

    try {
      let user = await user_collection.updateOne(
        { _id: user_id },
        { $set: { password: hashedPassword } }
      );
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  });

  app.post('/login', passport.authenticate('local', { successRedirect: '/account', failureRedirect: '/login' }));
  app.get('/logout', checkLoggedIn, function(req, res){
    console.log('logout');
    req.logout();
    res.sendStatus(200);
  });

  // /notify?from=123&to=321&ride_id=1271
  app.get("/notify", checkLoggedIn, async function (req, res) {
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);
    const ride_id = parseInt(req.query.ride_id);
    console.log(from, to, ride_id);
    const me = await user_collection.findOne({ _id: from });
    await user_collection.updateOne(
      { _id: to },
      {
        $push: {
          notifications: {
            name: me.name,
            _id: me._id,
            email: me.email,
            ride_id: ride_id,
          },
        },
      }
    );

    res.send({ success: true });
  });

  // /denotify?from=123&to=321&ride_id
  app.get("/denotify", checkLoggedIn, async function (req, res) {
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);
    const ride_id = parseInt(req.query.ride_id);

    await user_collection.updateOne(
      { _id: to },
      { $pull: { notifications: { _id: from, ride_id: ride_id } } }
    );

    res.send({ success: true });
  });

  // /notifs?id=321
  app.get("/notifs", checkLoggedIn, async (req, res) => {
    const user_id = parseInt(req.query.id);
    try {
      const user = await user_collection.findOne({ _id: user_id });
      const notifications = user.notifications;
      res.json(notifications);
    } catch (err) {
      res.json({ success: false, error: "Error grabbing notifications" });
    }
  });

  app.listen(port, () => {
    console.log(`Rideshare app listening at http://localhost:${port}`);
  });
});
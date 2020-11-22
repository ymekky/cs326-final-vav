#Documentation
-----------
<br>
user document 
<br>
{"_id": Integer,
<br>
"name": String, &nbsp; //name of user
<br>
"email": String, &nbsp; //email of user
<br>
"password":[salt,hash], &nbsp; &nbsp; //encrypted password of user
<br>
"my_rides": &nbsp; &nbsp; //user's rides
<br>
&nbsp; &nbsp; &nbsp; {"active" : Array //user's active rides
<br>
&nbsp; &nbsp; &nbsp; "pending": Array //user's pending (requested) rides
<br>
&nbsp; &nbsp; &nbsp; , 
<br>
"notifications": Array &nbsp; //user's notifications
}
<br>
<br>
ride document
<br>
{"_id": Integer,
<br>
"date": String &nbsp; //date of ride
<br>
"time": String, &nbsp; //time of ride
<br>
"from": String,  &nbsp; //starting location
<br>
"to": String, &nbsp; //final destination
<br>
"driver":
<br>
	{"_id": Integer, &nbsp; //id of user driver (as above)
<br>
	"name": String, &nbsp; //name of user driver (as above)
<br>
	"email":"ymekky@umass.edu" &nbsp; //email of user driver (as above)
<br>
	}
<br>
}
<br>
<br>
session document
<br>
{
<br>
"_id":String,
<br>
"expires": Date, 	&nbsp; //date of session's expiry
<br>
"session": Object   &nbsp; //produced by py passport-local
<br>
}
<br>

#Division of labour
<br>
Alishba - MongoDB, Completing notifications (/notify, /notifs), matching user with rides, and showing notifications in front-end, User authentication
<br>
Yasmeen - MongoDB, Added unctionality to accept/reject request (user/rides/active), functions to cancel rides (user/rides/delete), functions to remove completed rides (user/rides/completed), fixed conflicting requests and rides, function to change password (/user/password), made persistent and added sessions, added function to suggest rides available in next week if exact date is not available, added notifications on refresh, completed user/rides/view and user/rides/pending
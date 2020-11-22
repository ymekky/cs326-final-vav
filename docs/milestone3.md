# Documentation
-----------
<br>

<br>
{
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"_id": Integer,
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": String, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //name of user
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"email": String, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//email of user
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password":[salt,hash], &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//encrypted password of user
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"my_rides": &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //user's rides
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; {"active" : Array &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //user's active rides
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; "pending": Array &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //user's pending (requested) rides
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; , 
	<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notifications": Array of { //user's notifications
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; _id: Integer,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //requesting user's id
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; name: String,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //requesting user's name
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; email, String,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //requesting user's email
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; ride_id, Integer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //id of ride being requests
<br>
}
<br>
}
<br>
<br>
ride document
<br>
{
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "_id": Integer,
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "date": String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//date of ride
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "time": String, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//time of ride
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "from": String,  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //starting location
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "to": String, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//final destination
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "driver":
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; {"_id": Integer, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; //id of user driver (as above)
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;"name": String, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//name of user driver (as above)
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;"email":"ymekky@umass.edu" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//email of user driver (as above)}
<br>
}
<br>
<br>
session document
<br>
{
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "_id":String,
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "expires": Date, 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//date of session's expiry
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "session": Object   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//produced by py passport-local
<br>
}
<br>

# Division of labour
-----------
<br>
Alishba - MongoDB, Completing notifications (/notify, /notifs), matching user with rides, and showing notifications in front-end, User authentication
<br>
Yasmeen - MongoDB, Added unctionality to accept/reject request (user/rides/active), functions to cancel rides (user/rides/delete), functions to remove completed rides (user/rides/completed), fixed conflicting requests and rides, function to change password (/user/password), made persistent and added sessions, added function to suggest rides available in next week if exact date is not available, added notifications on refresh, completed user/rides/view and user/rides/pending
#Milestone 2

Heroku Link: https://enigmatic-garden-25331.herokuapp.com/

Definitions:
Active: Ride has been accepted by driver User 
Pending: User requested Ride, but driver User is yet to accept
Completed: Ride was completed 

##User Object
-----------
ID
Name
Email
Password
Rides: {Active: , Pending: [], Completed: []}
Notifications: []


##Ride Objects
------------
ID
Date
Time
Start
Destination
Driver: User Object

##API ENDPOINTS
---------------------------------------------------------------------------------------------------------------------------------------------

/user/new                         makes new User object
<br>
*POST input:'{ "id" : "123", "name" : "jane doe", "email": "jdoe@umass.edu", "password": "123"}')*
<br>
<br>
/login                            allows User to login
<br>
*GET input: /login?email=jdoe@umass.edu&password=123*
---------------------------------------------------------------------------------------------------------------------------------------------

/user/rides/view				  returns active, pending, and completed rides of User in the form {Active: , Pending: [], Completed: []}
<br>
*GET input: /user/rides/view?user_id=12)*
<br><br>
/user/rides/pending           	  creates new, pending Ride for User
<br>
*GET input: /user/rides/pending?user_id=12&ride_id=702*
<br><br>                            
/user/rides/active           	  creates new active Ride from existing pending ride of User
<br>
*user/rides/active?user_id=12&ride_id=702)*
<br><br>
/user/rides/completed         	  creates new completed Ride from existing active ride of User
<br>
*/user/rides/completed?user_id=12&ride_id=702*
<br><br>
/user/rides/delete            	  cancels pending or active Ride of User
<br>
*/user/rides/delete?user_id=12&ride_id=702*
---------------------------------------------------------------------------------------------------------------------------------------------
/ride/new                         makes new Ride Object
<br>
*POST body: {"user_id" : "123", "ride_id" : "232", "date": "12/02/2020", "time": "2:30PM","name":"JSJ"}*
<br>
/ride/delete                      deletes Ride Object from database (when driver cancels) */ride/delete?ride_id=702*
<br>
/rides/view						  gets all rides in database */rides/view*
---------------------------------------------------------------------------------------------------------------------------------------------
/notify                           notifies other User of request/confirmation *GET input: /notify?from={id}&to={id}*
<br>
/notifs                           returns the array of notifications for User */notifs?id={user id}*
---------------------------------------------------------------------------------------------------------------------------------------------
![](https://github.com/ymekky/cs326-final-vav/blob/main/docs/registering.png)
Here you create an account, which calls /user/new and creates a new User object.

![](https://github.com/ymekky/cs326-final-vav/blob/main/docs/login.png)
After creating an account, you can login here. Uses user/login to authenticate inputs against existing User objects. 

![](https://github.com/ymekky/cs326-final-vav/blob/main/docs/searching.png)
To find a ride, click 'find ride' on the main page to take you here. 
If you want to find a ride (as a passenger), the client will temporarily save inputs to fetch the best matched rides using rides/view. 
If you want to post a ride (as a driver), the client will use the inputs to update the availble rides using rides/new.

![](https://github.com/ymekky/cs326-final-vav/blob/main/docs/matching.png)
The client uses /rides/view to retrieve and show the available rides for a rider. The user can request a ride, the client will update the requostor's pending rides (/user/rides/pending). It then notifies the requested User through /notify and updates that User's notifaction array.

![](https://github.com/ymekky/cs326-final-vav/blob/main/docs/myacc.png)
Finally, based on the above data, here is where the User can find their confirmed, requested, and completed rides (fetches /user/rides/view to retrieve User's rides).
<br>
The User can also cancel their ride (/user/rides/delete).
<br>
The client also retrieves the User's notifications (/notifs). 
They confirm a request, which updates the requostor's *active* or confirmed rides (/user/rides/active) and notifies them.
<br>
Logging out erases local storage. 



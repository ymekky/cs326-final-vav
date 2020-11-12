# Milestone 2

Heroku Link: https://enigmatic-garden-25331.herokuapp.com/

Definitions:
Active: Ride has been accepted by driver User 
Pending: User requested Ride, but driver User is yet to accept
Completed: Ride was completed 

# User Object
-----------
ID
<br>
Name
<br>
Email
<br>
Password
<br>
Rides: {Active: , Pending: [], Completed: []}
<br>
Notifications: []


## Ride Objects
------------
ID
<br>
Date
<br>
Time
<br>
Start
<br>
Destination
<br>
Driver: User Object

## API ENDPOINTS #

/user/new &nbsp; &nbsp; &nbsp; makes new User object
<br>
*POST input:'{ "id" : "123", "name" : "jane doe", "email": "jdoe@umass.edu", "password": "123"}')*
<br>
<br>
/login &nbsp; &nbsp; &nbsp; sallows User to login
<br>
*GET input: /login?email=jdoe@umass.edu&password=123*

<br><br>

/user/rides/view &nbsp; &nbsp; &nbsp; returns active, pending, and completed rides of User in the form {Active: , Pending: [], Completed: []}
<br>
*GET input: /user/rides/view?user_id=12)*
<br><br>
/user/rides/pending &nbsp; &nbsp; &nbsp; creates new, pending Ride for User
<br>
*GET input: /user/rides/pending?user_id=12&ride_id=702*
<br><br>                            
/user/rides/active &nbsp; &nbsp; &nbsp; creates new active Ride from existing pending ride of User
<br>
*user/rides/active?user_id=12&ride_id=702)*
<br><br>
/user/rides/completed &nbsp; &nbsp; &nbsp; creates new completed Ride from existing active ride of User
<br>
*/user/rides/completed?user_id=12&ride_id=702*
<br><br>
/user/rides/delete &nbsp; &nbsp; &nbsp; cancels pending or active Ride of User
<br>
*/user/rides/delete?user_id=12&ride_id=702*

<br><br>

/ride/new &nbsp; &nbsp; &nbsp; makes new Ride Object
<br>
*POST body: {"user_id" : "123", "ride_id" : "232", "date": "12/02/2020", "time": "2:30PM","name":"JSJ"}*
<br>
/ride/delete &nbsp; &nbsp; &nbsp; deletes Ride Object from database (when driver cancels) */ride/delete?ride_id=702*
<br>
/rides/view &nbsp; &nbsp; &nbsp; gets all rides in database */rides/view*

<br><br>

/notify &nbsp; &nbsp; &nbsp; notifies other User of request/confirmation *GET input: /notify?from={id}&to={id}*
<br>
/notifs &nbsp; &nbsp; &nbsp; returns the array of notifications for User */notifs?id={user id}*

<br><br>

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
Finally, based on the above data, here is where the User can find their confirmed, requested, and completed rides (fetches /user/rides/view to retrieve User's rides). The User can also cancel their ride (/user/rides/delete). The client also retrieves the User's notifications (/notifs). They confirm a request, which updates the requostor's *active* or confirmed rides (/user/rides/active) and notifies them. Logging out erases local storage. 



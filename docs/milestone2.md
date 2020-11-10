Milestone 2

Defintions:
Active: Ride has been accepted by driver User 
Pending: User requested Ride, but driver User is yet to accept
Completed: Ride was completed 

User Object
-----------
ID
Name
Email
Password
Rides: {Active: , Pending: [], Completed: []} 


Ride Objects
------------
ID
Date
Time
Start
Destination
Driver: User Object

API ENDPOINTS
-------------

/user/new                         allows User to create account
/login                            allows User to login

/user/rides/view				  returns active, pending, and completed rides of User in the form {Active: , Pending: [], Completed: []}

/user/rides/pending           	  creates new, pending Ride for User
/user/rides/active           	  creates new active Ride from existing pending ride of User
/user/rides/completed         	  creates new completed Ride from existing active ride of User
/user/rides/delete            	  cancels pending or active Ride of User

/ride/new                         makes new Ride Object
/ride/delete                      deletes Ride Object from database (when driver cancels)
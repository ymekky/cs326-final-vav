Milestone 2

Defintions:
Active: Ride has been accepted by driver User 
Pending: User requested Ride, but driver User is yet to accept
Completed: 
Cancelled: Ride was cancelled by driver or User

User Object
-----------
Name
Email
Password
Rides: {Active: , Pending: [], Completed: [], Canelled: []} 
Chatters: []


Ride Objects
------------
ID
Date
Time
Start - Destination
Riders: [array of User objects]
Driver: User Object

API ENDPOINTS
-------------

/user/new                         allows User to create account
/login                            allows User to login

/user/rides/view				  returns active, pending, completed, and cancelled rides of User ( {Active: , Pending: , Completed: [], Canelled: []})

/user/rides/pending/new           creates new, pending Ride for User
/user/rides/active/new            creates new active Ride from existing pending ride of User
/user/rides/completed/new         creates new completed Ride from existing active ride of User
/user/rides/delete            	  cancels active Ride of User

/user/chat/view                   returns active chats of User (“Chatters”)
/user/chat/delete                 removes Users from each other's chats

/ride/new                         makes new Ride Object
/ride/delete                      deletes Ride Object from database (when driver cancels)
/ride/addRider                    adds rider (User) to Ride
/ride/removeRider			      removes rider (User) from Ride
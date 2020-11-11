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
Notifications: []


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

/user/new                         allows User to create account (/user/new?id=123&name=jane doe&email=jdoe@umass.edu&password=123)               
/login                            allows User to login (/login?email=jdoe@umass.edu&password=123)

/user/rides/view				          returns active, pending, and completed rides of User in the form {Active: , Pending: [], Completed: []}
                                  (/user/ride/view?status=active&id=232&date=12/11/2020&time=5:30&starting=umass&destination=bostan logan)

/user/rides/pending           	  creates new, pending Ride for User (/user/rides/pending?user_id=12&ride_id=702)
                                  
/user/rides/active           	    creates new active Ride from existing pending ride of User (/user/rides/active?user_id=12&ride_id=702)
/user/rides/completed         	  creates new completed Ride from existing active ride of User (/user/rides/completed?user_id=12&ride_id=702)
/user/rides/delete            	  cancels pending or active Ride of User (/user/rides/delete?user_id=12&ride_id=702)

/ride/new                         makes new Ride Object (user/ride/new?date=11/20/2020&time=5:30pm&name=jane doe&starting=umass&destination=bostan logan&driver=sara                                                          jane)
/ride/delete                      deletes Ride Object from database (when driver cancels) (/ride/delete?ride_id=702)
/rides/view						            gets all rides in database (user/ride/view?date=11/20/2020&time=5:30pm&name=jane doe&starting=umass&destination=bostan                                               logan&driver=sara jane&id=700&date=12/12/2012&time=8:30am&name=John Doe&starting=jfk&destination=umass&driver=sara smith)

/notify                           notifies the id of the user that is notifying the other user (/notify?from=123&to=321)
/notifs                           notfies the user of incoming messages (/notifs?id=321)

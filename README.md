# UMassRideshare: https://enigmatic-garden-25331.herokuapp.com

### Overview:

Our app is a rideshare app which we have created for the use of UMASS Students. This app would allow students to search for a ride or offer a ride to and from various airports and UMASS. It is unique as it is specifically designed to make the rideshare process easier than what it is now and it is specifically tailored to UMASS students needs. As of now whenever students need a ride or offer rides they make posts on social media to try and find someone to share a ride with. This is inefficient as posts get lost and it is hard to find people who are leaving at the same time as you. Our app makes this easier with our search and request feature.

There are two types of users: a driver and a passenger. A user can be both at the same time, but not for the same ride. After signing up, the user inputs a route, date, and time, and searches for a ride. If the user is a passenger, they’ll get a list of matches based on their input, and can request a ride. If the user is a driver, they just have to wait for a notification for a request. After confirmation, the users can contact each other and complete their rides!

### Team Members:

Yasmeen Mekky (github: ymekky) Alishba Khalil (github: alishbakhalil)

### User Interface: 
|                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|---------------------------------  |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| Register                          | The user registers here. This creates a user in the database. <br> ![Registration View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/regview.png)                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Login                             | The user logs in here. This validates a user in the database. <br> ![Login View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/loginview.png)                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Find a Ride (search)              | The user inputs their ride information (passenger or driver, starting location and destination, date, and time).<br>This is used to create a ride (if a driver) or return a list of matches (if a passenger). <br> ![Search View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/searchview2.png)                                                                                                                                                                                                                                                                               |
| Matches and requests              | Passengers only: this retrieves the best matches for the ride search.<br>If there are no rides available on the chosen day, it will return the rides available in the next 6 days (if any). <br>The rides are sorted by date and time.<br><br>The user picks a ride and ‘requests’ it. The driver will be notified, and accepts or rejects it.<br>Meanwhile, the requested ride will be ‘requested’/’pending’ for the passenger. <br> ![Match View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/matchesview.png)                                                         |
| My account and all its features   | A user accesses his/her confirmed and requested rides here.<br>They can cancel their requests, or an already confirmed ride.<br>The rides are sorted by type, date, and time. The table provides the user with the necessary information about the ride, including a clickable contact email, with the subject and message already filled out.<br><br>A driver (who posted a ride) can also accept/reject requests for their ride here.<br><br>The user can also change their password. <br> ![Account View 1](https://github.com/ymekky/cs326-final-vav/blob/main/docs/accview1.png) <br> ![Account View 2](https://github.com/ymekky/cs326-final-vav/blob/main/docs/accview2.png)   |
| Notifications/alerts on request   | Throughout the app, the user can get ‘live’ notifications (on refresh) for a request. This makes the user experience smoother. <br> ![Notification View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/notifview.png)                                                                                                                                                                                                                                                                                                                                                              |
| Main Page                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 

### APIs: 
|                           |                                                                                                                                                                   |
|-----------------------    |---------------------------------------------------------------------------------------------------------------------------------------------------------------    |
| /user/new                 | makes new User object <br> *POST input:'{ "id" : "123", "name" : "jane doe", "email": "jdoe@umass.edu", "password": "123"}')*                                       |
| /login                    | allows User to login via Passport authentication <br> EXAMPLE: *POST body: '{email, password}';                                                                    |
| /logout                   | allows User to login via Passport                                                                                                                                 |
| /account                  | redirects User to account page                                                                                                                                    |
| /user/password            | allows User to change password                                                                                                                                    |
|                           |                                                                                                                                                                   |
| /user/rides/view          | returns active, pending, and completed rides of User in the form {Active: , Pending: [], Completed: []} <br>EXAMPLE: *GET input: /user/rides/view?user_id=12)*     |
| /user/rides/pending       | creates new, pending Ride for User <br> EXAMPLE: *GET input: /user/rides/pending?user_id=12&ride_id=702*                                                            |
| /user/rides/active        | creates new active Ride from existing pending ride of User <br> EXAMPLE: *user/rides/active?user_id=12&ride_id=702)*                                                |
| /user/rides/completed     | creates new completed Ride from existing active ride of User <br> EXAMPLE: */user/rides/completed?user_id=12&ride_id=702*                                           |
| /user/rides/delete        | cancels pending or active Ride of User <br> EXAMPLE: */user/rides/delete?user_id=12&ride_id=702*                                                                    |
|                           |                                                                                                                                                                   |
| /ride/new                 | makes new Ride Object <br> EXAMPLE POST body: *{"user_id" : "123", "ride_id" : "232", "date": "12/02/2020", "time": "2:30PM","name":"JSJ"}*                         |
| /rides/view               | gets all rides in database <br> EXAMPLE: */rides/view*                                                                                                             |
|                           |                                                                                                                                                                   |
| /notify                   | notifies other User of request/confirmation <br> EXAMPLE *GET input: /notify?from={id}&to={id}*                                                                    |
| /denotify                 | removes notification <br> EXAMPLE GET *input: /notify?from={id}&to={id}&ride_id={rideid}*                                                                           |
| /notifs                   | returns the array of notifications for User <br> EXAMPLE: */notifs?id={user id}*                                                                                   |
### Database:
User Document
<br>
{
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "_id": Integer,
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "name": String, //name of user
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "email": String, //email of user
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "password": [salt,hash] //encrypted password of user
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "my_rides": //user's rides
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "active" : Array of Ride documents //user's active rides
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "pending": Array of Ride documents //user's pending (requested) rides
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "notifications": Array of Objects. Each object looks like this: //user's notifications
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; _id: Integer,//requesting user's id
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; name: String,//requesting user's name
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; email, //requesting user's email
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ride_id: Integer //id of ride being requested
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }
<br>
}
<br>
<br>

Ride Document (belongs to users)
<br>
{
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "_id": Integer,
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "date": String //date of ride
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "time": String, //time of ride
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "from": String,  //starting location
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "to": String, //final destination
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "driver":
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "_id": Integer, //id of user driver (as above)
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "name": String, //name of user driver (as above)
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  "email":"ymekky@umass.edu"//email of user driver (as above)}
<br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }
<br>
<br>

Session Document
<br>
{
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "_id": String,
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "expires": Date,   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//date of session's expiry
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "session": Object   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//produced by passport-local
<br>
}
<br>
<br>

### URL Routes/Mappings:
|                                                                   |                                                                                                   |
|---------------------------------------------------------------    |------------------------------------------------------------------------------------------------   |
| https://enigmatic-garden-25331.herokuapp.com/login.html           | Used to view the login page. Anyone can access.                                                   |
| https://enigmatic-garden-25331.herokuapp.com/register.html        | Used to view the registration page. Anyone can access.                                            |
| https://enigmatic-garden-25331.herokuapp.com/index.html           | Used to view the main page. Anyone can access, but only those logged in can see notifications.    |
| https://enigmatic-garden-25331.herokuapp.com/account.html         | Used to view account and ride information. Only registered users can access.                      |
| https://enigmatic-garden-25331.herokuapp.com/info.html            | Used to search for a ride. Only registered users can access.                                      |
| https://enigmatic-garden-25331.herokuapp.com/bestMatches.html     | Used to view matched rides. Only registered users can access.                                     |

### Authentication/Authorization:
Users must be registered and are authenticated on login through passport. All CRUD operations required to use the account and matches pages also require authentication. Without authentication, only the main, login, and registration pages will be available.  
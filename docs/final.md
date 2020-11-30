# TEAM VAV
## UMassRideshare: https://enigmatic-garden-25331.herokuapp.com
### FALL 2020
### Overview: 
For those living in the UMass area, it can get complicated to find a ride to the surrounding airports. Especially for out-of-state and international students who don’t have family to pick them up. UMass Rideshare provides residents in the UMass area with an easy way to share a ride to or from Boston Logan, Bradley International, or JFK Airport (practically for free). Right now, students normally have to ask around on the UMass facebook group for a ride. Our app innovates by making rideshare possible with just a couple of clicks.

There are two types of users: a driver and a passenger. A user can be both at the same time, but not for the same ride. After signing up, the user inputs a route, date, and time, and searches for a ride. If the user is a passenger, they’ll get a list of matches based on their input, and can request a ride. If the user is a driver, they just have to wait for a notification for a request. After confirmation, the users can contact each other and complete their rides. 

## Team Members: 
Yasmeen Mekky (github: ymekky)
Alishba Khalil
# User Interface: 
|                                 	|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         	|
|---------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Register                        	| The user registers here. This creates a user in the database. <br> ![Registration View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/regview.png)                                                                                                                                                                                                                                                                                                                                                                                                                           	|
| Login                           	| The user logs in here. This validates a user in the database. <br> ![Login View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/loginview.png)                                                                                                                                                                                                                                                                                                                                                                                                                           	|
| Find a Ride (search)            	| The user inputs their ride information (passenger or driver, starting location and destination, date, and time).<br>This is used to create a ride (if a driver) or return a list of matches (if a passenger). <br> ![Search View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/searchview2.png)                                                                                                                                                                                                                                                                           	|
| Matches and requests            	| Passengers only: this retrieves the best matches for the ride search.<br>If there are no rides available on the chosen day, it will return the rides available in the next 6 days (if any). <br>The rides are sorted by date and time.<br><br>The user picks a ride and ‘requests’ it. The driver will be notified, and accepts or rejects it.<br>Meanwhile, the requested ride will be ‘requested’/’pending’ for the passenger. <br> ![Match View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/matchesview.png)                                                        	|
| My account and all its features 	| A user accesses his/her confirmed and requested rides here.<br>They can cancel their requests, or an already confirmed ride.<br>The rides are sorted by type, date, and time. The table provides the user with the necessary information about the ride, including a clickable contact email, with the subject and message already filled out.<br><br>A driver (who posted a ride) can also accept/reject requests for their ride here.<br><br>The user can also change their password. <br> ![Account View 1](https://github.com/ymekky/cs326-final-vav/blob/main/docs/accview1.png) <br> ![Account View 2](https://github.com/ymekky/cs326-final-vav/blob/main/docs/accview2.png) 	|
| Notifications/alerts on request 	| Throughout the app, the user can get ‘live’ notifications (on refresh) for a request. This makes the user experience smoother. <br> ![Notification View](https://github.com/ymekky/cs326-final-vav/blob/main/docs/notifview.png)                                                                                                                                                                                                                                                                                                                                                          	|
| Other                           	|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         	|
|                                 	|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         	| 

### APIs: 
copy from milestone2 but removed /ride/delete 
New: /user/password, /login /logout, /register, /account
Edited: /denotify?from=123&to=321&ride_id=232
Database: same as milestone3. Add relationships
### URL Routes/Mappings:
|                                                               	|                                                                                                	|
|---------------------------------------------------------------	|------------------------------------------------------------------------------------------------	|
| https://enigmatic-garden-25331.herokuapp.com/login.html       	| Used to view the login page. Anyone can access.                                                	|
| https://enigmatic-garden-25331.herokuapp.com/register.html    	| Used to view the registration page. Anyone can access.                                         	|
| https://enigmatic-garden-25331.herokuapp.com/index.html       	| Used to view the main page. Anyone can access, but only those logged in can see notifications. 	|
| https://enigmatic-garden-25331.herokuapp.com/account.html     	| Used to view account and ride information. Only registered users can access.                   	|
| https://enigmatic-garden-25331.herokuapp.com/info.html        	| Used to search for a ride. Only registered users can access.                                   	|
| https://enigmatic-garden-25331.herokuapp.com/bestMatches.html 	| Used to view matched rides. Only registered users can access.                                  	|

### Authentication/Authorization:
Users must be registered and are authenticated on login through passport. All CRUD operations required to use the account and matches pages also require authentication. Without authentication, only the main, login, and registration pages will be available.  
### Division of Labour: 
- Initial HTML, CSS: 
    - **Yasmeen**: 
        - wireframes, data interactions, index.html, login.html, info.html, account.html
    - **Alishba**:
        - bestMatches.html, register.html
- Front-end/Back-end: 
    - **Yasmeen**:
        - Came up with most of API plan, document plan
        - Most of index.js
        - My Account: complete implementation of CRUD for user’s information, confirmed/pending rides notifications. Allows users to contact each other
        - Best Matches: implemented functions that: 
            - allow users to view available rides based on their inputs
            - filtering algorithm and sorting rides
            - allow to request a ride (creating a new pending ride)
            - notify the corresponding driver (creating a notification). 
        - Find Ride: implemented function that creates ride based on inputs and allows passengers to search for a ride 
        - Sitewide notifications: implemented retrieval of user’s notifications on login/refresh
        - user/rides/active,  user/rides/pending,  user/rides/completed, user/rides/delete, /user/password, /user/rides/view, /denotify, /ride/new, /rides/view
    - **Alishba**:
        - Registering and creating user
        - User Authentication
            - /logout, /login, /account
        - Encrypting passwords
    - **Both**: implementation of backend server
        - /user/new , /notify, /notifs

### Conclusion:
This project was extremely challenging but we learned a lot. Through the process, we learned how data interacts between the frontend and backend. Our partner, Xiawoei, couldn’t contribute to this project, so we had to build the entire project as just a team of two, which was really stressful. Because of that, we had to sacrifice some features, like a chat. Additionally, we would’ve liked to verify umass students, but it turned out we have to pay for a student validation API to do so (we wish we realized this before). It made us learn the limitations of our resources. It was also really hard and unfair for one person to do 70% of the work in this project
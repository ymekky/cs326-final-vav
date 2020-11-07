function findRide(ride_id,database) {
    let my_ride = {};

    for(let ride in database.Rides) {
        if (parseInt(database.Rides[ride].id) === ride_id) {
            return database.Rides[ride];
        }
    }
    return {};
}

function addToRide(ride_id,database,user) {
    let my_ride = {};

    for(let ride in database.Rides) {
        if (parseInt(database.Rides[ride].id) === ride_id) {
        		database.Rides[ride].riders.push(user);
        }
    }
}

module.exports = {findRide, addToRide};
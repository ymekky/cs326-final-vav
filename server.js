import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync, fstat} from 'fs';

let database;
if (existsSync("database.json")) {
    database = JSON.parse(readFileSync("database.json"));
} else {
    database = {
        Users: [],
        Rides: []
    };
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);

    if (parsed.pathname === '/user/new') { 
        let body = '';

        req.on('data', data => body += data);
        req.on('end', () => {
            console.log(body);
            const data = JSON.parse(JSON.stringify(body));
            database.Users.push({
                user_id: data.USERID,
                name: data.name,
                email: data.email,
                password: data.password,
                Rides: {},
                Chatters: []
            });
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
        });
    } else if (parsed.pathname === '/user/rides/pending/new') { //?USERID=89&RIDEID=29
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);

            const my_ride = {};
            for(let ride of database.Rides) {
                if (ride.id === data.RIDEID) {
                    my_ride = ride;
                }
            }
            for(let user of database.Users){
                if(user.id === data.USERID) {
                    database.Users.indexOf(user)[Rides]['pending'] = ride;
                }
            }

            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
        });
    }  
    else {
        // If the client did not request an API endpoint, we assume we need to fetch a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
        const path = filename;
        console.log("trying to serve " + path + "...");
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            } else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            } else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            } else {
                res.writeHead(200);
            }

            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
}).listen(8080);

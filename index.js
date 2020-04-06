const express = require("express");

const shortid = require("shortid");

const server = express();

//users array brought to global scope
let users = [
    {
        id: shortid.generate(),
        name: "Joe",
        bio: "Fullstack"
    },
    {
        id: shortid.generate(),
        name: "Cindy",
        bio: "Frontend"
    },
    {
        id: shortid.generate(),
        name: "Chazz",
        bio: "Backend"
    },
]

//main API startup endpoint
server.get("/", (req, res) => {
    res.json({ api: "running...."});
});

const port = 5000;

server.listen(port, () => console.log(`\n api on port ${port} \n`))

//middleware
server.use(express.json());


//endpoints

//POST for /users
server.post('/api/users', (req, res) => {

    let { id, name, bio } = req.body;
    
    //if success, status 201; otherwise status 404 if no name or bio plus errormessage
    if (req.body) {
        res.status(201).json(users);
    } else if (!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
        //error status 500 if can't save plus errormessage
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
});

//GET for /users
server.get("/api/users", (req, res) => {
    if (users) {
        res.json(users);
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
});

//GET for /users/:id
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const users = users.find((user) => user.id == id);

    if (users) {
    res.status(201).json(users);
    } else if (!users) {
        //status 404 if can't find id
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    } else {
        //status 500 if error retrieving user
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
});







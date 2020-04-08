const express = require("express");

// const shortid = require("shortid");

const server = express();

//users array brought to global scope
let users = [
    {
        // id: shortid.generate(),
        id: 1,
        name: "Joe",
        bio: "Fullstack"
    },
    {
        // id: shortid.generate(),
        id: 2,
        name: "Cindy",
        bio: "Frontend"
    },
    {
        // id: shortid.generate(),
        id: 3,
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

    const userData = req.body;
    
    //if success, status 201; otherwise status 404 if no name or bio plus errormessage
    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else if (userData) {
            users.push(userData);
            res.status(201).json(users);
    } else {
        //error status 500 if can't save plus errormessage
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
});

//GET for /users
server.get("/api/users", (req, res) => {
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
});

//GET for /users/:id
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const userFound = users.find((user) => user.id == id);

    if (userFound) {
    res.status(201).json(userFound);
    } else if (!userFound) {
        //status 404 if can't find id
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    } else {
        //status 500 if error retrieving user
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
});

//DELETE for /users/:id
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    
    users = users.filter(user => {
        return (+user.id !== +id);
        
    })
    console.log("users", users);
    res.status(200).json(users);
    // .then((count) => {
    //     if (count) {
    //         res.status(200).json({ message: "user has been deleted" });
    //     } else {
    //         res.status(404).json({ message: "The user with the specified ID does not exist." });
    //     }
    // })
    // .catch(err => {
    //     res.status(500).json({ errorMessage: "The user could not be removed" });
    // });
});

//PATCH for /users/:id
server.patch("/api/users/:id", (req, res) => {
    const changes = req.body;

    users.update(req.params.id, changes)
    .then((count) => {
        if (count) {
            users.findById(req.params.id)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "The user information could not be modified." })
            })
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    })
})




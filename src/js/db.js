//----------------------------------DATABASE----------------------------------\\

// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'simplegamelibrary',
});

//----------------------------------CLASSES----------------------------------\\

class User {

    static users = []

    constructor(id, username, password, email) {
        this.id = id; //int
        this.username = username; //string
        this.password = password; //string
        this.email = email; //string
        this.lists = []; //array
        User.users.push(this);
    }

    static getAllUsers() {
        return User.users;
    }

    get getFullName() {
        return this.name + " " + this.firstname;
    }

}

class List {
    constructor(id, name, favorite, games) {
        this.id = id; //int
        this.name = name; //string
        this.favorite = favorite; //boolean
        this.games = games; //array
    }
}

class Game {
    constructor(id, name, release, publishers, developers, price, rating, description, languages, plateforms, pcRequirement, image, categories) {
        this.id = id; //int
        this.name = name; //string
        this.release = release; //date
        this.publishers = publishers; //string
        this.developers = developers; //string
        this.price = price; //float
        this.rating = rating; //int
        this.description = description; //string
        this.languages = languages; // string
        this.plateforms = plateforms; //array
        this.pcRequirement = pcRequirement; //array
        this.image = image; //string
        this.categories = categories; //array
    }
}

class Category {
    constructor(id, name) {
        this.id = id; //int
        this.name = name; //string
    }
}

//----------------------------------OBJECTS CREATION FROM DATABASE----------------------------------\\

//Create Users
try {
    const [results] = await con.query(
        'SELECT * FROM accounts'
    );
    results.forEach((element) => new User(element.id, element.username, element.password, element.email))
} catch (err) {
    console.log(err);
}

//Create Lists && Lists in Users

// TODO

//Create games

// TODO

//Create Category

// TODO

//Create Games in Lists

// TODO

//Create Category in Games

//TODO

//----------------------------------TESTS----------------------------------\\

// Test getFullName
/*
let user = new User(1, "Name", "Firstname", "login", "pwd", []);
if (user.getFullName === "Name Firstname"){
    console.log("Test User.getFullName OK");
} else {
    console.log("Test User.getFullName ERROR")
}
*/
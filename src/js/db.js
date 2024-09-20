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

    /**
     * Constructor of User class
     * @param {int} id The ID of the user
     * @param {string} username The username of the user
     * @param {string} password The password of the user
     * @param {string} email The email of the user
     */
    constructor(id, username, password, email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.lists = [];
        User.users.push(this);
    }

    /**
     * Function to get all created users
     * @returns all created users with the class User
     */
    static getAllUsers() {
        return User.users;
    }
}

class List {
    /**
     * Constructor of List class
     * @param {int} id the ID of the list 
     * @param {string} name 
     * @param {boolean} favorite  
     */
    constructor(id, name, favorite) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.games = [];
    }
}

class Game {
    /**
     * Constructor of Game class
     * @param {int} id The ID of the game
     * @param {string} name The name of the game
     * @param {Date} release The date of the game
     * @param {string} publishers The publishers of the game
     * @param {string} developers The developers of the game
     * @param {float} price The price of the game 
     * @param {int} rating The rate of the game
     * @param {string} description The description of the game
     * @param {string} languages The languages of the game 
     * @param {array} plateforms The plateforms of the game
     * @param {array} pcRequirement The PC Requirements of the game 
     * @param {string} image The image of the game
     */
    constructor(id, name, release, publishers, developers, price, rating, description, languages, plateforms, pcRequirement, image) {
        this.id = id;
        this.name = name;
        this.release = release;
        this.publishers = publishers;
        this.developers = developers;
        this.price = price;
        this.rating = rating;
        this.description = description;
        this.languages = languages;
        this.plateforms = plateforms;
        this.pcRequirement = pcRequirement;
        this.image = image;
        this.categories = [];
    }
}

class Category {
    /**
     * Constructor of Category class
     * @param {int} id The ID of the category
     * @param {string} name The name of the category 
     */
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

// Test Users créations
console.log(User.getAllUsers());
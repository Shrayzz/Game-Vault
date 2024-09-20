//----------------------------------DATABASE----------------------------------\\

// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
// TODO: put in a function
const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'simplegamelibrary',
});

/**
 * Disconnect the Database
 */
function dbDisconnect() {
    con.end(function (err) {
        if (err) throw err;
        console.log('connection to DB successfully closed');
    });
}

// TODO: Make an init Database function

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

    static lists = [];

    /**
     * Constructor of List class
     * @param {int} id The ID of the list 
     * @param {string} name The name of the list
     * @param {boolean} favorite If the list is a favorite list = true
     */
    constructor(id, name, favorite) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.games = [];
        List.lists.push(this);
    }

    /**
     * Function to get all created lists
     * @returns all created lists with the class List
     */
    static getAllLists() {
        return List.lists;
    }
}

class Game {

    static games = [];

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
     * @param {JSON} plateforms The plateforms of the game
     * @param {JSON} pcRequirement The PC Requirements of the game 
     * @param {Blob} image The image of the game
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
        Game.games.push(this);
    }

    static getAllGames() {
        return Game.games;
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
// TODO: put in a function
try {
    const [results] = await con.query(
        'SELECT id, username, password, email FROM accounts'
    );
    results.forEach((element) => new User(element.id, element.username, element.password, element.email))
} catch (err) {
    console.log(err);
}

//Create Lists && Lists in Users

// TODO: put in a function
try {
    const [results] = await con.query(
        'SELECT id, name, favorite, accountId FROM list'
    );
    results.forEach((listElement) => {
        let fav;
        if (listElement.favorite === 0) {
            fav = false;
        } else {
            if (listElement.favorite === 1) {
                fav = true;
            } else {
                throw new Error("Can't get 'favorite' properly in 'List'");
            }
        }
        let list = new List(listElement.id, listElement.name, fav);
        User.getAllUsers().forEach((userElement) => {
            if (userElement.id === listElement.accountId) {
                userElement.lists.push(list);
            }
        })
    })
} catch (err) {
    console.log(err);
}

//Create games

// TODO: put in a function
try {
    const [results] = await con.query(
        "SELECT id, name, 'release', publishers, developers, price, rating, description, languages, plateforms, pcRequirement, image FROM game"
    );
    results.forEach((element) => new Game(element.id, element.name, element.release, element.publishers, element.developers, element.price, element.rating, element.description, element.languages, element.plateforms, element.pcRequirement, element.image))
} catch (err) {
    console.log(err);
}

//Create Category

// TODO

//Create Games in Lists

// TODO

//Create Category in Games

//TODO

//----------------------------------TESTS----------------------------------\\

//Test users creations

//TODO
console.log(User.getAllUsers());

//Test lists creation

//TODO
console.log(List.getAllLists());
console.log(User.getAllUsers()[0].lists[0])

//Test games creation

//TODO
console.log(Game.getAllGames());

//Test category creation

//TODO

//Test users-lists link creation

//TODO

//Test lists-games link creation

//TODO

//Test games-category link creation

//TODO

class User{
    constructor(id, name, firstname, login, password, lists){
        this.id = id; //int
        this.name = name; //string
        this.firstname = firstname; //string
        this.login = login; //string
        this.password = password; //string
        this.lists = lists; //array
    }

    get getFullName(){
        return this.name + " " + this.firstname;
    }

}

class List{
    constructor(id, name, favorite, games){
        this.id = id; //int
        this.name = name; //string
        this.favorite = favorite; //boolean
        this.games = games; //array
    }
}

class Game{
    constructor(id, name, release, editor, price, description, pcRequirement, plateform, image, categories){
        this.id = id; //int
        this.name = name; //string
        this.release = release; //date
        this.editor = editor; //string
        this.price = price; //float
        this.description = description; //string
        this.pcRequirement = pcRequirement; //array
        this.plateform = plateform; //array
        this.image = image; //string
        this.categories = categories; //array
    }
}

class Category{
    constructor(id, name){
        this.id = id; //int
        this.name = name; //string
    }
}

x = new User(1, "name", "firstname", "a", "b", []);
console.log(x.getFullName);
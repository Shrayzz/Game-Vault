/**
 * Function to register based on data from the request
 * @param {Request} req the request 
 * @returns {Response} the response to the base request
 */
async function register(req) {
    // get data from the resquest
    const { email, username, password } = req.body;

    // hash password
    const hashedpassword = Bun.password.hash(password);

    // try to create the user in db with given data
    const userCreated = await db.createUser(email, username, password);

    // check if succeed
    if (userCreated) {
        return new Response("Succes", { status: 200 });
    }
    else {
        return new Response("Email or Username already used !", { status: 500 }); //TODO: edit based on db functions
    }
}

module.exports = { register }
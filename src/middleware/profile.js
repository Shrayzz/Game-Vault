import db from "../js/db";

async function updateUsername(req, con) {
    const { oldUsername, newUsername } = await req.json();
    console.log("values:")
    console.log(oldUsername);
    console.log(newUsername);

    const existUser = await db.existUser(con, oldUsername);

    if (existUser) {
        db.updateUser(con, oldUsername, ['username'], [newUsername]);
    } else {
        return new Response("User does not exist", { status: 502 });
    }

    return new Response("Success, please login now", { status: 200 });
}

export default {
    updateUsername,
};
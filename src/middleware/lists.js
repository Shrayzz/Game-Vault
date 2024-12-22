import db from "../js/db";

async function addList(req, pool) {
    try {
        const { username, listName } = await req.json();
        const existUser = await db.existUser(pool, username);

        if (existUser) {
            const userId = await db.getFromUser(pool, username, ['id']);
            await db.createList(pool, listName, false, userId);
            return new Response("List successfuly created", { status: 200 });
        } else {
            return new Response("User does not exist", { status: 502 });
        }
    } catch (error) {
        return new Response(`An error occured : ${error}`, { status: 500 });
    }
}

export default {
    addList,
}
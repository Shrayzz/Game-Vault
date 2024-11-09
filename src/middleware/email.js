import db from '../js/db.js';

async function email(req, con) {
    try {
        const { email } = await req.json(); 
        console.log(`Email reçu : ${email}`);
        
        const emailDB = await db.existEmail(con, email);
        console.log(`Email existe dans la DB : ${emailDB}`);

        if (emailDB) {
            return new Response(JSON.stringify({ success: true, message: 'Email exists!' }), { status: 202, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ success: false, message: 'Email does not exist!' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.warn(`Erreur lors de la vérification de l'email : ${err.message}`);
        return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export default email;

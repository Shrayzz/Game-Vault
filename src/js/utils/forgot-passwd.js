import nodemailer from "nodemailer";
import db from "../db"
import crypto from "crypto";

/**
 * Function to send an email
 * @param {string} mailSender the origin email address that send the email
 * @param {string} password the password from the origin email address
 * @param {string} emailReceiver the email address to send the email
 * @param {string} subject the subject of the email to send
 * @param {string} the content of the email to send
 * @return {void}
 */
function sendEmail(mailSender, password, emailReceiver, subject, content) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailSender,
      pass: password,
    },
  });

  const mailopt = {
    from: mailSender,
    to: emailReceiver,
    subject: subject,
    text: content,
  };

  transporter.sendMail(mailopt, (error) => {
    if (error) console.log(error);
  });
}

/**
 * Function to send an email to reset the password
 * @param {Request} req the request 
 * @param {Object} pool the db pool connection 
 * @param {Headers} headers the headers for the request 
 * @returns 
 */
async function emailForgot(req, pool, headers) {

  try {

    const { email } = await req.json();

    const token = crypto.randomBytes(20).toString('hex');

    const resetLink = `http://localhost:3000/new-password?token=${token}`;

    const exist = await db.existEmail(pool, email)

    if (!exist)
      return Response(JSON.stringify("Account not found !"), { status: 404, headers: { headers } })

    const expirationTime = new Date(Date.now() + 3600000); // 1h
    await pool.query("UPDATE accounts SET reset_token = ?, reset_token_expiration = ? WHERE email = ?", [token, expirationTime, email]);

    const mailSender = process.env.GMAIL_ACCOUNT;
    const password = process.env.GMAIL_PASSWORD;
    const subject = "Your password reset request.";
    const content = `You have requested the reset of the password for your account.\n\n
  The following link will guide you to reset your password:\n\n
  ${resetLink}\n\n
  Ignore this email if you didn't ask for it.\n`;

    sendEmail(mailSender, password, email, subject, content)

    return new Response(JSON.stringify("Email succesfully sent !"), { status: 200, headers: { headers } });
  } catch (err) {
    console.log(err.message);
    return Response(JSON.stringify("Error while sending reset email"), { status: 500, headers: { headers } })
  }
}

/**
 * Function to change the password of a user
 * @param {Request} req the request 
 * @param {Object} pool the db pool connection 
 * @param {Headers} headers the headers for the request 
 * @returns 
 */
async function resetPassword(req, pool, headers) {
  const { token, newPassword } = await req.json();

  try {

    if (!token || !newPassword)
      return Response(JSON.stringify("Token and/or new password missing"), { status: 404, headers: { headers } })


    const result = await pool.query("SELECT * FROM accounts WHERE reset_token = ? AND reset_token_expiration > NOW()", [token]);
    if (result.length === 0) {
      return new Response(JSON.stringify("Invalid token"), { status: 400, headers: { headers } });
    }

    const hashedPassword = await Bun.password.hash(newPassword);
    const [reset] = await pool.query("UPDATE accounts SET password = ?, reset_token = NULL WHERE reset_token = ?", [hashedPassword, token]);
    if (reset.affectedRows === 1) {
      return new Response(JSON.stringify("Password successfully reset!"), { status: 200, headers: { headers } });
    }

    return new Response(JSON.stringify("Token expired"), { status: 401, headers: { headers } })
  } catch (err) {
    return new Response(JSON.stringify("Error while resetting password"), { status: 500, headers: { headers } });
  }
}

export default { emailForgot, resetPassword }
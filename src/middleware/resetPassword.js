import db from "../js/db.js";

import "dotenv/config";
import nodemailer from "nodemailer";

const mailUser = process.env.GMAIL_ACCOUNT;
const password = process.env.GMAIL_PASSWORD;

async function resetPassword(req, path) {}

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: mailUser,
//     pass: password,
//   },
// });

// const mailopt = {
//   from: "simplegamelibrary@gmail.com",
//   to: "eden.douru@gmail.com",
//   subject: "test mail",
//   text: "test test test test",
// };

// transporter.sendMail(mailopt, (error, info) => {
//   if (error) console.log(error);
//   else console.log("email sent");
// });

// export default null;

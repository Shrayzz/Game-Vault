import nodemailer from "nodemailer";

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

  transporter.sendMail(mailopt, (error, info) => {
    if (error) console.log(error);
  });
}

export default sendEmail;

const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const mailGun = require("nodemailer-mailgun-transport");
const { API_KEY, DOMAIN } = require("../config/config");

const sendEmail = async (email, subject, templateName, name, link) => {
  try {
    const transporter = nodemailer.createTransport(
      mailGun({
        auth: {
          api_key: API_KEY,
          domain: DOMAIN,
        },
      })
    );

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: "./emails/",
          defaultLayout: false,
        },
        viewPath: "./emails/",
      })
    );

    await transporter.sendMail({
      from: 'Itsfoss0 Admin <admin@itsfoss0.net>',
      to: email,
      subject: subject,
      template: templateName,
      context: {
        name, 
        link
      },
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;

const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { EMAIL_API } = process.env;
sgMail.setApiKey(EMAIL_API);

const sendEmail = async (data) => {
  const email = { ...data, from: "maroma1991@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;

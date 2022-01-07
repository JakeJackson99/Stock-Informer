const nodemailer = require("nodemailer");

const sendEamil = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jakecjacksoncontact",
        pass: process.env.PASS,
      },
    });

    transporter.sendMail(
      {
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text,
      },
      (error) => {
        if (error) {
          return console.log("There was an error: " + error);
        }
        console.log("Email sent successfully");
      }
    );
  } catch (error) {
    console.log("Error sending email");
    console.log(error);
  }
};

module.exports = sendEamil;

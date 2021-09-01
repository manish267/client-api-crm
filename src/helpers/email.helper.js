const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "regan.jacobs58@ethereal.email",
    pass: "R68JqKs3AkmCZQaHJg",
  },
});

const send = async (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);
      console.log(`Message sent : %s ${result.messageId}`);
      console.log(`Preview URL: %s ${nodemailer.getTestMessageUrl(result)}`);

      resolve(result);
    } catch (error) {
      console.log(error);
      reject(erro);
    }
  });
};

const emailProcessor = (email, pin, type) => {
    let info=''
  switch (type) {
    case "request-new-password":
      info = {
        from: '"CRM Company👻" <regan.jacobs58@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password reset pin", // Subject line
        text:
          "Here is your password reset pin " +
          pin +
          " This pin will expire in 1 day", // plain text body
        html: `<b>Hello world?</b>
        <p>Here is your pin <b>${pin}</b> This pin will expire in 1 day</p>
        
        `, // html body
      };
      send(info);

      break;
    case "passwrod-update-success":
       info = {
        from: '"CRM Company👻" <regan.jacobs58@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password Updated", // Subject line
        text:"Your new password has been updated", // plain text body
        html: `<b>Hello world?</b>
                <p>Your new password has been updated</p>
                
                `, // html body
      };
      send(info);

      break;
    default:
      break;
  }
};

module.exports = {
  emailProcessor,
};

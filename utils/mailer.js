const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transportDetail = smtpTransport({
  host: "mail.mhdarabi.ir",
  port: 465,
  secure: true,
  auth: {
    user: "weblog@mhdarabi.ir",
    pass: ".kFkETVc+Hm}",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendMail = (email, fullname, subject, message) => {
  const transporter = nodeMailer.createTransport(transportDetail);

  transporter.sendMail({
    from: "weblog@mhdarabi.ir",
    to: email,
    subject: subject,
    text: `<h1>سلام ${fullname}<h1>
            <p>${message}</p>`,
  });
};

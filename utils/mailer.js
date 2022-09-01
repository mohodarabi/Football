const nodeMailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const transporterDetails = smtpTransport({
  host: 'mail.mhdarabi.ir',
  port: 2079,
  auth: {
    user: 'football@mhdarabi.ir',
    pass: 'Elmondoo1999',
  },
  tls: {
    rejectUnauthorized: false,
  },
})

exports.sendMail = (email, fullname, subject, message) => {
  const transporter = nodeMailer.createTransport(transporterDetails)

  transporter.sendMail({
    from: 'toplearn@ghorbany.dev',
    to: email,
    subject: subject,
    text: `<h1>سلام ${fullname}<h1>
            <p>${message}</p>`,
  })
}

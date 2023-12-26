const nodemailer = require('nodemailer');

async function sendMail(to, subject, text,html) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "thakursahil29124@gmail.com",
            pass: "wfuxloqheagjdhkv"
        }
    })

    let info = await transporter.sendMail({
        from: "thakursahil29124@gmail.com",
        to: to,
        subject: subject,
        text: text,
        html:html
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
module.exports = sendMail;
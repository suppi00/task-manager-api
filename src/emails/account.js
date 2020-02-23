const sgMail = require("@sendgrid/mail")

const sendgridApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridApiKey)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"supriyaagrawal8863@gmail.com",
        subject:"Welcome To Task-Manager-App",
        text: `Welcome ${name} Hope to provide you all task-manager-app services`
    })
}
const sendDeleteMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"supriyaagrawal8863@gmail.com",
        subject:"Good Bye!",
        text:"We hope you com back here soon!"
    })
}
module.exports = {
    sendWelcomeEmail,
    sendDeleteMail,
}
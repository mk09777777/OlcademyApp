const nodeMailer=require("nodemailer");
const dotenv=require("dotenv");
dotenv.config();

const transport = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Match variable name
        pass: process.env.GMAIL_PASSWORD, // Match variable name
    },
});


console.log(process.env.GMAIL_PASSWORD,process.env.GMAIL_USER,"eee")



const Email = async (email,subject,id) => {
    console.log(email,subject,id);
    try {
        await transport.sendMail({
            from:"venkatreddy30301@gmail.com",
            to: email,
            subject:id,
            text:subject,
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

module.exports=Email
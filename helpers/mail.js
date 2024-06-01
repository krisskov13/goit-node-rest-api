import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, verificationToken) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: "Email Verification",
    html: `Please, to confirm your email go to the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
    text: `Please, to confirm your email go to the link http://localhost:3000/api/users/verify/${verificationToken}`,
  };
  await transport.sendMail(mailOptions);
};

export default sendVerificationEmail;

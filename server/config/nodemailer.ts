import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PWD;

if (!smtpUser || !smtpPass) {
  throw new Error("SMTP credentials are missing in environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true only for port 465
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Optional verification
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

export default transporter;
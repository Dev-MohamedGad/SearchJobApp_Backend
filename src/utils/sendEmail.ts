import nodemailer  from 'nodemailer';

interface EmailOptions {
    from?: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const sendEmail = async ({ from = process.env.EMAIL_USER , to, subject, text, html }: EmailOptions ) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER! ,
            pass: process.env.EMAIL_PASSWORD!,
        },
    });

    await transporter.sendMail({
        from: `"MohammedGad" <${from}>`,
        to,
        subject,
        text,
        html,
    });
 
};

export default sendEmail;

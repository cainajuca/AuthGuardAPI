import nodemailer from 'nodemailer';

const transportOptions = {
	host: 'smtp-mail.outlook.com',
	port: 587, // Outlook' port
	secure: false, // true for 465, false for other ports like 587
	auth: {
		user: process.env.API_EMAIL_USER,
		pass: process.env.API_EMAIL_PASS,
	},
	tls: {
		ciphers: 'SSLv3' // avoids problems with TLS
	}
}

export async function sendResetPasswordEmail(email: string, resetToken: string) {
	
	const resetUrl = `${process.env.RESET_URL}?token=${resetToken}`;
	
	const transporter = nodemailer.createTransport(transportOptions);

	const mailOptions = {
		from: process.env.API_EMAIL_USER,
		to: email,
		subject: 'Reset your password',
		text: 'Click the link to reset your password...',
		html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
	};

	transporter.sendMail(mailOptions);
}
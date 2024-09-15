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

export async function sendActivationEmail(email: string, activationToken: string, activationTokenExpiresAt: Date) {
	
	const activationUrl = `${process.env.ACTIVATION_URL}?token=${activationToken}`;

	const transporter = nodemailer.createTransport(transportOptions);
	
	const mailOptions = {
		from: process.env.API_EMAIL_USER,
		to: email,
		subject: 'Activate your account',
		html: `
			<p>Welcome! Click the link below to activate your account:</p>
			<p><a href="${activationUrl}">Activate Account</a></p>
			<p>This link will expire on <strong>${activationTokenExpiresAt.toLocaleString()}</strong>. Please activate your account before this date.</p>
			<p>If you did not request this, please ignore this email.</p>
		`,
	};
	
	await transporter.sendMail(mailOptions);
}
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendResetPasswordEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.RESET_URL}?token=${resetToken}`;

    const msg = {
        to: email,
        from: process.env.API_EMAIL_USER,
        subject: 'Reset your password',
        text: `Click the following link to reset your password: ${resetUrl}`,
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}

export async function sendActivationEmail(email: string, activationToken: string, activationTokenExpiresAt: Date) {
    const activationUrl = `${process.env.ACTIVATION_URL}?token=${activationToken}`;

	console.log(activationUrl);

    const msg = {
        to: email,
        from: process.env.API_EMAIL_USER,
        subject: 'Activate your account',
        html: `
            <p>Welcome! Click the link below to activate your account:</p>
            <p><a href="${activationUrl}">Activate Account</a></p>
            <p>This link will expire on <strong>${activationTokenExpiresAt.toLocaleString()}</strong>. Please activate your account before this date.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    try {
		console.log(msg.html);
        await sgMail.send(msg);
        console.log('Activation email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}

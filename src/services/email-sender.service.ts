import sgMail from '@sendgrid/mail';
import logger from 'config/logger.config';

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
        logger.info(`Password reset email sent successfully to ${email}`);
    } catch (error) {
        logger.error('Error sending reset password email', { error: error.message, stack: error.stack });
        if (error.response) {
            logger.error('Error response from SendGrid API', { responseBody: error.response.body });
        }
    }
}

export async function sendActivationEmail(email: string, activationToken: string, activationTokenExpiresAt: Date) {
    const activationUrl = `${process.env.ACTIVATION_URL}?token=${activationToken}`;

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
        await sgMail.send(msg);
        logger.info(`Activation email sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            logger.error('Error response from SendGrid API', { responseBody: error.response.body });
        }
    }
}

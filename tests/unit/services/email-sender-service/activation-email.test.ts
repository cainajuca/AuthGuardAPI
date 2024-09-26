import { sendActivationEmail } from 'services/email-sender.service';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
    send: jest.fn(),
    setApiKey: jest.fn(),
}));

describe('sendActivationEmail', () => {
    const email = 'john.doe@example.com';
    const activationToken = 'activation-token';
    const activationTokenExpiresAt = new Date(Date.now() + 3600000); // 1h
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

    it('should send an activation email successfully', async () => {
        (sgMail.send as jest.Mock).mockResolvedValueOnce({}); // Simulate successful email sending

        await sendActivationEmail(email, activationToken, activationTokenExpiresAt);

        expect(sgMail.send).toHaveBeenCalledWith(msg); // Ensure the email was sent with the correct parameters
    });

    it('should handle errors when sending the email', async () => {
        const error = new Error('Email service error');
        (sgMail.send as jest.Mock).mockRejectedValueOnce(error); // Simulate email sending failure

        await sendActivationEmail(email, activationToken, activationTokenExpiresAt);

        expect(sgMail.send).toHaveBeenCalledWith(msg); // Ensure it tried to send the email
    });

    it('should log the response body if available in error', async () => {
        const error = {
            response: {
                body: { message: 'Invalid email address' },
            },
        };

        (sgMail.send as jest.Mock).mockRejectedValueOnce(error); // Simulate email sending failure

        await sendActivationEmail(email, activationToken, activationTokenExpiresAt);

        expect(sgMail.send).toHaveBeenCalledWith(msg); // Ensure it tried to send the email
    });
});

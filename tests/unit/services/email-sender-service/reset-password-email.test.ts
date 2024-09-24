import { sendResetPasswordEmail } from 'services/email-sender.service';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
    send: jest.fn(),
    setApiKey: jest.fn(),
}));

describe('sendResetPasswordEmail', () => {
    const resetToken = 'reset-token';
    const email = 'john.doe@example.com';
    const resetUrl = `${process.env.RESET_URL}?token=${resetToken}`;
    const msg = {
        to: email,
        from: process.env.API_EMAIL_USER,
        subject: 'Reset your password',
        text: `Click the following link to reset your password: ${resetUrl}`,
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    it('should send a reset password email successfully', async () => {
        (sgMail.send as jest.Mock).mockResolvedValueOnce({}); // Simulate successful email sending

        await sendResetPasswordEmail(email, resetToken);

        expect(sgMail.send).toHaveBeenCalledWith(msg); // Ensure the email was sent with the correct parameters
    });

    it('should handle errors when sending the email', async () => {
        const error = new Error('Email service error');
        (sgMail.send as jest.Mock).mockRejectedValueOnce(error); // Simulate email sending failure

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error

        await sendResetPasswordEmail(email, resetToken);

        expect(sgMail.send).toHaveBeenCalledWith(msg); // Ensure it tried to send the email
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', error); // Ensure the error was logged

        consoleErrorSpy.mockRestore(); // Restore console.error after the test
    });

    it('should log the response body if available in error', async () => {
        const error = {
            response: {
                body: { message: 'Invalid email address' },
            },
        };

        (sgMail.send as jest.Mock).mockRejectedValueOnce(error); // Simulate email sending failure

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error

        await sendResetPasswordEmail(email, resetToken);

        expect(sgMail.send).toHaveBeenCalledWith(msg); // Ensure it tried to send the email
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', error); // Ensure the error was logged
        expect(consoleErrorSpy).toHaveBeenCalledWith(error.response.body); // Ensure the response body is logged

        consoleErrorSpy.mockRestore(); // Restore console.error after the test
    });
});

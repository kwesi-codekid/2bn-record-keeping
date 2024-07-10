// Import necessary module
import crypto from "crypto";

// Function to generate OTP
const generateOTP = (length: number = 6): string => {
  // Ensure the length is a positive integer and reasonable for an OTP
  if (length <= 0 || length > 10) {
    throw new Error("OTP length must be between 1 and 10 digits");
  }

  // Generate a random number within the range of 10^(length-1) to 10^length - 1
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  // Generate a random number within the specified range
  const otp = crypto.randomInt(min, max + 1).toString();
  return otp;
};

export default generateOTP;

/***
 * import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(sender_email, sender_password, recipient_email, subject, message):
    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # Attach the message to the MIMEMultipart object
    msg.attach(MIMEText(message, 'plain'))

    try:
        # Connect to the SMTP server (in this case, Google's SMTP server)
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            # Start TLS for security
            server.starttls()

            # Login to the email account
            server.login(sender_email, sender_password)

            # Send the email
            server.sendmail(sender_email, recipient_email, msg.as_string())

        print(f"Email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"Error sending email to {recipient_email}: {e}")


if __name__ == "__main__":
    # Replace these values with your actual Gmail credentials
    sender_email = 'stanleykwaminaotabil@gmail.com'
    sender_password = 'xzjc awsp upld ungm'

    # Replace these values with the recipient's email address, subject, and message
    recipient_emails = ['kwasibordesjacob@gmail.com',
                        'jkbordes@adamusgh.com', 'stanleyotabil10@gmail.com']
    subject = 'Test Email'
    message = 'This is a test email sent from a Python script.'

    # Send emails to multiple recipients
    for recipient_email in recipient_emails:
        send_email(sender_email, sender_password,
                   recipient_email, subject, message)


# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart


# def send_email(sender_username, sender_email, sender_password, recipient_email, subject, message):
#     # Set up the MIME
#     msg = MIMEMultipart()
#     msg['From'] = sender_email
#     msg['To'] = recipient_email
#     msg['Subject'] = subject

#     # Attach the message to the MIMEMultipart object
#     msg.attach(MIMEText(message, 'plain'))

#     try:
#         # Connect to the SMTP server (in this case, Gmail's SMTP server)
#         with smtplib.SMTP('sandbox.smtp.mailtrap.io', 2525) as server:
#             # Start TLS for security
#             server.starttls()

#             # Login to the email account
#             server.login(sender_username, sender_password)

#             # Send the email
#             server.sendmail(sender_email, recipient_email, msg.as_string())

#         print(f"Email sent successfully to {recipient_email}")
#     except Exception as e:
#         print(f"Error sending email to {recipient_email}: {e}")


# if __name__ == "__main__":
#     # Replace these values with your actual email credentials
#     sender_username = 'e1d8465804da52'
#     sender_email = 'kwamina@gmail.com'
#     sender_password = 'bcf76953d97ddd'

#     # Replace these values with the recipient's email address, subject, and message
#     recipient_emails = ['recipient1@example.com', 'recipient2@example.com']
#     subject = 'Test Email'
#     message = 'This is a test email sent from a Python script.'

#     # Send emails to multiple recipients
#     for recipient_email in recipient_emails:
#         send_email(sender_username, sender_email, sender_password,
#                    recipient_email, subject, message)

 */

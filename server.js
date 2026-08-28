require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log('Sender email being used:', process.env.SENDER_EMAIL); 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory list of subscribers (fine for this task, no DB required)
const subscribers = [];

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (subscribers.includes(email)) {
    return res.status(409).json({ message: 'This email is already subscribed.' });
  }

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL, // must match your verified SendGrid sender
    subject: 'Welcome to DEV@Deakin!',
    text: `Hi there,\n\nThanks for subscribing to DEV@Deakin! You'll now receive the latest articles, tips and updates from our community.\n\nHappy coding!\nThe DEV@Deakin Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #8f6fff;">Welcome to DEV@Deakin!</h2>
        <p>Hi there,</p>
        <p>Thanks for subscribing to <strong>DEV@Deakin</strong>! You'll now receive the latest articles, tips and updates from our community.</p>
        <p>Happy coding!<br/>The DEV@Deakin Team</p>
      </div>
    `
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully. Status code:', response[0].statusCode);

    subscribers.push(email);

    return res.status(202).json({ message: 'Subscribed! Check your inbox for a welcome email.' });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error.message);
    return res.status(500).json({ message: 'Failed to send welcome email. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
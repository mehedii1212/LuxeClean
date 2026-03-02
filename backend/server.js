const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'khokonn1215@gmail.com',
        pass: 'your-app-password'
    }
});

app.post('/api/send-quote', async (req, res) => {
    const { name, email, phone, service, frequency, bedrooms, address, preferred_date, message } = req.body;

    const mailOptions = {
        from: 'khokonn1215@gmail.com',
        to: 'khokonn1215@gmail.com',
        subject: `New Quote Request from ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #c9a962, #b8943d); color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #c9a962; }
                    .value { color: #333; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Quote Request - LuxeClean</h1>
                    </div>
                    <div class="content">
                        <div class="field">
                            <span class="label">Name:</span>
                            <span class="value">${name}</span>
                        </div>
                        <div class="field">
                            <span class="label">Email:</span>
                            <span class="value">${email}</span>
                        </div>
                        <div class="field">
                            <span class="label">Phone:</span>
                            <span class="value">${phone}</span>
                        </div>
                        <div class="field">
                            <span class="label">Service Type:</span>
                            <span class="value">${service}</span>
                        </div>
                        <div class="field">
                            <span class="label">Frequency:</span>
                            <span class="value">${frequency}</span>
                        </div>
                        <div class="field">
                            <span class="label">Bedrooms:</span>
                            <span class="value">${bedrooms}</span>
                        </div>
                        <div class="field">
                            <span class="label">Address:</span>
                            <span class="value">${address}</span>
                        </div>
                        <div class="field">
                            <span class="label">Preferred Date:</span>
                            <span class="value">${preferred_date || 'Not specified'}</span>
                        </div>
                        <div class="field">
                            <span class="label">Additional Notes:</span>
                            <span class="value">${message || 'None'}</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    const clientMailOptions = {
        from: 'LuxeClean <khokonn1215@gmail.com>',
        to: email,
        subject: 'Thank you for your quote request - LuxeClean',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #c9a962, #b8943d); color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You for Choosing LuxeClean!</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${name}</strong>,</p>
                        <p>Thank you for your quote request. We have received your information and our team will review it shortly.</p>
                        <p>We will contact you within 24 hours to discuss your cleaning needs and provide a customized quote.</p>
                        <p><strong>What happens next:</strong></p>
                        <ul>
                            <li>Our team will review your requirements</li>
                            <li>We will contact you at <strong>${phone}</strong></li>
                            <li>We will send a detailed quote to <strong>${email}</strong></li>
                        </ul>
                        <p>If you have any urgent questions, please don't hesitate to call us at 800-LUXE-CLEAN.</p>
                        <p>Best regards,<br>The LuxeClean Team</p>
                    </div>
                    <div class="footer">
                        <p>LuxeClean - Premium Cleaning Services</p>
                        <p>123 Luxury Lane, Beverly Hills, CA 90210</p>
                        <p>Phone: 800-LUXE-CLEAN | Email: info@luxeclean.com</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(clientMailOptions);
        res.status(200).json({ success: true, message: 'Quote request sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: 'khokonn1215@gmail.com',
        to: 'khokonn1215@gmail.com',
        subject: `New Contact Form: ${subject}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

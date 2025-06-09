import 'dotenv/config';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { EmailRequest, EmailResponse, HealthCheckResponse, RequestHandler, Attachment } from './types/index.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SendGrid transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Health check route
const healthCheck: RequestHandler = async (req: Request, res: Response) => {
  const healthcheck: HealthCheckResponse = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
    sendgrid: {
      configured: !!process.env.SENDGRID_API_KEY,
      from_email: process.env.EMAIL_FROM || 'not configured'
    },
    sample_images: {
      directory_exists: fs.existsSync(path.join(projectRoot, 'sample-images')),
      count: fs.existsSync(path.join(projectRoot, 'sample-images')) 
        ? fs.readdirSync(path.join(projectRoot, 'sample-images')).filter(file => file.endsWith('.png')).length 
        : 0
    }
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error instanceof Error ? error.message : 'Unknown error';
    res.status(503).json(healthcheck);
  }
};

// Route to send email with PNG attachments
const sendEmail: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { to, subject, message } = req.body as EmailRequest;

    console.log('Hi there, we are starting to send an email');
    console.log('to', to);
    console.log('subject', subject);
    console.log('message', message);

    if (!to || !subject) {
      return res.status(400).json({ error: 'To and subject fields are required' });
    }

    if (!process.env.EMAIL_FROM) {
      return res.status(400).json({ error: 'EMAIL_FROM environment variable is required' });
    }

    // Get PNG files from sample-images directory
    const sampleDir = path.join(projectRoot, 'sample-images');
    if (!fs.existsSync(sampleDir)) {
      return res.status(400).json({ error: 'sample-images directory not found' });
    }

    const pngFiles = fs.readdirSync(sampleDir).filter(file => file.endsWith('.png'));
    if (pngFiles.length === 0) {
      return res.status(400).json({ error: 'No PNG files found in sample-images directory' });
    }

    // Prepare attachments and inline images
    const attachments: Attachment[] = [];
    let htmlContent = message || '<h2>Email with PNG Attachments</h2>\n<p>Please find the attached PNG images below:</p>\n';
    
    htmlContent += '<div style="margin: 20px 0;">\n';
    
    pngFiles.forEach((filename, index) => {
      const cid = `image${index}`;
      const filePath = path.join(sampleDir, filename);
      
      attachments.push({
        filename: filename,
        path: filePath,
        cid: cid
      });

      htmlContent += `
        <div style="margin: 10px 0; text-align: center;">
          <h4>${filename}</h4>
          <img src="cid:${cid}" alt="${filename}" style="max-width: 500px; max-height: 400px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
        </div>
      `;
    });
    
    htmlContent += '</div>\n';

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: attachments
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    const response: EmailResponse = {
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId
    };

    return res.json(response);

  } catch (error) {
    console.error('Error sending email:', error);
    const errorResponse: EmailResponse = {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return res.status(500).json(errorResponse);
  }
};

// Register routes
app.get('/health', healthCheck);
app.post('/send-email', sendEmail);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
}); 
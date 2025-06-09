# PNG Email Attachment Server

A Node.js server that sends emails with PNG attachments and displays them inline in the email body.

## Features

- Send emails with PNG attachments
- Display PNG images inline in the email body
- Modern web interface for easy testing
- Support for multiple PNG files
- Drag and drop file upload
- Sample images for testing
- Multiple email sending options (including passwordless)

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Email account (optional - multiple sending options available)

## Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd email-png-attachment-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure email settings (choose one option):

### Option 1: Ethereal Email (Testing - No Password Required)
Create a `.env` file:
```
USE_ETHEREAL=true
```
This will create a test account automatically. Great for development and testing!

### Option 2: SendGrid (Free Tier - API Key Only)
1. Sign up for a free SendGrid account
2. Create an API key
3. Add to `.env`:
```
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your-verified-sender@yourdomain.com
```

### Option 3: Mailgun (Free Tier - API Key Only)
1. Sign up for a free Mailgun account
2. Get your API key and domain
3. Add to `.env`:
```
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
EMAIL_FROM=your-verified-sender@yourdomain.com
```

### Option 4: Gmail (Requires Password)
1. Enable 2-factor authentication in your Google Account
2. Generate an App Password
3. Add to `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

4. Add sample PNG files:
   - Place your PNG files in the `sample-images` directory
   - Or use the provided script: `chmod +x create-sample-images.sh && ./create-sample-images.sh`

## Running the Server

1. Start the server:
```bash
npm start
```

2. For development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Open the web interface at `http://localhost:3000`
2. Enter recipient email address
3. Add a subject
4. (Optional) Add a custom message
5. Upload PNG files or use sample images
6. Click "Send Email with PNG Attachments"

## Email Configuration

The server supports multiple email providers. The configuration priority is:
1. Ethereal (if USE_ETHEREAL=true)
2. SendGrid (if SENDGRID_API_KEY is set)
3. Mailgun (if MAILGUN_API_KEY and MAILGUN_DOMAIN are set)
4. Gmail (default, if EMAIL_USER and EMAIL_PASS are set)

## Troubleshooting

1. **Email not sending:**
   - Check your email configuration in `.env`
   - For Ethereal, check the preview URL in the response
   - For SendGrid/Mailgun, verify your API keys
   - For Gmail, ensure you're using an App Password

2. **Images not displaying inline:**
   - Ensure the PNG files are valid
   - Check the email client's support for inline images
   - Try a different email client

3. **Server not starting:**
   - Check if port 3000 is available
   - Ensure all dependencies are installed
   - Check Node.js version

## License

MIT # email-png-preview-service

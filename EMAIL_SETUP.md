# Email Setup Guide

This application uses EmailJS to send portfolio reports via email. Follow these steps to configure email functionality:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create Email Template

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template:

**Template Name:** Portfolio Report

**Subject:** `{{subject}}`

**Content (HTML):**
```html
<p><strong>Daily Portfolio Report</strong></p>
<p>Date: {{date}}</p>
<br>
<div style="white-space: pre-wrap;">{{message_html}}</div>
```

**Or use plain text version:**
```
Daily Portfolio Report
Date: {{date}}

{{message_text}}
```

4. **Copy the Template ID** (e.g., `template_xxxxxxx`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `xxxxxxxxxxxxxxxxxxxx`)
3. Copy it

## Step 5: Configure the Application

1. Open `src/utils/emailService.js`
2. Replace the following values:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key
```

**Example:**
```javascript
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_PUBLIC_KEY = 'abcdefghijklmnopqrstuvwxyz';
```

## Step 6: Test Email

1. Run the application: `npm run dev`
2. Click the **"Send Email"** button in the header
3. Check your inbox at `sajidvfx@yahoo.com`

## Email Recipient

The email is automatically sent to: **sajidvfx@yahoo.com**

To change the recipient email, edit `RECIPIENT_EMAIL` in `src/utils/emailService.js`

## Troubleshooting

### Email not sending?
- Check browser console for errors
- Verify all three IDs are correctly set in `emailService.js`
- Make sure your EmailJS service is properly connected
- Check EmailJS dashboard for error logs

### Gmail Setup Issues?
- You may need to enable "Less secure app access" or use App Password
- For Gmail, consider using OAuth2 authentication in EmailJS

### Free Tier Limits?
- EmailJS free tier: 200 emails/month
- Upgrade to paid plan for more emails if needed

## Security Note

The Public Key is safe to expose in client-side code. However, keep your Service ID and Template ID private if possible. For production apps, consider using environment variables.

## Alternative: Environment Variables

For better security, you can use environment variables:

1. Create `.env` file in project root:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

2. Update `emailService.js`:
```javascript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
```

Don't commit `.env` file to git (it's already in `.gitignore`)


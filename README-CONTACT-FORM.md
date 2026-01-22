# Contact Form Setup

This contact form uses Resend API to send emails via Cloudflare Pages Functions.

## Setup Instructions

### 1. Get Resend API Key

1. Sign up at [https://resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Verify Email Domain in Resend

1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `inboxops.app`)
3. Add the required DNS records to verify domain ownership
4. Wait for verification (usually takes a few minutes)

### 3. Configure Cloudflare Pages Environment Variables

In your Cloudflare Pages project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

   - `RESEND_API_KEY`: Your Resend API key (e.g., `re_abc123...`)
   - `COMPANY_EMAIL`: Email address to receive contact form submissions (default: `hello@inboxops.app`)
   - `FROM_EMAIL`: Email address to send from (must be verified in Resend, default: `noreply@inboxops.app`)

3. Set these for **Production** environment (and optionally for Preview if you want to test)

### 4. Deploy

After setting environment variables, redeploy your Cloudflare Pages site. The contact form will automatically use the configured email addresses.

## How It Works

1. User submits the contact form
2. Cloudflare Pages Function (`/functions/api/contact.js`) receives the submission
3. Two emails are sent via Resend API:
   - **Lead email** to `COMPANY_EMAIL` with the form submission
   - **Confirmation email** to the submitter confirming receipt
4. User sees success/error message

## Testing

To test locally, you can use Wrangler:

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Set environment variables locally
wrangler pages dev . --env RESEND_API_KEY=your_key --env COMPANY_EMAIL=test@example.com --env FROM_EMAIL=noreply@example.com
```

## Troubleshooting

- **"Server configuration error"**: Check that `RESEND_API_KEY` is set correctly
- **Emails not sending**: Verify your domain in Resend and check API key permissions
- **CORS errors**: The function includes CORS headers, but ensure your domain is correct
- **Form not submitting**: Check browser console for errors and verify the API endpoint is accessible

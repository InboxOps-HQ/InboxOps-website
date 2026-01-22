# Environment Variables for Contact Form

Configure these in Cloudflare Pages → Settings → Environment Variables:

## Required Variables

- `RESEND_API_KEY` - Your Resend API key (get from https://resend.com/api-keys)
- `COMPANY_EMAIL` - Email address to receive contact form submissions (default: hello@inboxops.app)
- `FROM_EMAIL` - Email address to send from, must be verified in Resend (default: noreply@inboxops.app)

## Example Values

```
RESEND_API_KEY=re_abc123xyz...
COMPANY_EMAIL=hello@inboxops.app
FROM_EMAIL=noreply@inboxops.app
```

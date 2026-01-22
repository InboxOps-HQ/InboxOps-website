/**
 * Cloudflare Pages Function to handle contact form submissions
 * Uses Resend API to send emails
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse form data
    const formData = await request.json();
    const { name, email, subject, message, language = 'en' } = formData;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get environment variables
    const resendApiKey = env.RESEND_API_KEY;
    const companyEmail = env.COMPANY_EMAIL || 'hello@inboxops.app';
    const fromEmail = env.FROM_EMAIL || 'noreply@inboxops.app';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Subject mapping
    const subjectMap = {
      beta: { en: 'Beta Request', de: 'Beta-Anfrage' },
      pricing: { en: 'Pricing Question', de: 'Fragen zu Preisen' },
      partnership: { en: 'Partnership Inquiry', de: 'Partnerschaft' },
      support: { en: 'Support Request', de: 'Support' },
      other: { en: 'General Inquiry', de: 'Sonstiges' },
    };
    const subjectText = subjectMap[subject]?.[language] || subjectMap[subject]?.en || 'Contact Form Submission';
    const langLabel = language === 'de' ? 'Sprache' : 'Language';
    const langValue = language === 'de' ? 'Deutsch' : 'English';

    // HTML Email Template Helper
    function createEmailHTML(title, content, isConfirmation = false) {
      const bgColor = '#0B1220';
      const textColor = '#E8E8E8';
      const mutedColor = '#8C8C8C';
      const accentColor = '#2567E1';
      const borderColor = '#1F2937';
      const cardBg = '#151B28';

      return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${bgColor}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${bgColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: ${cardBg}; border-radius: 18px; overflow: hidden; border: 1px solid ${borderColor};">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center; border-bottom: 1px solid ${borderColor};">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: ${textColor}; font-family: 'Space Grotesk', Arial, sans-serif; letter-spacing: -0.5px;">
                ${isConfirmation ? (language === 'de' ? 'Vielen Dank!' : 'Thank You!') : 'InboxOps'}
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid ${borderColor}; text-align: center; background-color: ${bgColor};">
              <p style="margin: 0; font-size: 12px; color: ${mutedColor}; line-height: 1.5;">
                ${language === 'de' 
                  ? 'InboxOps – Email-first Ticketing für Freelancer & KMUs' 
                  : 'InboxOps – Email-first ticketing for freelancers & small businesses'}
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: ${mutedColor};">
                <a href="https://inboxops.app" style="color: ${accentColor}; text-decoration: none;">inboxops.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }

    // Prepare HTML email for company (lead notification)
    const companyEmailHTML = createEmailHTML(
      'New Contact Form Submission',
      `
        <div style="color: ${language === 'de' ? '#E8E8E8' : '#E8E8E8'};">
          <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #E8E8E8;">
            ${language === 'de' 
              ? 'Neue Kontaktformular-Anfrage von der InboxOps-Website:' 
              : 'New contact form submission from InboxOps website:'}
          </p>
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px;">
            <tr>
              <td style="padding: 12px; background-color: #1F2937; border-radius: 8px; border: 1px solid #2D3748;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; color: #8C8C8C; font-size: 13px; font-weight: 600; width: 120px;">
                      ${language === 'de' ? 'Name:' : 'Name:'}
                    </td>
                    <td style="padding: 8px 0; color: #E8E8E8; font-size: 14px;">
                      ${name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8C8C8C; font-size: 13px; font-weight: 600;">
                      ${language === 'de' ? 'E-Mail:' : 'Email:'}
                    </td>
                    <td style="padding: 8px 0; color: #E8E8E8; font-size: 14px;">
                      <a href="mailto:${email}" style="color: #2567E1; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8C8C8C; font-size: 13px; font-weight: 600;">
                      ${language === 'de' ? 'Betreff:' : 'Subject:'}
                    </td>
                    <td style="padding: 8px 0; color: #E8E8E8; font-size: 14px;">
                      ${subjectText}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8C8C8C; font-size: 13px; font-weight: 600;">
                      ${langLabel}:
                    </td>
                    <td style="padding: 8px 0; color: #E8E8E8; font-size: 14px;">
                      ${langValue}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #E8E8E8;">
            ${language === 'de' ? 'Nachricht:' : 'Message:'}
          </p>
          <div style="padding: 16px; background-color: #1F2937; border-radius: 8px; border: 1px solid #2D3748; color: #E8E8E8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message.replace(/\n/g, '<br>')}
          </div>
          
          <p style="margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #2D3748; font-size: 12px; color: #8C8C8C; text-align: center;">
            ${language === 'de' 
              ? 'Diese E-Mail wurde über das InboxOps-Kontaktformular gesendet.' 
              : 'This email was sent from the InboxOps contact form.'}
          </p>
        </div>
      `
    );

    // Prepare HTML confirmation email for submitter
    const confirmationEmailHTML = createEmailHTML(
      language === 'de' ? 'Vielen Dank für deine Nachricht!' : 'Thank You for Your Message!',
      `
        <div style="color: #E8E8E8;">
          <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #E8E8E8;">
            ${language === 'de' ? `Hallo ${name},` : `Hello ${name},`}
          </p>
          
          <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #E8E8E8;">
            ${language === 'de' 
              ? 'vielen Dank, dass du dich bei InboxOps gemeldet hast! Wir haben deine Nachricht erhalten und werden uns so schnell wie möglich bei dir melden.' 
              : 'thank you for contacting InboxOps! We have received your message and will get back to you as soon as possible.'}
          </p>
          
          <div style="padding: 16px; background-color: #1F2937; border-radius: 8px; border: 1px solid #2D3748; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #8C8C8C; text-transform: uppercase; letter-spacing: 0.5px;">
              ${language === 'de' ? 'Deine Nachricht:' : 'Your message:'}
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E8E8E8; white-space: pre-wrap;">
${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #E8E8E8;">
            ${language === 'de' 
              ? 'Beste Grüße,<br>Das InboxOps Team' 
              : 'Best regards,<br>The InboxOps Team'}
          </p>
        </div>
      `,
      true
    );

    // Plain text fallback for company email
    const companyEmailText = `
${language === 'de' ? 'Neue Kontaktformular-Anfrage von der InboxOps-Website:' : 'New contact form submission from InboxOps website:'}

${language === 'de' ? 'Name:' : 'Name:'} ${name}
${language === 'de' ? 'E-Mail:' : 'Email:'} ${email}
${language === 'de' ? 'Betreff:' : 'Subject:'} ${subjectText}
${langLabel}: ${langValue}

${language === 'de' ? 'Nachricht:' : 'Message:'}
${message}

---
${language === 'de' 
  ? 'Diese E-Mail wurde über das InboxOps-Kontaktformular gesendet.' 
  : 'This email was sent from the InboxOps contact form.'}
    `.trim();

    // Plain text fallback for confirmation email
    const confirmationEmailText = `
${language === 'de' ? `Hallo ${name},` : `Hello ${name},`}

${language === 'de' 
  ? 'vielen Dank, dass du dich bei InboxOps gemeldet hast! Wir haben deine Nachricht erhalten und werden uns so schnell wie möglich bei dir melden.' 
  : 'thank you for contacting InboxOps! We have received your message and will get back to you as soon as possible.'}

${language === 'de' ? 'Deine Nachricht:' : 'Your message:'}
${message}

${language === 'de' ? 'Beste Grüße,\nDas InboxOps Team' : 'Best regards,\nThe InboxOps Team'}
    `.trim();

    // Send HTML email to company using Resend API
    const companyEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [companyEmail],
        subject: `[InboxOps Contact] ${subjectText} from ${name}`,
        html: companyEmailHTML,
        text: companyEmailText,
        reply_to: email,
      }),
    });

    if (!companyEmailResponse.ok) {
      const errorData = await companyEmailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email to company');
    }

    // Send HTML confirmation email to submitter
    const confirmationSubject = language === 'de' 
      ? 'Vielen Dank für deine Nachricht – InboxOps' 
      : 'Thank You for Your Message – InboxOps';
    
    const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: confirmationSubject,
        html: confirmationEmailHTML,
        text: confirmationEmailText,
      }),
    });

    // Don't fail if confirmation email fails, but log it
    if (!confirmationEmailResponse.ok) {
      console.warn('Failed to send confirmation email, but lead email was sent');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

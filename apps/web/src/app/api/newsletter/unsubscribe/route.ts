import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.NODE_ENV === 'production' 
  ? new Resend(process.env.RESEND_API_KEY)
  : { 
      contacts: { 
        create: async () => ({}), 
        remove: async () => ({}),
        update: async () => ({})
      },
      emails: {
        send: async () => ({})
      }
    };

export async function GET(request: NextRequest) {
  try {
    // Get email from URL query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      // Redirect to home page with error
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourwebsite.com'}?error=Email is required for unsubscribe`
      );
    }

    // Remove from audience list
    try {
      // Option 1: If Resend has a removal API
      await resend.contacts.remove({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      });
    } catch (e) {
      console.error('Could not remove using direct method, trying alternative:', e);
      
      // Option 2: Alternative method - update with unsubscribed status
      await resend.contacts.update({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
        unsubscribed: true,
      });
    }

    // Send confirmation email with dark theme
    await resend.emails.send({
      from: 'support@inity.space',
      to: email,
      subject: 'You have been unsubscribed',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribe Confirmation</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f1112; color: #ffffff; font-family: 'Inter', Arial, sans-serif;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0f1112; padding: 20px;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #121416; border-radius: 8px; overflow: hidden;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding: 40px 20px 20px 20px;">
                      <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourwebsite.com'}/images/logo.png" alt="Best Branded Residences" width="180" style="display: block; margin: 0 auto;" />
                    </td>
                  </tr>
                  
                  <!-- Heading -->
                  <tr>
                    <td align="center" style="padding: 10px 20px 30px 20px;">
                      <h1 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700;">Unsubscribe Confirmation</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 40px 30px 40px;">
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-top: 0;">
                        You have successfully unsubscribed from our newsletter.
                      </p>
                      
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                        We're sorry to see you go. If you'd like to share why you unsubscribed, we'd love to hear your feedback.
                      </p>
                      
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                        If you change your mind, you can subscribe again anytime.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px; text-align: center; border-top: 1px solid #2a2a2a;">
                      <p style="font-size: 14px; color: #808080; margin: 0;">
                        © ${new Date().getFullYear()} Best Branded Residences. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    // Redirect to confirmation page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourwebsite.com'}/unsubscribe-confirmation`
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    // Redirect to error page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourwebsite.com'}?error=Failed to unsubscribe`
    );
  }
}
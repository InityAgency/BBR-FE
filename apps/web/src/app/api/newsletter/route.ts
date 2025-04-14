import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Add to audience list
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    // Generate unsubscribe link
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://bbrweb.inity.space'}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    // Send welcome email with dark theme
    await resend.emails.send({
      from: 'support@inity.space',
      to: email,
      subject: 'Thanks for subscribing!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our Newsletter</title>
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
                      <img 
                        src="data:image/png;base64,YOUR_BASE64_ENCODED_LOGO_HERE" 
                        alt="Best Branded Residences" 
                        width="180" 
                        style="display: block; margin: 0 auto; background-color: #121416;"
                        onerror="this.onerror=null; this.src='data:image/png;base64,YOUR_FALLBACK_BASE64_ENCODED_LOGO_HERE'"
                      />
                    </td>
                  </tr>
                  
                  <!-- Heading -->
                  <tr>
                    <td align="center" style="padding: 10px 20px 30px 20px;">
                      <h1 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 500;">Welcome to our community!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 40px 30px 40px;">
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-top: 0;">
                        We're glad you've subscribed to our newsletter! You'll now stay updated with all our latest news, promotions, and special offers.
                      </p>
                      
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 10px;">
                        Soon you'll receive our newsletters with:
                      </p>
                      
                      <ul style="list-style-type: none; padding-left: 0; margin-bottom: 20px;">
                        <li style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 8px; padding-left: 24px; position: relative;">
                          • Latest news and updates
                        </li>
                        <li style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 8px; padding-left: 24px; position: relative;">
                          • Special offers and promotions
                        </li>
                        <li style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 8px; padding-left: 24px; position: relative;">
                          • Useful tips and information
                        </li>
                      </ul>
                      
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                        If you have any questions, feel free to contact us.
                      </p>
                      
                      <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                        Best regards,<br>
                        Your Best Branded Residences Team
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px; text-align: center; border-top: 1px solid #2a2a2a;">
                      <p style="font-size: 14px; color: #808080; margin: 0 0 10px 0;">
                        © ${new Date().getFullYear()} Best Branded Residences. All rights reserved.
                      </p>
                      <p style="font-size: 14px; color: #808080; margin: 0;">
                        If you'd like to unsubscribe, <a href="${unsubscribeLink}" style="color: #b99f65; text-decoration: none;">click here</a>.
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

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to the newsletter!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'An error occurred during subscription' },
      { status: 500 }
    );
  }
}
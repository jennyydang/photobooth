import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email, imageUrl, gifUrl } = await req.json();

    if (!email || !imageUrl) {
      return NextResponse.json({ error: 'Missing email or image' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM ?? smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'Email service not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.' },
        { status: 503 }
      );
    }

    const transporter: Transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const attachments: Mail.Attachment[] = [
      {
        filename: 'photobooth.png',
        content: imageUrl.replace(/^data:image\/\w+;base64,/, ''),
        encoding: 'base64',
        contentType: 'image/png',
      },
    ];

    if (gifUrl) {
      attachments.push({
        filename: 'photobooth.gif',
        content: gifUrl.replace(/^data:image\/gif;base64,/, ''),
        encoding: 'base64',
        contentType: 'image/gif',
      });
    }

    await transporter.sendMail({
      from: `"Photo Booth" <${fromEmail}>`,
      to: email,
      subject: '📸 Your Photo Booth Strip!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f0f1a; color: white; border-radius: 12px;">
          <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 8px; background: linear-gradient(to right, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            📸 Your Photo Booth Strip!
          </h1>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">
            Thanks for using our photo booth! Your photo strip is attached below.
          </p>
          <p style="color: rgba(255,255,255,0.5); font-size: 13px;">
            ${gifUrl ? 'An animated GIF of your session is also attached.' : ''}
          </p>
        </div>
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}

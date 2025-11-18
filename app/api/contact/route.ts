import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Ensure Node.js runtime for nodemailer
export const runtime = "nodejs";

//Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as unknown;
    const name = "";
    const email = "";
    const message = "";
    const website = "";
    const budget = "";
    const deadline = "";
    if (typeof raw === "object" && raw !== null) {
      const body = raw as {
        name?: unknown;
        email?: unknown;
        message?: unknown;
      };
      if (typeof body.name === "string") name = body.name.trim();
      if (typeof body.email === "string") email = body.email.trim();
      if (typeof body.message === "string") message = body.message;
    }

    //Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    //Resolve SMTP config
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465");
    let secure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !user || !pass) {
      return NextResponse.json(
        { error: "Email service is not configured properly" },
        { status: 500 }
      );
    }

    // Auto-correct common misconfigurations to prevent ETIMEDOUT
    if (port === 465 && !secure) {
      console.warn(
        "[contact] Forcing secure TLS for port 465 to avoid connection timeout"
      );
      secure = true;
    }
    if (port === 587 && secure) {
      console.warn("[contact] Disabling secure for port 587 (uses STARTTLS)");
      secure = false;
    }

    // Create transporter with timeouts
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      family: 4,
    });
    // Verify transporter configuration
    await transporter.verify();

    // Email content - ensure ASCII-only envelope to avoid SMTPUTF8 requirement
    const hasNonASCII = (str: unknown): boolean =>
      /[^\x00-\x7F]/.test(String(str ?? ""));

    const envFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
    const envTo = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

    // Force ASCII envelope addresses
    const envelopeFrom = hasNonASCII(envFrom) ? process.env.SMTP_USER : envFrom;
    const envelopeTo = hasNonASCII(envTo) ? process.env.SMTP_USER : envTo;

    // Header From: keep user's name, but use ASCII address
    const headerFromAddress = hasNonASCII(envFrom)
      ? process.env.SMTP_USER
      : envFrom;
    // Include sender's email in the display name so it's visible in inboxes
    const headerFrom = `"${name} (${email})" <${headerFromAddress}>`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: headerFrom,
      to: envTo as string,
      // Make sure SMTP envelope stays ASCII-only
      envelope: {
        from: envelopeFrom as string,
        to: envelopeTo as string,
      },
      // Set Reply-To to the sender so replies go directly to them
      replyTo: `${name} <${email}>`,
      text: `
        Name: ${name}
        Email: ${email}
        Website: ${website}
        Budget: ${budget}
        Deadline: ${deadline}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(
              /\n/g,
              "<br>"
            )}</p>
            <p>${website.replace(/\n/g, "<br>")}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            This email was sent from your website's contact form.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Email sending error:", error);

    const isProd = process.env.NODE_ENV === "production";
    const err = error as
      | { code?: unknown; message?: unknown }
      | null
      | undefined;
    const code = typeof err?.code === "string" ? err!.code : undefined;
    const messageStr = typeof err?.message === "string" ? err!.message : "";

    const hint =
      code === "ETIMEDOUT"
        ? "Connection timed out. Check SMTP host/port, TLS (secure) setting vs port, firewall rules, and provider status."
        : code === "EENVELOPE" || /SMTPUTF8/i.test(messageStr)
        ? "Your From/To address appears to contain non-ASCII characters. Either enable SMTPUTF8 on the server or use ASCII-only addresses for the SMTP envelope (MAIL FROM/RCPT TO). This API now enforces ASCII envelopes; ensure SMTP_FROM/CONTACT_EMAIL are ASCII."
        : "Unexpected error while sending email.";

    return NextResponse.json(
      {
        error: "Failed to send email. Please try again later.",
        hint,
        details: isProd ? undefined : { code, message: messageStr },
      },
      { status: 500 }
    );
  }
}

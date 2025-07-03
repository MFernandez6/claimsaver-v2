// Email utility for sending document share emails
// In production, replace this with a real email service like Resend, SendGrid, etc.

import { Resend } from "resend";
import { getFileBuffer } from "./fileStorage";

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

interface Document {
  _id: string;
  name: string;
  type: string;
  fileType: string;
  size: string;
  uploadDate: string;
  description: string;
  url: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize Resend client lazily to avoid build-time errors
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev"; // Use your verified sender or Resend sandbox

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const { to, subject, html, text, attachments } = emailData;

    console.log("Sending email with attachments:", {
      to,
      subject,
      hasAttachments: attachments && attachments.length > 0,
      attachmentCount: attachments?.length || 0,
    });

    const resend = getResendClient();

    const emailOptions: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text: string;
      attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType?: string;
      }>;
    } = {
      from: SENDER_EMAIL,
      to,
      subject,
      html: html || text.replace(/\n/g, "<br>"),
      text,
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      console.log(
        "Adding attachments to email:",
        attachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          contentSize: a.content.length,
        }))
      );

      emailOptions.attachments = attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      }));
    } else {
      console.log("No attachments to add");
    }

    const result = await resend.emails.send(emailOptions);

    if (result.error) {
      console.error("Resend email sending failed:", result.error);
      return false;
    }

    console.log("Email sent successfully with result:", result);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

export async function generateDocumentShareEmail(
  recipientEmail: string,
  document: Document,
  message?: string
): Promise<EmailData> {
  const documentInfo = `
Document Information:
- Name: ${document.name}
- Type: ${document.type}
- Size: ${document.size}
- Upload Date: ${new Date(document.uploadDate).toLocaleDateString()}
- Description: ${document.description || "No description provided"}
- File Name: ${document.fileName}
- MIME Type: ${document.mimeType}
  `.trim();

  const emailText = `
Hello,

A document has been shared with you from ClaimSaver.

${documentInfo}

${message ? `\nMessage from sender:\n${message}\n` : ""}

The document file is attached to this email.

Best regards,
The ClaimSaver Team
  `.trim();

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document Shared - ClaimSaver</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2563eb;">Document Shared</h2>
    <p>Hello,</p>
    <p>A document has been shared with you from <strong>ClaimSaver</strong>.</p>
    
    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">Document Information:</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Name:</strong> ${document.name}</li>
        <li><strong>Type:</strong> ${document.type}</li>
        <li><strong>Size:</strong> ${document.size}</li>
        <li><strong>Upload Date:</strong> ${new Date(document.uploadDate).toLocaleDateString()}</li>
        <li><strong>Description:</strong> ${document.description || "No description provided"}</li>
        <li><strong>File Name:</strong> ${document.fileName}</li>
        <li><strong>MIME Type:</strong> ${document.mimeType}</li>
      </ul>
    </div>
    
    ${
      message
        ? `
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: #92400e;">Message from sender:</h4>
      <p style="margin: 0;">${message}</p>
    </div>
    `
        : ""
    }
    
    <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #065f46; font-size: 14px;">
        <strong>✅ File Attached:</strong> The document file is attached to this email.
      </p>
    </div>
    
    <p>Best regards,<br>The ClaimSaver Team</p>
  </div>
</body>
</html>
  `.trim();

  // Try to get the file attachment
  const attachments = [];
  try {
    if (document.url && document.url !== "#") {
      console.log("Attempting to attach file:", {
        filePath: document.url,
        fileName: document.fileName,
        mimeType: document.mimeType,
      });

      const fileBuffer = await getFileBuffer(document.url);
      console.log(
        "File buffer retrieved successfully, size:",
        fileBuffer.length
      );

      attachments.push({
        filename: document.fileName,
        content: fileBuffer,
        contentType: document.mimeType,
      });

      console.log("File attached successfully to email");
    } else {
      console.log("No file path available for attachment");
    }
  } catch (error) {
    console.error("Error reading file for attachment:", error);
    console.error("File path was:", document.url);
    // Continue without attachment if file can't be read
  }

  return {
    to: recipientEmail,
    subject: `Document Shared: ${document.name}`,
    text: emailText,
    html: emailHtml,
    attachments,
  };
}

# DocuSign Integration Setup Guide

## Overview

This guide will help you set up DocuSign integration for document notarization in ClaimSaver+. The integration allows users to upload PDF documents and have them notarized through DocuSign's secure platform.

## Prerequisites

1. DocuSign Developer Account
2. DocuSign Integration Key
3. DocuSign Account ID
4. DocuSign User ID
5. Private Key for JWT Authentication

## Step 1: Create DocuSign Developer Account

1. Go to [DocuSign Developer Center](https://developers.docusign.com/)
2. Sign up for a free developer account
3. Verify your email address

## Step 2: Create Integration Key

1. Log into your DocuSign Developer account
2. Go to "My Account" > "Integration Keys"
3. Click "Add Integration Key"
4. Name your integration key (e.g., "ClaimSaver+ Notarization")
5. Select "JWT Grant" as the authentication method
6. Save the Integration Key (Client ID)

## Step 3: Get Your Account ID

1. In your DocuSign Developer account, go to "My Account" > "API Account"
2. Note your Account ID (this is different from your Integration Key)

## Step 4: Get Your User ID

1. In your DocuSign Developer account, go to "My Account" > "API Account"
2. Note your User ID

## Step 5: Generate Private Key

1. In your DocuSign Developer account, go to "My Account" > "Integration Keys"
2. Click on your integration key
3. Go to "Settings" tab
4. Under "Authentication", click "Generate RSA Keypair"
5. Download the private key file
6. Copy the private key content (you'll need this for environment variables)

## Step 6: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# DocuSign Configuration
DOCUSIGN_ACCOUNT_ID=your_account_id_here
DOCUSIGN_USER_ID=your_user_id_here
DOCUSIGN_CLIENT_ID=your_integration_key_here
DOCUSIGN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYour private key content here\n-----END RSA PRIVATE KEY-----"
DOCUSIGN_BASE_PATH=https://demo.docusign.net/restapi
```

**Important Notes:**

- Use the demo base path for testing: `https://demo.docusign.net/restapi`
- Use the production base path for live: `https://www.docusign.net/restapi`
- The private key must be properly formatted with `\n` for line breaks
- Keep your private key secure and never commit it to version control

## Step 7: Configure DocuSign App Settings

1. In your DocuSign Developer account, go to "My Account" > "Integration Keys"
2. Click on your integration key
3. Go to "Settings" tab
4. Add your redirect URIs:
   - For development: `http://localhost:3000/api/docusign/callback`
   - For production: `https://yourdomain.com/api/docusign/callback`

## Step 8: Request Consent

1. In your DocuSign Developer account, go to "My Account" > "Integration Keys"
2. Click on your integration key
3. Go to "Settings" tab
4. Under "Authentication", click "Request Consent"
5. Follow the consent process for your DocuSign account

## Step 9: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Notarization page
3. Upload a PDF document
4. Fill in signer information
5. Click "Start Notarization Process"
6. Check the console for any errors

## API Endpoints

The integration includes the following API endpoints:

### 1. Create Envelope

- **Endpoint:** `POST /api/docusign/create-envelope`
- **Purpose:** Creates a DocuSign envelope for notarization
- **Body:**
  ```json
  {
    "documentBase64": "base64_encoded_pdf",
    "documentName": "document_name.pdf",
    "signerEmail": "signer@example.com",
    "signerName": "John Doe"
  }
  ```

### 2. Check Envelope Status

- **Endpoint:** `POST /api/docusign/envelope-status`
- **Purpose:** Checks the status of a DocuSign envelope
- **Body:**
  ```json
  {
    "envelopeId": "envelope_id_here"
  }
  ```

### 3. Download Document

- **Endpoint:** `POST /api/docusign/download-document`
- **Purpose:** Downloads the completed notarized document
- **Body:**
  ```json
  {
    "envelopeId": "envelope_id_here"
  }
  ```

## Troubleshooting

### Common Issues

1. **"DocuSign is not configured" Error**

   - Check that all environment variables are set correctly
   - Verify the private key format includes `\n` for line breaks

2. **"Invalid JWT" Error**

   - Ensure your private key is correct
   - Check that consent has been granted for your integration key

3. **"Account not found" Error**

   - Verify your Account ID is correct
   - Make sure you're using the right base path (demo vs production)

4. **"User not found" Error**
   - Verify your User ID is correct
   - Ensure the user has access to the DocuSign account

### Testing in Demo Environment

For testing, use the demo environment:

- Base Path: `https://demo.docusign.net/restapi`
- OAuth Base Path: `https://account-d.docusign.com`
- All envelopes created will be in demo mode

### Production Deployment

For production:

- Base Path: `https://www.docusign.net/restapi`
- OAuth Base Path: `https://account.docusign.com`
- Update redirect URIs to your production domain
- Ensure all environment variables are set in your production environment

## Security Considerations

1. **Private Key Security**

   - Never commit private keys to version control
   - Use environment variables for all sensitive data
   - Rotate keys regularly

2. **Document Security**

   - All documents are encrypted in transit and at rest
   - DocuSign provides bank-level security
   - Audit trails are maintained for all transactions

3. **Access Control**
   - Implement proper authentication before allowing notarization
   - Validate user permissions
   - Log all notarization attempts

## Support

If you encounter issues:

1. Check the DocuSign Developer Documentation
2. Review the console logs for detailed error messages
3. Verify all environment variables are correctly set
4. Test with the demo environment first

## Additional Resources

- [DocuSign Developer Documentation](https://developers.docusign.com/)
- [DocuSign API Reference](https://developers.docusign.com/docs/esign-rest-api/reference/)
- [JWT Grant Authentication](https://developers.docusign.com/docs/esign-rest-api/guides/authentication/oauth2-jsonwebtoken/)

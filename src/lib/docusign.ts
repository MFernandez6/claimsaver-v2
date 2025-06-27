import {
  ApiClient,
  EnvelopesApi,
  EnvelopeDefinition,
  Document,
  Signer,
  SignHere,
  Tabs,
} from "docusign-esign";

// DocuSign configuration
const DOCUSIGN_CONFIG = {
  accountId: process.env.DOCUSIGN_ACCOUNT_ID || "",
  userId: process.env.DOCUSIGN_USER_ID || "",
  clientId: process.env.DOCUSIGN_CLIENT_ID || "",
  clientSecret: process.env.DOCUSIGN_CLIENT_SECRET || "",
  integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || "",
  privateKey: process.env.DOCUSIGN_PRIVATE_KEY || "",
  basePath:
    process.env.DOCUSIGN_BASE_PATH || "https://demo.docusign.net/restapi", // Use demo for testing
};

// Initialize DocuSign API client
export const initializeDocuSignClient = async () => {
  try {
    const apiClient = new ApiClient();
    apiClient.setBasePath(DOCUSIGN_CONFIG.basePath);

    // Set OAuth configuration
    apiClient.setOAuthBasePath("https://account-d.docusign.com"); // Use demo for testing

    // Get access token using JWT Grant
    const response = await apiClient.requestJWTUserToken(
      DOCUSIGN_CONFIG.clientId,
      DOCUSIGN_CONFIG.userId,
      ["signature", "impersonation"],
      DOCUSIGN_CONFIG.privateKey,
      3600 // Token expires in 1 hour
    );

    const accessToken = response.body.access_token;
    apiClient.setDefaultHeader("Authorization", `Bearer ${accessToken}`);

    return apiClient;
  } catch (error) {
    console.error("Error initializing DocuSign client:", error);
    throw new Error("Failed to initialize DocuSign client");
  }
};

// Create envelope for notarization
export const createNotarizationEnvelope = async (
  documentBase64: string,
  documentName: string,
  signerEmail: string,
  signerName: string
) => {
  try {
    const apiClient = await initializeDocuSignClient();
    const envelopesApi = new EnvelopesApi(apiClient);

    // Create document
    const document: Document = {
      documentBase64: documentBase64,
      name: documentName,
      fileExtension: "pdf",
      documentId: "1",
    };

    // Create signer
    const signer: Signer = {
      email: signerEmail,
      name: signerName,
      recipientId: "1",
      routingOrder: "1",
    };

    // Create signature tab
    const signHere: SignHere = {
      anchorString: "/sn1/",
      anchorUnits: "pixels",
      anchorYOffset: "10",
      anchorXOffset: "20",
    };

    // Create tabs
    const tabs: Tabs = {
      signHereTabs: [signHere],
    };

    // Create envelope definition
    const envelopeDefinition: EnvelopeDefinition = {
      emailSubject: "Document for Notarization - ClaimSaver+",
      emailBlurb:
        "Please review and sign the attached document for notarization.",
      documents: [document],
      recipients: {
        signers: [signer],
      },
      status: "sent",
    };

    // Create envelope
    const results = await envelopesApi.createEnvelope(
      DOCUSIGN_CONFIG.accountId,
      {
        envelopeDefinition: envelopeDefinition,
      }
    );

    return {
      envelopeId: results.envelopeId,
      status: results.status,
      uri: results.uri,
    };
  } catch (error) {
    console.error("Error creating DocuSign envelope:", error);
    throw new Error("Failed to create DocuSign envelope");
  }
};

// Get envelope status
export const getEnvelopeStatus = async (envelopeId: string) => {
  try {
    const apiClient = await initializeDocuSignClient();
    const envelopesApi = new EnvelopesApi(apiClient);

    const envelope = await envelopesApi.getEnvelope(
      DOCUSIGN_CONFIG.accountId,
      envelopeId
    );

    return {
      envelopeId: envelope.envelopeId,
      status: envelope.status,
      statusChangedDateTime: envelope.statusChangedDateTime,
      documentsUri: envelope.documentsUri,
    };
  } catch (error) {
    console.error("Error getting envelope status:", error);
    throw new Error("Failed to get envelope status");
  }
};

// Download completed document
export const downloadDocument = async (
  envelopeId: string,
  documentId: string = "1"
) => {
  try {
    const apiClient = await initializeDocuSignClient();
    const envelopesApi = new EnvelopesApi(apiClient);

    const document = await envelopesApi.getDocument(
      DOCUSIGN_CONFIG.accountId,
      documentId,
      envelopeId
    );

    return document;
  } catch (error) {
    console.error("Error downloading document:", error);
    throw new Error("Failed to download document");
  }
};

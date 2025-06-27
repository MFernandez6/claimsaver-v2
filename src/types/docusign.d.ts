declare module "docusign-esign" {
  export class ApiClient {
    setBasePath(basePath: string): void;
    setOAuthBasePath(basePath: string): void;
    setDefaultHeader(name: string, value: string): void;
    requestJWTUserToken(
      clientId: string,
      userId: string,
      scopes: string[],
      privateKey: string,
      expiresIn: number
    ): Promise<{ body: { access_token: string } }>;
  }

  export class EnvelopesApi {
    constructor(apiClient: ApiClient);
    createEnvelope(
      accountId: string,
      options: { envelopeDefinition: EnvelopeDefinition }
    ): Promise<{
      envelopeId: string;
      status: string;
      uri: string;
    }>;
    getEnvelope(
      accountId: string,
      envelopeId: string
    ): Promise<{
      envelopeId: string;
      status: string;
      statusChangedDateTime: string;
      documentsUri: string;
    }>;
    getDocument(
      accountId: string,
      documentId: string,
      envelopeId: string
    ): Promise<Buffer>;
  }

  export interface Document {
    documentBase64: string;
    name: string;
    fileExtension: string;
    documentId: string;
  }

  export interface Signer {
    email: string;
    name: string;
    recipientId: string;
    routingOrder: string;
  }

  export interface SignHere {
    anchorString: string;
    anchorUnits: string;
    anchorYOffset: string;
    anchorXOffset: string;
  }

  export interface Tabs {
    signHereTabs: SignHere[];
  }

  export interface EnvelopeDefinition {
    emailSubject: string;
    emailBlurb: string;
    documents: Document[];
    recipients: {
      signers: Signer[];
    };
    status: string;
  }
}

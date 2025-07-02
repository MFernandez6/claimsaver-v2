import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ClaimData {
  _id: string;
  claimNumber: string;
  status: string;
  priority: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantAddress: string;
  claimantDOB: string;
  accidentDate: string;
  accidentLocation: string;
  accidentDescription: string;
  estimatedValue: number;
  submittedAt: string;
  lastUpdated: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  insuranceCompany: string;
  policyNumber: string;
  policyHolder: string;
  adjusterName: string;
  adjusterPhone: string;
  fileNumber: string;
  injured: boolean;
  injuryDescription: string;
  treatedByDoctor: boolean;
  doctorName: string;
  doctorAddress: string;
  hospitalInpatient: boolean;
  hospitalOutpatient: boolean;
  hospitalName: string;
  hospitalAddress: string;
  medicalBillsToDate: string;
  inCourseOfEmployment: boolean;
  lostWages: boolean;
  wageLossToDate: string;
  averageWeeklyWage: string;
  disabilityStart: string;
  disabilityEnd: string;
  workersComp: boolean;
  workersCompAmount: string;
  otherExpenses: string;
  signature: string;
  signatureDate: string;
  // Insurance Authorization
  insuranceAuthInsuredName: string;
  insuranceAuthPolicyNumber: string;
  insuranceAuthInsuranceCompany: string;
  insuranceAuthDisclosureType: string;
  insuranceAuthExcludedInfo: string[];
  insuranceAuthDisclosureForm: string;
  insuranceAuthReasonForDisclosure: string;
  insuranceAuthRecipientName: string;
  insuranceAuthRecipientOrganization: string;
  insuranceAuthRecipientAddress: string;
  insuranceAuthDurationType: string;
  insuranceAuthStartDate: string;
  insuranceAuthEndDate: string;
  insuranceAuthEndEvent: string;
  insuranceAuthRevocationName: string;
  insuranceAuthRevocationOrganization: string;
  insuranceAuthRevocationAddress: string;
  insuranceAuthSignature: string;
  insuranceAuthSignatureDate: string;
  // HIPAA Authorization
  hipaaPatientName: string;
  hipaaHealthcareProvider: string;
  hipaaDisclosureType: string;
  hipaaExcludedInfo: string[];
  hipaaDisclosureForm: string;
  hipaaReasonForDisclosure: string;
  hipaaRecipientName: string;
  hipaaRecipientOrganization: string;
  hipaaRecipientAddress: string;
  hipaaDurationType: string;
  hipaaStartDate: string;
  hipaaEndDate: string;
  hipaaEndEvent: string;
  hipaaRevocationName: string;
  hipaaRevocationOrganization: string;
  hipaaRevocationAddress: string;
  hipaaSignature: string;
  hipaaSignatureDate: string;
  // OIR-B1-1571 Disclosure
  pipPatientName: string;
  pipPatientSignature: string;
  pipPatientDate: string;
  pipProviderName: string;
  pipProviderSignature: string;
  pipProviderDate: string;
}

export async function generateClaimPDF(claim: ClaimData): Promise<Blob> {
  // Create a temporary container for the PDF content
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "white";
  container.style.padding = "40px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "12px";
  container.style.lineHeight = "1.4";
  container.style.color = "#333";

  document.body.appendChild(container);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Generate the HTML content with professional form styling
  container.innerHTML = `
    <style>
      /* Comprehensive CSS Reset to Override Global Styles */
      * {
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        color: #000000 !important;
        background: #ffffff !important;
        border-color: #000000 !important;
        outline-color: #000000 !important;
        text-decoration-color: #000000 !important;
        fill: #000000 !important;
        stroke: #000000 !important;
      }
      
      /* Override all CSS variables */
      :root {
        --background: #ffffff !important;
        --foreground: #000000 !important;
        --card: #ffffff !important;
        --card-foreground: #000000 !important;
        --popover: #ffffff !important;
        --popover-foreground: #000000 !important;
        --primary: #000000 !important;
        --primary-foreground: #ffffff !important;
        --secondary: #f5f5f5 !important;
        --secondary-foreground: #000000 !important;
        --muted: #f5f5f5 !important;
        --muted-foreground: #666666 !important;
        --accent: #f5f5f5 !important;
        --accent-foreground: #000000 !important;
        --destructive: #ff0000 !important;
        --border: #000000 !important;
        --input: #ffffff !important;
        --ring: #000000 !important;
        --radius: 0 !important;
        --chart-1: #000000 !important;
        --chart-2: #666666 !important;
        --chart-3: #999999 !important;
        --chart-4: #cccccc !important;
        --chart-5: #f0f0f0 !important;
      }
      
      /* Force all elements to use hex colors only */
      * {
        color: #000000 !important;
        background-color: #ffffff !important;
        border-color: #000000 !important;
      }
      
      /* Professional Form Styling */
      body {
        font-family: 'Times New Roman', serif !important;
        line-height: 1.4 !important;
        color: #000000 !important;
        background: #ffffff !important;
        font-size: 11px !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .form-container {
        max-width: 750px !important;
        margin: 0 auto !important;
        padding: 20px !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .form-header {
        text-align: center !important;
        margin-bottom: 30px !important;
        border-bottom: 2px solid #000000 !important;
        padding-bottom: 15px !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .form-title {
        font-size: 18px !important;
        font-weight: bold !important;
        margin-bottom: 5px !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        color: #000000 !important;
      }
      
      .form-subtitle {
        font-size: 14px !important;
        font-weight: bold !important;
        margin-bottom: 10px !important;
        color: #000000 !important;
      }
      
      .form-info {
        font-size: 10px !important;
        display: flex !important;
        justify-content: space-between !important;
        margin-top: 10px !important;
        color: #000000 !important;
      }
      
      .form-section {
        margin-bottom: 25px !important;
        border: 1px solid #000000 !important;
        padding: 15px !important;
        background: #ffffff !important;
        color: #000000 !important;
        page-break-inside: avoid !important;
      }
      
      .section-title {
        font-size: 12px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-bottom: 15px !important;
        border-bottom: 1px solid #000000 !important;
        padding-bottom: 5px !important;
        color: #000000 !important;
      }
      
      /* Force major sections to start on new pages */
      .form-section:nth-child(2) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(3) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(4) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(5) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(6) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(7) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(8) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(9) {
        page-break-before: always !important;
      }
      
      .form-section:nth-child(10) {
        page-break-before: always !important;
      }
      
      .form-row {
        display: flex !important;
        margin-bottom: 12px !important;
        align-items: center !important;
        color: #000000 !important;
      }
      
      .form-row:last-child {
        margin-bottom: 0 !important;
      }
      
      .form-label {
        font-size: 10px !important;
        font-weight: bold !important;
        min-width: 180px !important;
        margin-right: 10px !important;
        text-transform: uppercase !important;
        color: #000000 !important;
      }
      
      .form-field {
        flex: 1 !important;
        border-bottom: 1px solid #000000 !important;
        padding: 3px 0 !important;
        min-height: 20px !important;
        font-size: 10px !important;
        color: #000000 !important;
        background: #ffffff !important;
      }
      
      .form-field-large {
        flex: 1 !important;
        border: 1px solid #000000 !important;
        padding: 8px !important;
        min-height: 60px !important;
        font-size: 10px !important;
        background: #f9f9f9 !important;
        color: #000000 !important;
      }
      
      .checkbox-field {
        display: flex !important;
        align-items: center !important;
        margin-bottom: 8px !important;
        color: #000000 !important;
      }
      
      .checkbox-box {
        width: 12px !important;
        height: 12px !important;
        border: 1px solid #000000 !important;
        margin-right: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 8px !important;
        font-weight: bold !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .checkbox-label {
        font-size: 10px !important;
        font-weight: bold !important;
        color: #000000 !important;
      }
      
      .two-column {
        display: flex !important;
        gap: 20px !important;
        color: #000000 !important;
      }
      
      .column {
        flex: 1 !important;
        color: #000000 !important;
      }
      
      .signature-section {
        margin-top: 20px !important;
        border-top: 1px solid #000000 !important;
        padding-top: 15px !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .signature-line {
        border-bottom: 1px solid #000000 !important;
        margin: 10px 0 !important;
        min-height: 30px !important;
        display: flex !important;
        align-items: center !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .signature-image {
        max-width: 200px !important;
        max-height: 40px !important;
        object-fit: contain !important;
        background: #ffffff !important;
      }
      
      .signature-label {
        font-size: 9px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-bottom: 5px !important;
        color: #000000 !important;
      }
      
      .date-field {
        border-bottom: 1px solid #000000 !important;
        padding: 3px 0 !important;
        min-height: 20px !important;
        font-size: 10px !important;
        width: 120px !important;
        color: #000000 !important;
        background: #ffffff !important;
      }
      
      .page-break {
        page-break-before: always !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .authorization-form {
        margin-top: 30px !important;
        border: 2px solid #000000 !important;
        padding: 20px !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .auth-title {
        font-size: 14px !important;
        font-weight: bold !important;
        text-align: center !important;
        margin-bottom: 20px !important;
        text-transform: uppercase !important;
        color: #000000 !important;
      }
      
      .auth-section {
        margin-bottom: 20px !important;
        color: #000000 !important;
      }
      
      .auth-section-title {
        font-size: 11px !important;
        font-weight: bold !important;
        margin-bottom: 10px !important;
        text-transform: uppercase !important;
        color: #000000 !important;
      }
      
      .auth-text {
        font-size: 9px !important;
        line-height: 1.3 !important;
        margin-bottom: 8px !important;
        color: #000000 !important;
      }
      
      .auth-list {
        list-style: none !important;
        margin-left: 20px !important;
        color: #000000 !important;
      }
      
      .auth-list li {
        font-size: 9px !important;
        margin-bottom: 5px !important;
        position: relative !important;
        color: #000000 !important;
      }
      
      .auth-list li:before {
        content: "•" !important;
        position: absolute !important;
        left: -15px !important;
        color: #000000 !important;
      }
      
      .footer {
        margin-top: 30px !important;
        text-align: center !important;
        font-size: 8px !important;
        border-top: 1px solid #000000 !important;
        padding-top: 10px !important;
        color: #000000 !important;
        background: #ffffff !important;
      }
      
      /* Disable all problematic CSS features */
      * {
        filter: none !important;
        backdrop-filter: none !important;
        mask: none !important;
        mask-image: none !important;
        clip-path: none !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        border-radius: 0 !important;
        border-style: solid !important;
        border-width: 0 !important;
      }
      
      /* Force all backgrounds to be white */
      html, body, div, section, article, aside, header, footer, nav, main {
        background: #ffffff !important;
        background-color: #ffffff !important;
        background-image: none !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: auto !important;
      }
      
      /* Force all text to be black */
      html, body, div, section, article, aside, header, footer, nav, main, p, span, h1, h2, h3, h4, h5, h6, label, input, textarea, select, button {
        color: #000000 !important;
        color-scheme: light !important;
      }
    </style>
    
    <div class="form-container">
      <!-- Form Header -->
      <div class="form-header">
        <div class="form-title">Personal Injury Protection (PIP) Claim Form</div>
        <div class="form-subtitle">State of Florida - No-Fault Insurance</div>
        <div class="form-info">
          <span>Claim Number: ${claim.claimNumber || "N/A"}</span>
          <span>Date Filed: ${formatDate(claim.submittedAt)}</span>
          <span>Status: ${
            claim.status ? claim.status.toUpperCase() : "PENDING"
          }</span>
        </div>
      </div>

      <!-- Section 1: Claimant Information -->
      <div class="form-section">
        <div class="section-title">1. Claimant Information</div>
        
        <div class="form-row">
          <div class="form-label">Full Name:</div>
          <div class="form-field">${claim.claimantName || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Date of Birth:</div>
          <div class="form-field">${claim.claimantDOB || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Social Security #:</div>
          <div class="form-field">N/A</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Address:</div>
          <div class="form-field">${claim.claimantAddress || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Phone Number:</div>
          <div class="form-field">${claim.claimantPhone || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Email:</div>
          <div class="form-field">${claim.claimantEmail || "N/A"}</div>
        </div>
      </div>

      <!-- Section 2: Accident Information -->
      <div class="form-section">
        <div class="section-title">2. Accident Information</div>
        
        <div class="form-row">
          <div class="form-label">Date of Accident:</div>
          <div class="form-field">${formatDate(claim.accidentDate)}</div>
          <div class="form-label" style="margin-left: 20px;">Time:</div>
          <div class="form-field">N/A</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Location of Accident:</div>
          <div class="form-field">${claim.accidentLocation || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Description of Accident:</div>
          <div class="form-field-large">${
            claim.accidentDescription || "N/A"
          }</div>
        </div>
      </div>

      <!-- Section 3: Vehicle Information -->
      <div class="form-section">
        <div class="section-title">3. Vehicle Information</div>
        
        <div class="form-row">
          <div class="form-label">Year:</div>
          <div class="form-field">${claim.vehicleYear || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Make:</div>
          <div class="form-field">${claim.vehicleMake || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Model:</div>
          <div class="form-field">${claim.vehicleModel || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">License Plate:</div>
          <div class="form-field">${claim.licensePlate || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">State:</div>
          <div class="form-field">FL</div>
        </div>
      </div>

      <!-- Section 4: Insurance Information -->
      <div class="form-section">
        <div class="section-title">4. Insurance Information</div>
        
        <div class="form-row">
          <div class="form-label">Insurance Company:</div>
          <div class="form-field">${claim.insuranceCompany || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Policy Number:</div>
          <div class="form-field">${claim.policyNumber || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Policy Holder:</div>
          <div class="form-field">${claim.policyHolder || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">File Number:</div>
          <div class="form-field">${claim.fileNumber || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Adjuster:</div>
          <div class="form-field">${claim.adjusterName || "N/A"}</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Adjuster Phone:</div>
          <div class="form-field">${claim.adjusterPhone || "N/A"}</div>
        </div>
      </div>

      <!-- Section 5: Injury Information -->
      <div class="form-section">
        <div class="section-title">5. Injury Information</div>
        
        <div class="checkbox-field">
          <div class="checkbox-box">${claim.injured ? "X" : ""}</div>
          <div class="checkbox-label">Were you injured in the accident?</div>
        </div>
        
        ${
          claim.injured
            ? `
        <div class="form-row">
          <div class="form-label">Description of Injuries:</div>
          <div class="form-field-large">${
            claim.injuryDescription || "N/A"
          }</div>
        </div>
        `
            : ""
        }
        
        <div class="checkbox-field">
          <div class="checkbox-box">${claim.treatedByDoctor ? "X" : ""}</div>
          <div class="checkbox-label">Did you receive medical treatment?</div>
        </div>
        
        ${
          claim.treatedByDoctor
            ? `
        <div class="form-row">
          <div class="form-label">Doctor/Hospital Name:</div>
          <div class="form-field">${
            claim.doctorName || claim.hospitalName || "N/A"
          }</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Medical Bills to Date:</div>
          <div class="form-field">${claim.medicalBillsToDate || "N/A"}</div>
        </div>
        `
            : ""
        }
      </div>

      <!-- Section 6: Employment Information -->
      <div class="form-section">
        <div class="section-title">6. Employment Information</div>
        
        <div class="checkbox-field">
          <div class="checkbox-box">${
            claim.inCourseOfEmployment ? "X" : ""
          }</div>
          <div class="checkbox-label">Was the accident in the course of employment?</div>
        </div>
        
        <div class="checkbox-field">
          <div class="checkbox-box">${claim.lostWages ? "X" : ""}</div>
          <div class="checkbox-label">Did you lose wages due to the accident?</div>
        </div>
        
        ${
          claim.lostWages
            ? `
        <div class="form-row">
          <div class="form-label">Wage Loss to Date:</div>
          <div class="form-field">${claim.wageLossToDate || "N/A"}</div>
          <div class="form-label" style="margin-left: 20px;">Average Weekly Wage:</div>
          <div class="form-field">${claim.averageWeeklyWage || "N/A"}</div>
        </div>
        `
            : ""
        }
        
        <div class="checkbox-field">
          <div class="checkbox-box">${claim.workersComp ? "X" : ""}</div>
          <div class="checkbox-label">Are you receiving Workers' Compensation?</div>
        </div>
        
        ${
          claim.workersComp
            ? `
        <div class="form-row">
          <div class="form-label">Workers' Comp Amount:</div>
          <div class="form-field">${claim.workersCompAmount || "N/A"}</div>
        </div>
        `
            : ""
        }
      </div>

      <!-- Section 7: Other Expenses -->
      ${
        claim.otherExpenses
          ? `
      <div class="form-section">
        <div class="section-title">7. Other Expenses</div>
        
        <div class="form-row">
          <div class="form-label">Description of Other Expenses:</div>
          <div class="form-field-large">${claim.otherExpenses}</div>
        </div>
      </div>
      `
          : ""
      }

      <!-- Section 8: Authorization Status -->
      <div class="form-section">
        <div class="section-title">8. Authorization Status</div>
        
        <div class="two-column">
          <div class="column">
            <div class="checkbox-field">
              <div class="checkbox-box">${
                claim.insuranceAuthSignature ? "X" : ""
              }</div>
              <div class="checkbox-label">Insurance Authorization Signed</div>
            </div>
            <div class="checkbox-field">
              <div class="checkbox-box">${claim.hipaaSignature ? "X" : ""}</div>
              <div class="checkbox-label">HIPAA Authorization Signed</div>
            </div>
          </div>
          <div class="column">
            <div class="form-row">
              <div class="form-label">Insurance Auth Date:</div>
              <div class="date-field">${
                claim.insuranceAuthSignatureDate || "N/A"
              }</div>
            </div>
            <div class="form-row">
              <div class="form-label">HIPAA Auth Date:</div>
              <div class="date-field">${claim.hipaaSignatureDate || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 9: Claimant Signature -->
      <div class="form-section">
        <div class="section-title">9. Claimant Signature</div>
        
        <div class="signature-section">
          <div class="signature-label">I declare under penalty of perjury that the information provided above is true and correct to the best of my knowledge.</div>
          
          <div class="form-row">
            <div class="form-label">Signature:</div>
            <div class="signature-line">
              ${
                claim.signature
                  ? `<img src="${claim.signature}" alt="Claimant Signature" class="signature-image"/>`
                  : ""
              }
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-label">Date:</div>
            <div class="date-field">${claim.signatureDate || "N/A"}</div>
          </div>
        </div>
      </div>

      <!-- Insurance Authorization Form -->
      <div class="page-break">
        <div class="authorization-form">
          <div class="auth-title">Insurance Information Disclosure Authorization</div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section I - Insured Information</div>
            <div class="auth-text">
              <strong>Insured Name:</strong> ${
                claim.insuranceAuthInsuredName || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Policy Number:</strong> ${
                claim.insuranceAuthPolicyNumber || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Insurance Company:</strong> ${
                claim.insuranceAuthInsuranceCompany || "N/A"
              }
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section II - Information to be Disclosed</div>
            <div class="auth-text">
              <strong>Scope:</strong> Complete insurance claim information including status updates, settlement offers, and correspondence.
            </div>
            <div class="auth-text">
              <strong>Disclosure Type:</strong> ${
                claim.insuranceAuthDisclosureType === "partial"
                  ? "Partial (see exclusions)"
                  : "Complete"
              }
            </div>
            <div class="auth-text">
              <strong>Form of Disclosure:</strong> ${
                claim.insuranceAuthDisclosureForm || "N/A"
              }
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section III - Recipient Information</div>
            <div class="auth-text">
              <strong>Recipient Name:</strong> ${
                claim.insuranceAuthRecipientName || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Organization:</strong> ${
                claim.insuranceAuthRecipientOrganization || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Address:</strong> ${
                claim.insuranceAuthRecipientAddress || "N/A"
              }
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section IV - Duration & Revocation</div>
            <div class="auth-text">
              <strong>Duration Type:</strong> ${
                claim.insuranceAuthDurationType || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Revocation Contact:</strong> ${
                claim.insuranceAuthRevocationName || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Your Rights:</strong> You may revoke this authorization at any time by written notice to the contact above.
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section V - Signature</div>
            <div class="signature-section">
              <div class="signature-label">Digital Signature:</div>
              <div class="signature-line">
                ${
                  claim.insuranceAuthSignature
                    ? `<img src="${claim.insuranceAuthSignature}" alt="Insurance Auth Signature" class="signature-image"/>`
                    : ""
                }
              </div>
              <div class="auth-text">
                <strong>Signed on:</strong> ${
                  claim.insuranceAuthSignatureDate || "N/A"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HIPAA Authorization Form -->
      <div class="page-break">
        <div class="authorization-form">
          <div class="auth-title">HIPAA Authorization Form</div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section I - Patient Information</div>
            <div class="auth-text">
              <strong>Patient Name:</strong> ${claim.hipaaPatientName || "N/A"}
            </div>
            <div class="auth-text">
              <strong>Healthcare Provider:</strong> ${
                claim.hipaaHealthcareProvider || "N/A"
              }
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section II - Health Information to be Disclosed</div>
            <div class="auth-text">
              <strong>Scope:</strong> Complete health record related to the accident and subsequent treatment.
            </div>
            <div class="auth-text">
              <strong>Disclosure Type:</strong> ${
                claim.hipaaDisclosureType === "partial"
                  ? "Partial (see exclusions)"
                  : "Complete"
              }
            </div>
            <div class="auth-text">
              <strong>Form of Disclosure:</strong> ${
                claim.hipaaDisclosureForm || "N/A"
              }
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section III - Recipient Information</div>
            <div class="auth-text">
              <strong>Recipient Name:</strong> ${
                claim.hipaaRecipientName || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Organization:</strong> ${
                claim.hipaaRecipientOrganization || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Address:</strong> ${claim.hipaaRecipientAddress || "N/A"}
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section IV - Duration & Revocation</div>
            <div class="auth-text">
              <strong>Duration Type:</strong> ${
                claim.hipaaDurationType || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Revocation Contact:</strong> ${
                claim.hipaaRevocationName || "N/A"
              }
            </div>
            <div class="auth-text">
              <strong>Your Rights:</strong> You may revoke this authorization at any time by written notice.
            </div>
          </div>
          
          <div class="auth-section">
            <div class="auth-section-title">Section V - Signature</div>
            <div class="signature-section">
              <div class="signature-label">Patient/Legal Representative Signature:</div>
              <div class="signature-line">
                ${
                  claim.hipaaSignature
                    ? `<img src="${claim.hipaaSignature}" alt="HIPAA Signature" class="signature-image"/>`
                    : ""
                }
              </div>
              <div class="auth-text">
                <strong>Signed on:</strong> ${claim.hipaaSignatureDate || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Generated by ClaimSaver+ on ${new Date().toLocaleString()}</p>
        <p>Professional Claim Documentation System | Contact: claimsaverplus@gmail.com</p>
      </div>
    </div>
  `;

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 800,
      height: container.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate blob
    const pdfBlob = pdf.output("blob");

    // Clean up
    document.body.removeChild(container);

    return pdfBlob;
  } catch (error) {
    // Clean up on error
    document.body.removeChild(container);
    throw error;
  }
}

import jsPDF from "jspdf";

interface ClaimData {
  claimNumber?: string;
  status?: string;
  submittedAt?: string;
  claimantName?: string;
  claimantDOB?: string;
  claimantAddress?: string;
  claimantPhone?: string;
  claimantEmail?: string;
  accidentDate?: string;
  accidentLocation?: string;
  accidentDescription?: string;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  licensePlate?: string;
  insuranceCompany?: string;
  policyNumber?: string;
  policyHolder?: string;
  adjusterName?: string;
  adjusterPhone?: string;
  fileNumber?: string;
  injured?: boolean;
  injuryDescription?: string;
  treatedByDoctor?: boolean;
  doctorName?: string;
  hospitalName?: string;
  medicalBillsToDate?: string;
  inCourseOfEmployment?: boolean;
  lostWages?: boolean;
  wageLossToDate?: string;
  averageWeeklyWage?: string;
  workersComp?: boolean;
  workersCompAmount?: string;
  otherExpenses?: string;
  insuranceAuthSignature?: string;
  insuranceAuthSignatureDate?: string;
  hipaaSignature?: string;
  hipaaSignatureDate?: string;
  signature?: string;
  signatureDate?: string;
  insuranceAuthInsuredName?: string;
  insuranceAuthPolicyNumber?: string;
  insuranceAuthInsuranceCompany?: string;
  insuranceAuthDisclosureType?: string;
  insuranceAuthDisclosureForm?: string;
  insuranceAuthRecipientName?: string;
  insuranceAuthRecipientOrganization?: string;
  insuranceAuthRecipientAddress?: string;
  insuranceAuthDurationType?: string;
  insuranceAuthRevocationName?: string;
  hipaaPatientName?: string;
  hipaaHealthcareProvider?: string;
  hipaaDisclosureType?: string;
  hipaaDisclosureForm?: string;
  hipaaRecipientName?: string;
  hipaaRecipientOrganization?: string;
  hipaaRecipientAddress?: string;
  hipaaDurationType?: string;
  hipaaRevocationName?: string;
}

export const generateClaimPDF = async (claim: ClaimData) => {
  // Create PDF with A4 size
  const pdf = new jsPDF("p", "mm", "a4");

  // Page dimensions
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Typography settings
  const titleSize = 16;
  const sectionSize = 12;
  const fieldLabelSize = 9;
  const fieldValueSize = 10;
  const bodySize = 9;

  // Spacing
  const sectionSpacing = 8;
  const fieldSpacing = 4;

  // Colors
  const primaryColor = [50, 100, 150];
  const textColor = [50, 50, 50];
  const borderColor = [200, 200, 200];

  // Helper function to format dates
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

  // Helper function to add a modern field group
  const addFieldGroup = (
    label: string,
    value: string,
    x: number,
    y: number,
    width: number = contentWidth,
    isRequired: boolean = false
  ) => {
    const fieldValue = value || "N/A";

    // Label
    pdf.setFontSize(fieldLabelSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    const requiredText = isRequired ? " *" : "";
    pdf.text(label + requiredText, x, y);

    // Value with proper text wrapping
    pdf.setFontSize(fieldValueSize);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);

    const maxWidth = width - 2;
    const lines = pdf.splitTextToSize(fieldValue, maxWidth);
    pdf.text(lines, x, y + 4);

    // Return consistent height for side-by-side fields
    return Math.max(lines.length * 4 + 6, 10);
  };

  // Helper function to add a modern section header
  const addSectionHeader = (title: string, y: number) => {
    // Section number and title
    pdf.setFontSize(sectionSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text(title, margin, y);

    // Subtle line under section
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y + 2, pageWidth - margin, y + 2);

    return y + 8;
  };

  // Helper function to add a modern checkbox
  const addCheckbox = (
    question: string,
    checked: boolean,
    x: number,
    y: number
  ) => {
    // Modern checkbox design
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.rect(x, y, 4, 4, "S");

    if (checked) {
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(x + 0.5, y + 0.5, 3, 3, "F");
    }

    // Question text
    pdf.setFontSize(bodySize);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(question, x + 8, y + 3);

    return 6;
  };

  // Helper function to add a modern signature line
  const addSignatureLine = (
    label: string,
    hasSignature: boolean,
    x: number,
    y: number,
    width: number = 80
  ) => {
    // Label
    pdf.setFontSize(fieldLabelSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(label, x, y);

    // Signature line
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(x, y + 3, x + width, y + 3);

    if (hasSignature) {
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      pdf.text("[Digital Signature]", x + 2, y + 2);
    }

    return 8;
  };

  // Helper function to add modern header
  const addHeader = (y: number) => {
    // Header background
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, y - 8, pageWidth, 25, "F");

    // Main title
    pdf.setFontSize(titleSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text(
      "PERSONAL INJURY PROTECTION (PIP) CLAIM FORM",
      pageWidth / 2,
      y + 2,
      { align: "center" }
    );

    // Subtitle
    pdf.setFontSize(10);
    pdf.text("State of Florida - No-Fault Insurance", pageWidth / 2, y + 8, {
      align: "center",
    });

    // Claim info
    pdf.setFontSize(8);
    pdf.text(
      `Claim: ${claim.claimNumber || "N/A"} | Date: ${formatDate(claim.submittedAt || "")} | Status: ${claim.status ? claim.status.toUpperCase() : "PENDING"}`,
      pageWidth / 2,
      y + 14,
      { align: "center" }
    );

    return y + 20;
  };

  // Helper function to add modern footer
  const addFooter = () => {
    const footerY = pageHeight - 12;

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "Generated by ClaimSaver+ Professional Claim Documentation System",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
    pdf.text(
      "Contact: claimsaverplus@gmail.com | Professional Claim Management",
      pageWidth / 2,
      footerY + 3,
      { align: "center" }
    );
    pdf.text(
      `Generated on: ${new Date().toLocaleString()} | Version 3.0`,
      pageWidth / 2,
      footerY + 6,
      { align: "center" }
    );
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      pdf.addPage();
      yPosition = addHeader(margin);
      addFooter();
      // Add padding between header and content on new pages
      yPosition += 15;
    }
  };

  // Start with header
  let yPosition = addHeader(margin);
  addFooter();

  // Add padding between header and content
  yPosition += 15;

  // Section 1: Claimant Information
  yPosition = addSectionHeader("1. CLAIMANT INFORMATION", yPosition);

  checkNewPage(25);
  yPosition += addFieldGroup(
    "Full Name",
    claim.claimantName || "",
    margin,
    yPosition,
    contentWidth,
    true
  );
  yPosition += fieldSpacing;

  checkNewPage(15);
  const dobField = addFieldGroup(
    "Date of Birth",
    claim.claimantDOB || "",
    margin,
    yPosition,
    85
  );
  const ssnField = addFieldGroup(
    "Social Security Number",
    "N/A",
    margin + 95,
    yPosition,
    85
  );
  yPosition += Math.max(dobField, ssnField);
  yPosition += fieldSpacing;

  checkNewPage(15);
  yPosition += addFieldGroup(
    "Address",
    claim.claimantAddress || "",
    margin,
    yPosition,
    contentWidth
  );
  yPosition += fieldSpacing;

  checkNewPage(15);
  const phoneField = addFieldGroup(
    "Phone Number",
    claim.claimantPhone || "",
    margin,
    yPosition,
    85
  );
  const emailField = addFieldGroup(
    "Email Address",
    claim.claimantEmail || "",
    margin + 95,
    yPosition,
    85
  );
  yPosition += Math.max(phoneField, emailField);
  yPosition += sectionSpacing;

  // Section 2: Accident Information
  checkNewPage(25);
  yPosition = addSectionHeader("2. ACCIDENT INFORMATION", yPosition);

  checkNewPage(15);
  const accidentDateField = addFieldGroup(
    "Date of Accident",
    formatDate(claim.accidentDate || ""),
    margin,
    yPosition,
    85
  );
  const accidentTimeField = addFieldGroup(
    "Time of Accident",
    "N/A",
    margin + 95,
    yPosition,
    85
  );
  yPosition += Math.max(accidentDateField, accidentTimeField);
  yPosition += fieldSpacing;

  checkNewPage(15);
  yPosition += addFieldGroup(
    "Location of Accident",
    claim.accidentLocation || "",
    margin,
    yPosition,
    contentWidth
  );
  yPosition += fieldSpacing;

  checkNewPage(25);
  yPosition += addFieldGroup(
    "Description of Accident",
    claim.accidentDescription || "",
    margin,
    yPosition,
    contentWidth
  );
  yPosition += sectionSpacing;

  // Section 3: Vehicle Information
  checkNewPage(25);
  yPosition = addSectionHeader("3. VEHICLE INFORMATION", yPosition);

  checkNewPage(15);
  const fieldWidth = 55;
  const spacing = 6;
  const yearField = addFieldGroup(
    "Year",
    claim.vehicleYear || "",
    margin,
    yPosition,
    fieldWidth
  );
  const makeField = addFieldGroup(
    "Make",
    claim.vehicleMake || "",
    margin + fieldWidth + spacing,
    yPosition,
    fieldWidth
  );
  const modelField = addFieldGroup(
    "Model",
    claim.vehicleModel || "",
    margin + (fieldWidth + spacing) * 2,
    yPosition,
    fieldWidth
  );
  yPosition += Math.max(yearField, makeField, modelField);
  yPosition += fieldSpacing;

  checkNewPage(15);
  const plateField = addFieldGroup(
    "License Plate",
    claim.licensePlate || "",
    margin,
    yPosition,
    85
  );
  const stateField = addFieldGroup("State", "FL", margin + 95, yPosition, 85);
  yPosition += Math.max(plateField, stateField);
  yPosition += sectionSpacing;

  // Section 4: Insurance Information
  checkNewPage(25);
  yPosition = addSectionHeader("4. INSURANCE INFORMATION", yPosition);

  checkNewPage(15);
  yPosition += addFieldGroup(
    "Insurance Company",
    claim.insuranceCompany || "",
    margin,
    yPosition,
    contentWidth
  );
  yPosition += fieldSpacing;

  checkNewPage(15);
  const policyNumberField = addFieldGroup(
    "Policy Number",
    claim.policyNumber || "",
    margin,
    yPosition,
    85
  );
  const policyHolderField = addFieldGroup(
    "Policy Holder",
    claim.policyHolder || "",
    margin + 95,
    yPosition,
    85
  );
  yPosition += Math.max(policyNumberField, policyHolderField);
  yPosition += fieldSpacing;

  checkNewPage(15);
  const fileNumberField = addFieldGroup(
    "File Number",
    claim.fileNumber || "",
    margin,
    yPosition,
    85
  );
  const adjusterNameField = addFieldGroup(
    "Adjuster Name",
    claim.adjusterName || "",
    margin + 95,
    yPosition,
    85
  );
  yPosition += Math.max(fileNumberField, adjusterNameField);
  yPosition += fieldSpacing;

  checkNewPage(15);
  yPosition += addFieldGroup(
    "Adjuster Phone",
    claim.adjusterPhone || "",
    margin,
    yPosition,
    contentWidth
  );
  yPosition += sectionSpacing;

  // Section 5: Injury Information
  checkNewPage(25);
  yPosition = addSectionHeader("5. INJURY INFORMATION", yPosition);

  checkNewPage(8);
  yPosition += addCheckbox(
    "Were you injured in the accident?",
    claim.injured || false,
    margin,
    yPosition
  );
  yPosition += 6;

  if (claim.injured) {
    checkNewPage(25);
    yPosition += addFieldGroup(
      "Description of Injuries",
      claim.injuryDescription || "",
      margin,
      yPosition,
      contentWidth
    );
    yPosition += fieldSpacing;
  }

  checkNewPage(8);
  yPosition += addCheckbox(
    "Did you receive medical treatment?",
    claim.treatedByDoctor || false,
    margin,
    yPosition
  );
  yPosition += 6;

  if (claim.treatedByDoctor) {
    checkNewPage(15);
    yPosition += addFieldGroup(
      "Doctor/Hospital Name",
      claim.doctorName || claim.hospitalName || "",
      margin,
      yPosition,
      contentWidth
    );
    yPosition += fieldSpacing;

    checkNewPage(15);
    yPosition += addFieldGroup(
      "Medical Bills to Date",
      claim.medicalBillsToDate || "",
      margin,
      yPosition,
      contentWidth
    );
    yPosition += fieldSpacing;
  }

  yPosition += sectionSpacing;

  // Section 6: Employment Information
  checkNewPage(25);
  yPosition = addSectionHeader("6. EMPLOYMENT INFORMATION", yPosition);

  checkNewPage(8);
  yPosition += addCheckbox(
    "Was the accident in the course of employment?",
    claim.inCourseOfEmployment || false,
    margin,
    yPosition
  );
  yPosition += 6;

  checkNewPage(8);
  yPosition += addCheckbox(
    "Did you lose wages due to the accident?",
    claim.lostWages || false,
    margin,
    yPosition
  );
  yPosition += 6;

  if (claim.lostWages) {
    checkNewPage(15);
    const wageLossField = addFieldGroup(
      "Wage Loss to Date",
      claim.wageLossToDate || "",
      margin,
      yPosition,
      85
    );
    const avgWageField = addFieldGroup(
      "Average Weekly Wage",
      claim.averageWeeklyWage || "",
      margin + 95,
      yPosition,
      85
    );
    yPosition += Math.max(wageLossField, avgWageField);
    yPosition += fieldSpacing;
  }

  checkNewPage(8);
  yPosition += addCheckbox(
    "Are you receiving Workers' Compensation?",
    claim.workersComp || false,
    margin,
    yPosition
  );
  yPosition += 6;

  if (claim.workersComp) {
    checkNewPage(15);
    yPosition += addFieldGroup(
      "Workers' Compensation Amount",
      claim.workersCompAmount || "",
      margin,
      yPosition,
      contentWidth
    );
    yPosition += fieldSpacing;
  }

  yPosition += sectionSpacing;

  // Section 7: Other Expenses (if applicable)
  if (claim.otherExpenses) {
    checkNewPage(25);
    yPosition = addSectionHeader("7. OTHER EXPENSES", yPosition);

    checkNewPage(25);
    yPosition += addFieldGroup(
      "Description of Other Expenses",
      claim.otherExpenses || "",
      margin,
      yPosition,
      contentWidth
    );
    yPosition += sectionSpacing;
  }

  // Section 8: Authorization Status
  checkNewPage(25);
  yPosition = addSectionHeader("8. AUTHORIZATION STATUS", yPosition);

  checkNewPage(8);
  yPosition += addCheckbox(
    "Insurance Authorization Signed",
    !!claim.insuranceAuthSignature,
    margin,
    yPosition
  );
  yPosition += 6;

  checkNewPage(8);
  yPosition += addCheckbox(
    "HIPAA Authorization Signed",
    !!claim.hipaaSignature,
    margin,
    yPosition
  );
  yPosition += 6;

  checkNewPage(15);
  const insuranceAuthDateField = addFieldGroup(
    "Insurance Auth Date",
    claim.insuranceAuthSignatureDate || "",
    margin,
    yPosition,
    85
  );
  const hipaaAuthDateField = addFieldGroup(
    "HIPAA Auth Date",
    claim.hipaaSignatureDate || "",
    margin + 95,
    yPosition,
    85
  );
  yPosition += Math.max(insuranceAuthDateField, hipaaAuthDateField);
  yPosition += sectionSpacing;

  // Section 9: Claimant Signature
  checkNewPage(30);
  yPosition = addSectionHeader("9. CLAIMANT SIGNATURE", yPosition);

  checkNewPage(15);
  pdf.setFontSize(bodySize);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(80, 80, 80);
  pdf.text(
    "I declare under penalty of perjury that the information provided above is true and correct to the best of my knowledge.",
    margin,
    yPosition,
    { maxWidth: contentWidth }
  );
  yPosition += 10;

  checkNewPage(15);
  yPosition += addSignatureLine(
    "Signature",
    !!claim.signature,
    margin,
    yPosition,
    120
  );
  yPosition += 6;

  checkNewPage(15);
  yPosition += addSignatureLine("Date", true, margin, yPosition, 60);
  const signatureDateField = addFieldGroup(
    "",
    claim.signatureDate || "",
    margin + 70,
    yPosition,
    50
  );
  yPosition += Math.max(8, signatureDateField);

  // Generate blob
  const pdfBlob = pdf.output("blob");
  return pdfBlob;
};

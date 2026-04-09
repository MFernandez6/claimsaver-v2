/**
 * Worksheet fields aligned with the Florida no-fault application structure
 * (see public/docs/FL-Auto-No-Fault-Forms-Updated-07-29-2021.pdf).
 * This is a personal drafting aid; the insurer’s official form controls.
 */

export type CompletionMethod = "digital_worksheet" | "paper_hand" | "";

export interface FloridaNoFaultFormData {
  completionMethod: CompletionMethod;
  employersList: string;

  insuranceCompany: string;
  policyNumber: string;
  adjusterName: string;
  adjusterPhone: string;
  fileNumber: string;
  policyHolder: string;
  dateOfAccident: string;

  medicalInsurance: string;
  medicalMemberId: string;

  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantPhoneHome: string;
  claimantPhoneBusiness: string;
  claimantAddress: string;
  claimantDOB: string;
  claimantSSN: string;
  floridaResidencyDuration: string;
  permanentAddress: string;

  accidentDate: string;
  accidentLocation: string;
  accidentDescription: string;
  accidentDateTime: string;
  accidentPlace: string;
  yourVehicle: string;
  familyVehicle: string;
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
  moreMedicalExpense: boolean;

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
  insuranceAuthLegalAuthorityName: string;
  insuranceAuthLegalAuthoritySignature: string;
  insuranceAuthLegalAuthorityDescription: string;

  pipPatientName: string;
  pipPatientSignature: string;
  pipPatientDate: string;
  pipProviderName: string;
  pipProviderSignature: string;
  pipProviderDate: string;

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
  hipaaLegalAuthorityName: string;
  hipaaLegalAuthoritySignature: string;
  hipaaLegalAuthorityDescription: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  injuries: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  propertyDamage: string;
  estimatedValue: number;
}

export function getInitialFloridaNoFaultFormData(): FloridaNoFaultFormData {
  return {
    completionMethod: "",
    employersList: "",

    insuranceCompany: "",
    policyNumber: "",
    adjusterName: "",
    adjusterPhone: "",
    fileNumber: "",
    policyHolder: "",
    dateOfAccident: "",

    medicalInsurance: "",
    medicalMemberId: "",

    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    claimantPhoneHome: "",
    claimantPhoneBusiness: "",
    claimantAddress: "",
    claimantDOB: "",
    claimantSSN: "",
    floridaResidencyDuration: "",
    permanentAddress: "",

    accidentDate: "",
    accidentLocation: "",
    accidentDescription: "",
    accidentDateTime: "",
    accidentPlace: "",
    yourVehicle: "",
    familyVehicle: "",
    injured: false,
    injuryDescription: "",

    treatedByDoctor: false,
    doctorName: "",
    doctorAddress: "",
    hospitalInpatient: false,
    hospitalOutpatient: false,
    hospitalName: "",
    hospitalAddress: "",
    medicalBillsToDate: "",
    moreMedicalExpense: false,

    inCourseOfEmployment: false,
    lostWages: false,
    wageLossToDate: "",
    averageWeeklyWage: "",
    disabilityStart: "",
    disabilityEnd: "",
    workersComp: false,
    workersCompAmount: "",
    otherExpenses: "",

    signature: "",
    signatureDate: "",

    insuranceAuthInsuredName: "",
    insuranceAuthPolicyNumber: "",
    insuranceAuthInsuranceCompany: "",
    insuranceAuthDisclosureType: "",
    insuranceAuthExcludedInfo: [],
    insuranceAuthDisclosureForm: "",
    insuranceAuthReasonForDisclosure: "",
    insuranceAuthRecipientName: "",
    insuranceAuthRecipientOrganization: "",
    insuranceAuthRecipientAddress: "",
    insuranceAuthDurationType: "",
    insuranceAuthStartDate: "",
    insuranceAuthEndDate: "",
    insuranceAuthEndEvent: "",
    insuranceAuthRevocationName: "",
    insuranceAuthRevocationOrganization: "",
    insuranceAuthRevocationAddress: "",
    insuranceAuthSignature: "",
    insuranceAuthSignatureDate: "",
    insuranceAuthLegalAuthorityName: "",
    insuranceAuthLegalAuthoritySignature: "",
    insuranceAuthLegalAuthorityDescription: "",

    pipPatientName: "",
    pipPatientSignature: "",
    pipPatientDate: "",
    pipProviderName: "",
    pipProviderSignature: "",
    pipProviderDate: "",

    hipaaPatientName: "",
    hipaaHealthcareProvider: "",
    hipaaDisclosureType: "",
    hipaaExcludedInfo: [],
    hipaaDisclosureForm: "",
    hipaaReasonForDisclosure: "",
    hipaaRecipientName: "",
    hipaaRecipientOrganization: "",
    hipaaRecipientAddress: "",
    hipaaDurationType: "",
    hipaaStartDate: "",
    hipaaEndDate: "",
    hipaaEndEvent: "",
    hipaaRevocationName: "",
    hipaaRevocationOrganization: "",
    hipaaRevocationAddress: "",
    hipaaSignature: "",
    hipaaSignatureDate: "",
    hipaaLegalAuthorityName: "",
    hipaaLegalAuthoritySignature: "",
    hipaaLegalAuthorityDescription: "",

    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    injuries: [],
    propertyDamage: "",
    estimatedValue: 0,
  };
}

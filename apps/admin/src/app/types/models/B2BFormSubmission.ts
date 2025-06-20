import { B2BFormSubmissionStatus } from "../../../lib/api/services/b2b-form-submissions.service";

export interface B2BFormSubmission {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  brandedResidencesName: string;
  companyWebsite: string;
  pageOrigin: string;
  status: B2BFormSubmissionStatus;
  createdAt: string;
  updatedAt: string;
} 
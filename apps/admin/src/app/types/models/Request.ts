export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  phone: string | null;
  preferredContactMethod: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  subject: string | null;
  message: string | null;
  entityId: string | null;
  type: 'CONSULTATION' | 'CONTACT_US' | 'MORE_INFORMATION';
  status: string;
  note: string | null;
  lead: Lead;
  createdAt: string;
  updatedAt: string;
}

export interface RequestsApiResponse {
  data: Request[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
} 
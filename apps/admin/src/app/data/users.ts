import { User } from "../types/models/User";

export const usersData: User[] = [
  {
    id: "4adc2156-34b0-43a2-955e-35d80bb8c620",
    fullName: "Super Admin",
    email: "superadmin@example.com",
    emailVerified: true,
    company: null,
    role: {
      id: "4fadddfc-d7ab-4ae1-af78-4196c12f3b04",
      name: "superadmin"
    },
    status: "Active",
    createdAt: "2023-03-14T18:07:25.834Z",
    updatedAt: "2023-03-14T18:07:25.834Z",
  },
  {
    id: "7c5dfa4e-c7d3-4b7a-9a5c-08c8b7ea7b9e",
    fullName: "John Doe",
    email: "john.doe@example.com",
    emailVerified: true,
    company: "Acme Corp",
    role: {
      id: "6a1b3c2d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
      name: "admin"
    },
    status: "Active",
    createdAt: "2023-04-25T09:15:32.123Z",
    updatedAt: "2023-06-18T11:30:45.789Z",
  },
  {
    id: "3e2d1c0b-9a8b-7c6d-5e4f-3a2b1c0d9e8f",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    emailVerified: true,
    company: "Tech Solutions",
    role: {
      id: "8f7e6d5c-4b3a-2c1d-0e9f-8a7b6c5d4e3f",
      name: "developer"
    },
    status: "Active",
    createdAt: "2023-05-10T14:22:18.456Z",
    updatedAt: "2023-07-05T16:45:12.345Z",
  },
  {
    id: "9f8e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
    fullName: "Robert Johnson",
    email: "robert.johnson@example.com",
    emailVerified: false,
    company: "Global Enterprises",
    role: {
      id: "2d3e4f5a-6b7c-8d9e-0a1b-2c3d4e5f6a7b",
      name: "buyer"
    },
    status: "Invited",
    createdAt: "2023-06-05T08:17:42.789Z",
    updatedAt: "2023-06-05T08:17:42.789Z",
  },
  {
    id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
    fullName: "Emily Wilson",
    email: "emily.wilson@example.com",
    emailVerified: true,
    company: "Creative Designs",
    role: {
      id: "8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d",
      name: "developer"
    },
    status: "Active",
    createdAt: "2023-02-18T13:45:29.123Z",
    updatedAt: "2023-08-12T10:20:33.456Z",
  },
  {
    id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    emailVerified: true,
    company: "Financial Partners",
    role: {
      id: "4f5a6b7c-8d9e-0a1b-2c3d-4e5f6a7b8c9d",
      name: "admin"
    },
    status: "Suspended",
    createdAt: "2023-03-30T09:12:54.789Z",
    updatedAt: "2023-09-07T15:33:21.234Z",
  },
  {
    id: "1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
    fullName: "Sophia Davis",
    email: "sophia.davis@example.com",
    emailVerified: false,
    company: "Smart Solutions",
    role: {
      id: "6c7d8e9f-0a1b-2c3d-4e5f-6a7b8c9d0e1f",
      name: "buyer"
    },
    status: "Invited",
    createdAt: "2023-07-14T16:38:05.456Z",
    updatedAt: "2023-07-14T16:38:05.456Z",
  },
  {
    id: "8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d",
    fullName: "David Miller",
    email: "david.miller@example.com",
    emailVerified: true,
    company: "Innovation Labs",
    role: {
      id: "2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b",
      name: "developer"
    },
    status: "Suspended",
    createdAt: "2023-01-25T11:27:36.789Z",
    updatedAt: "2023-10-15T09:48:57.123Z",
  },
  {
    id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
    fullName: "Olivia Wilson",
    email: "olivia.wilson@example.com",
    emailVerified: true,
    company: "Eco Friendly Corp",
    role: {
      id: "8d9e0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b",
      name: "buyer"
    },
    status: "Active",
    createdAt: "2023-05-04T14:53:21.123Z",
    updatedAt: "2023-08-29T17:15:42.456Z",
  },
  {
    id: "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    fullName: "William Taylor",
    email: "william.taylor@example.com",
    emailVerified: true,
    company: "Digital Platforms",
    role: {
      id: "4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
      name: "admin"
    },
    status: "Active",
    createdAt: "2023-04-10T08:33:19.456Z",
    updatedAt: "2023-09-22T12:27:33.789Z",
  }
];

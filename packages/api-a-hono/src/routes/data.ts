import type { CustomerProfile } from "../../schemas/customer";

export const CUSTOMERS: CustomerProfile[] = [
  {
    customerId: "c_1001",
    fullName: "Alex Chen",
    email: "alex.chen@example.com",
    phone: "4035550101",
    status: "active",
    createdAt: "2024-07-01T10:15:00.000Z",
    address: {
      line1: "123 8 Ave SW",
      city: "Calgary",
      province: "AB",
      postalCode: "T2P 1B2",
      country: "CA",
    },
  },
  {
    customerId: "c_1002",
    fullName: "Jordan Patel",
    email: "jordan.patel@example.com",
    status: "frozen",
    createdAt: "2023-11-12T18:20:00.000Z",
    address: {
      line1: "88 King St",
      line2: "Unit 1203",
      city: "Toronto",
      province: "ON",
      postalCode: "M5H 1J9",
      country: "CA",
    },
  },
  {
    customerId: "c_1003",
    fullName: "Sam Nguyen",
    email: "sam.nguyen@example.com",
    status: "inactive",
    createdAt: "2022-03-05T08:00:00.000Z",
    address: {
      line1: "500 Granville St",
      city: "Vancouver",
      province: "BC",
      postalCode: "V6C 1W6",
      country: "CA",
    },
  },
];

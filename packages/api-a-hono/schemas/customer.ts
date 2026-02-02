import { z } from "zod";

export const CustomerStatus = z.enum(["active", "inactive", "frozen"]);
export const Province = z.enum([
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
]);

export const Address = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  province: Province,
  postalCode: z.string().min(3),
  country: z.literal("CA"),
});

export const CustomerProfile = z.object({
  customerId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  status: CustomerStatus,
  createdAt: z.string().datetime(),
  address: Address,
});

export type CustomerProfile = z.infer<typeof CustomerProfile>;

export const CustomerSearchRequest = z.object({
  query: z.string().min(1).optional(), // name/email substring
  status: CustomerStatus.optional(),
  province: Province.optional(),
  limit: z.number().int().min(1).max(50).default(10),
});

export const CustomerSearchResponse = z.object({
  results: z.array(CustomerProfile),
});

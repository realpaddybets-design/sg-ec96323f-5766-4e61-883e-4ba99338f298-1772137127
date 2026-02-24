import { z } from "zod";

// Base schema for all applications
const baseApplicationSchema = z.object({
  applicant_name: z.string().min(2, "Name must be at least 2 characters"),
  applicant_email: z.string().email("Please enter a valid email address"),
  applicant_phone: z.string().optional(),
  address: z.string().min(5, "Please enter a complete address"),
  city: z.string().min(2, "City is required"),
  state: z.string().default("NY"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
});

// Fun Grant Application Schema
export const funGrantSchema = baseApplicationSchema.extend({
  application_type: z.literal("fun_grant"),
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z.coerce.number().min(0).max(18, "Child must be 0-18 years old"),
  relationship: z.enum(["parent", "guardian", "family_member"]),
  loss_details: z.string().min(20, "Please provide details about the loss (at least 20 characters)"),
  description: z.string().min(50, "Please describe what would bring joy to your child (at least 50 characters)"),
  requested_amount: z.coerce.number().min(1).max(5000).optional(),
});

// Angel Aid Application Schema
export const angelAidSchema = baseApplicationSchema.extend({
  application_type: z.literal("angel_aid"),
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z.coerce.number().min(0).max(18, "Child must be 0-18 years old"),
  relationship: z.enum(["parent", "guardian", "family_member"]),
  loss_details: z.string().min(20, "Please provide details about the loss (at least 20 characters)"),
  description: z.string().min(50, "Please describe your financial need and how Angel Aid would help (at least 50 characters)"),
  requested_amount: z.coerce.number().min(1).max(10000).optional(),
});

// Angel Hug Application Schema
export const angelHugSchema = baseApplicationSchema.extend({
  application_type: z.literal("angel_hug"),
  relationship: z.literal("self"),
  loss_details: z.string().min(20, "Please share your story of loss (at least 20 characters)"),
  description: z.string().min(50, "Please describe how you'd like to use the Angel Hug grant for self-care (at least 50 characters)"),
  requested_amount: z.coerce.number().min(1).max(500).optional(),
});

// Hugs for Ukraine Application Schema
export const hugsForUkraineSchema = baseApplicationSchema.extend({
  application_type: z.literal("hugs_for_ukraine"),
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z.coerce.number().min(0).max(18, "Child must be 0-18 years old"),
  relationship: z.enum(["parent", "guardian", "family_member", "nominee"]),
  description: z.string().min(50, "Please describe the child's situation and how this grant would help (at least 50 characters)"),
  requested_amount: z.coerce.number().min(1).max(2000).optional(),
});

// Type exports
export type FunGrantFormData = z.infer<typeof funGrantSchema>;
export type AngelAidFormData = z.infer<typeof angelAidSchema>;
export type AngelHugFormData = z.infer<typeof angelHugSchema>;
export type HugsForUkraineFormData = z.infer<typeof hugsForUkraineSchema>;
export type ApplicationFormData = FunGrantFormData | AngelAidFormData | AngelHugFormData | HugsForUkraineFormData;
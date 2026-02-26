import { z } from "zod";

// Base schema fields shared by most applications
const baseSchema = z.object({
  applicant_name: z.string().min(2, "Name must be at least 2 characters"),
  applicant_email: z.string().email("Please enter a valid email address"),
  applicant_phone: z.string().optional(),
  
  // Address fields
  address: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2 characters").default("NY"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code is required"),
});

// Extended schema to cover all possible fields across different forms
// This is used for the generic ApplicationFormData type
export const applicationSchema = baseSchema.extend({
  application_type: z.enum(['fun_grant', 'angel_aid', 'angel_hug', 'scholarship', 'hugs_ukraine']),
  
  // Child info (Fun Grant, Angel Aid, Hugs for Ukraine)
  child_name: z.string().optional(),
  child_age: z.coerce.number().min(0).max(18).optional(),
  relationship: z.string().optional(),
  
  // Grant details
  loss_details: z.string().optional(),
  description: z.string().min(10, "Please provide more details"), // Used for various description fields
  requested_amount: z.coerce.number().min(0).optional(),
  
  // Scholarship specific fields
  school: z.string().optional(),
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  graduation_year: z.coerce.number().min(2024).optional(),
  essay_text: z.string().optional(),
  family_situation: z.string().optional(),
  transcript_url: z.string().optional(),
  recommendation_letter_url: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Specific schemas for validation
export const funGrantSchema = applicationSchema.omit({ 
  school: true, gpa: true, graduation_year: true, essay_text: true, family_situation: true, transcript_url: true, recommendation_letter_url: true 
}).extend({
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z.coerce.number().min(0).max(18),
  relationship: z.string().min(2, "Relationship is required"),
  loss_details: z.string().min(10, "Please share details about your loss"),
  description: z.string().min(20, "Please describe what would bring joy"),
});

export const angelAidSchema = applicationSchema.omit({
  school: true, gpa: true, graduation_year: true, essay_text: true, transcript_url: true, recommendation_letter_url: true
}).extend({
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z.coerce.number().min(0).max(18),
  relationship: z.string().min(2, "Relationship is required"),
  loss_details: z.string().min(10, "Please share details about your loss"),
  description: z.string().min(20, "Please explain your financial needs"),
  requested_amount: z.coerce.number().min(1, "Please enter an amount"),
});

export const angelHugSchema = applicationSchema.omit({
  child_name: true, child_age: true, relationship: true,
  school: true, gpa: true, graduation_year: true, essay_text: true, family_situation: true, transcript_url: true, recommendation_letter_url: true,
  requested_amount: true
}).extend({
  loss_details: z.string().min(10, "Please share your story of loss"),
  description: z.string().min(20, "Please describe how you would use this grant"),
});

export const hugsForUkraineSchema = applicationSchema.omit({
  loss_details: true,
  school: true, gpa: true, graduation_year: true, essay_text: true, family_situation: true, transcript_url: true, recommendation_letter_url: true
}).extend({
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z.coerce.number().min(0).max(18),
  relationship: z.string().min(2, "Relationship is required"),
  description: z.string().min(20, "Please describe the situation"),
});
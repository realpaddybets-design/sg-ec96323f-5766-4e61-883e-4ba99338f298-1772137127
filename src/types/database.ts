export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ApplicationType = 'fun_grant' | 'angel_aid' | 'angel_hug' | 'scholarship' | 'hugs_ukraine';

export type ApplicationStatus = 
  | 'pending' 
  | 'under_review' 
  | 'recommended' 
  | 'approved' 
  | 'denied' 
  | 'more_info_needed'
  | 'board_approved';

export type UserRole = 'staff' | 'admin';

export type VoteType = 'approve' | 'deny' | 'discuss';

export interface Application {
  id: string;
  created_at: string;
  updated_at: string;
  type: ApplicationType;
  status: ApplicationStatus;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string | null;
  
  // Scholarship-specific
  school?: string | null;
  gpa?: number | null;
  graduation_year?: number | null;
  essay_text?: string | null;
  transcript_url?: string | null;
  recommendation_letter_url?: string | null;
  
  // General grant fields
  grant_details?: string | null;
  family_situation?: string | null;
  requested_amount?: number | null;
  
  // Legacy/Other Grant Fields
  child_name?: string | null;
  child_age?: number | null;
  relationship?: string | null;
  description?: string | null;
  loss_details?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  
  supporting_documents?: Json;
  staff_notes?: string | null;
  recommendation_summary?: string | null;
  recommended_by?: string | null;
  recommended_at?: string | null;
  
  // Additional fields used in ApplicationForm
  priority?: string | null;
}

export interface StaffAssignment {
  id: string;
  created_at: string;
  staff_user_id: string;
  school: string;
}

export interface Vote {
  id: string;
  created_at: string;
  application_id: string;
  voter_id: string;
  vote: VoteType;
  comment?: string | null;
}

export interface UserProfile {
  id: string;
  created_at: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
}

export interface ApplicationNote {
  id: string;
  created_at: string;
  application_id: string;
  user_id: string;
  note: string;
  is_internal: boolean;
}

export const CAPITAL_REGION_SCHOOLS = [
  "Ft. Edward High School",
  "Lake George High School",
  "Mechanicville High School",
  "Glens Falls High School",
  "Hoosic Valley High School",
  "Queensbury High School",
  "Saratoga Central Catholic School",
  "Saratoga Springs High School",
  "Shenendehowa High School",
  "South Glens Falls High School",
  "Stillwater High School",
  "Ravena-Coeymans-Selkirk",
  "Hudson Falls",
  "Whitehall High School"
] as const;

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Application>;
      };
      staff_assignments: {
        Row: StaffAssignment;
        Insert: Omit<StaffAssignment, 'id' | 'created_at'>;
        Update: Partial<StaffAssignment>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Vote>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at'>;
        Update: Partial<UserProfile>;
      };
      application_notes: {
        Row: ApplicationNote;
        Insert: Omit<ApplicationNote, 'id' | 'created_at'>;
        Update: Partial<ApplicationNote>;
      };
    };
  };
}
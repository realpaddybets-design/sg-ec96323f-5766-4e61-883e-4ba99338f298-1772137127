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
  applicant_phone?: string;
  
  // Scholarship-specific
  school?: string;
  gpa?: number;
  graduation_year?: number;
  essay_text?: string;
  transcript_url?: string;
  recommendation_letter_url?: string;
  
  // General grant fields
  grant_details?: string;
  family_situation?: string;
  requested_amount?: number;
  
  // Legacy/Other Grant Fields (Making optional to satisfy dashboard.tsx until refactor)
  child_name?: string;
  child_age?: number;
  relationship?: string;
  description?: string;
  loss_details?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  
  supporting_documents?: any[];
  staff_notes?: string;
  recommendation_summary?: string;
  recommended_by?: string;
  recommended_at?: string;
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
  comment?: string;
}

export interface UserProfile {
  id: string;
  created_at: string;
  email: string;
  role: UserRole;
  full_name?: string;
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
      votes: { // Table name in SQL is 'votes', let's check dashboard usage
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Vote>;
      };
      // Adding alias if dashboard uses 'application_votes' though SQL used 'votes'
      application_votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Vote>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at'>;
        Update: Partial<UserProfile>;
      };
      // Add application_notes if used
      application_notes: {
        Row: {
            id: string;
            created_at: string;
            application_id: string;
            user_id: string;
            note: string;
            is_internal: boolean;
        };
        Insert: {
            application_id: string;
            user_id: string;
            note: string;
            is_internal?: boolean;
        };
        Update: {
            note?: string;
            is_internal?: boolean;
        };
      };
    };
  };
}
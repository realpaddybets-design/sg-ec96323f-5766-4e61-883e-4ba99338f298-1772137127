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

export type UserRole = 'staff' | 'admin' | 'owner';

export type VoteType = 'approve' | 'deny' | 'discuss';

export type VolunteerStatus = 'confirmed' | 'cancelled' | 'attended';

export type OpportunityStatus = 'active' | 'full' | 'cancelled';

export type GrantStatus = 'pending' | 'approved' | 'denied' | 'under_review';

export type MinutesStatus = 'pending' | 'approved' | 'denied' | 'discussion';

export type AnnouncementPriority = 'normal' | 'urgent';

export type TargetGroup = 'all' | 'active' | 'specific';

export interface AppSetting {
  key: string;
  value: any;
  description?: string | null;
  updated_at: string;
  updated_by?: string | null;
}

export interface StaffActivityLog {
  id: string;
  user_id: string;
  action_type: 'vote' | 'status_change' | 'comment' | 'upload' | 'login' | 'create';
  entity_type: 'application' | 'grant' | 'meeting' | 'volunteer';
  entity_id: string;
  details?: any | null;
  created_at: string;
}

export interface Application {
  id: string;
  created_at: string;
  updated_at: string;
  type: ApplicationType;
  status: ApplicationStatus;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string | null;
  
  // Common fields
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  description?: string | null;
  
  // Scholarship-specific
  school?: string | null;
  gpa?: number | null;
  graduation_year?: number | null;
  essay?: string | null;
  transcript_url?: string | null;
  recommendation_letter_url?: string | null;
  
  // General grant fields
  child_name?: string | null;
  relationship?: string | null;
  grant_details?: string | null;
  family_situation?: string | null;
  requested_amount?: number | null;
  
  supporting_documents?: Json | null;
  staff_notes?: string | null;
  recommendation_summary?: string | null;
  recommended_by?: string | null;
  recommended_at?: string | null;
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
  user_id: string;
  decision: VoteType;
  comment?: string | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  created_at?: string;
  email: string;
  role: UserRole;
  full_name: string;
}

export interface ApplicationNote {
  id: string;
  created_at: string;
  application_id: string;
  user_id: string;
  note: string;
  is_internal: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  total_spots: number;
  filled_spots: number;
  category: string;
  requirements?: string | null;
  contact_email?: string | null;
  created_at: string;
  created_by: string;
  status: OpportunityStatus;
}

export interface VolunteerProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  notify_email: boolean;
  notify_sms: boolean;
  interests?: string[] | null;
  hours_completed: number;
  joined_date: string;
}

export interface VolunteerRSVP {
  id: string;
  opportunity_id: string;
  volunteer_id: string;
  status: VolunteerStatus;
  rsvp_date: string;
  cancellation_date?: string | null;
  notes?: string | null;
}

export interface VolunteerAnnouncement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  send_email: boolean;
  send_sms: boolean;
  target_group: TargetGroup;
  created_by: string;
  created_at: string;
  read_by: string[];
}

export interface Grant {
  id: string;
  applicant_name: string;
  organization?: string | null;
  email: string;
  phone?: string | null;
  amount_requested: number;
  amount_approved?: number | null;
  category: string;
  description: string;
  status: GrantStatus;
  application_date: string;
  decision_date?: string | null;
  decided_by?: string | null;
  documents?: string[] | null;
  notes?: string | null;
  created_at: string;
}

export interface MeetingMinutes {
  id: string;
  meeting_date: string;
  title: string;
  document_url: string;
  uploaded_by: string;
  uploaded_at: string;
  status: MinutesStatus;
  votes_approve: string[];
  votes_deny: string[];
  votes_discuss: string[];
}

export interface MeetingComment {
  id: string;
  minutes_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface NextMeeting {
  id: string;
  date: string;
  time: string;
  location: string;
  agenda_url?: string | null;
  notes?: string | null;
  updated_by: string;
  updated_at: string;
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

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: AppSetting;
        Insert: Omit<AppSetting, 'updated_at'>;
        Update: Partial<Omit<AppSetting, 'updated_at'>>;
      };
      staff_activity_logs: {
        Row: StaffActivityLog;
        Insert: Omit<StaffActivityLog, 'id' | 'created_at'>;
        Update: Partial<Omit<StaffActivityLog, 'id' | 'created_at'>>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
      };
      staff_assignments: {
        Row: StaffAssignment;
        Insert: Omit<StaffAssignment, 'id' | 'created_at'>;
        Update: Partial<Omit<StaffAssignment, 'id' | 'created_at'>>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Omit<Vote, 'id' | 'created_at'>>;
      };
      application_notes: {
        Row: ApplicationNote;
        Insert: Omit<ApplicationNote, 'id' | 'created_at'>;
        Update: Partial<Omit<ApplicationNote, 'id' | 'created_at'>>;
      };
      volunteer_opportunities: {
        Row: VolunteerOpportunity;
        Insert: Omit<VolunteerOpportunity, 'id' | 'created_at' | 'filled_spots'>;
        Update: Partial<Omit<VolunteerOpportunity, 'id' | 'created_at'>>;
      };
      volunteer_profiles: {
        Row: VolunteerProfile;
        Insert: Omit<VolunteerProfile, 'id' | 'joined_date' | 'hours_completed'>;
        Update: Partial<Omit<VolunteerProfile, 'id' | 'joined_date'>>;
      };
      volunteer_rsvps: {
        Row: VolunteerRSVP;
        Insert: Omit<VolunteerRSVP, 'id' | 'rsvp_date'>;
        Update: Partial<Omit<VolunteerRSVP, 'id' | 'rsvp_date'>>;
      };
      volunteer_announcements: {
        Row: VolunteerAnnouncement;
        Insert: Omit<VolunteerAnnouncement, 'id' | 'created_at' | 'read_by'>;
        Update: Partial<Omit<VolunteerAnnouncement, 'id' | 'created_at'>>;
      };
      grants: {
        Row: Grant;
        Insert: Omit<Grant, 'id' | 'created_at'>;
        Update: Partial<Omit<Grant, 'id' | 'created_at'>>;
      };
      meeting_minutes: {
        Row: MeetingMinutes;
        Insert: Omit<MeetingMinutes, 'id' | 'uploaded_at' | 'votes_approve' | 'votes_deny' | 'votes_discuss'>;
        Update: Partial<Omit<MeetingMinutes, 'id' | 'uploaded_at'>>;
      };
      meeting_comments: {
        Row: MeetingComment;
        Insert: Omit<MeetingComment, 'id' | 'created_at'>;
        Update: Partial<Omit<MeetingComment, 'id' | 'created_at'>>;
      };
      next_meeting: {
        Row: NextMeeting;
        Insert: Omit<NextMeeting, 'id' | 'updated_at'>;
        Update: Partial<Omit<NextMeeting, 'id' | 'updated_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
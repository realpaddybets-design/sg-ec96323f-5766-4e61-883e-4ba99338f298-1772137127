export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          created_at: string;
          applicant_name: string;
          applicant_email: string;
          applicant_phone: string | null;
          grant_type: "fun_grant" | "angel_aid" | "angel_hug" | "scholarship" | "hugs_ukraine";
          child_name: string | null;
          child_age: number | null;
          loss_description: string;
          grant_details: string;
          status: "pending" | "under_review" | "approved" | "denied" | "more_info_needed";
          notes: string | null;
          supporting_documents: string[] | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          applicant_name: string;
          applicant_email: string;
          applicant_phone?: string | null;
          grant_type: "fun_grant" | "angel_aid" | "angel_hug" | "scholarship" | "hugs_ukraine";
          child_name?: string | null;
          child_age?: number | null;
          loss_description: string;
          grant_details: string;
          status?: "pending" | "under_review" | "approved" | "denied" | "more_info_needed";
          notes?: string | null;
          supporting_documents?: string[] | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          applicant_name?: string;
          applicant_email?: string;
          applicant_phone?: string | null;
          grant_type?: "fun_grant" | "angel_aid" | "angel_hug" | "scholarship" | "hugs_ukraine";
          child_name?: string | null;
          child_age?: number | null;
          loss_description?: string;
          grant_details?: string;
          status?: "pending" | "under_review" | "approved" | "denied" | "more_info_needed";
          notes?: string | null;
          supporting_documents?: string[] | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
      };
      votes: {
        Row: {
          id: string;
          created_at: string;
          application_id: string;
          user_id: string;
          vote: "approve" | "deny" | "request_info";
          comment: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          application_id: string;
          user_id: string;
          vote: "approve" | "deny" | "request_info";
          comment?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          application_id?: string;
          user_id?: string;
          vote?: "approve" | "deny" | "request_info";
          comment?: string | null;
        };
      };
      staff_notes: {
        Row: {
          id: string;
          created_at: string;
          application_id: string;
          user_id: string;
          note: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          application_id: string;
          user_id: string;
          note: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          application_id?: string;
          user_id?: string;
          note?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string;
          role: "staff" | "admin";
          is_active: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          full_name: string;
          role?: "staff" | "admin";
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          full_name?: string;
          role?: "staff" | "admin";
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
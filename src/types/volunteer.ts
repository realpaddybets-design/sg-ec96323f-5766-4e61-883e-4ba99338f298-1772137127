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
  requirements?: string;
  contact_email?: string;
  created_at: string;
  created_by: string;
  status: "active" | "full" | "cancelled";
}

export interface VolunteerRSVP {
  id: string;
  opportunity_id: string;
  volunteer_id: string;
  status: "confirmed" | "cancelled" | "attended";
  rsvp_date: string;
  cancellation_date?: string;
  notes?: string;
}

export interface VolunteerProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  notify_email: boolean;
  notify_sms: boolean;
  interests?: string[];
  hours_completed: number;
  joined_date: string;
}

export interface VolunteerAnnouncement {
  id: string;
  title: string;
  message: string;
  priority: "normal" | "urgent";
  send_email: boolean;
  send_sms: boolean;
  target_group: "all" | "active" | "specific";
  created_by: string;
  created_at: string;
  read_by: string[];
}

export interface Grant {
  id: string;
  applicant_name: string;
  organization?: string;
  email: string;
  phone?: string;
  amount_requested: number;
  amount_approved?: number;
  category: string;
  description: string;
  status: "pending" | "approved" | "denied" | "under_review";
  application_date: string;
  decision_date?: string;
  decided_by?: string;
  documents?: string[];
  notes?: string;
}

export interface MeetingMinutes {
  id: string;
  meeting_date: string;
  title: string;
  document_url: string;
  uploaded_by: string;
  uploaded_at: string;
  status: "pending" | "approved" | "denied" | "discussion";
  votes: {
    approve: string[];
    deny: string[];
    discuss: string[];
  };
  comments?: MeetingComment[];
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
  agenda_url?: string;
  notes?: string;
  updated_by: string;
  updated_at: string;
}
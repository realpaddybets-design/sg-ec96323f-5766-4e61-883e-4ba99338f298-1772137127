import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Upload, CheckCircle, XCircle, MessageCircle, Users, Clock, MapPin, FileText, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Meeting, MeetingMinutes, MeetingAttendee, MeetingMinuteVote, UserProfile } from "@/types/database";

interface MeetingManagementProps {
  userId: string;
  userRole: "staff" | "admin" | "owner";
}

export function MeetingManagement({ userId, userRole }: MeetingManagementProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
  const [votes, setVotes] = useState<MeetingMinuteVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    meeting_date: "",
    meeting_time: "",
    location: "",
    meeting_type: "board" as const,
  });

  const [newMinutes, setNewMinutes] = useState({
    minutes_text: "",
    document_url: "",
  });

  const canCreateMeeting = userRole === "admin" || userRole === "owner";
  const canUploadMinutes = true; // All staff can upload
  const canReviewMinutes = userRole === "admin" || userRole === "owner";

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (selectedMeeting) {
      fetchMeetingDetails(selectedMeeting.id);
    }
  }, [selectedMeeting]);

  async function fetchMeetings() {
    try {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("meeting_date", { ascending: false });

      if (error) throw error;
      setMeetings((data || []) as Meeting[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMeetingDetails(meetingId: string) {
    try {
      // Fetch minutes
      const { data: minutesData, error: minutesError } = await supabase
        .from("meeting_minutes")
        .select(`
          *,
          uploader:uploaded_by(id, email, full_name)
        `)
        .eq("meeting_id", meetingId);

      if (minutesError) throw minutesError;
      setMinutes((minutesData || []) as MeetingMinutes[]);

      // Fetch attendees
      const { data: attendeesData, error: attendeesError } = await supabase
        .from("meeting_attendees")
        .select(`
          *,
          user:user_id(id, email, full_name)
        `)
        .eq("meeting_id", meetingId);

      if (attendeesError) throw attendeesError;
      setAttendees((attendeesData || []) as MeetingAttendee[]);

      // Fetch votes for all minutes
      if (minutesData && minutesData.length > 0) {
        const minuteIds = minutesData.map((m: any) => m.id);
        const { data: votesData, error: votesError } = await supabase
          .from("meeting_minute_votes")
          .select(`
            *,
            user:user_id(id, email, full_name)
          `)
          .in("minute_id", minuteIds);

        if (votesError) throw votesError;
        setVotes((votesData || []) as MeetingMinuteVote[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meeting details");
    }
  }

  async function createMeeting() {
    if (!canCreateMeeting) {
      setError("Only admins can create meetings");
      return;
    }

    try {
      const meetingDateTime = `${newMeeting.meeting_date}T${newMeeting.meeting_time}:00`;
      
      const { data, error } = await supabase
        .from("meetings")
        .insert({
          title: newMeeting.title,
          description: newMeeting.description,
          meeting_date: meetingDateTime,
          location: newMeeting.location,
          meeting_type: newMeeting.meeting_type,
          created_by: userId,
        } as any)
        .select()
        .single();

      if (error) throw error;

      setSuccess("Meeting created successfully!");
      setNewMeeting({
        title: "",
        description: "",
        meeting_date: "",
        meeting_time: "",
        location: "",
        meeting_type: "board",
      });
      fetchMeetings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create meeting");
    }
  }

  async function uploadMinutes() {
    if (!selectedMeeting) return;

    try {
      // Bypass TypeScript strict checking for new table
      const supabaseClient: any = supabase;
      const { data, error } = await supabaseClient
        .from("meeting_minutes")
        .insert({
          meeting_id: selectedMeeting.id,
          minutes_text: newMinutes.minutes_text,
          document_url: newMinutes.document_url !== "" ? newMinutes.document_url : null,
          uploaded_by: userId,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      setSuccess("Minutes uploaded successfully!");
      setNewMinutes({ minutes_text: "", document_url: "" });
      fetchMeetingDetails(selectedMeeting.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload minutes");
    }
  }

  async function voteOnMinutes(minuteId: string, vote: "approve" | "deny" | "discuss", comment?: string) {
    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("meeting_minute_votes")
        .select("*")
        .eq("minute_id", minuteId)
        .eq("user_id", userId)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from("meeting_minute_votes")
          .update({ vote, comment } as any)
          .eq("id", (existingVote as any).id);

        if (error) throw error;
      } else {
        // Insert new vote - bypass TypeScript strict checking
        const supabaseClient: any = supabase;
        const { error } = await supabaseClient
          .from("meeting_minute_votes")
          .insert({
            minute_id: minuteId,
            user_id: userId,
            vote,
            comment,
          });

        if (error) throw error;
      }

      setSuccess("Vote recorded!");
      if (selectedMeeting) {
        fetchMeetingDetails(selectedMeeting.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record vote");
    }
  }

  async function updateRSVP(rsvpStatus: "attending" | "not_attending" | "maybe") {
    if (!selectedMeeting) return;

    try {
      const { data: existingRSVP } = await supabase
        .from("meeting_attendees")
        .select("*")
        .eq("meeting_id", selectedMeeting.id)
        .eq("user_id", userId)
        .single();

      if (existingRSVP) {
        const { error } = await supabase
          .from("meeting_attendees")
          .update({ rsvp_status: rsvpStatus } as any)
          .eq("id", (existingRSVP as any).id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("meeting_attendees")
          .insert({
            meeting_id: selectedMeeting.id,
            user_id: userId,
            rsvp_status: rsvpStatus,
          } as any);

        if (error) throw error;
      }

      setSuccess("RSVP updated!");
      fetchMeetingDetails(selectedMeeting.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update RSVP");
    }
  }

  function getVotesForMinute(minuteId: string) {
    const minuteVotes = votes.filter((v) => v.minute_id === minuteId);
    return {
      approve: minuteVotes.filter((v) => v.vote === "approve").length,
      deny: minuteVotes.filter((v) => v.vote === "deny").length,
      discuss: minuteVotes.filter((v) => v.vote === "discuss").length,
      total: minuteVotes.length,
      userVote: minuteVotes.find((v) => v.user_id === userId),
    };
  }

  function getUserRSVP() {
    if (!selectedMeeting) return null;
    return attendees.find((a) => a.user_id === userId);
  }

  if (loading) {
    return <div className="text-center py-8">Loading meetings...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="past">Past Meetings</TabsTrigger>
          {canCreateMeeting && <TabsTrigger value="create">Create Meeting</TabsTrigger>}
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meetings
              .filter((m) => new Date(m.meeting_date) >= new Date())
              .map((meeting) => (
                <Card key={meeting.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedMeeting(meeting)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(meeting.meeting_date).toLocaleDateString()} at{" "}
                      {new Date(meeting.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {meeting.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {meeting.location}
                        </div>
                      )}
                      <Badge variant="outline">{meeting.meeting_type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {meetings.filter((m) => new Date(m.meeting_date) >= new Date()).length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No upcoming meetings scheduled</CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meetings
              .filter((m) => new Date(m.meeting_date) < new Date())
              .map((meeting) => (
                <Card key={meeting.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedMeeting(meeting)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(meeting.meeting_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{meeting.meeting_type}</Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {canCreateMeeting && (
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Meeting</CardTitle>
                <CardDescription>Create a new meeting and notify staff members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                      placeholder="Board Meeting - February 2026"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMeeting.description}
                      onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                      placeholder="Agenda items and meeting details..."
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newMeeting.meeting_date}
                        onChange={(e) => setNewMeeting({ ...newMeeting, meeting_date: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newMeeting.meeting_time}
                        onChange={(e) => setNewMeeting({ ...newMeeting, meeting_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                      placeholder="Conference Room A or Zoom Link"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Meeting Type</Label>
                    <Select value={newMeeting.meeting_type} onValueChange={(value: any) => setNewMeeting({ ...newMeeting, meeting_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="board">Board Meeting</SelectItem>
                        <SelectItem value="committee">Committee Meeting</SelectItem>
                        <SelectItem value="emergency">Emergency Meeting</SelectItem>
                        <SelectItem value="annual">Annual Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={createMeeting} className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Meeting
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedMeeting && new Date(selectedMeeting.meeting_date).toLocaleDateString()} at{" "}
                  {selectedMeeting && new Date(selectedMeeting.meeting_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                {selectedMeeting?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedMeeting.location}
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* RSVP Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  RSVP Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={getUserRSVP()?.rsvp_status === "attending" ? "default" : "outline"}
                    onClick={() => updateRSVP("attending")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Attending
                  </Button>
                  <Button
                    size="sm"
                    variant={getUserRSVP()?.rsvp_status === "not_attending" ? "default" : "outline"}
                    onClick={() => updateRSVP("not_attending")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Not Attending
                  </Button>
                  <Button
                    size="sm"
                    variant={getUserRSVP()?.rsvp_status === "maybe" ? "default" : "outline"}
                    onClick={() => updateRSVP("maybe")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Maybe
                  </Button>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="font-medium mb-2">Attendees ({attendees.length}):</div>
                  <div className="grid gap-2">
                    {attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between">
                        <span>{attendee.user?.full_name || attendee.user?.email}</span>
                        <Badge variant={attendee.rsvp_status === "attending" ? "default" : "secondary"}>{attendee.rsvp_status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Minutes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Meeting Minutes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload New Minutes */}
                <div className="border-2 border-dashed rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Upload Meeting Minutes</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="minutes-text">Minutes Text</Label>
                      <Textarea
                        id="minutes-text"
                        value={newMinutes.minutes_text}
                        onChange={(e) => setNewMinutes({ ...newMinutes, minutes_text: e.target.value })}
                        placeholder="Paste meeting minutes here or provide a document link below..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="document-url">Document Link (Optional)</Label>
                      <Input
                        id="document-url"
                        value={newMinutes.document_url}
                        onChange={(e) => setNewMinutes({ ...newMinutes, document_url: e.target.value })}
                        placeholder="https://docs.google.com/document/..."
                      />
                    </div>
                    <Button onClick={uploadMinutes} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Minutes
                    </Button>
                  </div>
                </div>

                {/* Existing Minutes */}
                {minutes.map((minute) => {
                  const voteStats = getVotesForMinute(minute.id);
                  return (
                    <Card key={minute.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              Uploaded by {minute.uploader?.full_name || "Unknown"} on{" "}
                              {new Date(minute.uploaded_at).toLocaleDateString()}
                            </CardTitle>
                            <Badge variant={minute.status === "approved" ? "default" : minute.status === "denied" ? "destructive" : "secondary"} className="mt-2">
                              {minute.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex gap-2">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4 text-green-500" /> {voteStats.approve}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsDown className="h-4 w-4 text-red-500" /> {voteStats.deny}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-500" /> {voteStats.discuss}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {minute.minutes_text && (
                          <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">{minute.minutes_text}</div>
                        )}
                        {minute.document_url && (
                          <a href={minute.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            View Document
                          </a>
                        )}

                        {/* Voting Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant={voteStats.userVote?.vote === "approve" ? "default" : "outline"}
                            onClick={() => voteOnMinutes(minute.id, "approve")}
                          >
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant={voteStats.userVote?.vote === "deny" ? "destructive" : "outline"}
                            onClick={() => voteOnMinutes(minute.id, "deny")}
                          >
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            Deny
                          </Button>
                          <Button
                            size="sm"
                            variant={voteStats.userVote?.vote === "discuss" ? "secondary" : "outline"}
                            onClick={() => voteOnMinutes(minute.id, "discuss")}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Discuss
                          </Button>
                        </div>

                        {voteStats.userVote && (
                          <div className="text-sm text-muted-foreground pt-2 border-t">
                            Your vote: <Badge variant="outline">{voteStats.userVote.vote}</Badge>
                            {voteStats.userVote.comment && <p className="mt-1 italic">{voteStats.userVote.comment}</p>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {minutes.length === 0 && <div className="text-center py-4 text-muted-foreground">No minutes uploaded yet</div>}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
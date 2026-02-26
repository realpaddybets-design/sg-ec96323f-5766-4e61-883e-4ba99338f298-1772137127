import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, Bell, LogOut, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { VolunteerOpportunity, VolunteerRSVP, VolunteerAnnouncement, VolunteerProfile } from "@/types/volunteer";

export default function VolunteerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<(VolunteerRSVP & { opportunity: VolunteerOpportunity })[]>([]);
  const [pastEvents, setPastEvents] = useState<(VolunteerRSVP & { opportunity: VolunteerOpportunity })[]>([]);
  const [announcements, setAnnouncements] = useState<VolunteerAnnouncement[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/volunteer/login");
    } else if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      // Get volunteer profile
      const { data: profileData, error: profileError } = await supabase
        .from("volunteer_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error("Profile not found");
      setProfile(profileData);

      // Get RSVPs with opportunity details
      const { data: rsvpData, error: rsvpError } = await supabase
        .from("volunteer_rsvps")
        .select(`
          *,
          opportunity:volunteer_opportunities(*)
        `)
        .eq("volunteer_id", profileData.id);

      if (rsvpError) throw rsvpError;

      const now = new Date();
      const upcoming = (rsvpData || [])
        .filter((rsvp: any) => 
          rsvp.status === "confirmed" && 
          new Date(rsvp.opportunity.event_date) >= now
        )
        .sort((a: any, b: any) => 
          new Date(a.opportunity.event_date).getTime() - new Date(b.opportunity.event_date).getTime()
        );

      const past = (rsvpData || [])
        .filter((rsvp: any) => new Date(rsvp.opportunity.event_date) < now)
        .sort((a: any, b: any) => 
          new Date(b.opportunity.event_date).getTime() - new Date(a.opportunity.event_date).getTime()
        );

      setUpcomingEvents(upcoming as any);
      setPastEvents(past as any);

      // Get announcements
      const { data: announcementData, error: announcementError } = await supabase
        .from("volunteer_announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (announcementError) throw announcementError;
      setAnnouncements(announcementData || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRSVP = async (rsvpId: string) => {
    try {
      const { error } = await supabase
        .from("volunteer_rsvps")
        .update({ 
          status: "cancelled",
          cancellation_date: new Date().toISOString()
        } as any)
        .eq("id", rsvpId);

      if (error) throw error;
      loadDashboardData(); // Reload data
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/volunteer/login");
  };

  const markAnnouncementRead = async (announcementId: string) => {
    if (!profile) return;
    
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement || announcement.read_by.includes(profile.id)) return;

    await supabase
      .from("volunteer_announcements")
      .update({
        read_by: [...announcement.read_by, profile.id]
      } as any)
      .eq("id", announcementId);

    loadDashboardData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Volunteer Dashboard - Kelly's Angels" />
      
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Kelly&apos;s Angels - Volunteer Portal
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {profile?.full_name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {profile?.full_name}</p>
                  <p><strong>Email:</strong> {profile?.email}</p>
                  {profile?.phone && <p><strong>Phone:</strong> {profile?.phone}</p>}
                  <p><strong>Hours Completed:</strong> {profile?.hours_completed || 0}</p>
                  <p><strong>Member Since:</strong> {new Date(profile?.joined_date || "").toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</span>
                    <span className="font-semibold">{upcomingEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Past Events</span>
                    <span className="font-semibold">{pastEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Unread Announcements</span>
                    <span className="font-semibold">
                      {announcements.filter(a => !a.read_by.includes(profile?.id || "")).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {profile?.notify_email ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span>Email notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile?.notify_sms ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span>SMS notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upcoming">
                Upcoming Events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="communications">
                Communications
                {announcements.filter(a => !a.read_by.includes(profile?.id || "")).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {announcements.filter(a => !a.read_by.includes(profile?.id || "")).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="registered">All Registered</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven&apos;t registered for any upcoming events yet.
                    </p>
                    <Button onClick={() => router.push("/volunteer-opportunities")}>
                      Browse Opportunities
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map(({ id, opportunity, notes }) => (
                    <Card key={id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle>{opportunity.title}</CardTitle>
                          <Badge variant="default">Confirmed</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {opportunity.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(opportunity.event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          {opportunity.event_time}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {opportunity.location}
                        </div>
                        {notes && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                            <p className="text-sm"><strong>Your Notes:</strong> {notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelRSVP(id)}
                        >
                          Cancel RSVP
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="communications" className="mt-6">
              {announcements.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No Communications</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No announcements at this time.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => {
                    const isRead = announcement.read_by.includes(profile?.id || "");
                    return (
                      <Card 
                        key={announcement.id}
                        className={!isRead ? "border-pink-200 dark:border-pink-800" : ""}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                {announcement.priority === "urgent" && (
                                  <Badge variant="destructive">Urgent</Badge>
                                )}
                                {!isRead && (
                                  <Badge variant="outline">New</Badge>
                                )}
                              </div>
                              <CardDescription>
                                {new Date(announcement.created_at).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit"
                                })}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{announcement.message}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                            Questions? Email <a href="mailto:volunteers@kellysangels.org" className="text-pink-600 hover:underline">volunteers@kellysangels.org</a>
                          </p>
                        </CardContent>
                        {!isRead && (
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => markAnnouncementRead(announcement.id)}
                            >
                              Mark as Read
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="registered" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...upcomingEvents, ...pastEvents].map(({ id, opportunity, status, notes }) => (
                  <Card key={id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <Badge variant={
                          status === "confirmed" ? "default" :
                          status === "cancelled" ? "destructive" :
                          "secondary"
                        }>
                          {status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(opportunity.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {opportunity.event_time}
                      </div>
                      {notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm">{notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastEvents.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No Past Events</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your event history will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastEvents.map(({ id, opportunity, status }) => (
                    <Card key={id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <Badge variant={
                            status === "attended" ? "default" :
                            status === "cancelled" ? "destructive" :
                            "secondary"
                          }>
                            {status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(opportunity.event_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {opportunity.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
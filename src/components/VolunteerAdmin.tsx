import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Users, Calendar, Bell, Trash2 } from "lucide-react";
import type { VolunteerOpportunity, VolunteerAnnouncement, OpportunityStatus, AnnouncementPriority, TargetGroup } from "@/types/database";

interface VolunteerAdminProps {
  userId: string;
}

export function VolunteerAdmin({ userId }: VolunteerAdminProps) {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [announcements, setAnnouncements] = useState<VolunteerAnnouncement[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Create Opportunity Form
  const [newOppTitle, setNewOppTitle] = useState("");
  const [newOppDescription, setNewOppDescription] = useState("");
  const [newOppDate, setNewOppDate] = useState("");
  const [newOppTime, setNewOppTime] = useState("");
  const [newOppLocation, setNewOppLocation] = useState("");
  const [newOppSpots, setNewOppSpots] = useState("10");
  const [newOppCategory, setNewOppCategory] = useState("");
  const [newOppRequirements, setNewOppRequirements] = useState("");
  const [newOppContact, setNewOppContact] = useState("");

  // Create Announcement Form
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annPriority, setAnnPriority] = useState<AnnouncementPriority>("normal");
  const [annSendEmail, setAnnSendEmail] = useState(true);
  const [annSendSMS, setAnnSendSMS] = useState(false);
  const [annTargetGroup, setAnnTargetGroup] = useState<TargetGroup>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: oppsData } = await (supabase
        .from("volunteer_opportunities") as any)
        .select("*")
        .order("event_date", { ascending: true });

      const { data: annsData } = await (supabase
        .from("volunteer_announcements") as any)
        .select("*")
        .order("created_at", { ascending: false });

      setOpportunities(oppsData || []);
      setAnnouncements(annsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleCreateOpportunity = async () => {
    if (!newOppTitle || !newOppDate || !newOppTime || !newOppLocation) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await (supabase
        .from("volunteer_opportunities") as any)
        .insert({
          title: newOppTitle,
          description: newOppDescription,
          event_date: newOppDate,
          event_time: newOppTime,
          location: newOppLocation,
          total_spots: parseInt(newOppSpots),
          category: newOppCategory,
          requirements: newOppRequirements || null,
          contact_email: newOppContact || null,
          created_by: userId,
          status: "active" as OpportunityStatus,
        });

      if (error) throw error;

      setMessage("Opportunity created successfully!");
      setNewOppTitle("");
      setNewOppDescription("");
      setNewOppDate("");
      setNewOppTime("");
      setNewOppLocation("");
      setNewOppSpots("10");
      setNewOppCategory("");
      setNewOppRequirements("");
      setNewOppContact("");
      loadData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!annTitle || !annMessage) {
      setMessage("Please fill title and message");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await (supabase
        .from("volunteer_announcements") as any)
        .insert({
          title: annTitle,
          message: annMessage,
          priority: annPriority,
          send_email: annSendEmail,
          send_sms: annSendSMS,
          target_group: annTargetGroup,
          created_by: userId,
        });

      if (error) throw error;

      setMessage("Announcement sent successfully!");
      setAnnTitle("");
      setAnnMessage("");
      setAnnPriority("normal");
      setAnnSendEmail(true);
      setAnnSendSMS(false);
      setAnnTargetGroup("all");
      loadData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm("Delete this opportunity?")) return;

    try {
      const { error } = await (supabase
        .from("volunteer_opportunities") as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  const getStatusBadge = (status: OpportunityStatus) => {
    const variants: Record<OpportunityStatus, "default" | "secondary" | "destructive"> = {
      active: "default",
      full: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Tabs defaultValue="opportunities" className="w-full">
      <TabsList>
        <TabsTrigger value="opportunities">
          <Calendar className="w-4 h-4 mr-2" />
          Opportunities
        </TabsTrigger>
        <TabsTrigger value="announcements">
          <Bell className="w-4 h-4 mr-2" />
          Announcements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="opportunities" className="space-y-6">
        {/* Create Opportunity Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Volunteer Opportunity</CardTitle>
            <CardDescription>Add a new volunteer opportunity for members to RSVP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oppTitle">Title *</Label>
                <Input
                  id="oppTitle"
                  value={newOppTitle}
                  onChange={(e) => setNewOppTitle(e.target.value)}
                  placeholder="Community Garden Cleanup"
                />
              </div>
              <div>
                <Label htmlFor="oppCategory">Category</Label>
                <Input
                  id="oppCategory"
                  value={newOppCategory}
                  onChange={(e) => setNewOppCategory(e.target.value)}
                  placeholder="Community Service"
                />
              </div>
              <div>
                <Label htmlFor="oppDate">Date *</Label>
                <Input
                  id="oppDate"
                  type="date"
                  value={newOppDate}
                  onChange={(e) => setNewOppDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="oppTime">Time *</Label>
                <Input
                  id="oppTime"
                  value={newOppTime}
                  onChange={(e) => setNewOppTime(e.target.value)}
                  placeholder="9:00 AM - 12:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="oppLocation">Location *</Label>
                <Input
                  id="oppLocation"
                  value={newOppLocation}
                  onChange={(e) => setNewOppLocation(e.target.value)}
                  placeholder="123 Main St, Albany NY"
                />
              </div>
              <div>
                <Label htmlFor="oppSpots">Total Spots *</Label>
                <Input
                  id="oppSpots"
                  type="number"
                  value={newOppSpots}
                  onChange={(e) => setNewOppSpots(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="oppContact">Contact Email</Label>
                <Input
                  id="oppContact"
                  type="email"
                  value={newOppContact}
                  onChange={(e) => setNewOppContact(e.target.value)}
                  placeholder="volunteers@kellysangels.org"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="oppDescription">Description</Label>
              <Textarea
                id="oppDescription"
                value={newOppDescription}
                onChange={(e) => setNewOppDescription(e.target.value)}
                placeholder="Describe the volunteer opportunity..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="oppRequirements">Requirements</Label>
              <Textarea
                id="oppRequirements"
                value={newOppRequirements}
                onChange={(e) => setNewOppRequirements(e.target.value)}
                placeholder="Any special requirements or skills needed..."
                rows={2}
              />
            </div>
            <Button onClick={handleCreateOpportunity} disabled={loading} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Opportunity
            </Button>
            {message && (
              <p className="text-sm text-center text-blue-600">{message}</p>
            )}
          </CardContent>
        </Card>

        {/* List of Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>All Opportunities ({opportunities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{opp.title}</h3>
                          {getStatusBadge(opp.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(opp.event_date).toLocaleDateString()} • {opp.event_time}
                        </p>
                        <p className="text-sm text-gray-600">{opp.location}</p>
                        <p className="text-sm mt-1">
                          <strong>Spots:</strong> {opp.filled_spots} / {opp.total_spots} filled
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOpportunity(opp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="announcements" className="space-y-6">
        {/* Send Announcement Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Announcement</CardTitle>
            <CardDescription>Notify volunteers via dashboard, email, or SMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="annTitle">Title *</Label>
              <Input
                id="annTitle"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="Important Update"
              />
            </div>
            <div>
              <Label htmlFor="annMessage">Message *</Label>
              <Textarea
                id="annMessage"
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                placeholder="Write your announcement message..."
                rows={5}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annPriority">Priority</Label>
                <Select value={annPriority} onValueChange={(val: AnnouncementPriority) => setAnnPriority(val)}>
                  <SelectTrigger id="annPriority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="annTarget">Target Group</Label>
                <Select value={annTargetGroup} onValueChange={(val: TargetGroup) => setAnnTargetGroup(val)}>
                  <SelectTrigger id="annTarget">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Volunteers</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="specific">Specific Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendEmail"
                  checked={annSendEmail}
                  onCheckedChange={(checked) => setAnnSendEmail(checked as boolean)}
                />
                <Label htmlFor="sendEmail">Send Email Notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendSMS"
                  checked={annSendSMS}
                  onCheckedChange={(checked) => setAnnSendSMS(checked as boolean)}
                />
                <Label htmlFor="sendSMS">Send SMS (for urgent announcements)</Label>
              </div>
            </div>
            <Button onClick={handleSendAnnouncement} disabled={loading} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
            {message && (
              <p className="text-sm text-center text-blue-600">{message}</p>
            )}
          </CardContent>
        </Card>

        {/* Past Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Past Announcements ({announcements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <Card key={ann.id} className={ann.priority === "urgent" ? "border-red-200" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{ann.title}</h3>
                      {ann.priority === "urgent" && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                    <p className="text-sm whitespace-pre-wrap mb-2">{ann.message}</p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{new Date(ann.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span>{ann.read_by.length} read</span>
                      {ann.send_email && <Badge variant="outline" className="text-xs">Email</Badge>}
                      {ann.send_sms && <Badge variant="outline" className="text-xs">SMS</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
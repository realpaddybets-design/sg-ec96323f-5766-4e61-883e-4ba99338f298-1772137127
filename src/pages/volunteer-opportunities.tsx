import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VolunteerOpportunity } from "@/types/volunteer";
import Link from "next/link";

export default function VolunteerOpportunities() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("volunteer_opportunities")
        .select("*")
        .in("status", ["active", "full"])
        .order("event_date", { ascending: true });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = (opportunityId: string) => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        // Redirect to login with return URL
        window.location.href = `/volunteer/login?redirect=/volunteer-opportunities&rsvp=${opportunityId}`;
      } else {
        // Redirect to dashboard to complete RSVP
        window.location.href = `/volunteer/dashboard?rsvp=${opportunityId}`;
      }
    });
  };

  return (
    <>
      <SEO 
        title="Volunteer Opportunities - Kelly's Angels"
        description="Join our team of volunteers and make a difference in the community. View upcoming volunteer opportunities and RSVP today."
      />
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Volunteer Opportunities
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Make a difference in your community. Browse upcoming volunteer opportunities and join our team of dedicated volunteers.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Opportunities Available</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back soon for new volunteer opportunities!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => {
                  const spotsLeft = opportunity.total_spots - opportunity.filled_spots;
                  const isFull = opportunity.status === "full";

                  return (
                    <Card key={opportunity.id} className="flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                          {isFull ? (
                            <Badge variant="destructive">Full</Badge>
                          ) : spotsLeft <= 3 ? (
                            <Badge variant="secondary">{spotsLeft} spots left</Badge>
                          ) : (
                            <Badge variant="default">{spotsLeft} spots</Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {opportunity.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-grow space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(opportunity.event_date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {opportunity.event_time}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          {opportunity.location}
                        </div>

                        <Badge variant="outline" className="mt-2">
                          {opportunity.category}
                        </Badge>
                      </CardContent>

                      <CardFooter>
                        <Button 
                          onClick={() => handleRSVP(opportunity.id)}
                          disabled={isFull}
                          className="w-full"
                          variant={isFull ? "secondary" : "default"}
                        >
                          {isFull ? "Event Full" : "RSVP Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <Card className="inline-block">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Already a Volunteer?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    View your upcoming events and manage your RSVPs
                  </p>
                  <Link href="/volunteer/dashboard">
                    <Button variant="outline">Go to Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
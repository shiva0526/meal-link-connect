import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Package, Calendar, History, MapPin, LogOut, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleEventDialog } from "@/components/ScheduleEventDialog";
import { format } from "date-fns";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donorName] = useState("John Doe");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const loadEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("events")
      .select(`
        *,
        orphanages (name)
      `)
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold text-foreground">MealLink</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {donorName}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Donor Dashboard</h1>
          <p className="text-muted-foreground">Manage your donations and make a difference</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/donate")}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>Donate food, clothes, furniture, or money to orphanages in need</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Donating</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setScheduleDialogOpen(true)}>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Schedule Event</CardTitle>
              <CardDescription>Organize birthday parties, anniversaries, or special celebrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Schedule Event</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Find Orphanages</CardTitle>
              <CardDescription>View orphanages on map and connect with those nearby</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Map</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-2">
                <History className="w-6 h-6 text-warning" />
              </div>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Track your past donations and their impact</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View History</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Events</CardTitle>
            <CardDescription>Your upcoming and past events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No events scheduled yet</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">{event.event_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.orphanages?.name} - {format(new Date(event.event_date), "PPP")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.status)}
                      <span className="text-sm text-muted-foreground">{getStatusText(event.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ScheduleEventDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        onEventScheduled={loadEvents}
      />
    </div>
  );
};

export default DonorDashboard;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, LogOut, Users, Settings, BarChart3, CheckCircle, XCircle, Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Admin User");
  const [donations, setDonations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const loadDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    if (data) setDonations(data);
  };

  const loadEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select(`
        *,
        orphanages (name),
        profiles (full_name)
      `)
      .order("event_date", { ascending: true });
    
    if (data) setEvents(data);
  };

  useEffect(() => {
    loadDonations();
    loadEvents();
  }, []);

  const handleApproveDonation = async (id: string) => {
    const { error } = await supabase
      .from("donations")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve donation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Donation approved successfully",
      });
      loadDonations();
    }
  };

  const handleRejectDonation = async (id: string) => {
    const { error } = await supabase
      .from("donations")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject donation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Donation rejected",
      });
      loadDonations();
    }
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
            <span className="text-muted-foreground">Welcome, {adminName}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, donations, and system operations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast({
            title: "User Management",
            description: "View and manage all registered users",
          })}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View All Users</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast({
            title: "Donation Analytics",
            description: "View detailed reports and statistics",
          })}>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Donation Analytics</CardTitle>
              <CardDescription>View reports and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast({
            title: "System Settings",
            description: "Configure platform preferences",
          })}>
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Open Settings</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Donation Requests</CardTitle>
            <CardDescription>Approve or manage donation requests</CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending donation requests</p>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{donation.donation_type} Donation</p>
                          <p className="text-sm text-muted-foreground">
                            {donation.quantity && `Quantity: ${donation.quantity}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => handleApproveDonation(donation.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRejectDonation(donation.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>Monitor all scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No events scheduled</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.event_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.orphanages?.name || "Unknown Orphanage"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By {event.profiles?.full_name || "Unknown Donor"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(event.event_date), "PPP")}</p>
                        <p className="text-sm text-muted-foreground capitalize">{event.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;

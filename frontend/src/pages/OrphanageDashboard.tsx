import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Package, LogOut, Calendar, CheckCircle, XCircle, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const OrphanageDashboard = () => {
  const navigate = useNavigate();
  const [orphanageName] = useState("Hope Children's Home");
  const [donations, setDonations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const loadDonations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: orphanageData } = await supabase
      .from("orphanages")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (orphanageData) {
      const { data } = await supabase
        .from("donations")
        .select("*")
        .eq("orphanage_id", orphanageData.id)
        .eq("status", "pending");
      
      if (data) setDonations(data);
    }
  };

  const loadEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: orphanageData } = await supabase
      .from("orphanages")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (orphanageData) {
      const { data } = await supabase
        .from("events")
        .select(`
          *,
          profiles (full_name)
        `)
        .eq("orphanage_id", orphanageData.id)
        .eq("status", "pending")
        .order("event_date", { ascending: true });
      
      if (data) setEvents(data);
    }
  };

  useEffect(() => {
    loadDonations();
    loadEvents();
  }, []);

  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from("donations")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept donation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Donation accepted successfully",
      });
      loadDonations();
    }
  };

  const handleDecline = async (id: string) => {
    const { error } = await supabase
      .from("donations")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to decline donation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Donation declined",
      });
      loadDonations();
    }
  };

  const handleApproveEvent = async (id: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve event",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Event approved successfully",
      });
      loadEvents();
    }
  };

  const handleRejectEvent = async (id: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject event",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Event rejected",
      });
      loadEvents();
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
            <span className="text-muted-foreground">{orphanageName}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Orphanage Dashboard</h1>
          <p className="text-muted-foreground">Manage donations and update your requirements</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Donation Requests</CardTitle>
            <CardDescription>Review and accept donations from donors</CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending donation requests</p>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.donation_type} Donation</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.quantity && `Quantity: ${donation.quantity}`}
                          {donation.delivery_method && ` • ${donation.delivery_method}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => handleAccept(donation.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDecline(donation.id)}>
                        <XCircle className="w-4 h-4 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Requests</CardTitle>
              <CardDescription>Pending event requests from donors</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending event requests</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium">{event.event_type}</p>
                            <p className="text-sm text-muted-foreground">
                              By {event.profiles?.full_name || "Donor"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-3 ml-13">
                        <p className="text-sm">
                          <span className="font-medium">Date:</span> {format(new Date(event.event_date), "PPP")}
                        </p>
                        {event.description && (
                          <p className="text-sm">
                            <span className="font-medium">Details:</span> {event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-13">
                        <Button
                          size="sm"
                          onClick={() => handleApproveEvent(event.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectEvent(event.id)}
                          className="flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Requirements</CardTitle>
              <CardDescription>Update your needs for donors to see</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Daily Food Packets</span>
                  <span className="font-semibold">45 needed</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Winter Clothing</span>
                  <span className="font-semibold">Urgent</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>School Supplies</span>
                  <span className="font-semibold">30 sets</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Requirements editor will be available soon",
                })}
              >
                <Edit className="w-4 h-4 mr-2" /> Update Requirements
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrphanageDashboard;

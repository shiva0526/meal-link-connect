import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ScheduleEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventScheduled: () => void;
}

export const ScheduleEventDialog = ({ open, onOpenChange, onEventScheduled }: ScheduleEventDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");
  const [orphanageId, setOrphanageId] = useState("");
  const [orphanages, setOrphanages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrphanages = async () => {
    const { data } = await supabase
      .from("orphanages")
      .select("id, name")
      .eq("approved", true);
    if (data) setOrphanages(data);
  };

  const handleSubmit = async () => {
    if (!date || !eventType || !orphanageId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to schedule events",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("events").insert({
      donor_id: user.id,
      orphanage_id: orphanageId,
      event_type: eventType,
      event_date: date.toISOString(),
      description: description || null,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to schedule event",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Event scheduled successfully!",
      });
      setDate(undefined);
      setEventType("");
      setDescription("");
      setOrphanageId("");
      onEventScheduled();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isOpen) loadOrphanages();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Event</DialogTitle>
          <DialogDescription>
            Organize a celebration with an orphanage
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Event Type *</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Birthday">Birthday Party</SelectItem>
                <SelectItem value="Anniversary">Anniversary</SelectItem>
                <SelectItem value="Festival">Festival Celebration</SelectItem>
                <SelectItem value="Sports Day">Sports Day</SelectItem>
                <SelectItem value="Educational">Educational Event</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Orphanage *</Label>
            <Select value={orphanageId} onValueChange={setOrphanageId}>
              <SelectTrigger>
                <SelectValue placeholder="Select orphanage" />
              </SelectTrigger>
              <SelectContent>
                {orphanages.map((orphanage) => (
                  <SelectItem key={orphanage.id} value={orphanage.id}>
                    {orphanage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Event Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Add any special requests or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Scheduling..." : "Schedule Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

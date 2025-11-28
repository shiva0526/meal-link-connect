import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // State for form inputs
  const [userType, setUserType] = useState<string>("donor");
  const [contact, setContact] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when switching tabs
  const onTabChange = (value: string) => {
    setActiveTab(value);
    setIsOtpSent(false);
    setOtp("");
    // Optional: keep contact if user switches tabs
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);

    try {
      const data = await authApi.requestOtp(contact);
      setIsOtpSent(true);
      toast.success("OTP sent successfully!");

      // For Development: Display OTP in console/toast
      if (data.debug_otp) {
        console.log("%c DEV OTP: " + data.debug_otp, "background: #222; color: #bada55; font-size: 20px");
        toast.info(`Dev Mode OTP: ${data.debug_otp}`);
      }
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      const msg = error.response?.data?.detail || "Failed to send OTP. Is backend running?";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only pass name and role if we are in the signup tab
      const isSignup = activeTab === "signup";

      const data = await authApi.verifyOtp(
        contact,
        otp,
        isSignup ? userType : undefined,
        isSignup ? fullName : undefined
      );

      // Store Token
      localStorage.setItem("access_token", data.access_token);
      toast.success("Authentication successful!");

      // Route based on User Type (or verify from backend response in future)
      const routes: Record<string, string> = {
        donor: "/donor-dashboard",
        orphanage: "/orphanage-dashboard",
        volunteer: "/volunteer-dashboard",
        admin: "/admin-dashboard"
      };

      // Default to donor dashboard if type is unknown or login
      const targetRoute = isSignup ? routes[userType] : "/donor-dashboard";
      navigate(targetRoute);

    } catch (error: any) {
      console.error("Verify Error:", error);
      toast.error(error.response?.data?.detail || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <span className="text-3xl font-bold text-foreground">MealLink</span>
          </div>
          <p className="text-muted-foreground">Sign in to continue connecting hearts.</p>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your phone to receive an OTP</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={contact}
                      disabled={isOtpSent}
                      onChange={(e) => setContact(e.target.value)}
                      required
                    />
                  </div>

                  {isOtpSent && (
                    <div className="space-y-2">
                      <Label>Enter OTP</Label>
                      <Input
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : (isOtpSent ? "Verify & Login" : "Send OTP")}
                  </Button>

                  {isOtpSent && (
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setIsOtpSent(false)}>
                      Change Phone Number
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join our community today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <Select value={userType} onValueChange={setUserType} disabled={isOtpSent}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="orphanage">Orphanage Representative</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={fullName}
                      disabled={isOtpSent}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={contact}
                      disabled={isOtpSent}
                      onChange={(e) => setContact(e.target.value)}
                      required
                    />
                  </div>

                  {isOtpSent && (
                    <div className="space-y-2">
                      <Label>Enter OTP</Label>
                      <Input
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : (isOtpSent ? "Verify & Sign Up" : "Send OTP")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
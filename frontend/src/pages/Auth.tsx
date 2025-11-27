import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Mail, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth"; // <--- IMPORT THE NEW API FILE

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("phone");
  const [userType, setUserType] = useState<"donor" | "orphanage" | "volunteer" | "admin">("donor");
  
  const [contact, setContact] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLER: SEND OTP ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the clean API function
      const data = await authApi.requestOtp(contact);
      
      setIsOtpSent(true);
      toast.success("OTP sent successfully!");
      
      // Debug check for dev mode
      if (data.debug_otp) {
        console.log("Dev OTP:", data.debug_otp);
        toast.info(`Dev OTP: ${data.debug_otp}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER: VERIFY OTP ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the clean API function
      const data = await authApi.verifyOtp(
        contact, 
        otp, 
        userType, 
        activeTab === "signup" ? fullName : undefined
      );

      localStorage.setItem("access_token", data.access_token);
      toast.success("Login successful!");
      
      const routes = {
        donor: "/donor-dashboard",
        orphanage: "/orphanage-dashboard",
        volunteer: "/volunteer-dashboard",
        admin: "/admin-dashboard"
      };
      navigate(routes[userType]);

    } catch (error: any) {
      console.error(error);
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
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your phone to login</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <Input
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify & Login"}
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setIsOtpSent(false)}>
                        Change Number
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Register as a new user</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>I am a</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">Donor</SelectItem>
                            <SelectItem value="orphanage">Orphanage</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="Your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input type="tel" placeholder="9876543210" value={contact} onChange={(e) => setContact(e.target.value)} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify & Sign Up"}
                      </Button>
                    </>
                  )}
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
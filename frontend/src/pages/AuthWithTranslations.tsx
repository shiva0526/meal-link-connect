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
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { authApi } from "@/api/auth";

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("login");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("phone");
  const [userType, setUserType] = useState<"donor" | "orphanage" | "volunteer" | "admin">("donor");
  const [contact, setContact] = useState("");
  const [fullName, setFullName] = useState(""); // Add fullName state
  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSendOtp called", { contact, contactMethod });
    if (contact.length < 10 && contactMethod === "phone") {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);

    try {
      // Currently backend only supports phone. If email is selected, we might need to handle it or just send phone for now.
      // The backend expects 'phone'.
      // If user selected email, we should probably warn them or update backend. 
      // For now, assuming phone auth as primary based on backend code.
      const isLogin = activeTab === "login";
      const data = await authApi.requestOtp(contact, isLogin);
      setIsOtpSent(true);
      toast.success(`OTP sent to your ${contactMethod}`);

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
      // For signup, we need to pass role and name.
      // The current UI has 'userType' and 'fullName' in signup tab.
      // But 'AuthWithTranslations' structure is a bit different (tabs wrap the form).
      // We need to know if we are in login or signup mode.
      // The Tabs component controls visibility, but we don't have state for active tab here easily unless we control it.
      // However, the form is inside the tab content.
      // Wait, the state `userType` is only visible in signup tab.
      // Let's assume if `userType` is set and we are submitting, we might be signing up?
      // Actually, `handleVerifyOtp` is called for both.
      // We need to know which tab is active to decide if we send role/name.
      // Let's add state for activeTab.

      const data = await authApi.verifyOtp(
        contact,
        otp,
        userType,
        activeTab === "signup" ? fullName : undefined,
        activeTab === "signup" && userType === "orphanage" ? { name: orgName, address: orgAddress } : undefined
      );

      localStorage.setItem("access_token", data.access_token);
      toast.success("Login successful!");

      const routes: Record<string, string> = {
        donor: "/donor-dashboard",
        orphanage: "/orphanage-dashboard",
        volunteer: "/volunteer-dashboard",
        admin: "/admin-dashboard"
      };
      // Default to donor if unknown
      navigate(routes[userType] || "/donor-dashboard");

    } catch (error: any) {
      console.error("Verify Error:", error);
      if (error.response?.status === 403) {
        toast.warning(error.response.data.detail || "Account pending approval.");
        // Optionally navigate to home or stay on page
      } else {
        toast.error(error.response?.data?.detail || "Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" /> {t('auth.backToHome')}
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <span className="text-3xl font-bold text-foreground">{t('app.name')}</span>
          </div>
          <p className="text-muted-foreground">{t('auth.signIn')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.welcomeBack')}</CardTitle>
                <CardDescription>{t('auth.welcomeDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.iAmA')}</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">{t('auth.donor')}</SelectItem>
                            <SelectItem value="orphanage">{t('auth.orphanage')}</SelectItem>
                            <SelectItem value="volunteer">{t('auth.volunteer')}</SelectItem>
                            <SelectItem value="admin">{t('auth.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('auth.contactMethod')}</Label>
                        <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4" /> {t('auth.email')}
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center">
                                <Phone className="mr-2 w-4 h-4" /> {t('auth.phone')}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{contactMethod === "email" ? t('auth.emailAddress') : t('auth.phoneNumber')}</Label>
                        <Input
                          type={contactMethod === "email" ? "email" : "tel"}
                          placeholder={contactMethod === "email" ? "your@email.com" : "+91 1234567890"}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : t('auth.sendOtp')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.enterOtp')}</Label>
                        <Input
                          type="text"
                          placeholder={t('auth.otpPlaceholder')}
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          {t('auth.otpSentTo')} {contact}
                        </p>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : t('auth.verifyLogin')}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOtpSent(false)}
                      >
                        {t('auth.changeContact')}
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
                <CardTitle>{t('auth.createAccount')}</CardTitle>
                <CardDescription>{t('auth.createAccountDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!isOtpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.iAmA')}</Label>
                        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donor">{t('auth.donor')}</SelectItem>
                            <SelectItem value="orphanage">{t('auth.orphanageApproval')}</SelectItem>
                            <SelectItem value="volunteer">{t('auth.volunteer')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('auth.fullName')}</Label>
                        <Input
                          type="text"
                          placeholder={t('auth.namePlaceholder')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>

                      {userType === "orphanage" && (
                        <>
                          <div className="space-y-2">
                            <Label>Orphanage Name</Label>
                            <Input
                              type="text"
                              placeholder="Name of the Orphanage"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                              type="text"
                              placeholder="Full Address"
                              value={orgAddress}
                              onChange={(e) => setOrgAddress(e.target.value)}
                              required
                            />
                          </div>
                        </>
                      )}

                      {userType === "donor" && (
                        <div className="space-y-2">
                          <Label>{t('auth.aadhaar')}</Label>
                          <Input
                            type="text"
                            placeholder={t('auth.aadhaarPlaceholder')}
                            maxLength={12}
                            pattern="[0-9]{12}"
                            required
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>{t('auth.contactMethod')}</Label>
                        <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="mr-2 w-4 h-4" /> {t('auth.email')}
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center">
                                <Phone className="mr-2 w-4 h-4" /> {t('auth.phone')}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{contactMethod === "email" ? t('auth.emailAddress') : t('auth.phoneNumber')}</Label>
                        <Input
                          type={contactMethod === "email" ? "email" : "tel"}
                          placeholder={contactMethod === "email" ? "your@email.com" : "+91 1234567890"}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : t('auth.sendOtp')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>{t('auth.enterOtp')}</Label>
                        <Input
                          type="text"
                          placeholder={t('auth.otpPlaceholder')}
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          {t('auth.otpSentTo')} {contact}
                        </p>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : t('auth.verifySignup')}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOtpSent(false)}
                      >
                        {t('auth.changeDetails')}
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

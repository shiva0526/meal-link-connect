import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'kn' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing Page
    'app.name': 'MealLink',
    'landing.hero.title': 'Connecting Hearts,',
    'landing.hero.subtitle': 'Nourishing Lives',
    'landing.hero.description': 'MealLink bridges the gap between food waste and hunger by connecting donors with orphanages and volunteers to create a sustainable support system.',
    'landing.cta.donor': 'Join as Donor',
    'landing.cta.orphanage': 'Register Orphanage',
    'landing.getStarted': 'Get Started',
    'landing.features.title': 'How MealLink Works',
    'landing.features.subtitle': 'Simple steps to make a difference',
    'landing.feature1.title': 'Donate Food & Items',
    'landing.feature1.desc': 'Share food, clothing, furniture, and monetary donations with orphanages in need.',
    'landing.feature2.title': 'Connect Communities',
    'landing.feature2.desc': 'Bridge the gap between donors, orphanages, and volunteers in your area.',
    'landing.feature3.title': 'Make an Impact',
    'landing.feature3.desc': 'Track your donations and see the direct impact of your generosity.',
    'landing.feature4.title': 'Schedule Events',
    'landing.feature4.desc': 'Organize special celebrations and events with orphanages.',
    'landing.users.title': 'Who Can Join?',
    'landing.users.subtitle': 'Everyone has a role in reducing food waste',
    'landing.users.donors.title': 'Donors',
    'landing.users.donors.desc': 'Individuals or organizations wanting to donate food, clothes, furniture, or funds to support orphanages.',
    'landing.users.orphanages.title': 'Orphanages',
    'landing.users.orphanages.desc': 'Organizations caring for children and seeking support from the community for their daily needs.',
    'landing.users.admin.title': 'Admin',
    'landing.users.admin.desc': 'Oversee operations and manage the platform',
    'landing.cta.final.title': 'Ready to Make a Difference?',
    'landing.cta.final.desc': 'Join thousands of donors, volunteers, and orphanages working together to end food waste and hunger.',
    'landing.cta.final.button': 'Get Started Today',
    'landing.footer': '2025 MealLink. Reducing food waste, nourishing lives.',
    
    // Auth Page
    'auth.backToHome': 'Back to Home',
    'auth.signIn': 'Sign in to continue',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.welcomeBack': 'Welcome Back',
    'auth.welcomeDesc': 'Enter your details to access your account',
    'auth.createAccount': 'Create Account',
    'auth.createAccountDesc': 'Register to start making a difference',
    'auth.iAmA': 'I am a',
    'auth.donor': 'Donor',
    'auth.orphanage': 'Orphanage',
    'auth.orphanageApproval': 'Orphanage (Requires Admin Approval)',
    'auth.volunteer': 'Volunteer',
    'auth.admin': 'Admin',
    'auth.contactMethod': 'Contact Method',
    'auth.email': 'Email',
    'auth.phone': 'Phone',
    'auth.emailAddress': 'Email Address',
    'auth.phoneNumber': 'Phone Number',
    'auth.sendOtp': 'Send OTP',
    'auth.enterOtp': 'Enter OTP',
    'auth.otpPlaceholder': 'Enter 6-digit OTP',
    'auth.otpSentTo': 'OTP sent to',
    'auth.verifyLogin': 'Verify & Login',
    'auth.verifySignup': 'Verify & Sign Up',
    'auth.changeContact': 'Change Contact',
    'auth.changeDetails': 'Change Details',
    'auth.fullName': 'Full Name / Organization Name',
    'auth.namePlaceholder': 'Enter your name',
    'auth.aadhaar': 'Aadhaar Number',
    'auth.aadhaarPlaceholder': 'Enter 12-digit Aadhaar number',
  },
  kn: {
    // Landing Page
    'app.name': 'ಮೀಲ್‌ಲಿಂಕ್',
    'landing.hero.title': 'ಹೃದಯಗಳನ್ನು ಸಂಪರ್ಕಿಸುವುದು,',
    'landing.hero.subtitle': 'ಜೀವನವನ್ನು ಪೋಷಿಸುವುದು',
    'landing.hero.description': 'ಮೀಲ್‌ಲಿಂಕ್ ಆಹಾರ ವ್ಯರ್ಥ ಮತ್ತು ಹಸಿವಿನ ನಡುವಿನ ಅಂತರವನ್ನು ತುಂಬುತ್ತದೆ, ದಾನಿಗಳನ್ನು ಅನಾಥಾಶ್ರಮಗಳು ಮತ್ತು ಸ್ವಯಂಸೇವಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ಮೂಲಕ ಸುಸ್ಥಿರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆಯನ್ನು ರಚಿಸುತ್ತದೆ.',
    'landing.cta.donor': 'ದಾನಿಯಾಗಿ ಸೇರಿ',
    'landing.cta.orphanage': 'ಅನಾಥಾಶ್ರಮವನ್ನು ನೋಂದಾಯಿಸಿ',
    'landing.getStarted': 'ಪ್ರಾರಂಭಿಸಿ',
    'landing.features.title': 'ಮೀಲ್‌ಲಿಂಕ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    'landing.features.subtitle': 'ವ್ಯತ್ಯಾಸವನ್ನು ಮಾಡಲು ಸರಳ ಹಂತಗಳು',
    'landing.feature1.title': 'ಆಹಾರ ಮತ್ತು ವಸ್ತುಗಳನ್ನು ದಾನ ಮಾಡಿ',
    'landing.feature1.desc': 'ಅಗತ್ಯವಿರುವ ಅನಾಥಾಶ್ರಮಗಳೊಂದಿಗೆ ಆಹಾರ, ಬಟ್ಟೆ, ಪೀಠೋಪಕರಣಗಳು ಮತ್ತು ಹಣಕಾಸಿನ ದೇಣಿಗೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    'landing.feature2.title': 'ಸಮುದಾಯಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ',
    'landing.feature2.desc': 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ದಾನಿಗಳು, ಅನಾಥಾಶ್ರಮಗಳು ಮತ್ತು ಸ್ವಯಂಸೇವಕರ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡಿ.',
    'landing.feature3.title': 'ಪ್ರಭಾವ ಬೀರಿ',
    'landing.feature3.desc': 'ನಿಮ್ಮ ದೇಣಿಗೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಉದಾರತೆಯ ನೇರ ಪರಿಣಾಮವನ್ನು ನೋಡಿ.',
    'landing.feature4.title': 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ನಿಗದಿಪಡಿಸಿ',
    'landing.feature4.desc': 'ಅನಾಥಾಶ್ರಮಗಳೊಂದಿಗೆ ವಿಶೇಷ ಆಚರಣೆಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಆಯೋಜಿಸಿ.',
    'landing.users.title': 'ಯಾರು ಸೇರಬಹುದು?',
    'landing.users.subtitle': 'ಆಹಾರ ವ್ಯರ್ಥವನ್ನು ಕಡಿಮೆ ಮಾಡುವಲ್ಲಿ ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಪಾತ್ರವಿದೆ',
    'landing.users.donors.title': 'ದಾನಿಗಳು',
    'landing.users.donors.desc': 'ಅನಾಥಾಶ್ರಮಗಳನ್ನು ಬೆಂಬಲಿಸಲು ಆಹಾರ, ಬಟ್ಟೆ, ಪೀಠೋಪಕರಣಗಳು ಅಥವಾ ಹಣವನ್ನು ದಾನ ಮಾಡಲು ಬಯಸುವ ವ್ಯಕ್ತಿಗಳು ಅಥವಾ ಸಂಸ್ಥೆಗಳು.',
    'landing.users.orphanages.title': 'ಅನಾಥಾಶ್ರಮಗಳು',
    'landing.users.orphanages.desc': 'ಮಕ್ಕಳನ್ನು ನೋಡಿಕೊಳ್ಳುವ ಮತ್ತು ತಮ್ಮ ದೈನಂದಿನ ಅಗತ್ಯಗಳಿಗಾಗಿ ಸಮುದಾಯದಿಂದ ಬೆಂಬಲವನ್ನು ಬಯಸುವ ಸಂಸ್ಥೆಗಳು.',
    'landing.users.admin.title': 'ನಿರ್ವಾಹಕ',
    'landing.users.admin.desc': 'ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ವೇದಿಕೆಯನ್ನು ನಿರ್ವಹಿಸಿ',
    'landing.cta.final.title': 'ವ್ಯತ್ಯಾಸವನ್ನು ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
    'landing.cta.final.desc': 'ಆಹಾರ ವ್ಯರ್ಥ ಮತ್ತು ಹಸಿವನ್ನು ಕೊನೆಗೊಳಿಸಲು ಒಟ್ಟಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿರುವ ಸಾವಿರಾರು ದಾನಿಗಳು, ಸ್ವಯಂಸೇವಕರು ಮತ್ತು ಅನಾಥಾಶ್ರಮಗಳನ್ನು ಸೇರಿ.',
    'landing.cta.final.button': 'ಇಂದೇ ಪ್ರಾರಂಭಿಸಿ',
    'landing.footer': '2025 ಮೀಲ್‌ಲಿಂಕ್. ಆಹಾರ ವ್ಯರ್ಥವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು, ಜೀವನವನ್ನು ಪೋಷಿಸುವುದು.',
    
    // Auth Page
    'auth.backToHome': 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
    'auth.signIn': 'ಮುಂದುವರಿಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
    'auth.login': 'ಲಾಗಿನ್',
    'auth.signup': 'ಸೈನ್ ಅಪ್',
    'auth.welcomeBack': 'ಮರಳಿ ಸ್ವಾಗತ',
    'auth.welcomeDesc': 'ನಿಮ್ಮ ಖಾತೆಗೆ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    'auth.createAccount': 'ಖಾತೆ ರಚಿಸಿ',
    'auth.createAccountDesc': 'ವ್ಯತ್ಯಾಸವನ್ನು ಮಾಡಲು ನೋಂದಾಯಿಸಿ',
    'auth.iAmA': 'ನಾನು ಒಬ್ಬ',
    'auth.donor': 'ದಾನಿ',
    'auth.orphanage': 'ಅನಾಥಾಶ್ರಮ',
    'auth.orphanageApproval': 'ಅನಾಥಾಶ್ರಮ (ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆ)',
    'auth.volunteer': 'ಸ್ವಯಂಸೇವಕ',
    'auth.admin': 'ನಿರ್ವಾಹಕ',
    'auth.contactMethod': 'ಸಂಪರ್ಕ ವಿಧಾನ',
    'auth.email': 'ಇಮೇಲ್',
    'auth.phone': 'ಫೋನ್',
    'auth.emailAddress': 'ಇಮೇಲ್ ವಿಳಾಸ',
    'auth.phoneNumber': 'ಫೋನ್ ಸಂಖ್ಯೆ',
    'auth.sendOtp': 'OTP ಕಳುಹಿಸಿ',
    'auth.enterOtp': 'OTP ನಮೂದಿಸಿ',
    'auth.otpPlaceholder': '6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ',
    'auth.otpSentTo': 'OTP ಇಲ್ಲಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    'auth.verifyLogin': 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್',
    'auth.verifySignup': 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸೈನ್ ಅಪ್',
    'auth.changeContact': 'ಸಂಪರ್ಕವನ್ನು ಬದಲಾಯಿಸಿ',
    'auth.changeDetails': 'ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ',
    'auth.fullName': 'ಪೂರ್ಣ ಹೆಸರು / ಸಂಸ್ಥೆಯ ಹೆಸರು',
    'auth.namePlaceholder': 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    'auth.aadhaar': 'ಆಧಾರ್ ಸಂಖ್ಯೆ',
    'auth.aadhaarPlaceholder': '12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
  },
  hi: {
    // Landing Page
    'app.name': 'मीललिंक',
    'landing.hero.title': 'दिलों को जोड़ना,',
    'landing.hero.subtitle': 'जीवन को पोषण देना',
    'landing.hero.description': 'मीललिंक खाद्य बर्बादी और भूख के बीच की खाई को पाटता है, दाताओं को अनाथालयों और स्वयंसेवकों के साथ जोड़कर एक स्थायी समर्थन प्रणाली बनाता है।',
    'landing.cta.donor': 'दाता के रूप में शामिल हों',
    'landing.cta.orphanage': 'अनाथालय पंजीकृत करें',
    'landing.getStarted': 'शुरू करें',
    'landing.features.title': 'मीललिंक कैसे काम करता है',
    'landing.features.subtitle': 'बदलाव लाने के लिए सरल कदम',
    'landing.feature1.title': 'भोजन और वस्तुएं दान करें',
    'landing.feature1.desc': 'जरूरतमंद अनाथालयों के साथ भोजन, कपड़े, फर्नीचर और मौद्रिक दान साझा करें।',
    'landing.feature2.title': 'समुदायों को जोड़ें',
    'landing.feature2.desc': 'अपने क्षेत्र में दाताओं, अनाथालयों और स्वयंसेवकों के बीच की खाई को पाटें।',
    'landing.feature3.title': 'प्रभाव डालें',
    'landing.feature3.desc': 'अपने दान को ट्रैक करें और अपनी उदारता के प्रत्यक्ष प्रभाव को देखें।',
    'landing.feature4.title': 'कार्यक्रम निर्धारित करें',
    'landing.feature4.desc': 'अनाथालयों के साथ विशेष समारोह और कार्यक्रम आयोजित करें।',
    'landing.users.title': 'कौन शामिल हो सकता है?',
    'landing.users.subtitle': 'खाद्य बर्बादी को कम करने में सभी की भूमिका है',
    'landing.users.donors.title': 'दाता',
    'landing.users.donors.desc': 'अनाथालयों का समर्थन करने के लिए भोजन, कपड़े, फर्नीचर या धन दान करने के इच्छुक व्यक्ति या संगठन।',
    'landing.users.orphanages.title': 'अनाथालय',
    'landing.users.orphanages.desc': 'बच्चों की देखभाल करने वाले और अपनी दैनिक जरूरतों के लिए समुदाय से समर्थन मांगने वाले संगठन।',
    'landing.users.admin.title': 'प्रशासक',
    'landing.users.admin.desc': 'संचालन की देखरेख करें और प्लेटफ़ॉर्म प्रबंधित करें',
    'landing.cta.final.title': 'बदलाव लाने के लिए तैयार हैं?',
    'landing.cta.final.desc': 'खाद्य बर्बादी और भूख को समाप्त करने के लिए मिलकर काम कर रहे हजारों दाताओं, स्वयंसेवकों और अनाथालयों में शामिल हों।',
    'landing.cta.final.button': 'आज ही शुरू करें',
    'landing.footer': '2025 मीललिंक। खाद्य बर्बादी को कम करना, जीवन को पोषण देना।',
    
    // Auth Page
    'auth.backToHome': 'होम पर वापस जाएं',
    'auth.signIn': 'जारी रखने के लिए साइन इन करें',
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.welcomeBack': 'वापस स्वागत है',
    'auth.welcomeDesc': 'अपने खाते तक पहुंचने के लिए अपना विवरण दर्ज करें',
    'auth.createAccount': 'खाता बनाएं',
    'auth.createAccountDesc': 'बदलाव लाने के लिए पंजीकरण करें',
    'auth.iAmA': 'मैं एक हूं',
    'auth.donor': 'दाता',
    'auth.orphanage': 'अनाथालय',
    'auth.orphanageApproval': 'अनाथालय (व्यवस्थापक अनुमोदन आवश्यक)',
    'auth.volunteer': 'स्वयंसेवक',
    'auth.admin': 'व्यवस्थापक',
    'auth.contactMethod': 'संपर्क विधि',
    'auth.email': 'ईमेल',
    'auth.phone': 'फोन',
    'auth.emailAddress': 'ईमेल पता',
    'auth.phoneNumber': 'फोन नंबर',
    'auth.sendOtp': 'OTP भेजें',
    'auth.enterOtp': 'OTP दर्ज करें',
    'auth.otpPlaceholder': '6-अंकीय OTP दर्ज करें',
    'auth.otpSentTo': 'OTP यहां भेजा गया',
    'auth.verifyLogin': 'सत्यापित करें और लॉगिन करें',
    'auth.verifySignup': 'सत्यापित करें और साइन अप करें',
    'auth.changeContact': 'संपर्क बदलें',
    'auth.changeDetails': 'विवरण बदलें',
    'auth.fullName': 'पूरा नाम / संगठन का नाम',
    'auth.namePlaceholder': 'अपना नाम दर्ज करें',
    'auth.aadhaar': 'आधार नंबर',
    'auth.aadhaarPlaceholder': '12-अंकीय आधार नंबर दर्ज करें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

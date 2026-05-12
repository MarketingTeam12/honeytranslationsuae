import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// test update
type Language = 'EN' | 'AR';
const LANGUAGE_STORAGE_KEY = 'language';

const isLanguage = (value: string | null): value is Language => value === 'EN' || value === 'AR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(saved) ? saved : 'EN';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language === 'AR' ? 'ar-AE' : 'en-AE';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    const translations = language === 'AR' ? translationsAR : translationsEN;
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    if (value) return value;

    if (language === 'AR' && /[A-Za-zÀ-ÿ]/.test(key)) {
      const fallback: Record<string, string> = {
        'Thank you! We will contact you soon.': 'شكرا لك! سنتواصل معك قريبا.',
        'Thank you! We will contact you within 24 hours.': 'شكرا لك! سنتواصل معك خلال 24 ساعة.',
        'Language Worldwide': 'اللغات حول العالم',
        'traductions précises et culturellement adaptées': 'ترجمات دقيقة ومتكيفة ثقافيا'
      };

      return fallback[key] || 'خدمات ترجمة عربية معتمدة في الإمارات';
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const translationsEN = {
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    blog: 'Blog',
    getQuote: 'Get Quote'
  },
  about: {
    ceo: 'CEO',
    aboutUs: 'About Us',
    service: 'Service',
    joinUs: 'Join Us',
    missionVision: 'Mission and Vision',
    refundPolicy: 'Refund and Cancellation policy',
    ourTeam: 'Our Team',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    terms: 'Terms & Condition',
    privacy: 'Privacy & Policy'
  },
  services: {
    translation: 'Translation Service',
    interpretation: 'Interpretation Service',
    apostille: 'Apostille Service',
    proofReading: 'Proof Reading Service',
    dtpTyping: 'DTP & Typing Service',
    attestation: 'Attestation Service',
    overseasEducation: 'Overseas Educational Consultant Service',
    carrierCoaching: 'Carrier Coaching Service',
    visaAssistance: 'Visa Assistance',
    studyAbroad: 'Study Abroad Service',
    languageTraining: 'Language Training Service',
    contentWriting: 'Content Writing Service',
    localization: 'Localization Service',
    voiceOverDubbing: 'Voice Over & Dubbing',
    graphicDesign: 'Graphic Designing Service',
    transcription: 'Transcription Service',
    subtitling: 'Subtitling Service'
  },
  home: {
    hero: {
      title: 'Certified Translation Services in UAE & Dubai',
      subtitle: 'Professional certified translation services in Dubai and across the UAE for legal, business, medical, technical, immigration, and official documents in 120+ languages.',
      getStarted: 'Get Started',
      whatsapp: 'WhatsApp'
    },
    faq: {
      question1: 'What languages do you support?',
      answer1: 'We provide certified translation services in over 120+ languages including Arabic, English, Spanish, Chinese, German, and many more.',
      question2: 'How long does translation take?',
      answer2: 'Standard documents are delivered within 24-48 hours. Rush services are available for urgent needs with delivery in as fast as 4-6 hours.',
      question3: 'Are your translations certified?',
      answer3: 'Yes, all our translations are certified and accepted by government authorities, courts, and official institutions worldwide.',
      question4: 'How much does translation cost?',
      answer4: 'Pricing varies based on language pair, document type, and urgency. Contact us for a free quote tailored to your specific needs.',
      question5: 'Is my information secure?',
      answer5: 'Absolutely. We maintain strict confidentiality and use secure systems to protect your documents and personal information.'
    },
    process: {
      title: 'Our Working Process',
      subtitle: 'A simple, transparent, and efficient translation workflow',
      step1Title: 'Submit Your Document',
      step1Desc: 'Upload your document securely through our platform and select your language requirements.',
      step2Title: 'Expert Translation',
      step2Desc: 'Your content is translated by certified native-language professionals with subject expertise.',
      step3Title: 'Quality Assurance',
      step3Desc: 'Each translation undergoes strict quality checks to ensure accuracy and cultural relevance.',
      step4Title: 'Secure Delivery',
      step4Desc: 'Receive your completed translation on time, ready for official or professional use.',
      ctaText: 'Ready to experience our seamless process?',
      ctaButton: 'Start Your Translation'
    },
    industries: {
      title: 'Industries We Serve',
      subtitle: 'Specialized expertise across multiple sectors',
      legal: 'Legal',
      medical: 'Medical',
      corporate: 'Corporate',
      education: 'Education',
      marketing: 'Marketing'
    },
    whyUs: {
      title: 'Why Choose Us',
      subtitle: 'Premium translation services you can trust',
      feature1Title: 'Accurate & Certified Translators',
      feature1Desc: 'All our translators are certified professionals with years of experience.',
      feature2Title: 'Fast and Reliable',
      feature2Desc: '24-48 hour delivery for standard documents with rush options available.',
      feature3Title: 'Secure & Confidential',
      feature3Desc: 'Your documents are protected with enterprise-grade security and privacy.'
    },
    aboutCompany: {
      title: 'Your Trusted Translation Partner',
      description: 'We bridge language barriers for clients in Dubai and across the UAE. Our mission is to provide accurate, certified translation services that help individuals and businesses communicate effectively worldwide.',
      clients: 'Clients',
      languages: 'Languages',
      experience: 'Years Experience'
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Trusted by thousands worldwide',
      client1Name: 'Sarah Johnson',
      client1Location: 'ðŸ‡ºðŸ‡¸ United States',
      client1Text: 'Exceptional service! They translated all my legal documents quickly and accurately. Highly professional team.',
      client2Name: 'Mohammed Al-Rashid',
      client2Location: 'ðŸ‡¦ðŸ‡ª UAE',
      client2Text: 'The best translation service in Dubai. Fast, reliable, and their certified translations are accepted everywhere.',
      client3Name: 'Maria Garcia',
      client3Location: 'ðŸ‡ªðŸ‡¸ Spain',
      client3Text: 'Outstanding quality and attention to detail. They handled our corporate website localization perfectly.'
    },
    contactForm: {
      title: 'Get Your Certified Translation Started Today',
      subtitle: 'Fast, accurate, and certified translations in Dubai and across the UAE across 120+ languages.',
      feature1: 'Certified Translators',
      feature1Desc: 'Native speakers with professional credentials',
      feature2: 'Fast Turnaround',
      feature2Desc: '24-48 hour delivery with rush options',
      feature3: 'Secure & Confidential',
      feature3Desc: 'Enterprise-grade security for your documents',
      isoCertified: 'ISO Certified',
      clients: '10K+ Clients',
      support: '24/7 Support',
      getQuote: 'Get Quote',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      languagePair: 'Select Language Pair',
      enToAr: 'English â†’ Arabic',
      arToEn: 'Arabic â†’ English',
      enToEs: 'English â†’ Spanish',
      enToCn: 'English â†’ Chinese',
      enToHi: 'English â†’ Hindi',
      otherPair: 'Other Language Pair',
      uploadText: 'Drop your document here or click to browse',
      uploadFormat: 'PDF, DOC, DOCX, JPG (Max 10MB)',
      additionalNotes: 'Additional Notes (Optional)',
      securityNote: 'Your information is secure and confidential'
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Get your UAE documents translated by certified professionals today',
      button: 'Request a Quote'
    }
  },
  contact: {
    hero: {
      badge: 'Available 24/7',
      title: 'Get in Touch With Us',
      subtitle: "We're here to assist you with all your translation needs across 120+ global languages."
    },
    form: {
      title: 'Send Us a Message',
      subtitle: "Fill out the form below and we'll get back to you promptly",
      fullName: 'Full Name *',
      email: 'Email Address *',
      phone: 'Phone Number',
      language: 'Select Language', 
      languagePlaceholder: 'Choose language pair',
      uploadDoc: 'Upload Document (Optional)',
      uploadText: 'Drop your file here or click to browse',
      uploadFormat: 'PDF, DOC, DOCX, JPG, PNG (Max 10MB)',
      uploadSuccess: 'File uploaded successfully',
      message: 'Message / Description *',
      messagePlaceholder: 'Tell us about your translation needs...',
      sendButton: 'Send Message',
      namePlaceholder: 'John Doe',
      emailPlaceholder: 'john@example.com',
      phonePlaceholder: '+971 XX XXX XXXX'
    },
    faq: {
      title: 'Quick Questions',
      subtitle: 'Common questions about our services',
      question1: 'How long does translation take?',
      answer1: 'Standard translations are delivered within 24-48 hours. Express services are available for urgent needs with delivery in 4-6 hours.',
      question2: 'Do you offer certified translations?',
      answer2: 'Yes, all our translations are certified and accepted by government authorities, courts, and official institutions worldwide.',
      question3: 'How many languages do you support?',
      answer3: 'We provide professional translation services in over 120+ languages with certified native translators.',
      question4: 'What are your rates?',
      answer4: 'Pricing varies based on language pair, document type, and urgency. Contact us for a free personalized quote.'
    },
    contactDetails: {
      title: 'Other Ways to Reach Us',
      subtitle: "We're available through multiple channels",
      emailTitle: 'Email Support',
      emailAddress: 'sales@honeytranslations.com',
      emailNote: 'We reply within 24 hours',
      phoneTitle: 'Phone / WhatsApp',
      phoneNumber: '+91 7299005577',
      phoneNote: 'Available 9AM-6PM',
      locationTitle: 'Office Location',
      locationAddress: 'Remote',
      locationNote: 'Visit us by appointment',
      hoursTitle: 'Business Hours',
      hoursWeekday: 'Mon-Sat: 9AM-6PM',
      hoursSunday: 'Sunday: Closed'
    },
    map: {
      title: 'Visit Our Office',
      subtitle: 'Located in the heart of Dubai',
      location: 'Dubai, United Arab Emirates',
      center: 'Premium Translation Services Center'
    },
    cta: {
      title: 'Need Help with a Translation?',
      subtitle: 'Our expert team is ready to assist you with professional translation services',
      button: 'Talk to Our Team'
    }
  },
  servicesPage: {
    hero: {
      badge: 'Professional Translation Solutions',
      title: 'Translation That Feels Natural',
      subtitle: 'Professional translation services designed to help your message travel clearly across languages and cultures.',
      tagline: 'Accurate. Reliable. Human-focused.'
    },
    overview: {
      paragraph1: 'Honey Translation offers professional language solutions for individuals and businesses worldwide.',
      paragraph2: 'We focus on delivering translations that preserve meaning, tone, and cultural relevance â€” not just words.',
      paragraph3: 'Our services are flexible, scalable, and tailored to your needs.'
    },
    core: {
      title: 'Core Services',
      subtitle: 'What We Translate',
      service1Title: 'Business & Corporate Translation',
      service1Desc: 'Reports, presentations, emails, proposals, and internal documents translated with professional accuracy.',
      service2Title: 'Website & Digital Content Translation',
      service2Desc: 'Websites, landing pages, apps, and online content optimized for global audiences.',
      service3Title: 'Marketing & Brand Translation',
      service3Desc: 'Brochures, ads, campaigns, and brand messaging adapted for cultural impact.',
      service4Title: 'Legal & Official Translation',
      service4Desc: 'Contracts, certificates, agreements, and official documents handled with strict confidentiality.',
      service5Title: 'Academic & Personal Translation',
      service5Desc: 'Essays, research papers, resumes, personal documents, and more.',
      service6Title: 'Technical Documentation',
      service6Desc: 'Manuals, specifications, and technical content with industry precision.'
    },
    specialized: {
      title: 'Specialized Solutions',
      subtitle: 'Beyond Translation',
      intro: 'In addition to translation, we provide language support services to ensure clarity and consistency.',
      service1Title: 'Proofreading & Editing',
      service1Desc: 'Refine and perfect your translated content',
      service2Title: 'Localization Services',
      service2Desc: 'Cultural adaptation for target markets',
      service3Title: 'Content Adaptation',
      service3Desc: 'Rewrite content to fit local contexts',
      service4Title: 'Multilingual Content Review',
      service4Desc: 'Quality checks across languages',
      outro: 'These services ensure your message sounds natural and professional.'
    },
    workflow: {
      title: 'Our Workflow',
      subtitle: 'How We Work',
      step1Title: 'Content Review',
      step1Desc: 'We assess your content, purpose, and target audience.',
      step2Title: 'Expert Translation',
      step2Desc: 'Professional translators handle your project with precision.',
      step3Title: 'Quality Assurance',
      step3Desc: 'Multiple checks for accuracy, tone, and clarity.',
      step4Title: 'Final Delivery',
      step4Desc: 'On-time delivery with post-delivery support if needed.'
    },
    industries: {
      title: 'Industries We Serve',
      subtitle: 'We work with clients across multiple industries',
      industry1: 'Corporate & Startups',
      industry2: 'E-commerce',
      industry3: 'Education & Research',
      industry4: 'Legal & Government',
      industry5: 'Marketing & Media',
      industry6: 'Individuals & Freelancers',
      note: 'Every industry receives the same level of care and professionalism.'
    },
    quality: {
      title: 'Quality & Confidentiality',
      subtitle: 'Our Promise to You',
      feature1Title: 'Strict Confidentiality',
      feature1Desc: 'All documents are handled with complete privacy and security. Your content never leaves our secure systems.',
      feature2Title: 'Human-Reviewed Translations',
      feature2Desc: 'Every translation is reviewed by native speakers to ensure authenticity and natural flow.',
      feature3Title: 'Cultural & Linguistic Accuracy',
      feature3Desc: 'We preserve meaning, tone, and cultural context â€” not just literal translation.',
      feature4Title: 'Commitment to Deadlines',
      feature4Desc: 'On-time delivery guaranteed. We respect your timeline and work accordingly.',
      note: 'Your content is handled with complete care and respect.'
    },
    whyUs: {
      title: 'Why Choose Honey Translation',
      subtitle: 'Our Sweet Advantage',
      feature1Title: 'Human-Centered Approach',
      feature1Desc: 'We prioritize meaning and context over word-for-word translation.',
      feature2Title: 'Clear Communication',
      feature2Desc: 'Transparent process with updates throughout your project.',
      feature3Title: 'Consistent Quality',
      feature3Desc: 'Every project meets our rigorous standards for excellence.',
      feature4Title: 'Flexible Service Options',
      feature4Desc: 'Scalable solutions that adapt to your specific needs.',
      feature5Title: 'Client-Focused Support',
      feature5Desc: 'Dedicated support team available to assist you.',
      feature6Title: 'Long-Term Partnerships',
      feature6Desc: 'We build relationships, not just complete transactions.',
      badge: 'Guaranteed',
      closing: 'We build long-term partnerships, not just translations.'
    }
  },
  popup: {
    title: 'Get Your Translation Done Today',
    fast: 'Fast',
    accurate: 'Accurate',
    certified: 'Certified',
    description: 'Fill in your details and our expert team will contact you within 24 hours with a personalized quote.',
    namePlaceholder: 'Your Full Name',
    emailPlaceholder: 'your@email.com',
    phonePlaceholder: '+971 50 123 4567',
    submitButton: 'Get Translation',
    securityNote: 'Your information is secure and confidential'
  },
  common: {
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
    readMore: 'Read More',
    learnMore: 'Learn More',
    viewAll: 'View All',
    backToHome: 'Back to Home',
    required: 'Required',
    optional: 'Optional'
  },
  aboutPage: {
    hero: {
      badge: 'About Honey Translation',
      title: 'Clarity That Speaks Every Language',
      subtitle: 'We make communication simple, accurate, and human. Honey Translation helps individuals and businesses connect across languages with precision, care, and cultural understanding.',
      tagline: 'Sweet Clarity. Global Reach.'
    },
    whoWeAre: {
      badge: 'Who We Are',
      title: 'Human-Centered Translation',
      paragraph1: 'Honey Translation is a professional language service provider focused on delivering accurate and culturally adapted translations.',
      paragraph2: 'We believe translation is more than words â€” it\'s meaning, tone, and intent.',
      paragraph3: 'Our team works closely with clients to ensure every message feels natural, clear, and authentic in the target language.',
      stat1: '120+',
      stat1Label: 'Languages',
      stat2: '10K+',
      stat2Label: 'Projects',
      stat3: '15+',
      stat3Label: 'Years'
    },
    whatMakesUsDifferent: {
      badge: 'What Makes Us Different',
      title: 'Our Sweet Advantage',
      subtitle: 'We don\'t just translate â€” we adapt your message for real people.',
      feature1: 'Human-Reviewed Translations',
      feature1Desc: 'Every translation is reviewed by native speakers to ensure authenticity and accuracy.',
      feature2: 'Cultural Accuracy',
      feature2Desc: 'Not just literal meaning â€” we capture tone, context, and cultural nuances.',
      feature3: 'Fast Turnaround',
      feature3Desc: 'Quick delivery without compromising quality or attention to detail.',
      feature4: 'Clear Communication',
      feature4Desc: 'Transparent process with regular updates and open dialogue throughout.',
      feature5: 'Trusted by Professionals',
      feature5Desc: 'Used by growing brands, businesses, and individuals worldwide.',
      feature6: 'Quality Guaranteed',
      feature6Desc: 'Every project meets our rigorous standards for excellence and precision.',
      verifiedAdvantage: 'Verified Advantage'
    },
    ourServices: {
      badge: 'Our Services',
      title: 'What We Translate',
      subtitle: 'Every project is handled with confidentiality and care.',
      service1: 'Business & Corporate Documents',
      service1Desc: 'Professional translation of contracts, reports, proposals, presentations, and internal communications for global business operations.',
      service2: 'Websites & Digital Content',
      service2Desc: 'Localization of websites, apps, software interfaces, and digital platforms to engage audiences in their native language.',
      service3: 'Marketing & Brand Materials',
      service3Desc: 'Culturally adapted marketing content, social media content, ads, and brand messaging that resonates locally.',
      service4: 'Legal & Official Documents',
      service4Desc: 'Certified translation of legal contracts, certificates, immigration documents, and official records accepted by authorities.',
      service5: 'Personal & Academic Translations',
      service5Desc: 'Accurate translation of academic transcripts, research papers, personal documents, and educational materials.'
    },
    ourProcess: {
      title: 'Our Process',
      subtitle: 'Simple. Clear. Reliable.',
      step1: 'Understanding Your Needs',
      step1Desc: 'We analyze your content, audience, and goals.',
      step2: 'Professional Translation',
      step2Desc: 'Expert translators work on your project with precision.',
      step3: 'Review & Quality Check',
      step3Desc: 'Every translation is checked for accuracy and tone.',
      step4: 'Delivery & Support',
      step4Desc: 'On-time delivery with ongoing support if needed.'
    },
    ourMission: {
      badge: 'Our Mission',
      title: 'Why We Exist',
      paragraph1: 'Our mission is to eliminate language barriers and help people communicate freely across borders.',
      paragraph2: 'We aim to provide translations that feel natural, respectful, and meaningful â€” just like a conversation in your native language.'
    },
    ourVision: {
      badge: 'Our Vision',
      title: 'Where We\'re Going',
      paragraph1: 'We envision a world where language is never a limitation.',
      paragraph2: 'Honey Translation strives to become a trusted global partner for businesses and individuals seeking clear, honest, and high-quality translations.'
    },
    whatWeStandFor: {
      title: 'What We Stand For',
      subtitle: 'Every translation reflects our values.',
      value1: 'Accuracy',
      value1Desc: 'Precision in every word and phrase',
      value2: 'Integrity',
      value2Desc: 'Honest and transparent service',
      value3: 'Confidentiality',
      value3Desc: 'Your data is always protected',
      value4: 'Cultural Respect',
      value4Desc: 'Honoring every language and culture',
      value5: 'Client Satisfaction',
      value5Desc: 'Your success is our priority'
    },
    cta: {
      title: 'Let\'s Translate Together',
      subtitle: 'You have content that needs to speak clearly across languages? We\'re here to help.',
      button1: 'Contact Us',
      button2: 'View Services',
      badge1: 'ISO Certified',
      badge2: 'Trusted by 10,000+ Clients',
      badge3: '24/7 Support'
    }
  },
  teamPage: {
    hero: {
      badge: 'Meet Our Team',
      title: 'The People Behind the Words',
      subtitle: 'Meet the professionals who bring clarity, precision, and cultural understanding to every translation.',
      tagline: 'Human Expertise. Global Perspective.'
    },
    whoWeAre: {
      badge: 'Who We Are',
      title: 'A Global Language Team',
      paragraph1: 'Honey Translation is powered by a diverse team of language professionals working across regions and cultures.',
      paragraph2: 'Our translators, editors, and reviewers collaborate to ensure every project meets high standards of accuracy, tone, and meaning.',
      stat1: '200+',
      stat1Label: 'Professionals',
      stat2: '80+',
      stat2Label: 'Languages',
      stat3: '40+',
      stat3Label: 'Countries'
    },
    teamStructure: {
      badge: 'Our Team Structure',
      title: 'How We Work Together',
      subtitle: 'Our team includes specialized roles that collaborate seamlessly',
      role1: 'Professional Translators',
      role1Desc: 'Native speakers with domain expertise translating with accuracy and cultural sensitivity.',
      role2: 'Proofreaders & Editors',
      role2Desc: 'Quality specialists ensuring precision, consistency, and grammatical excellence.',
      role3: 'Language Specialists',
      role3Desc: 'Experts in technical, legal, medical, and industry-specific specialized translations.',
      role4: 'Localization Experts',
      role4Desc: 'Cultural consultants adapting content for regional and cultural relevance.',
      role5: 'Project Coordinators',
      role5Desc: 'Dedicated managers ensuring smooth workflow and on-time delivery.',
      bottomText: 'Every role plays a key part in delivering reliable translations.'
    },
    ourExperts: {
      title: 'Our Experts',
      subtitle: 'Experience You Can Trust',
      block1Title: 'Rigorous Selection Process',
      block1Desc: 'Our team members are selected based on their expertise, language mastery, and attention to detail.',
      block2Title: 'Domain Expertise',
      block2Desc: 'Many of our professionals have experience in business, legal, academic, and marketing translations â€” ensuring domain-specific accuracy.',
      area1: 'Business',
      area2: 'Legal',
      area3: 'Academic',
      area4: 'Marketing'
    },
    ourValues: {
      title: 'Our Values as a Team',
      subtitle: 'What Guides Us',
      value1: 'Accuracy & Quality',
      value1Desc: 'Precision in every word',
      value2: 'Cultural Awareness',
      value2Desc: 'Context and nuance',
      value3: 'Respect & Collaboration',
      value3Desc: 'Working together',
      value4: 'Clear Communication',
      value4Desc: 'Open dialogue',
      value5: 'Commitment to Deadlines',
      value5Desc: 'On-time delivery',
      bottomText: 'These values shape how we work together and serve our clients.'
    },
    collaboration: {
      badge: 'Collaboration & Culture',
      title: 'How We Work',
      paragraph1: 'We believe that great translations come from collaboration.',
      paragraph2: 'Our team works closely across languages and time zones, maintaining open communication and consistent quality throughout every project.',
      aspect1: 'Cross-Functional',
      aspect2: 'Global Network',
      aspect3: 'Open Communication',
      aspect4: 'Shared Goals'
    },
    qualityAssurance: {
      badge: 'Quality Assurance',
      title: 'Our Final Check',
      paragraph1: 'Before delivery, every project goes through a dedicated review process.',
      paragraph2: 'Our quality assurance team ensures translations are accurate, culturally appropriate, and aligned with client expectations.',
      step1: 'Accuracy Check',
      step2: 'Cultural Review',
      step3: 'Client Alignment'
    },
    joinTeam: {
      title: 'Join Our Team',
      subtitle: 'We are always open to working with skilled language professionals who share our commitment to quality.',
      question: 'Interested in joining Honey Translation?',
      button1: 'Join Us',
      button2: 'Contact Us',
      badge1: 'Global Team',
      badge2: 'Expert Professionals',
      badge3: 'Collaborative Culture'
    }
  },
  footer: {
    tagline: 'Professional translation services connecting people and businesses worldwide.',
    quickLinks: 'Quick Links',
    home: 'Home',
    about: 'About',
    services: 'Services',
    industries: 'Industries',
    contact: 'Contact',
    faqs: 'FAQs',
    servicesTitle: 'Services',
    docTranslation: 'Document Translation',
    legalTranslation: 'Legal Translation',
    medicalTranslation: 'Medical Translation',
    technicalTranslation: 'Technical Translation',
    subtitles: 'Subtitles & Transcription',
    websiteLocalization: 'Website Localization',
    contactTitle: 'Contact',
    phone: 'Phone',
    phoneNumber: '+91 72990 05577',
    email: 'Email',
    emailAddress: 'sales@honeytranslations.com',
    location: 'Location',
    officeLocation: 'India Office',
    copyright: '© 2025 Honey Translations. All Rights Reserved.'
  },
  howItWorks: {
    hero: {
      title: 'How It Works',
      subtitle: 'Get started in 5 simple steps'
    },
    step1: {
      title: 'Create Your Account',
      description: 'Sign up as a customer or interpreter with simple onboarding.'
    },
    step2: {
      title: 'Choose Your Language Need',
      description: 'Select the language pair you need help with.'
    },
    step3: {
      title: 'Get Instant Match',
      description: 'Our system instantly matches you with the best available interpreter.'
    },
    step4: {
      title: 'Start Communicating',
      description: 'Begin a call, chat, or send documents to translate.'
    },
    step5: {
      title: 'Make Payment & Done',
      description: 'Complete secure payment and enjoy seamless translation services.'
    }
  },
  pricing: {
    hero: {
      badge: 'Pricing',
      title: 'Clear. Fair. Transparent Pricing',
      subtitle: 'At Honey Translation, our pricing is designed to be simple, flexible, and tailored to your needs. Costs depend on language pair, content complexity, turnaround time, and service type.'
    },
    intro: 'We believe in transparent pricing with no hidden fees. Whether you need a short document or a large-scale localization project, we provide clear quotes before work begins.',
    trust1: 'Professional linguists',
    trust2: 'Quality assurance included',
    trust3: 'Confidential & secure handling'
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions'
  }
};

const translationsAR = {
  nav: {
    home: 'الرئيسية',
    about: 'حول',
    services: 'الخدمات',
    contact: 'اتصل بنا',
    blog: 'المدونة',
    getQuote: 'احصل على عرض أسعار'
  },
  about: {
    ceo: 'الرئيس التنفيذي',
    aboutUs: 'حولنا',
    service: 'الخدمة',
    joinUs: 'انضم إلينا',
    missionVision: 'المهمة والرؤية',
    refundPolicy: 'سياسة الاسترداد والإلغاء',
    ourTeam: 'فريقنا',
    pricing: 'التسعير',
    testimonials: 'الشهادات',
    terms: 'الشروط والأحكام',
    privacy: 'الخصوصية والسياسة'
  },
  services: {
    translation: 'خدمة الترجمة',
    interpretation: 'خدمة التفسير',
    apostille: 'خدمة التأشيرة',
    proofReading: 'خدمة التدقيق',
    dtpTyping: 'خدمة DTP والكتابة',
    attestation: 'خدمة التصديق',
    overseasEducation: 'خدمة استشارات التعليم الخارجي',
    carrierCoaching: 'خدمة تدريب الحملة',
    visaAssistance: 'مساعدة التأشيرة',
    studyAbroad: 'خدمة الدراسة في الخارج',
    languageTraining: 'خدمة تدريب اللغات',
    contentWriting: 'خدمة كتابة المحتوى',
    localization: 'خدمة التوطين',
    voiceOverDubbing: 'الصوت والدبلجة',
    graphicDesign: 'خدمة التصميم الجرافيكي',
    transcription: 'خدمة النصوص',
    subtitling: 'خدمة الترجمة'
  },
  home: {
    hero: {
      title: 'ربط الناس من خلال اللغة في جميع أنحاء العالم',
      subtitle: 'خدمات ترجمة معتمدة للأفراد والشركات في أكثر من 120 لغة.',
      getStarted: 'ابدأ الآن',
      whatsapp: 'واتساب'
    },
    faq: {
      question1: 'ما هي اللغات التي تدعمها؟',
      answer1: 'نحن نقدم خدمات ترجمة معتمدة في أكثر من 120 لغة بما في ذلك العربية، الإنجليزية، الإسبانية، الصينية، الألمانية، والعديد من اللغات الأخرى.',
      question2: 'كم يستغرق الترجمة؟',
      answer2: 'يتم تسليم الوثائق القياسية خلال 24-48 ساعة. تتوفر خدمات الطوارئ للاحتياجات العاجلة مع التسليم في أسرع وقت ممكن 4-6 ساعات.',
      question3: 'هل ترجماتكم معتمدة؟',
      answer3: 'نعم، جميع ترجماتنا معتمدة ومقبولة من قبل السلطات الحكومية، المحاكم، والمؤسسات الرسمية في جميع أنحاء العالم.',
      question4: 'كم تكلفة الترجمة؟',
      answer4: 'تختلف الأسعار بناءً على زوج اللغات، نوع الوثيقة، والإلحاح. اتصل بنا للحصول على عرض أسعار مجاني مخصص لاحتياجاتك المحددة.',
      question5: 'هل معلوماتي آمنة؟',
      answer5: 'بالتأكيد. نحافظ على سرية صارمة ونستخدم أنظمة آمنة لحماية وثائقك ومعلوماتك الشخصية.'
    },
    process: {
      title: 'عملية عملنا',
      subtitle: 'سير عمل ترجمة بسيط وشفاف وفعال',
      step1Title: 'قدم وثيقتك',
      step1Desc: 'قم بتحميل وثيقتك بأمان من خلال منصتنا وحدد متطلبات اللغة الخاصة بك.',
      step2Title: 'ترجمة الخبراء',
      step2Desc: 'يتم ترجمة محتواك بواسطة محترفين معتمدين من اللغة الأم مع خبرة متخصصة.',
      step3Title: 'ضمان الجودة',
      step3Desc: 'تخضع كل ترجمة لفحوصات جودة صارمة لضمان الدقة والصلة الثقافية.',
      step4Title: 'التسليم الآمن',
      step4Desc: 'احصل على ترجمتك المكتملة في الوقت المحدد، جاهزة للاستخدام الرسمي أو المهني.',
      ctaText: 'جاهز لتجربة عمليتنا السلسة؟',
      ctaButton: 'ابدأ ترجمتك'
    },
    industries: {
      title: 'الصناعات التي نخدمها',
      subtitle: 'خبرة متخصصة عبر قطاعات متعددة',
      legal: 'قانوني',
      medical: 'طبي',
      corporate: 'شركات',
      education: 'تعليم',
      marketing: 'تسويق'
    },
    whyUs: {
      title: 'لماذا تختارنا',
      subtitle: 'خدمات ترجمة مميزة يمكنك الوثوق بها',
      feature1Title: 'مترجمون دقيقون ومعتمدون',
      feature1Desc: 'جميع مترجمنا محترفون معتمدون مع سنوات من الخبرة.',
      feature2Title: 'سريع وموثوق',
      feature2Desc: 'تسليم في غضون 24-48 ساعة للوثائق القياسية مع خيارات الطوارئ المتاحة.',
      feature3Title: 'آمن وسري',
      feature3Desc: 'وثائقك محمية بأمان وخصوصية من مستوى المؤسسات.'
    },
    aboutCompany: {
      title: 'شريكك الموثوق للترجمة',
      description: 'نحن نجسر الفجوات اللغوية ونربط الثقافات. مهمتنا تقديم خدمات ترجمة دقيقة ومعتمدة تساعد الأفراد والشركات على التواصل بفعالية عالمياً.',
      clients: 'عملاؤنا',
      languages: 'اللغات',
      experience: 'سنوات الخبرة'
    },
    testimonials: {
      title: 'ماذا يقول عملاؤنا',
      subtitle: 'موثوق به من قبل الآلاف حول العالم',
      client1Name: 'سارة جونسون',
      client1Location: 'الولايات المتحدة',
      client1Text: 'خدمة استثنائية! تم ترجمة جميع مستنداتي القانونية بسرعة ودقة. فريق محترف للغاية.',
      client2Name: 'محمد الراشد',
      client2Location: 'الإمارات',
      client2Text: 'أفضل خدمة ترجمة في دبي. سريعة وموثوقة، وترجماتهم المعتمدة مقبولة في كل مكان.',
      client3Name: 'ماريا غارسيا',
      client3Location: 'إسبانيا',
      client3Text: 'جودة ممتازة واهتمام بالتفاصيل. تعاملوا مع توطين موقع شركتنا ببراعة.'
    },
    contactForm: {
      title: 'ابدأ ترجمتك اليوم',
      subtitle: 'ترجمات سريعة ودقيقة ومعتمدة في أكثر من 120 لغة.',
      feature1: 'مترجمون معتمدون',
      feature1Desc: 'ناطقون أصليون بخبرة مهنية',
      feature2: 'تسليم سريع',
      feature2Desc: 'تسليم خلال 24-48 ساعة مع خيارات عاجلة',
      feature3: 'آمن وسري',
      feature3Desc: 'أمان على مستوى المؤسسات لمستنداتك',
      isoCertified: 'معتمد ISO',
      clients: 'أكثر من 10 آلاف عميل',
      support: 'دعم 24/7',
      getQuote: 'احصل على عرض',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      languagePair: 'اختر زوج اللغات',
      enToAr: 'الإنجليزية → العربية',
      arToEn: 'العربية → الإنجليزية',
      enToEs: 'الإنجليزية → الإسبانية',
      enToCn: 'الإنجليزية → الصينية',
      enToHi: 'الإنجليزية → الهندية',
      otherPair: 'زوج لغات آخر',
      uploadText: 'اسحب المستند هنا أو انقر للتصفح',
      uploadFormat: 'PDF، DOC، DOCX، JPG (الحد الأقصى 10 ميغابايت)',
      additionalNotes: 'ملاحظات إضافية (اختياري)',
      securityNote: 'معلوماتك آمنة وسرية'
    },
    cta: {
      title: 'هل أنت مستعد للبدء؟',
      subtitle: 'دع محترفينا المعتمدين يترجموا مستنداتك اليوم',
      button: 'احصل على عرض'
    }
  },
  contact: {
    hero: {
      badge: 'متاح 24/7',
      title: 'اتصل بنا',
      subtitle: 'نحن هنا لدعمك في جميع احتياجات الترجمة الخاصة بك.'
    },
    form: {
      title: 'أرسل لنا رسالة',
      subtitle: 'املأ النموذج أدناه وسنرد عليك بسرعة',
      fullName: 'الاسم الكامل *',
      email: 'البريد الإلكتروني *',
      phone: 'رقم الهاتف',
      language: 'اختر اللغة',
      languagePlaceholder: 'اختر زوج اللغات',
      uploadDoc: 'تحميل المستند (اختياري)',
      uploadText: 'اسحب الملف هنا أو انقر للتصفح',
      uploadFormat: 'PDF، DOC، DOCX، JPG، PNG (حد أقصى 10 ميغابايت)',
      uploadSuccess: 'تم تحميل الملف بنجاح',
      message: 'الرسالة / الوصف *',
      messagePlaceholder: 'أخبرنا عن احتياجات الترجمة الخاصة بك...',
      sendButton: 'إرسال الرسالة',
      namePlaceholder: 'أحمد محمد',
      emailPlaceholder: 'ahmed@example.com',
      phonePlaceholder: '+971 XX XXX XXXX'
    },
    faq: {
      title: 'أسئلة سريعة',
      subtitle: 'الأسئلة الشائعة حول خدماتنا',
      question1: 'كم يستغرق الترجمة؟',
      answer1: 'تُسلم الترجمات القياسية خلال 24-48 ساعة. تتوفر خدمات سريعة للحالات العاجلة مع التسليم خلال 4-6 ساعات.',
      question2: 'هل تقدمون ترجمة معتمدة؟',
      answer2: 'نعم، جميع ترجماتنا معتمدة ومقبولة لدى الجهات الحكومية والمحاكم والمؤسسات الرسمية.',
      question3: 'كم عدد اللغات التي تدعمونها؟',
      answer3: 'نحن نقدم خدمات ترجمة احترافية في أكثر من 120 لغة مع مترجمين معتمدين.',
      question4: 'ما هي الأسعار؟',
      answer4: 'تختلف الأسعار حسب زوج اللغات، نوع الوثيقة ومدى الاستعجال. اتصل بنا للحصول على عرض مجاني مخصص.'
    },
    contactDetails: {
      title: 'طرق أخرى للتواصل',
      subtitle: 'نحن متاحون عبر عدة قنوات',
      emailTitle: 'دعم البريد الإلكتروني',
      emailAddress: 'sales@honeytranslations.com',
      emailNote: 'نرد خلال 24 ساعة',
      phoneTitle: 'الهاتف / واتساب',
      phoneNumber: '+971 XX XXX XXXX',
      phoneNote: 'متاح من 9 صباحًا إلى 9 مساءً بتوقيت GST',
      locationTitle: 'موقع المكتب',
      locationAddress: 'دبي، الإمارات العربية المتحدة',
      locationNote: 'قم بزيارتنا بمواعيد مسبقة',
      hoursTitle: 'ساعات العمل',
      hoursWeekday: 'الاثنين - السبت: 9 صباحًا - 9 مساءً',
      hoursSunday: 'الأحد: مغلق'
    },
    map: {
      title: 'قم بزيارة مكتبنا',
      subtitle: 'يقع في قلب دبي',
      location: 'دبي، الإمارات العربية المتحدة',
      center: 'مركز خدمات ترجمة متميز'
    },
    cta: {
      title: 'هل تحتاج مساعدة في الترجمة؟',
      subtitle: 'فريق الخبراء لدينا جاهز لدعمك بخدمات ترجمة احترافية',
      button: 'تواصل مع فريقنا'
    }
  },
  servicesPage: {
    hero: {
      badge: 'حلول ترجمة احترافية',
      title: 'ترجمة تبدو طبيعية',
      subtitle: 'خدمات ترجمة احترافية تساعد رسالتك على الانتقال بوضوح عبر اللغات والثقافات.',
      tagline: 'دقيقة. موثوقة. إنسانية.'
    },
    overview: {
      paragraph1: 'توفر هوني للترجمة حلولًا لغوية احترافية للأفراد والشركات حول العالم.',
      paragraph2: 'نركز على تقديم ترجمات تحافظ على المعنى والنبرة والملاءمة الثقافية، وليس الكلمات فقط.',
      paragraph3: 'خدماتنا مرنة وقابلة للتوسع ومصممة لتلبية احتياجاتك.'
    },
    core: {
      title: 'الخدمات الأساسية',
      subtitle: 'ما نترجمه',
      service1Title: 'الترجمة التجارية والمؤسسية',
      service1Desc: 'تقارير، عروض تقديمية، رسائل إلكترونية، مقترحات، ومستندات داخلية مترجمة بدقة احترافية.',
      service2Title: 'ترجمة المواقع والمحتوى الرقمي',
      service2Desc: 'المواقع، صفحات الهبوط، التطبيقات، والمحتوى عبر الإنترنت محسنة للجماهير العالمية.',
      service3Title: 'ترجمة التسويق والعلامة التجارية',
      service3Desc: 'مواد تسويقية مصممة ثقافيًا، إعلانات، ورسائل علامة تجارية تتفاعل محليًا.',
      service4Title: 'الترجمة القانونية والرسمية',
      service4Desc: 'عقود، شهادات، اتفاقيات، ومستندات رسمية تعامل بسرية تامة.',
      service5Title: 'الترجمة الأكاديمية والشخصية',
      service5Desc: 'مقالات، أوراق بحثية، سير ذاتية، ومستندات شخصية وأكثر.',
      service6Title: 'الوثائق التقنية',
      service6Desc: 'كتيبات، مواصفات، ومحتوى فني بدقة عالية.'
    },
    specialized: {
      title: 'الحلول المتخصصة',
      subtitle: 'أكثر من مجرد ترجمة',
      intro: 'بالإضافة إلى الترجمة، نقدم خدمات دعم لغوي لضمان الوضوح والاتساق.',
      service1Title: 'التدقيق والتحرير',
      service1Desc: 'تحسين وصقل المحتوى المترجم.',
      service2Title: 'خدمات التوطين',
      service2Desc: 'التكيف الثقافي للأسواق المستهدفة.',
      service3Title: 'تكييف المحتوى',
      service3Desc: 'إعادة صياغة المحتوى ليناسب السياقات المحلية.',
      service4Title: 'مراجعة المحتوى متعدد اللغات',
      service4Desc: 'فحوصات جودة عبر جميع اللغات.',
      outro: 'تضمن هذه الخدمات أن تبدو رسالتك طبيعية ومحترفة.'
    },
    workflow: {
      title: 'سير العمل لدينا',
      subtitle: 'كيف نعمل',
      step1Title: 'مراجعة المحتوى',
      step1Desc: 'نقيم المحتوى، الهدف والجمهور.',
      step2Title: 'الترجمة بواسطة الخبراء',
      step2Desc: 'المترجمون المحترفون يديرون مشروعك بدقة.',
      step3Title: 'ضمان الجودة',
      step3Desc: 'فحوصات متعددة للدقة والنبرة والوضوح.',
      step4Title: 'التسليم النهائي',
      step4Desc: 'تسليم في الوقت المحدد مع دعم ما بعد التسليم.'
    },
    industries: {
      title: 'القطاعات التي نخدمها',
      subtitle: 'نعمل مع عملاء من عدة قطاعات',
      industry1: 'الشركات والشركات الناشئة',
      industry2: 'التجارة الإلكترونية',
      industry3: 'التعليم والبحث',
      industry4: 'القانونية والحكومية',
      industry5: 'التسويق والإعلام',
      industry6: 'الأفراد والمستقلون',
      note: 'كل قطاع يتلقى نفس مستوى العناية والاحتراف.'
    },
    quality: {
      title: 'الجودة والسرية',
      subtitle: 'وعدنا لك',
      feature1Title: 'سرية صارمة',
      feature1Desc: 'جميع المستندات تعامل بسرية وأمان كاملين. لا يغادر المحتوى أنظمتنا الآمنة.',
      feature2Title: 'ترجمات يتحقق منها بشر',
      feature2Desc: 'تراجع كل ترجمة بواسطة ناطقين أصليين لضمان الأصالة والطبيعية.',
      feature3Title: 'الدقة الثقافية واللغوية',
      feature3Desc: 'نحافظ على المعنى والنبرة والسياق الثقافي وليس الترجمة الحرفية فقط.',
      feature4Title: 'الالتزام بالمواعيد',
      feature4Desc: 'ضمان التسليم في الوقت المحدد. نحترم جدولك ونعمل وفقًا له.',
      note: 'يتم التعامل مع محتواك بعناية واحترام كامل.'
    },
    whyUs: {
      title: 'لماذا تختار Honey Translation',
      subtitle: 'ميزتنا المميزة',
      feature1Title: 'نهج يتمحور حول الإنسان',
      feature1Desc: 'نركز على المعنى والسياق بدلاً من الترجمة حرفياً.',
      feature2Title: 'الاتصال الواضح',
      feature2Desc: 'عملية شفافة مع تحديثات طوال المشروع.',
      feature3Title: 'جودة متسقة',
      feature3Desc: 'كل مشروع يفي بمعاييرنا الصارمة للتميز.',
      feature4Title: 'خيارات خدمة مرنة',
      feature4Desc: 'حلول قابلة للتوسع تتكيف مع احتياجاتك.',
      feature5Title: 'دعم يركز على العميل',
      feature5Desc: 'فريق دعم مخصص جاهز للمساعدة.',
      feature6Title: 'شراكات طويلة المدى',
      feature6Desc: 'نبني علاقات طويلة الأمد، لا مجرد مشاريع.',
      badge: 'مضمون',
      closing: 'نبني شراكات طويلة الأمد، لا مجرد ترجمات.'
    }
  },
  popup: {
    title: 'ترجم اليوم',
    fast: 'سريع',
    accurate: 'دقيق',
    certified: 'معتمد',
    description: 'أدخل بياناتك وسيتواصل معك فريق الخبراء خلال 24 ساعة مع عرض سعر مخصص.',
    namePlaceholder: 'اسمك الكامل',
    emailPlaceholder: 'بريدك الإلكتروني',
    phonePlaceholder: '+971 50 123 4567',
    submitButton: 'احصل على ترجمة',
    securityNote: 'معلوماتك آمنة وسرية'
  },
  common: {
    loading: 'جاري التحميل...',
    submit: 'إرسال',
    cancel: 'إلغاء',
    close: 'إغلاق',
    readMore: 'اقرأ المزيد',
    learnMore: 'اعرف أكثر',
    viewAll: 'عرض الكل',
    backToHome: 'العودة إلى الصفحة الرئيسية',
    required: 'مطلوب',
    optional: 'اختياري'
  },
  aboutPage: {
    hero: {
      badge: 'حول هوني للترجمة',
      title: 'وضوح يتحدث جميع اللغات',
      subtitle: 'نحن نجعل التواصل بسيطًا ودقيقًا وإنسانيًا. تساعد هوني للترجمة الأفراد والشركات على الاتصال عبر اللغات بدقة ورعاية وفهم ثقافي.',
      tagline: 'وضوح هادئ. تأثير عالمي.'
    },
    whoWeAre: {
      badge: 'من نحن',
      title: 'ترجمة تركز على الإنسان',
      paragraph1: 'هوني للترجمة هي مزود خدمات لغوية احترافية تركز على تقديم ترجمات دقيقة ومتكيفة ثقافيًا.',
      paragraph2: 'نؤمن أن الترجمة أكثر من كلمات — إنها المعنى، والنبرة، والنية.',
      paragraph3: 'يعمل فريقنا عن قرب مع العملاء لضمان أن يبدو كل محتوى طبيعيًا وواضحًا وأصيلًا في اللغة المستهدفة.',
      stat1: '120+',
      stat1Label: 'لغات',
      stat2: '10K+',
      stat2Label: 'مشروع',
      stat3: '15+',
      stat3Label: 'سنوات'
    },
    whatMakesUsDifferent: {
      badge: 'ما يميزنا',
      title: 'ميزتنا الفريدة',
      subtitle: 'لا نترجم فقط — نكيف رسالتك لأشخاص حقيقيين.',
      feature1: 'ترجمات يتحقق منها بشر',
      feature1Desc: 'يتم مراجعة كل ترجمة من قبل ناطقين أصليين لضمان الدقة والطبيعية.',
      feature2: 'الدقة الثقافية',
      feature2Desc: 'نلتقط ليس فقط المعنى الحرفي، بل النبرة والسياق الثقافي.',
      feature3: 'التسليم السريع',
      feature3Desc: 'تسليم سريع دون المساومة على الجودة أو التفاصيل.',
      feature4: 'الاتصال الواضح',
      feature4Desc: 'عملية شفافة مع تحديثات منتظمة وحوار مفتوح طوال المشروع.',
      feature5: 'معتمد من المهنيين',
      feature5Desc: 'يستخدمنا العلامات التجارية والشركات والأفراد حول العالم.',
      feature6: 'جودة مضمونة',
      feature6Desc: 'يستوفي كل مشروع معاييرنا الصارمة للتميز والدقة.',
      verifiedAdvantage: 'ميزة موثوقة'
    },
    ourServices: {
      badge: 'خدماتنا',
      title: 'ما نترجمه',
      subtitle: 'يتم التعامل مع كل مشروع بسرية واحتراف.',
      service1: 'مستندات الأعمال والشركات',
      service1Desc: 'ترجمة احترافية للعقود والتقارير والمقترحات والعروض التقديمية والاتصالات الداخلية.',
      service2: 'المواقع والمحتوى الرقمي',
      service2Desc: 'توطين مواقع الإنترنت والتطبيقات والمحتوى الرقمي لجذب الجماهير بلغتهم الأم.',
      service3: 'التسويق ومواد العلامة التجارية',
      service3Desc: 'محتوى تسويقي مُعدّل ثقافيًا، وإعلانات، ورسائل علامة تجارية تتناسب محليًا.',
      service4: 'المستندات القانونية والرسمية',
      service4Desc: 'ترجمة معتمدة للعقود والشهادات ومستندات الهجرة والوثائق الرسمية.',
      service5: 'الترجمات الشخصية والأكاديمية',
      service5Desc: 'ترجمة دقيقة لكشوف الدرجات، والأوراق البحثية، والسير الذاتية، والمستندات الشخصية.',
      service6: 'الوثائق التقنية',
      service6Desc: 'دليل المستخدم والمواصفات والمحتوى الفني بدقة صناعية.'
    },
    ourProcess: {
      title: 'عمليتنا',
      subtitle: 'بسيطة. واضحة. موثوقة.',
      step1: 'فهم احتياجاتك',
      step1Desc: 'نحلل محتواك وجمهورك وأهدافك.',
      step2: 'الترجمة الاحترافية',
      step2Desc: 'يعمل المترجمون الخبراء على مشروعك بدقة.',
      step3: 'المراجعة وضمان الجودة',
      step3Desc: 'تُراجع كل ترجمة للتأكد من الدقة والنبرة.',
      step4: 'التسليم والدعم',
      step4Desc: 'التسليم في الوقت المحدد مع دعم مستمر عند الحاجة.'
    },
    ourMission: {
      badge: 'مهمتنا',
      title: 'لماذا نعمل',
      paragraph1: 'مهمتنا هي إزالة الحواجز اللغوية ومساعدة الناس على التواصل بحرية عبر الحدود.',
      paragraph2: 'نهدف إلى توفير ترجمات تبدو طبيعية ومحترمة وذات معنى — مثل محادثة بلغة المستخدم.'
    },
    ourVision: {
      badge: 'رؤيتنا',
      title: 'إلى أين نتجه',
      paragraph1: 'نرى عالمًا لا تكون فيه اللغة عقبة أبدًا.',
      paragraph2: 'تسعى هوني للترجمة إلى أن تكون شريكًا عالميًا موثوقًا للشركات والأفراد الباحثين عن ترجمات واضحة وأمينة وعالية الجودة.'
    },
    whatWeStandFor: {
      title: 'ما نمثله',
      subtitle: 'كل ترجمة تعكس قيمنا.',
      value1: 'الدقة',
      value1Desc: 'دقة في كل كلمة وجملة',
      value2: 'الشفافية',
      value2Desc: 'خدمة صادقة وواضحة',
      value3: 'السرية',
      value3Desc: 'بياناتك محمية دائمًا',
      value4: 'الاحترام الثقافي',
      value4Desc: 'نحترم كل لغة وثقافة',
      value5: 'رضا العملاء',
      value5Desc: 'نجاحك هو أولويتنا'
    },
    cta: {
      title: 'دعنا نترجم معًا',
      subtitle: 'هل لديك محتوى يجب أن يتحدث بوضوح عبر اللغات؟ نحن هنا لمساعدتك.',
      button1: 'اتصل بنا',
      button2: 'عرض الخدمات',
      badge1: 'معتمد ISO',
      badge2: 'موثوق من أكثر من 10,000 عميل',
      badge3: 'دعم 24/7'
    }
  },
  teamPage: {
    hero: {
      badge: 'تعرف على فريقنا',
      title: 'الأشخاص وراء الكلمات',
      subtitle: 'تعرف على المحترفين الذين يقدمون الوضوح والدقة والفهم الثقافي في كل ترجمة.',
      tagline: 'خبرة بشرية. رؤية عالمية.'
    },
    whoWeAre: {
      badge: 'من نحن',
      title: 'فريق لغوي عالمي',
      paragraph1: 'هوني للترجمة مدعومة بفريق متنوع من محترفي اللغة يعمل عبر المناطق والثقافات.',
      paragraph2: 'يتعاون المترجمون والمحررون والمراجعون لضمان أن كل مشروع يفي بمعايير عالية من الدقة والنبرة والمعنى.',
      stat1: '200+',
      stat1Label: 'محترف',
      stat2: '80+',
      stat2Label: 'لغة',
      stat3: '40+',
      stat3Label: 'دولة'
    },
    teamStructure: {
      badge: 'هيكل فريقنا',
      title: 'كيف نعمل معًا',
      subtitle: 'يتضمن فريقنا أدوارًا متخصصة تتعاون بسلاسة',
      role1: 'مترجمون محترفون',
      role1Desc: 'ناطقون أصليون بخبرة تخصصية يترجمون بالدقة والوعي الثقافي.',
      role2: 'مراجعون ومحررون',
      role2Desc: 'متخصصو جودة يضمنون الدقة والتناسق والتميز اللغوي.',
      role3: 'خبراء لغويون',
      role3Desc: 'خبراء في الترجمة التقنية والقانونية والطبية والمتخصصة حسب القطاع.',
      role4: 'خبراء التوطين',
      role4Desc: 'استشاريون ثقافيون يكيفون المحتوى ليتناسب مع السياق الإقليمي.',
      role5: 'منسقو المشاريع',
      role5Desc: 'مديرون مخصصون يضمنون سير عمل سلسًا وتسليمًا في الوقت المحدد.',
      bottomText: 'يلعب كل دور دورًا أساسيًا في تقديم ترجمات موثوقة.'
    },
    ourExperts: {
      title: 'خبراؤنا',
      subtitle: 'خبرة تثق بها',
      block1Title: 'عملية اختيار دقيقة',
      block1Desc: 'يُختار أعضاء فريقنا بناءً على خبرتهم وسيطرتهم اللغوية واهتمامهم بالتفاصيل.',
      block2Title: 'خبرة التخصص',
      block2Desc: 'لدى العديد من المحترفين لدينا خبرة في الترجمة التجارية والقانونية والأكاديمية والتسويقية.',
      area1: 'تجاري',
      area2: 'قانوني',
      area3: 'أكاديمي',
      area4: 'تسويق'
    },
    ourValues: {
      title: 'قيمنا كفريق',
      subtitle: 'ما يوجهنا',
      value1: 'الدقة والجودة',
      value1Desc: 'دقة في كل كلمة',
      value2: 'الوعي الثقافي',
      value2Desc: 'السياق والنبرة',
      value3: 'الاحترام والتعاون',
      value3Desc: 'العمل معًا بتعاون',
      value4: 'التواصل الواضح',
      value4Desc: 'حوار مفتوح',
      value5: 'الالتزام بالمواعيد',
      value5Desc: 'تسليم في الوقت المحدد',
      bottomText: 'تشكل هذه القيم طريقة عملنا معًا وخدمة عملائنا.'
    },
    collaboration: {
      badge: 'التعاون والثقافة',
      title: 'كيف نعمل',
      paragraph1: 'نؤمن أن الترجمات المميزة تنشأ من التعاون.',
      paragraph2: 'يعمل فريقنا معًا عبر اللغات والمناطق الزمنية، مع الحفاظ على اتصال مفتوح وجودة ثابتة طوال المشروع.',
      aspect1: 'التعاون الداخلي',
      aspect2: 'شبكة عالمية',
      aspect3: 'التواصل المفتوح',
      aspect4: 'الأهداف المشتركة'
    },
    qualityAssurance: {
      badge: 'ضمان الجودة',
      title: 'التحقق النهائي',
      paragraph1: 'قبل التسليم، يخضع كل مشروع لعملية مراجعة دقيقة.',
      paragraph2: 'تضمن فرق ضمان الجودة لدينا أن تكون الترجمات دقيقة ومناسبة ثقافيًا ومتوافقة مع توقعات العملاء.',
      step1: 'التحقق من الدقة',
      step2: 'المراجعة الثقافية',
      step3: 'مواءمة العميل'
    },
    joinTeam: {
      title: 'انضم إلى فريقنا',
      subtitle: 'نحن دائمًا نرحب بالمهنيين اللغويين الماهرين الذين يشاركوننا التزامنا بالجودة.',
      question: 'هل ترغب في الانضمام إلى هوني للترجمة؟',
      button1: 'انضم إلينا',
      button2: 'اتصل بنا',
      badge1: 'فريق عالمي',
      badge2: 'محترفون خبراء',
      badge3: 'ثقافة تعاونية'
    }
  },
  footer: {
    tagline: 'خدمات ترجمة احترافية تربط الناس والشركات حول العالم.',
    quickLinks: 'روابط سريعة',
    home: 'الرئيسية',
    about: 'حول',
    services: 'الخدمات',
    industries: 'الصناعات',
    contact: 'اتصل بنا',
    faqs: 'الأسئلة الشائعة',
    servicesTitle: 'الخدمات',
    docTranslation: 'ترجمة المستندات',
    legalTranslation: 'الترجمة القانونية',
    medicalTranslation: 'الترجمة الطبية',
    technicalTranslation: 'الترجمة التقنية',
    subtitles: 'الترجمة والنصوص',
    websiteLocalization: 'توطين المواقع',
    contactTitle: 'اتصل بنا',
    phone: 'الهاتف',
    phoneNumber: '7299005577',
    email: 'البريد الإلكتروني',
    emailAddress: 'sales@honeytranslation.com',
    location: 'الموقع',
    officeLocation: 'عن بعد',
    copyright: '© 2025 هوني للترجمة. جميع الحقوق محفوظة.'
  },
  howItWorks: {
    hero: {
      title: 'كيف يعمل',
      subtitle: 'ابدأ في 5 خطوات بسيطة'
    },
    step1: {
      title: 'أنشئ حسابك',
      description: 'اشترك كعميل أو مترجم من خلال التسجيل البسيط.'
    },
    step2: {
      title: 'اختر احتياجاتك اللغوية',
      description: 'حدد زوج اللغات الذي تحتاج إلى مساعدة بشأنه.'
    },
    step3: {
      title: 'احصل على مطابقة فورية',
      description: 'يطابق نظامنا بين احتياجاتك وأفضل مترجم متاح.'
    },
    step4: {
      title: 'ابدأ التواصل',
      description: 'ابدأ مكالمة أو دردشة أو أرسل المستندات للترجمة.'
    },
    step5: {
      title: 'قم بالدفع وانتهى',
      description: 'أكمل الدفع الآمن واستمتع بخدمات الترجمة السلسة.'
    }
  },
  pricing: {
    hero: {
      badge: 'التسعير',
      title: 'واضح. عادل. تسعير شفاف',
      subtitle: 'في هوني للترجمة، تم تصميم التسعير ليكون بسيطًا ومرنًا ومخصصًا لاحتياجاتك. تعتمد التكاليف على زوج اللغات وتعقيد المحتوى وسرعة الإنجاز ونوع الخدمة.'
    },
    intro: 'نؤمن بالتسعير الشفاف بدون رسوم مخفية. سواء كنت بحاجة إلى مستند قصير أو مشروع توطين واسع النطاق، فإننا نقدم عروض أسعار واضحة قبل بدء العمل.',
    trust1: 'لغويون محترفون',
    trust2: 'ضمان الجودة المدرج',
    trust3: 'معالجة سرية وآمنة'
  },
  faq: {
    title: 'الأسئلة الشائعة',
    subtitle: 'ابحث عن إجابات على الأسئلة الشائعة'
  }
};



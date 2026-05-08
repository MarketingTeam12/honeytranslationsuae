import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Popup } from './components/Popup';
import { ArabicContentGuard } from './components/ArabicContentGuard';
import { SEO } from './components/SEO';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));
const Services = lazy(() => import('./pages/Services').then((module) => ({ default: module.Services })));
const Contact = lazy(() => import('./pages/Contact').then((module) => ({ default: module.Contact })));
const Blog = lazy(() => import('./pages/Blog').then((module) => ({ default: module.Blog })));
const CEO = lazy(() => import('./pages/CEO').then((module) => ({ default: module.CEO })));
const Team = lazy(() => import('./pages/Team').then((module) => ({ default: module.Team })));
const MissionVision = lazy(() => import('./pages/MissionVision').then((module) => ({ default: module.MissionVision })));
const JoinUs = lazy(() => import('./pages/JoinUs').then((module) => ({ default: module.JoinUs })));
const Testimonials = lazy(() => import('./pages/Testimonials').then((module) => ({ default: module.Testimonials })));
const Pricing = lazy(() => import('./pages/Pricing').then((module) => ({ default: module.Pricing })));
const Terms = lazy(() => import('./pages/Terms').then((module) => ({ default: module.Terms })));
const Privacy = lazy(() => import('./pages/Privacy').then((module) => ({ default: module.Privacy })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then((module) => ({ default: module.RefundPolicy })));
const TranslationService = lazy(() => import('./pages/services/TranslationService').then((module) => ({ default: module.TranslationService })));
const InterpretationService = lazy(() => import('./pages/services/InterpretationService').then((module) => ({ default: module.InterpretationService })));
const ApostilleService = lazy(() => import('./pages/services/ApostilleService').then((module) => ({ default: module.ApostilleService })));
const ProofReadingService = lazy(() => import('./pages/services/ProofReadingService').then((module) => ({ default: module.ProofReadingService })));
const DTPTypingService = lazy(() => import('./pages/services/DTPTypingService').then((module) => ({ default: module.DTPTypingService })));
const AttestationService = lazy(() => import('./pages/services/AttestationService').then((module) => ({ default: module.AttestationService })));
const OverseasEducationService = lazy(() => import('./pages/services/OverseasEducationService').then((module) => ({ default: module.OverseasEducationService })));
const CarrierCoachingService = lazy(() => import('./pages/services/CarrierCoachingService').then((module) => ({ default: module.CarrierCoachingService })));
const VisaAssistance = lazy(() => import('./pages/services/VisaAssistance').then((module) => ({ default: module.VisaAssistance })));
const StudyAbroadService = lazy(() => import('./pages/services/StudyAbroadService').then((module) => ({ default: module.StudyAbroadService })));
const LanguageTrainingService = lazy(() => import('./pages/services/LanguageTrainingService').then((module) => ({ default: module.LanguageTrainingService })));
const ContentWritingService = lazy(() => import('./pages/services/ContentWritingService').then((module) => ({ default: module.ContentWritingService })));
const LocalizationService = lazy(() => import('./pages/services/LocalizationService').then((module) => ({ default: module.LocalizationService })));
const VoiceOverDubbingService = lazy(() => import('./pages/services/VoiceOverDubbingService').then((module) => ({ default: module.VoiceOverDubbingService })));
const GraphicDesignService = lazy(() => import('./pages/services/GraphicDesignService').then((module) => ({ default: module.GraphicDesignService })));
const TranscriptionService = lazy(() => import('./pages/services/TranscriptionService').then((module) => ({ default: module.TranscriptionService })));
const SubtitlingService = lazy(() => import('./pages/services/SubtitlingService').then((module) => ({ default: module.SubtitlingService })));

function LanguageRouteSync() {
  const { language } = useLanguage();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isArabicRoute = pathname === '/ar' || pathname.startsWith('/ar/');
    const basePath = pathname === '/ar'
      ? '/'
      : pathname.startsWith('/ar/')
        ? pathname.slice(3) || '/'
        : pathname;

    if (language === 'EN' && isArabicRoute) {
      navigate(`${basePath}${search}${hash}`, { replace: true });
      return;
    }

    if (language === 'AR' && !isArabicRoute) {
      const arabicPath = basePath === '/' ? '/ar/' : `/ar${basePath}`;
      navigate(`${arabicPath}${search}${hash}`, { replace: true });
    }
  }, [hash, language, navigate, pathname, search]);

  return null;
}

export default function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <ScrollProgressBar />
          <LanguageRouteSync />
          <SEO />
          <Header onOpenPopup={() => setIsPopupOpen(true)} />
          <ArabicContentGuard />
          <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
          <main id="main-content">
            <Suspense fallback={null}>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ar" element={<Home />} />
              <Route path="/ar/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ar/about" element={<About />} />
              <Route path="/ceo" element={<CEO />} />
              <Route path="/ar/ceo" element={<CEO />} />
              <Route path="/team" element={<Team />} />
              <Route path="/ar/team" element={<Team />} />
              <Route path="/mission-vision" element={<MissionVision />} />
              <Route path="/ar/mission-vision" element={<MissionVision />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/ar/join-us" element={<JoinUs />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/ar/testimonials" element={<Testimonials />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/ar/pricing" element={<Pricing />} />
              <Route path="/services" element={<Services />} />
              <Route path="/ar/services" element={<Services />} />
              <Route path="/services/translation" element={<TranslationService />} />
              <Route path="/ar/services/translation" element={<TranslationService />} />
              <Route path="/services/interpretation" element={<InterpretationService />} />
              <Route path="/ar/services/interpretation" element={<InterpretationService />} />
              <Route path="/services/apostille" element={<ApostilleService />} />
              <Route path="/ar/services/apostille" element={<ApostilleService />} />
              <Route path="/services/proof-reading" element={<ProofReadingService />} />
              <Route path="/ar/services/proof-reading" element={<ProofReadingService />} />
              <Route path="/services/dtp-typing" element={<DTPTypingService />} />
              <Route path="/ar/services/dtp-typing" element={<DTPTypingService />} />
              <Route path="/services/attestation" element={<AttestationService />} />
              <Route path="/ar/services/attestation" element={<AttestationService />} />
              <Route path="/services/overseas-education" element={<OverseasEducationService />} />
              <Route path="/ar/services/overseas-education" element={<OverseasEducationService />} />
              <Route path="/services/carrier-coaching" element={<CarrierCoachingService />} />
              <Route path="/ar/services/carrier-coaching" element={<CarrierCoachingService />} />
              <Route path="/services/visa-assistance" element={<VisaAssistance />} />
              <Route path="/ar/services/visa-assistance" element={<VisaAssistance />} />
              <Route path="/services/study-abroad" element={<StudyAbroadService />} />
              <Route path="/ar/services/study-abroad" element={<StudyAbroadService />} />
              <Route path="/services/language-training" element={<LanguageTrainingService />} />
              <Route path="/ar/services/language-training" element={<LanguageTrainingService />} />
              <Route path="/services/content-writing" element={<ContentWritingService />} />
              <Route path="/ar/services/content-writing" element={<ContentWritingService />} />
              <Route path="/services/localization" element={<LocalizationService />} />
              <Route path="/ar/services/localization" element={<LocalizationService />} />
              <Route path="/services/voice-over-dubbing" element={<VoiceOverDubbingService />} />
              <Route path="/ar/services/voice-over-dubbing" element={<VoiceOverDubbingService />} />
              <Route path="/services/graphic-design" element={<GraphicDesignService />} />
              <Route path="/ar/services/graphic-design" element={<GraphicDesignService />} />
              <Route path="/services/transcription" element={<TranscriptionService />} />
              <Route path="/ar/services/transcription" element={<TranscriptionService />} />
              <Route path="/services/subtitling" element={<SubtitlingService />} />
              <Route path="/ar/services/subtitling" element={<SubtitlingService />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ar/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/ar/blog" element={<Blog />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/ar/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/ar/privacy" element={<Privacy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/ar/refund-policy" element={<RefundPolicy />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
      </div>
    </Router>
    </LanguageProvider>
  );
}

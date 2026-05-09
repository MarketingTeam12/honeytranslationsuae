import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  HeartPulse,
  Languages,
  Laptop,
  Mail,
  MessageCircle,
  Phone,
  Scale,
  Shield,
  Subtitles,
  Wrench,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

type IconComponent = typeof FileText;

type ServicePageConfig = {
  title: string;
  subtitle: string;
  description: string;
  icon: IconComponent;
  detailTitle: string;
  detailIntro: string;
  details: string[];
  benefits: Array<{
    title: string;
    description: string;
    icon: IconComponent;
    gradient: string;
  }>;
  languages: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  quoteLabel: string;
};

const commonLanguages = [
  'Arabic',
  'English',
  'Hindi',
  'Tamil',
  'Malayalam',
  'Urdu',
  'French',
  'Spanish',
  'German',
  'Chinese',
  'Japanese',
  'Russian',
  'Portuguese',
  'Italian',
  'and many more',
];

const serviceConfigs: Record<string, ServicePageConfig> = {
  document: {
    title: 'Document Translation',
    subtitle: 'Accurate, certified document translation for personal, academic, and business needs',
    description:
      'Honey Translation translates official and everyday documents with careful attention to meaning, formatting, terminology, and acceptance requirements.',
    icon: FileText,
    detailTitle: 'Documents We Translate',
    detailIntro:
      'From certificates to corporate files, every document is handled by experienced human translators and reviewed before delivery.',
    details: [
      'Birth, marriage, education, and experience certificates',
      'Immigration, embassy, and government documents',
      'Business reports, letters, proposals, and agreements',
      'Academic records, transcripts, resumes, and personal files',
      'Scanned PDFs, Word files, and formatted document layouts',
      'Certified and standard translation requirements',
    ],
    benefits: [
      {
        title: 'Certified Accuracy',
        description: 'Precise translations prepared for official and professional use.',
        icon: Award,
        gradient: 'from-blue-400 to-blue-500',
      },
      {
        title: 'Formatting Care',
        description: 'Clean output that follows the structure of your original document.',
        icon: FileText,
        gradient: 'from-purple-400 to-purple-500',
      },
      {
        title: 'Confidential Handling',
        description: 'Sensitive personal and business documents are protected throughout.',
        icon: Shield,
        gradient: 'from-green-400 to-green-500',
      },
    ],
    languages: commonLanguages,
    ctaTitle: 'Translate Your Document with Confidence',
    ctaSubtitle: 'Send your file and receive a clear quote from our team.',
    quoteLabel: 'Request Document Quote',
  },
  legal: {
    title: 'Legal Translation',
    subtitle: 'Precise legal translation for contracts, court files, and official submissions',
    description:
      'Legal content needs exact terminology and careful context. Our translators handle sensitive legal documents with accuracy, privacy, and professional review.',
    icon: Scale,
    detailTitle: 'Legal Content We Handle',
    detailIntro:
      'We support individuals, companies, and legal teams with translations that preserve obligations, intent, and terminology.',
    details: [
      'Contracts, agreements, memorandums, and affidavits',
      'Court documents, legal notices, and case material',
      'Power of attorney, company formation, and compliance files',
      'Immigration, embassy, and government legal documents',
      'Terms, policies, and corporate legal communication',
      'Certified translations for official submission',
    ],
    benefits: [
      {
        title: 'Legal Terminology',
        description: 'Specialized translators maintain the intended legal meaning.',
        icon: Scale,
        gradient: 'from-blue-400 to-blue-500',
      },
      {
        title: 'Strict Privacy',
        description: 'Sensitive case and company information is treated with discretion.',
        icon: Shield,
        gradient: 'from-purple-400 to-purple-500',
      },
      {
        title: 'Review Focus',
        description: 'Each file is checked for consistency, names, dates, and clauses.',
        icon: CheckCircle2,
        gradient: 'from-green-400 to-green-500',
      },
    ],
    languages: commonLanguages,
    ctaTitle: 'Need a Legal Translation Reviewed Carefully?',
    ctaSubtitle: 'Share your requirements and our team will guide the next step.',
    quoteLabel: 'Request Legal Quote',
  },
  medical: {
    title: 'Medical Translation',
    subtitle: 'Clear medical translation for patient records, reports, and healthcare documents',
    description:
      'Medical translations require specialist care. We translate healthcare content with attention to terminology, clarity, and patient safety.',
    icon: HeartPulse,
    detailTitle: 'Medical Documents We Translate',
    detailIntro:
      'Our translators work with clinical, patient, insurance, and healthcare-administration documents across language pairs.',
    details: [
      'Medical reports, prescriptions, and discharge summaries',
      'Lab results, diagnostic records, and treatment plans',
      'Hospital, clinic, and patient information documents',
      'Insurance claims and healthcare administration files',
      'Clinical research, consent forms, and study materials',
      'Pharmaceutical and medical-device content',
    ],
    benefits: [
      {
        title: 'Terminology Accuracy',
        description: 'Medical language is translated with care and consistency.',
        icon: HeartPulse,
        gradient: 'from-blue-400 to-blue-500',
      },
      {
        title: 'Patient Clarity',
        description: 'Content remains readable and useful for the intended audience.',
        icon: Languages,
        gradient: 'from-green-400 to-green-500',
      },
      {
        title: 'Secure Process',
        description: 'Private medical records are handled with strong confidentiality.',
        icon: Shield,
        gradient: 'from-pink-400 to-pink-500',
      },
    ],
    languages: commonLanguages,
    ctaTitle: 'Translate Medical Records with Care',
    ctaSubtitle: 'Send your file securely and we will respond with a quote.',
    quoteLabel: 'Request Medical Quote',
  },
  technical: {
    title: 'Technical Translation',
    subtitle: 'Specialized translation for manuals, product files, and technical documentation',
    description:
      'Technical translation must be accurate, consistent, and easy to follow. We help teams communicate complex information clearly across languages.',
    icon: Wrench,
    detailTitle: 'Technical Content We Translate',
    detailIntro:
      'We work with engineering, IT, manufacturing, product, and training documentation while preserving terminology and structure.',
    details: [
      'User manuals, installation guides, and safety instructions',
      'Product specifications, datasheets, and catalogues',
      'Software, IT, and help-center documentation',
      'Engineering, manufacturing, and process documents',
      'Training materials, SOPs, and technical presentations',
      'Terminology glossaries and style-consistent updates',
    ],
    benefits: [
      {
        title: 'Subject Precision',
        description: 'Technical terms are handled consistently across every file.',
        icon: Wrench,
        gradient: 'from-blue-400 to-blue-500',
      },
      {
        title: 'Usable Output',
        description: 'Instructions remain clear for end users, teams, and customers.',
        icon: CheckCircle2,
        gradient: 'from-purple-400 to-purple-500',
      },
      {
        title: 'Format Support',
        description: 'We work with structured documents, guides, and digital files.',
        icon: Laptop,
        gradient: 'from-yellow-400 to-yellow-500',
      },
    ],
    languages: commonLanguages,
    ctaTitle: 'Make Technical Content Clear Worldwide',
    ctaSubtitle: 'Tell us your industry, files, and language pair for a tailored quote.',
    quoteLabel: 'Request Technical Quote',
  },
  subtitles: {
    title: 'Subtitles & Transcription',
    subtitle: 'Readable subtitles and accurate transcription for audio and video content',
    description:
      'We help videos, interviews, training content, and media projects become accessible through careful transcription, translation, timing, and subtitle formatting.',
    icon: Subtitles,
    detailTitle: 'Media Services We Provide',
    detailIntro:
      'Our team supports spoken-content workflows from raw audio to platform-ready subtitle files.',
    details: [
      'Audio and video transcription',
      'Translated subtitles for multilingual audiences',
      'SRT, VTT, and platform-ready subtitle files',
      'Corporate videos, webinars, interviews, and training modules',
      'YouTube, social media, e-learning, and marketing content',
      'Readable line breaks, timing, and quality review',
    ],
    benefits: [
      {
        title: 'Human Accuracy',
        description: 'Speech is captured and reviewed by real language professionals.',
        icon: Languages,
        gradient: 'from-blue-400 to-blue-500',
      },
      {
        title: 'Timing & Readability',
        description: 'Subtitles are synced, clear, and comfortable to read.',
        icon: Clock,
        gradient: 'from-purple-400 to-purple-500',
      },
      {
        title: 'Global Reach',
        description: 'Make your media accessible to viewers across languages.',
        icon: Globe,
        gradient: 'from-green-400 to-green-500',
      },
    ],
    languages: commonLanguages,
    ctaTitle: 'Make Your Audio and Video Accessible',
    ctaSubtitle: 'Send your media details and required format for a quick quote.',
    quoteLabel: 'Request Media Quote',
  },
  website: {
    title: 'Website Localization',
    subtitle: 'Website translation and localization that helps your brand feel local',
    description:
      'Website localization adapts your content, tone, calls to action, and user-facing language so visitors feel understood in their market.',
    icon: Globe,
    detailTitle: 'Website Content We Localize',
    detailIntro:
      'We adapt digital content for language, culture, search intent, and user experience while preserving your brand voice.',
    details: [
      'Website pages, landing pages, and product pages',
      'App screens, UI text, buttons, and microcopy',
      'SEO titles, meta descriptions, and localized keywords',
      'Marketing campaigns, blogs, and digital content',
      'E-commerce descriptions, checkout content, and support text',
      'Regional style, terminology, and cultural adaptation',
    ],
    benefits: [
      {
        title: 'Local Market Fit',
        description: 'Content feels natural and relevant to your target audience.',
        icon: Globe,
        gradient: 'from-blue-400 to-blue-500',
      },
      {
        title: 'Brand Consistency',
        description: 'Your voice stays recognizable across languages and markets.',
        icon: Award,
        gradient: 'from-purple-400 to-purple-500',
      },
      {
        title: 'Digital Ready',
        description: 'Support for SEO, UI text, web copy, and conversion content.',
        icon: Laptop,
        gradient: 'from-green-400 to-green-500',
      },
    ],
    languages: commonLanguages,
    ctaTitle: 'Ready to Localize Your Website?',
    ctaSubtitle: 'Share your URL or content files and we will prepare a clear quote.',
    quoteLabel: 'Request Localization Quote',
  },
};

function FooterServicePage({ config }: { config: ServicePageConfig }) {
  const { language } = useLanguage();
  const contactPath = language === 'AR' ? '/ar/contact' : '/contact';
  const Icon = config.icon;

  return (
    <div className="pt-16">
      <section className="premium-service-hero relative bg-gradient-to-br from-[#151249] via-[#1e1a5e] to-[#151249] text-white py-24 sm:py-28 px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 world-map-pattern opacity-10"></div>
        <div className="blur-blob w-72 h-72 sm:w-96 sm:h-96 bg-yellow-400/20 top-10 right-10"></div>
        <div className="blur-blob w-72 h-72 sm:w-96 sm:h-96 bg-blue-400/20 bottom-10 left-10"></div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-xl">
              <Icon className="w-10 h-10 text-[#151249]" />
            </div>
          </div>

          <h1
            className="text-white mb-6 text-4xl sm:text-5xl lg:text-[3.5rem] leading-tight"
            style={{ textShadow: '0px 3px 10px rgba(0,0,0,0.4)' }}
          >
            {config.title}
          </h1>

          <p className="text-xl sm:text-2xl text-yellow-400 mb-8 font-semibold max-w-4xl mx-auto">
            {config.subtitle}
          </p>

          <p
            className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto"
            style={{ textShadow: '0px 2px 6px rgba(0,0,0,0.3)' }}
          >
            {config.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-soft-blue px-6 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-[#151249] mb-6 text-3xl sm:text-4xl lg:text-[2.75rem]">
              {config.detailTitle}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {config.detailIntro}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {config.details.map((detail) => (
                <div key={detail} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C4FF] flex-shrink-0 mt-1" />
                  <span className="text-gray-700 leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white px-6 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-[#151249] mb-6 text-3xl sm:text-4xl lg:text-[2.75rem]">
              Benefits
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Professional service designed around accuracy, clarity, and dependable delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.benefits.map((benefit) => {
              const BenefitIcon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="bg-gradient-to-br from-soft-blue to-white rounded-2xl p-8 card-shadow-premium hover:scale-105 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <BenefitIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#151249] mb-3 text-center">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-blue px-6 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C4FF] to-blue-500 flex items-center justify-center shadow-xl">
                <Languages className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-[#151249] mb-6 text-3xl sm:text-4xl lg:text-[2.75rem]">
              Supported Languages
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
              We support major global and regional language pairs for business, official, and personal needs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow-premium">
            <div className="flex flex-wrap justify-center gap-3 text-[#151249]">
              {config.languages.map((lang) => (
                <span key={lang} className="font-semibold bg-soft-blue px-4 py-2 rounded-lg">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#151249] to-[#1e1a5e] text-white px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 world-map-pattern opacity-10"></div>
        <div className="blur-blob w-72 h-72 sm:w-96 sm:h-96 bg-yellow-400/20 bottom-10 right-10"></div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-white mb-6 text-3xl sm:text-4xl lg:text-[2.75rem]">
              {config.ctaTitle}
            </h2>
            <p className="text-xl sm:text-2xl text-yellow-400 mb-10 font-semibold">
              {config.ctaSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a
              href="tel:+917299005577"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#151249] font-bold hover:scale-105 transition-transform shadow-xl"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us</span>
            </a>

            <a
              href="https://wa.me/917299005577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-500 text-white font-bold hover:scale-105 transition-transform shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              to={contactPath}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#151249] font-bold hover:scale-105 transition-transform shadow-xl"
            >
              <Mail className="w-5 h-5" />
              <span>{config.quoteLabel}</span>
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Email</p>
                  <a href="mailto:sales@honeytranslations.com" className="text-white hover:text-yellow-400 transition-colors font-semibold break-all">
                    sales@honeytranslations.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Response Time</p>
                  <p className="text-white font-semibold">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function DocumentTranslationPage() {
  return <FooterServicePage config={serviceConfigs.document} />;
}

export function LegalTranslationPage() {
  return <FooterServicePage config={serviceConfigs.legal} />;
}

export function MedicalTranslationPage() {
  return <FooterServicePage config={serviceConfigs.medical} />;
}

export function TechnicalTranslationPage() {
  return <FooterServicePage config={serviceConfigs.technical} />;
}

export function SubtitlesTranscriptionPage() {
  return <FooterServicePage config={serviceConfigs.subtitles} />;
}

export function WebsiteLocalizationPage() {
  return <FooterServicePage config={serviceConfigs.website} />;
}

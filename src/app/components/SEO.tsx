import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const siteUrl = 'https://honeytranslation.ae';
const siteName = 'Honey Translation';
const defaultImage = `${siteUrl}/og-image.jpg`;
const logoUrl = `${siteUrl}/logo.png`;
const phone = '+91 72990 05577';
const email = 'sales@honeytranslations.com';

type LanguageCode = 'EN' | 'AR';

type SeoConfig = {
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  keywords: Record<LanguageCode, string>;
  type?: 'website' | 'article';
};

const uaeKeywords = {
  EN: 'certified translation UAE, certified translation Dubai, legal translation UAE, Arabic English translation UAE, document translation UAE, translation company Dubai, translation services Abu Dhabi, translation services Sharjah, UAE translator',
  AR: 'ترجمة معتمدة الإمارات, ترجمة معتمدة دبي, ترجمة قانونية الإمارات, ترجمة عربية إنجليزية الإمارات, ترجمة مستندات دبي, شركة ترجمة في دبي, خدمات ترجمة أبوظبي, خدمات ترجمة الشارقة, مترجم معتمد الإمارات',
};

const pageSeo: Record<string, SeoConfig> = {
  '/': {
    title: {
      EN: 'Certified Translation Services UAE & Dubai | Honey Translation',
      AR: 'خدمات ترجمة معتمدة في الإمارات ودبي | هوني للترجمة',
    },
    description: {
      EN: 'Honey Translation provides certified translation services in Dubai and across the UAE for legal, business, medical, technical, immigration, and official documents.',
      AR: 'تقدم هوني للترجمة خدمات ترجمة معتمدة في دبي وجميع أنحاء الإمارات للوثائق القانونية والتجارية والطبية والتقنية والهجرة والمستندات الرسمية.',
    },
    keywords: uaeKeywords,
  },
  '/about': {
    title: {
      EN: 'About Honey Translation | Certified Language Experts UAE',
      AR: 'عن هوني للترجمة | خبراء ترجمة معتمدون في الإمارات',
    },
    description: {
      EN: 'Learn about Honey Translation, a trusted provider of certified translation, interpretation, localization, and language support services in the UAE.',
      AR: 'تعرف على هوني للترجمة، مزود موثوق لخدمات الترجمة المعتمدة والترجمة الفورية والتوطين والدعم اللغوي في الإمارات.',
    },
    keywords: {
      EN: `about Honey Translation, certified translators UAE, translation company Dubai, language experts UAE, ${uaeKeywords.EN}`,
      AR: `عن هوني للترجمة, مترجمون معتمدون الإمارات, شركة ترجمة دبي, خبراء لغة الإمارات, ${uaeKeywords.AR}`,
    },
  },
  '/ceo': {
    title: {
      EN: 'CEO Message | Honey Translation UAE',
      AR: 'رسالة المدير التنفيذي | هوني للترجمة الإمارات',
    },
    description: {
      EN: 'Read the Honey Translation CEO message on quality, cultural accuracy, confidentiality, and professional language solutions in the UAE.',
      AR: 'اقرأ رسالة المدير التنفيذي لهوني للترجمة حول الجودة والدقة الثقافية والسرية وحلول اللغة الاحترافية في الإمارات.',
    },
    keywords: {
      EN: `Honey Translation CEO, UAE translation company founder, professional translation leadership, ${uaeKeywords.EN}`,
      AR: `مدير هوني للترجمة, قيادة شركة ترجمة الإمارات, ترجمة احترافية دبي, ${uaeKeywords.AR}`,
    },
  },
  '/team': {
    title: {
      EN: 'Our Translation Team | Certified Translators UAE',
      AR: 'فريق الترجمة لدينا | مترجمون معتمدون في الإمارات',
    },
    description: {
      EN: 'Meet the professional translators, interpreters, editors, and language specialists behind Honey Translation in the UAE.',
      AR: 'تعرف على المترجمين والمترجمين الفوريين والمحررين وخبراء اللغة المحترفين لدى هوني للترجمة في الإمارات.',
    },
    keywords: {
      EN: `translation team UAE, certified translators Dubai, interpreters UAE, language specialists, ${uaeKeywords.EN}`,
      AR: `فريق ترجمة الإمارات, مترجمون معتمدون دبي, مترجمون فوريون الإمارات, خبراء لغة, ${uaeKeywords.AR}`,
    },
  },
  '/mission-vision': {
    title: {
      EN: 'Mission and Vision | Honey Translation UAE',
      AR: 'الرسالة والرؤية | هوني للترجمة الإمارات',
    },
    description: {
      EN: 'Explore Honey Translation mission, vision, values, and commitment to precise, confidential, and culturally aware language services.',
      AR: 'اكتشف رسالة ورؤية وقيم هوني للترجمة والتزامها بخدمات لغوية دقيقة وسرية وواعية ثقافيا.',
    },
    keywords: {
      EN: `translation mission vision UAE, Honey Translation values, language service quality Dubai, ${uaeKeywords.EN}`,
      AR: `رسالة شركة ترجمة, رؤية هوني للترجمة, جودة خدمات لغوية دبي, ${uaeKeywords.AR}`,
    },
  },
  '/join-us': {
    title: {
      EN: 'Translator Careers UAE | Join Honey Translation',
      AR: 'وظائف مترجمين في الإمارات | انضم إلى هوني للترجمة',
    },
    description: {
      EN: 'Join Honey Translation as a translator, interpreter, editor, language trainer, or language service professional.',
      AR: 'انضم إلى هوني للترجمة كمترجم أو مترجم فوري أو محرر أو مدرب لغة أو متخصص في الخدمات اللغوية.',
    },
    keywords: {
      EN: `translator jobs UAE, interpreter careers Dubai, join translation company UAE, language jobs, ${uaeKeywords.EN}`,
      AR: `وظائف مترجمين الإمارات, وظائف ترجمة فورية دبي, انضم لشركة ترجمة, وظائف لغة, ${uaeKeywords.AR}`,
    },
  },
  '/testimonials': {
    title: {
      EN: 'Client Testimonials | Honey Translation Reviews UAE',
      AR: 'آراء العملاء | تقييمات هوني للترجمة في الإمارات',
    },
    description: {
      EN: 'Read client feedback about Honey Translation certified translation, interpretation, localization, and document services in the UAE.',
      AR: 'اقرأ آراء العملاء حول خدمات الترجمة المعتمدة والترجمة الفورية والتوطين وترجمة المستندات من هوني للترجمة في الإمارات.',
    },
    keywords: {
      EN: `Honey Translation reviews UAE, translation testimonials Dubai, certified translation feedback, ${uaeKeywords.EN}`,
      AR: `تقييمات هوني للترجمة, آراء عملاء ترجمة دبي, تقييم ترجمة معتمدة, ${uaeKeywords.AR}`,
    },
  },
  '/pricing': {
    title: {
      EN: 'Translation Pricing UAE | Certified Translation Quote',
      AR: 'أسعار الترجمة في الإمارات | عرض سعر ترجمة معتمدة',
    },
    description: {
      EN: 'Review translation pricing and request a quote for certified document translation, interpretation, localization, and related UAE language services.',
      AR: 'اطلع على أسعار الترجمة واطلب عرض سعر لترجمة المستندات المعتمدة والترجمة الفورية والتوطين والخدمات اللغوية في الإمارات.',
    },
    keywords: {
      EN: `translation pricing UAE, certified translation cost Dubai, translation quote UAE, legal translation price Dubai, ${uaeKeywords.EN}`,
      AR: `أسعار الترجمة الإمارات, تكلفة ترجمة معتمدة دبي, عرض سعر ترجمة الإمارات, سعر ترجمة قانونية دبي, ${uaeKeywords.AR}`,
    },
  },
  '/services': {
    title: {
      EN: 'Translation and Language Services UAE | Honey Translation',
      AR: 'خدمات الترجمة واللغات في الإمارات | هوني للترجمة',
    },
    description: {
      EN: 'Professional UAE translation, interpretation, localization, attestation, apostille, DTP, subtitling, transcription, language training, visa, and education support services.',
      AR: 'خدمات ترجمة ولغة احترافية في الإمارات تشمل الترجمة المعتمدة والفورية والتوطين والتصديق والأبوستيل والترجمة النصية والتفريغ والتدريب اللغوي ودعم التأشيرات والتعليم.',
    },
    keywords: {
      EN: `translation services UAE, interpretation services Dubai, localization UAE, attestation services Dubai, apostille service UAE, ${uaeKeywords.EN}`,
      AR: `خدمات ترجمة الإمارات, ترجمة فورية دبي, توطين الإمارات, خدمات تصديق دبي, أبوستيل الإمارات, ${uaeKeywords.AR}`,
    },
  },
  '/contact': {
    title: {
      EN: 'Contact Honey Translation UAE | Request a Translation Quote',
      AR: 'اتصل بهوني للترجمة الإمارات | اطلب عرض سعر ترجمة',
    },
    description: {
      EN: 'Contact Honey Translation for certified translation, interpretation, localization, attestation, apostille, and language service quotes in the UAE.',
      AR: 'تواصل مع هوني للترجمة للحصول على عروض أسعار لخدمات الترجمة المعتمدة والفورية والتوطين والتصديق والأبوستيل والخدمات اللغوية في الإمارات.',
    },
    keywords: {
      EN: `contact translation company UAE, translation quote Dubai, certified translation contact, UAE document translation, ${uaeKeywords.EN}`,
      AR: `اتصل بشركة ترجمة الإمارات, عرض سعر ترجمة دبي, تواصل ترجمة معتمدة, ترجمة مستندات الإمارات, ${uaeKeywords.AR}`,
    },
  },
  '/blog': {
    title: {
      EN: 'Translation Blog UAE | Language and Localization Insights',
      AR: 'مدونة الترجمة في الإمارات | مقالات اللغة والتوطين',
    },
    description: {
      EN: 'Read expert UAE articles on translation, localization, interpretation, business communication, legal translation, and global language trends.',
      AR: 'اقرأ مقالات متخصصة في الإمارات حول الترجمة والتوطين والترجمة الفورية والتواصل التجاري والترجمة القانونية واتجاهات اللغة العالمية.',
    },
    keywords: {
      EN: `translation blog UAE, localization articles Dubai, language insights, business translation tips UAE, ${uaeKeywords.EN}`,
      AR: `مدونة ترجمة الإمارات, مقالات توطين دبي, نصائح ترجمة الأعمال, مقالات لغة, ${uaeKeywords.AR}`,
    },
    type: 'article',
  },
  '/terms': {
    title: {
      EN: 'Terms and Conditions | Honey Translation UAE',
      AR: 'الشروط والأحكام | هوني للترجمة الإمارات',
    },
    description: {
      EN: 'Review the terms and conditions for using Honey Translation professional language services in the UAE.',
      AR: 'راجع الشروط والأحكام الخاصة باستخدام خدمات هوني للترجمة اللغوية الاحترافية في الإمارات.',
    },
    keywords: {
      EN: 'Honey Translation terms, UAE translation service terms, terms and conditions',
      AR: 'شروط هوني للترجمة, شروط خدمات الترجمة الإمارات, الشروط والأحكام',
    },
  },
  '/privacy': {
    title: {
      EN: 'Privacy Policy | Honey Translation UAE',
      AR: 'سياسة الخصوصية | هوني للترجمة الإمارات',
    },
    description: {
      EN: 'Learn how Honey Translation protects client data, uploaded documents, personal information, and confidential project details.',
      AR: 'تعرف على كيفية حماية هوني للترجمة لبيانات العملاء والمستندات المرفوعة والمعلومات الشخصية وتفاصيل المشاريع السرية.',
    },
    keywords: {
      EN: 'Honey Translation privacy, document confidentiality UAE, translation data protection Dubai',
      AR: 'خصوصية هوني للترجمة, سرية المستندات الإمارات, حماية بيانات الترجمة دبي',
    },
  },
  '/refund-policy': {
    title: {
      EN: 'Refund and Cancellation Policy | Honey Translation UAE',
      AR: 'سياسة الاسترداد والإلغاء | هوني للترجمة الإمارات',
    },
    description: {
      EN: 'Review Honey Translation refund and cancellation policy for translation, interpretation, and language service orders.',
      AR: 'راجع سياسة الاسترداد والإلغاء لدى هوني للترجمة لطلبات الترجمة والترجمة الفورية والخدمات اللغوية.',
    },
    keywords: {
      EN: 'translation refund policy UAE, cancellation policy, Honey Translation refund',
      AR: 'سياسة استرداد الترجمة الإمارات, سياسة الإلغاء, استرداد هوني للترجمة',
    },
  },
};

const serviceSeo: Record<string, Record<LanguageCode, string>> = {
  '/services/translation': { EN: 'Certified Translation Services UAE', AR: 'خدمات ترجمة معتمدة في الإمارات' },
  '/services/interpretation': { EN: 'Interpretation Services UAE', AR: 'خدمات ترجمة فورية في الإمارات' },
  '/services/apostille': { EN: 'Apostille Services UAE', AR: 'خدمات الأبوستيل في الإمارات' },
  '/services/proof-reading': { EN: 'Proofreading Services UAE', AR: 'خدمات التدقيق اللغوي في الإمارات' },
  '/services/dtp-typing': { EN: 'DTP and Typing Services UAE', AR: 'خدمات التنضيد والطباعة في الإمارات' },
  '/services/attestation': { EN: 'Document Attestation Services UAE', AR: 'خدمات تصديق المستندات في الإمارات' },
  '/services/overseas-education': { EN: 'Overseas Education Consultant Services UAE', AR: 'استشارات التعليم في الخارج في الإمارات' },
  '/services/carrier-coaching': { EN: 'Career Coaching Services UAE', AR: 'خدمات الإرشاد المهني في الإمارات' },
  '/services/visa-assistance': { EN: 'Visa Assistance Services UAE', AR: 'خدمات مساعدة التأشيرات في الإمارات' },
  '/services/study-abroad': { EN: 'Study Abroad Services UAE', AR: 'خدمات الدراسة في الخارج في الإمارات' },
  '/services/language-training': { EN: 'Language Training Services UAE', AR: 'خدمات تدريب اللغات في الإمارات' },
  '/services/content-writing': { EN: 'Content Writing Services UAE', AR: 'خدمات كتابة المحتوى في الإمارات' },
  '/services/localization': { EN: 'Website and Business Localization Services UAE', AR: 'خدمات توطين المواقع والأعمال في الإمارات' },
  '/services/voice-over-dubbing': { EN: 'Voice Over and Dubbing Services UAE', AR: 'خدمات التعليق الصوتي والدبلجة في الإمارات' },
  '/services/graphic-design': { EN: 'Graphic Design Services UAE', AR: 'خدمات التصميم الجرافيكي في الإمارات' },
  '/services/transcription': { EN: 'Transcription Services UAE', AR: 'خدمات التفريغ النصي في الإمارات' },
  '/services/subtitling': { EN: 'Subtitling Services UAE', AR: 'خدمات الترجمة النصية في الإمارات' },
};

const stripArabicPrefix = (pathname: string) => {
  if (pathname === '/ar') return '/';
  if (pathname.startsWith('/ar/')) return pathname.slice(3) || '/';
  return pathname || '/';
};

const localizedPath = (path: string, language: LanguageCode) => {
  if (language === 'AR') return path === '/' ? '/ar/' : `/ar${path}`;
  return path === '/' ? '/' : path;
};

const absoluteUrl = (path: string) => `${siteUrl}${path}`;

const getSeo = (basePath: string): SeoConfig => {
  if (pageSeo[basePath]) return pageSeo[basePath];

  const serviceTitle = serviceSeo[basePath];
  if (serviceTitle) {
    return {
      title: {
        EN: `${serviceTitle.EN} | Honey Translation`,
        AR: `${serviceTitle.AR} | هوني للترجمة`,
      },
      description: {
        EN: `${serviceTitle.EN} from Honey Translation with accurate delivery, confidentiality, expert support, and professional language service quality across the UAE.`,
        AR: `${serviceTitle.AR} من هوني للترجمة مع تسليم دقيق وسرية ودعم متخصص وجودة لغوية احترافية في جميع أنحاء الإمارات.`,
      },
      keywords: {
        EN: `${serviceTitle.EN}, Honey Translation, translation services UAE, language services Dubai, certified translation Abu Dhabi, Sharjah translation, ${uaeKeywords.EN}`,
        AR: `${serviceTitle.AR}, هوني للترجمة, خدمات ترجمة الإمارات, خدمات لغوية دبي, ترجمة معتمدة أبوظبي, ترجمة الشارقة, ${uaeKeywords.AR}`,
      },
    };
  }

  return pageSeo['/'];
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([name, value]) => element?.setAttribute(name, value));
};

const upsertLink = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([name, value]) => element?.setAttribute(name, value));
};

const createJsonLd = (basePath: string, currentPath: string, language: LanguageCode, seo: SeoConfig) => {
  const currentUrl = absoluteUrl(currentPath);
  const title = seo.title[language];
  const description = seo.description[language];
  const isService = basePath.startsWith('/services');
  const serviceTitle = serviceSeo[basePath]?.[language];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        legalName: 'Honey Translation',
        url: siteUrl,
        logo: logoUrl,
        image: defaultImage,
        email,
        telephone: phone,
        areaServed: 'AE',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: phone,
            email,
            contactType: 'customer service',
            areaServed: 'AE',
            availableLanguage: ['English', 'Arabic'],
          },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: siteName,
        url: siteUrl,
        image: defaultImage,
        priceRange: '$$',
        telephone: phone,
        email,
        areaServed: [
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'City', name: 'Dubai' },
          { '@type': 'City', name: 'Abu Dhabi' },
          { '@type': 'City', name: 'Sharjah' },
          { '@type': 'City', name: 'Ajman' },
          { '@type': 'City', name: 'Ras Al Khaimah' },
          { '@type': 'City', name: 'Fujairah' },
          { '@type': 'City', name: 'Umm Al Quwain' },
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AE',
          addressRegion: 'Dubai',
          addressLocality: 'Dubai',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.2048,
          longitude: 55.2708,
        },
        knowsLanguage: ['English', 'Arabic', 'Hindi', 'Chinese', 'Japanese', 'Spanish'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: ['en-AE', 'ar-AE'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/blog?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': isService ? 'Service' : 'WebPage',
        '@id': `${currentUrl}#webpage`,
        url: currentUrl,
        name: title,
        description,
        provider: { '@id': `${siteUrl}/#localbusiness` },
        areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
        inLanguage: language === 'AR' ? 'ar-AE' : 'en-AE',
        isPartOf: { '@id': `${siteUrl}/#website` },
        ...(isService && serviceTitle
          ? {
              serviceType: serviceTitle,
              offers: {
                '@type': 'Offer',
                areaServed: 'AE',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'AED',
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: language === 'AR' ? 'الرئيسية' : 'Home',
            item: absoluteUrl(localizedPath('/', language)),
          },
          ...(basePath === '/'
            ? []
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: title,
                  item: currentUrl,
                },
              ]),
        ],
      },
    ],
  };
};

export function SEO() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const basePath = stripArabicPrefix(pathname);
    const currentLanguage: LanguageCode = language;
    const seo = getSeo(basePath);
    const currentPath = localizedPath(basePath, currentLanguage);
    const canonical = absoluteUrl(currentPath);
    const englishUrl = absoluteUrl(localizedPath(basePath, 'EN'));
    const arabicUrl = absoluteUrl(localizedPath(basePath, 'AR'));
    const locale = currentLanguage === 'AR' ? 'ar_AE' : 'en_AE';
    const alternateLocale = currentLanguage === 'AR' ? 'en_AE' : 'ar_AE';

    document.documentElement.lang = currentLanguage === 'AR' ? 'ar-AE' : 'en-AE';
    document.documentElement.dir = 'ltr';
    document.title = seo.title[currentLanguage];

    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description[currentLanguage] });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: seo.keywords[currentLanguage] });
    upsertMeta('meta[name="author"]', { name: 'author', content: siteName });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    upsertMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'AE-DU' });
    upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Dubai, United Arab Emirates' });
    upsertMeta('meta[name="ICBM"]', { name: 'ICBM', content: '25.2048, 55.2708' });

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type ?? 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title[currentLanguage] });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description[currentLanguage] });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: defaultImage });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: currentLanguage === 'AR' ? 'خدمات ترجمة معتمدة في الإمارات من هوني للترجمة' : 'Honey Translation certified translation services in the UAE' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale });
    upsertMeta('meta[property="og:locale:alternate"]', { property: 'og:locale:alternate', content: alternateLocale });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title[currentLanguage] });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description[currentLanguage] });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: defaultImage });

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    upsertLink('link[rel="alternate"][hreflang="en-AE"]', { rel: 'alternate', hreflang: 'en-AE', href: englishUrl });
    upsertLink('link[rel="alternate"][hreflang="ar-AE"]', { rel: 'alternate', hreflang: 'ar-AE', href: arabicUrl });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: englishUrl });
    upsertLink('link[rel="sitemap"]', { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' });

    let jsonLd = document.getElementById('route-json-ld') as HTMLScriptElement | null;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'route-json-ld';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(createJsonLd(basePath, currentPath, currentLanguage, seo));
  }, [language, pathname]);

  return null;
}

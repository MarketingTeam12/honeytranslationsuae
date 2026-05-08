import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

type SeoEntry = {
  titleEn: string;
  descriptionEn: string;
  keywordsEn: string;
  titleAr: string;
  descriptionAr: string;
  keywordsAr: string;
  headingAr: string;
};

const defaultSeo: SeoEntry = {
  titleEn: 'Honey Translation UAE | Certified Translation Services in Dubai',
  descriptionEn: 'Certified translation services in the UAE for legal, business, medical, technical, website, and official documents with fast, confidential delivery.',
  keywordsEn: 'certified translation UAE, translation services Dubai, Arabic translation UAE, legal translation Dubai, document translation UAE, Honey Translation',
  titleAr: 'هوني للترجمة الإمارات | خدمات ترجمة معتمدة في دبي',
  descriptionAr: 'خدمات ترجمة معتمدة في الإمارات للوثائق القانونية والتجارية والطبية والتقنية والمواقع والمستندات الرسمية مع تسليم سريع وسري.',
  keywordsAr: 'ترجمة معتمدة الإمارات, خدمات ترجمة دبي, ترجمة عربية الإمارات, ترجمة قانونية دبي, ترجمة مستندات الإمارات, هوني للترجمة',
  headingAr: 'خدمات ترجمة معتمدة في الإمارات'
};

const routeSeo: Record<string, Partial<SeoEntry>> = {
  '/': {
    titleEn: 'Honey Translation UAE | Certified Arabic Translation Services',
    titleAr: 'هوني للترجمة الإمارات | خدمات ترجمة عربية معتمدة',
    headingAr: 'خدمات ترجمة عربية معتمدة في الإمارات'
  },
  '/about': {
    titleEn: 'About Honey Translation UAE | Professional Translation Company',
    titleAr: 'عن هوني للترجمة الإمارات | شركة ترجمة احترافية',
    headingAr: 'عن هوني للترجمة'
  },
  '/ceo': {
    titleEn: 'CEO Message | Honey Translation UAE',
    titleAr: 'رسالة المدير التنفيذي | هوني للترجمة الإمارات',
    headingAr: 'رسالة المدير التنفيذي'
  },
  '/team': {
    titleEn: 'Our Translation Team | Honey Translation UAE',
    titleAr: 'فريق الترجمة لدينا | هوني للترجمة الإمارات',
    headingAr: 'فريق الترجمة لدينا'
  },
  '/mission-vision': {
    titleEn: 'Mission and Vision | Honey Translation UAE',
    titleAr: 'الرسالة والرؤية | هوني للترجمة الإمارات',
    headingAr: 'رسالتنا ورؤيتنا'
  },
  '/join-us': {
    titleEn: 'Join Honey Translation UAE | Translator Careers',
    titleAr: 'انضم إلى هوني للترجمة الإمارات | فرص للمترجمين',
    headingAr: 'انضم إلى فريق هوني للترجمة'
  },
  '/testimonials': {
    titleEn: 'Client Testimonials | Honey Translation UAE',
    titleAr: 'آراء العملاء | هوني للترجمة الإمارات',
    headingAr: 'آراء عملائنا'
  },
  '/pricing': {
    titleEn: 'Translation Pricing UAE | Honey Translation',
    titleAr: 'أسعار الترجمة في الإمارات | هوني للترجمة',
    headingAr: 'أسعار ترجمة واضحة وشفافة'
  },
  '/services': {
    titleEn: 'Translation Services UAE | Honey Translation Dubai',
    titleAr: 'خدمات الترجمة في الإمارات | هوني للترجمة دبي',
    headingAr: 'خدمات الترجمة في الإمارات'
  },
  '/contact': {
    titleEn: 'Contact Honey Translation UAE | Translation Quote Dubai',
    titleAr: 'اتصل بهوني للترجمة الإمارات | عرض سعر ترجمة في دبي',
    headingAr: 'تواصل مع هوني للترجمة'
  },
  '/blog': {
    titleEn: 'Translation Blog UAE | Honey Translation Insights',
    titleAr: 'مدونة الترجمة في الإمارات | مقالات هوني للترجمة',
    headingAr: 'مقالات ورؤى حول الترجمة'
  },
  '/terms': {
    titleEn: 'Terms and Conditions | Honey Translation UAE',
    titleAr: 'الشروط والأحكام | هوني للترجمة الإمارات',
    headingAr: 'الشروط والأحكام'
  },
  '/privacy': {
    titleEn: 'Privacy Policy | Honey Translation UAE',
    titleAr: 'سياسة الخصوصية | هوني للترجمة الإمارات',
    headingAr: 'سياسة الخصوصية'
  },
  '/refund-policy': {
    titleEn: 'Refund and Cancellation Policy | Honey Translation UAE',
    titleAr: 'سياسة الاسترداد والإلغاء | هوني للترجمة الإمارات',
    headingAr: 'سياسة الاسترداد والإلغاء'
  }
};

const serviceNamesAr: Record<string, string> = {
  '/services/translation': 'خدمة الترجمة المعتمدة',
  '/services/interpretation': 'خدمة الترجمة الفورية',
  '/services/apostille': 'خدمة الأبوستيل',
  '/services/proof-reading': 'خدمة التدقيق اللغوي',
  '/services/dtp-typing': 'خدمة التنضيد والطباعة',
  '/services/attestation': 'خدمة التصديق',
  '/services/overseas-education': 'استشارات التعليم في الخارج',
  '/services/carrier-coaching': 'خدمة الإرشاد المهني',
  '/services/visa-assistance': 'خدمة المساعدة في التأشيرات',
  '/services/study-abroad': 'خدمة الدراسة في الخارج',
  '/services/language-training': 'خدمة تدريب اللغات',
  '/services/content-writing': 'خدمة كتابة المحتوى',
  '/services/localization': 'خدمة التوطين',
  '/services/voice-over-dubbing': 'خدمة التعليق الصوتي والدبلجة',
  '/services/graphic-design': 'خدمة التصميم الجرافيكي',
  '/services/transcription': 'خدمة التفريغ النصي',
  '/services/subtitling': 'خدمة الترجمة النصية'
};

const exactTextAr: Record<string, string> = {
  'EN': 'الإنجليزية',
  'AR': 'العربية',
  'Call Us': 'اتصل بنا',
  'WhatsApp Us': 'راسلنا عبر واتساب',
  'Request a Free Quote': 'اطلب عرض سعر مجاني',
  'Request a Quote': 'اطلب عرض سعر',
  'Read More': 'اقرأ المزيد',
  'Featured': 'مميز',
  'Latest Updates': 'آخر التحديثات',
  'Insights & Articles': 'مقالات ورؤى',
  'Subscribe Now': 'اشترك الآن',
  'Email': 'البريد الإلكتروني',
  'Email Us': 'راسلنا عبر البريد الإلكتروني',
  'Contact Page': 'صفحة التواصل',
  'Response Time': 'وقت الرد',
  'Within 24 hours': 'خلال 24 ساعة',
  'Honey Translation': 'هوني للترجمة',
  'Honey Translation Services': 'خدمات هوني للترجمة',
  'Important Notice': 'تنبيه مهم',
  'View Refund Policy': 'عرض سياسة الاسترداد',
  'Leave a Review': 'اترك تقييما',
  'Client Testimonials': 'آراء العملاء',
  'Featured Testimonials': 'آراء مميزة',
  'Share Your Experience': 'شارك تجربتك',
  'No Articles Found': 'لم يتم العثور على مقالات',
  'Try selecting a different category': 'جرّب اختيار فئة مختلفة',
  'Stay Updated With Language Insights': 'ابق على اطلاع بأحدث رؤى اللغة',
  'Enter your email address': 'أدخل بريدك الإلكتروني',
  'We respect your privacy. Unsubscribe at any time.': 'نحترم خصوصيتك ويمكنك إلغاء الاشتراك في أي وقت.',
  'Page': 'الصفحة',
  'of': 'من'
};

const categoryAr: Record<string, string> = {
  All: 'الكل',
  Translation: 'الترجمة',
  Localization: 'التوطين',
  Business: 'الأعمال',
  Languages: 'اللغات',
  Culture: 'الثقافة',
  'Industry Trends': 'اتجاهات القطاع'
};

const originalTextNodes = new WeakMap<Text, string>();
const originalPlaceholderAttribute = 'data-original-placeholder';

function getSeo(pathname: string): SeoEntry {
  const serviceName = serviceNamesAr[pathname];
  if (serviceName) {
    return {
      ...defaultSeo,
      titleEn: `${serviceName} UAE | Honey Translation Dubai`,
      titleAr: `${serviceName} في الإمارات | هوني للترجمة دبي`,
      descriptionAr: `${serviceName} في الإمارات من هوني للترجمة مع دقة لغوية وسرية كاملة وتسليم سريع للشركات والأفراد.`,
      keywordsAr: `${serviceName}, ترجمة معتمدة الإمارات, خدمات ترجمة دبي, هوني للترجمة`,
      headingAr: serviceName
    };
  }

  return { ...defaultSeo, ...(routeSeo[pathname] || {}) };
}

function ensureMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([name, value]) => element?.setAttribute(name, value));
}

function updateSeo(language: string, pathname: string) {
  const seo = getSeo(pathname);
  const isArabic = language === 'AR';
  const title = isArabic ? seo.titleAr : seo.titleEn;
  const description = isArabic ? seo.descriptionAr : seo.descriptionEn;
  const keywords = isArabic ? seo.keywordsAr : seo.keywordsEn;
  const locale = isArabic ? 'ar_AE' : 'en_AE';

  document.documentElement.lang = isArabic ? 'ar-AE' : 'en-AE';
  document.documentElement.dir = 'ltr';
  document.title = title;

  ensureMeta('meta[name="description"]', { name: 'description', content: description });
  ensureMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
  ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  ensureMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale });
  ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
}

function fallbackArabic(element: Element, pathname: string) {
  const seo = getSeo(pathname);
  const tag = element.tagName.toLowerCase();
  const isAction = tag === 'button' || tag === 'a' || element.closest('button,a');
  const isHeading = /^h[1-6]$/.test(tag);

  if (isAction) return 'اطلب الخدمة';
  if (isHeading) return seo.headingAr;
  if (tag === 'li') return 'خدمة احترافية بدقة عالية وسرية كاملة داخل الإمارات.';
  return 'نقدم خدمات ترجمة عربية معتمدة في الإمارات بدقة عالية وسرية كاملة وتسليم سريع يناسب احتياجات الأفراد والشركات.';
}

function arabizeText(text: string, element: Element, pathname: string) {
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (!/[A-Za-zÀ-ÿ]/.test(trimmed)) return text;
  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(trimmed)) return text;
  if (/^https?:\/\//.test(trimmed)) return text;
  if (exactTextAr[trimmed]) return text.replace(trimmed, exactTextAr[trimmed]);
  if (categoryAr[trimmed]) return text.replace(trimmed, categoryAr[trimmed]);
  if (/^\d+\s*min read$/i.test(trimmed)) return text.replace(trimmed, 'قراءة قصيرة');
  if (/^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/.test(trimmed)) return text.replace(trimmed, 'تاريخ النشر');
  return text.replace(trimmed, fallbackArabic(element, pathname));
}

function sanitizeArabicDom(root: ParentNode, pathname: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    if (!parent) continue;
    if (parent.closest('script,style,noscript,svg')) continue;
    if (parent.closest('[data-allow-latin]')) continue;
    textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent) return;
    const next = arabizeText(node.nodeValue || '', parent, pathname);
    if (next !== node.nodeValue) {
      if (!originalTextNodes.has(node)) {
        originalTextNodes.set(node, node.nodeValue || '');
      }
      node.nodeValue = next;
    }
  });

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[placeholder], textarea[placeholder]').forEach((input) => {
    const placeholder = input.getAttribute('placeholder') || '';
    if (/[A-Za-zÀ-ÿ]/.test(placeholder)) {
      if (!input.hasAttribute(originalPlaceholderAttribute)) {
        input.setAttribute(originalPlaceholderAttribute, placeholder);
      }
      input.setAttribute('placeholder', arabizeText(placeholder, input, pathname));
    }
  });
}

function restoreEnglishDom(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    const original = originalTextNodes.get(node);
    if (original !== undefined && node.nodeValue !== original) {
      node.nodeValue = original;
    }
  });

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[${originalPlaceholderAttribute}]`).forEach((input) => {
    const original = input.getAttribute(originalPlaceholderAttribute);
    if (original !== null) {
      input.setAttribute('placeholder', original);
      input.removeAttribute(originalPlaceholderAttribute);
    }
  });
}

export function ArabicContentGuard() {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (language !== 'AR') {
      restoreEnglishDom(document.body);
      return;
    }

    const run = () => sanitizeArabicDom(document.body, location.pathname);
    run();
    const frame = window.requestAnimationFrame(run);
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [language, location.pathname]);

  return null;
}

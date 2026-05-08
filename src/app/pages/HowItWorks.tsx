import { UserPlus, Search, Users, MessageCircle, CreditCard } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function HowItWorks() {
  const { t } = useLanguage();
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-[#151249] text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl mb-6 font-bold">{t('howItWorks.hero.title')}</h1>
          <p className="text-xl text-white/90">
            {t('howItWorks.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#151249] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <UserPlus className="w-8 h-8 text-[#151249]" />
                  <h2 className="text-3xl text-[#151249] font-bold">{t('howItWorks.step1.title')}</h2>
                </div>
                <p className="text-lg text-[#1A1A1A]">
                  {t('howItWorks.step1.description')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#151249] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Search className="w-8 h-8 text-[#151249]" />
                  <h2 className="text-3xl text-[#151249] font-bold">{t('howItWorks.step2.title')}</h2>
                </div>
                <p className="text-lg text-[#1A1A1A]">
                  {t('howItWorks.step2.description')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#151249] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-8 h-8 text-[#151249]" />
                  <h2 className="text-3xl text-[#151249] font-bold">{t('howItWorks.step3.title')}</h2>
                </div>
                <p className="text-lg text-[#1A1A1A]">
                  {t('howItWorks.step3.description')}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#151249] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  4
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <MessageCircle className="w-8 h-8 text-[#151249]" />
                  <h2 className="text-3xl text-[#151249] font-bold">{t('howItWorks.step4.title')}</h2>
                </div>
                <p className="text-lg text-[#1A1A1A]">
                  {t('howItWorks.step4.description')}
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#151249] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  5
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <CreditCard className="w-8 h-8 text-[#151249]" />
                  <h2 className="text-3xl text-[#151249] font-bold">{t('howItWorks.step5.title')}</h2>
                </div>
                <p className="text-lg text-[#1A1A1A]">
                  {t('howItWorks.step5.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Strip */}
      <section className="py-12 bg-[#F7F8FC] px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xl text-[#151249] font-semibold">
            {t('howItWorks.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#151249] to-[#2A257A] text-white px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl mb-6 font-bold">Ready to break language barriers?</h2>
          <a href="/signup" className="inline-block px-8 py-4 bg-white text-[#151249] rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-lg">
            Create Your Account
          </a>
        </div>
      </section>
    </div>
  );
}

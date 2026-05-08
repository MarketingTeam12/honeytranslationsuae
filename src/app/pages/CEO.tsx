import { Award, Lightbulb, BookOpen, TrendingUp, Users, Shield } from 'lucide-react';
import { useEffect } from 'react';
import ceoImage from 'figma:asset/b0d14bd522bbad9bc3ad1bc4a715499495dbf1d0.png';

export function CEO() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-zoom');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-16">
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50/30 py-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-zoom flex justify-center lg:justify-start">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{
                  boxShadow: '0 30px 60px rgba(21, 18, 73, 0.2), 0 0 0 1px rgba(250, 204, 21, 0.3)'
                }}>
                  <img
                    src={ceoImage}
                    alt="Founder and CEO of Honey Translation Services"
                    className="w-full h-auto object-cover"
                    style={{ maxWidth: '500px' }}
                    width="500"
                    height="500"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#151249] rounded-full font-bold mb-6 shadow-lg">
                Founder and CEO
              </div>

              <h1 className="text-5xl md:text-6xl text-[#151249] font-black mb-6 leading-tight">
                A Visionary Message from the{' '}
                <span className="gradient-text-shine">CEO</span>
              </h1>

              <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mb-8"></div>

              <p className="text-2xl text-[#151249] font-semibold mb-6 italic leading-relaxed">
                Founder and CEO, Honey Translation Services
              </p>

              <div className="relative bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-400 p-6 rounded-r-2xl shadow-lg mb-8">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  "Language is not just a tool for communication; it is a bridge that connects cultures, fosters understanding, and drives global progress."
                </p>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                With years of experience in the translation industry, our mission is to break language barriers and create meaningful connections worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl text-[#151249] font-bold mb-12 text-center">
              CEO Message
            </h2>
          </div>

          <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
            <div className="reveal-on-scroll" style={{ animationDelay: '100ms' }}>
              <p>Dear clients and partners,</p>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '200ms' }}>
              <p>
                Language is not just a tool for communication; it is a bridge that connects cultures, fosters understanding, and drives global progress. At <strong>Honey Translation Services</strong>, we have dedicated ourselves to making that bridge stronger, more reliable, and accessible to everyone.
              </p>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '300ms' }}>
              <p>
                Our journey began with a simple but powerful vision: to provide translation services that go beyond words. We strive to deliver meaning, context, and cultural relevance in every project. Whether it is a legal document, marketing campaign, or technical content, we handle every assignment with the highest care and precision.
              </p>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '400ms' }}>
              <p>
                What sets us apart is our unwavering commitment to quality, integrity, and innovation. Our team of professional translators and linguists brings not only expertise, but also deep respect for the languages and cultures they work with. We believe every word carries weight and every translation has the power to make a difference.
              </p>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '500ms' }}>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent my-8"></div>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '600ms' }}>
              <p>
                In today's interconnected world, businesses and individuals need more than accurate translations - they need partners who understand their goals and provide solutions aligned with their vision. That is exactly what we aim to be: a trusted partner in your global journey.
              </p>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '700ms' }}>
              <p>
                As we continue to grow and evolve, our goal remains constant: to exceed expectations, meet challenges, and set new standards in the translation industry. We are proud of the relationships we have built and the trust you place in us. Together, we break barriers and create opportunities.
              </p>
            </div>

            <div className="reveal-on-scroll" style={{ animationDelay: '800ms' }}>
              <p>
                Thank you for being part of our journey. We look forward to serving you with excellence, dedication, and passion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-yellow-50/20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-5xl text-[#151249] font-bold mb-4">Our Commitment</h2>
            <p className="text-xl text-gray-600">The values that define our service excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Accuracy',
                description: 'Providing precise and contextually relevant translations for clear communication.',
                color: 'from-yellow-400 to-yellow-500',
                delay: '100ms'
              },
              {
                icon: Users,
                title: 'Cultural Sensitivity',
                description: 'Ensuring every translation is adapted to reflect the nuances of each culture.',
                color: 'from-blue-400 to-blue-500',
                delay: '200ms'
              },
              {
                icon: Shield,
                title: 'High Quality Standards',
                description: 'Maintaining exceptional quality and global best practices.',
                color: 'from-green-400 to-green-500',
                delay: '300ms'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="reveal-on-scroll relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group border border-white/50"
                style={{
                  animationDelay: item.delay,
                  boxShadow: '0 10px 40px rgba(21, 18, 73, 0.1)'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all duration-300`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#151249] mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-white px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-5xl text-[#151249] font-bold mb-4">How We Sustain in the Industry</h2>
            <p className="text-xl text-gray-600">Our competitive advantage and sustainability strategies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Continuous Learning',
                description: 'Investing in training and development to stay ahead in the evolving language landscape.',
                color: 'from-purple-400 to-purple-500',
                delay: '100ms'
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                description: 'Adopting advanced technologies to streamline processes and improve service delivery.',
                color: 'from-orange-400 to-orange-500',
                delay: '200ms'
              },
              {
                icon: TrendingUp,
                title: 'Client-Centered Approach',
                description: 'Building long-term relationships by understanding client needs and providing tailored solutions.',
                color: 'from-teal-400 to-teal-500',
                delay: '300ms'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="reveal-on-scroll relative bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100"
                style={{
                  animationDelay: item.delay,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#151249] mb-4 relative">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed relative">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#151249] via-[#1e1a5e] to-[#151249] text-white px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 reveal-on-scroll">
          <p className="text-2xl leading-relaxed mb-12 text-white/90">
            Thank you for choosing <strong className="text-yellow-400">Honey Translation Services</strong>. We are honored to be your partner in breaking language barriers and unlocking global opportunities.
          </p>

          <div className="inline-block">
            <div className="mb-6">
              <div className="h-px w-64 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-6"></div>
              <p className="text-3xl font-bold mb-2 text-yellow-400">Sibi Chakravarthy</p>
              <p className="text-lg text-white/80">Founder and Chief Executive Officer</p>
              <p className="text-md text-white/60 mt-2">Honey Translation Services</p>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-yellow-400/50"></div>
            <Award className="w-6 h-6 text-yellow-400" />
            <div className="h-px w-12 bg-yellow-400/50"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

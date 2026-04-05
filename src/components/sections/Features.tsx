import { ScrollReveal } from '../ui/ScrollReveal';

interface FeatureItem {
  title: string;
  description: string;
  largeImage?: string | null;
  // UPDATED Interface
  icon: {
    discriminant: 'emoji' | 'image';
    value?: string | null;
  };
  colorTheme: 'orange' | 'pink' | 'blue' | 'purple' | 'green';
}

interface FeaturesProps {
  data: {
    featuresTitle: string;
    featuresSubtitle: string;
    featureList: FeatureItem[];
  };
}

export default function Features({ data }: FeaturesProps) {
  const themeMap = {
    orange: {
      gradient: "from-orange-400 to-amber-500",
      bgIcon: "bg-orange-100 dark:bg-orange-900/30",
    },
    pink: {
      gradient: "from-pink-500 to-rose-600",
      bgIcon: "bg-pink-100 dark:bg-pink-900/30",
    },
    blue: {
      gradient: "from-sky-400 to-blue-500",
      bgIcon: "bg-sky-100 dark:bg-sky-900/30",
    },
    purple: {
      gradient: "from-purple-500 to-indigo-600",
      bgIcon: "bg-purple-100 dark:bg-purple-900/30",
    },
    green: {
      gradient: "from-emerald-400 to-green-600",
      bgIcon: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  };

  return (
    <section id="vision" className="py-16 md:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Intro */}
        <ScrollReveal width="100%">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-32">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
              {data.featuresTitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-light whitespace-pre-line">
              {data.featuresSubtitle}
            </p>
          </div>
        </ScrollReveal>

        {data.featureList.map((feature, index) => {
          const style = themeMap[feature.colorTheme] || themeMap.blue;
          const isReversed = index % 2 !== 0;

          // Resolve Icons with Fallbacks (Updated Logic)
          const smallIconContent = feature.icon.discriminant === 'emoji' ? (
             <span className="text-4xl">{feature.icon.value || '✨'}</span>
          ) : (
             <img src={feature.icon.value || '/images/placeholder.svg'} alt={feature.title} className="w-full h-full object-contain" />
          );

          const largeVisualContent = feature.largeImage ? (
             <img src={feature.largeImage} alt={feature.title} className="w-full h-full object-cover mix-blend-normal opacity-90 hover:opacity-100 transition-opacity" />
          ) : (
             <div className="absolute inset-0 bg-white/10 mix-blend-overlay flex items-center justify-center">
                {feature.icon.discriminant === 'emoji' ? (
                   <span className="text-9xl drop-shadow-md">{feature.icon.value || '✨'}</span>
                ) : (
                   <img src={feature.icon.value || '/images/placeholder.svg'} alt={feature.title} className="w-32 h-32 object-contain drop-shadow-md" />
                )}
             </div>
          );

          return (
            <div key={index} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-32 last:mb-0">
              <div className={`${isReversed ? 'order-2 md:order-1' : ''}`}>
                 {isReversed ? (
                    // Text side (Reversed)
                     <ScrollReveal width="100%">
                      <div>
                        <div className={`w-16 h-16 rounded-2xl ${style.bgIcon} flex items-center justify-center mb-6 p-3`}>
                           {smallIconContent}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {feature.description}
                        </p>
                      </div>
                    </ScrollReveal>
                 ) : (
                    // Image side (Normal)
                    <ScrollReveal width="100%">
                      <div className={`relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br ${style.gradient} shadow-2xl flex items-center justify-center transform hover:scale-[1.02] transition-transform p-0`}>
                        {largeVisualContent}
                      </div>
                    </ScrollReveal>
                 )}
              </div>
              
              <div className={`${isReversed ? 'order-1 md:order-2' : ''}`}>
                 {isReversed ? (
                    // Image side (Reversed)
                    <ScrollReveal width="100%" delay={0.2}>
                      <div className={`relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-bl ${style.gradient} shadow-2xl flex items-center justify-center transform hover:scale-[1.02] transition-transform p-0`}>
                          {largeVisualContent}
                      </div>
                    </ScrollReveal>
                 ) : (
                   // Text side (Normal)
                   <ScrollReveal width="100%" delay={0.2}>
                    <div>
                      <div className={`w-16 h-16 rounded-2xl ${style.bgIcon} flex items-center justify-center mb-6 p-3`}>
                        {smallIconContent}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {feature.description}
                      </p>
                    </div>
                  </ScrollReveal>
                 )}
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
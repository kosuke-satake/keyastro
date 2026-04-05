import { ScrollReveal } from '../ui/ScrollReveal';

interface StatsProps {
  data: {
    statsTitle?: string | null;
    statsSubtitle?: string | null;
    statsList?: { label: string; value: string }[] | null;
  };
}

export default function Stats({ data }: StatsProps) {
  // Default values if data is missing (fallback)
  const stats = data.statsList || [
    { label: 'Active Members', value: '150+' },
    { label: 'Countries Represented', value: '25+' },
    { label: 'Annual Events', value: '40+' },
    { label: 'University Labs', value: '30+' },
  ];
  const title = data.statsTitle || "Growing every day.";
  const subtitle = data.statsSubtitle || "Our impact across the campus and beyond.";

  return (
    <div className="bg-white dark:bg-black py-16 sm:py-32 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal width="100%">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-y-10 gap-x-8 text-center sm:grid-cols-2 lg:grid-cols-4 sm:gap-y-16">
              {stats.map((stat) => (
                <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">{stat.label}</dt>
                  <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

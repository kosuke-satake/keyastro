import { defineCollection, z } from 'astro:content';

// Helper for robust date parsing
const dateSchema = z.string().or(z.date())
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), { message: "Invalid date format" });

// Helper for media references (Keystatic libraryImageField)
const libraryImageSchema = z.discriminatedUnion('discriminant', [
  z.object({ discriminant: z.literal('blog'), value: z.string() }),
  z.object({ discriminant: z.literal('events'), value: z.string() }),
  z.object({ discriminant: z.literal('members'), value: z.string() }),
  z.object({ discriminant: z.literal('others'), value: z.string() }),
  z.object({ discriminant: z.literal('none'), value: z.unknown().optional() }),
]).optional().nullable();

const postSchema = z.object({
  publishedDate: dateSchema,
  coverImage: libraryImageSchema,
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  summary: z.string(),
});

const leaderSchema = z.object({
  category: z.enum(['active', 'alumni', 'advisor']).default('active'),
  joinedDate: dateSchema,
  leftDate: dateSchema.optional().nullable(),
  avatar: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  name: z.string(),
  role: z.string(),
});

const eventSchema = z.object({
  date: dateSchema,
  endTime: dateSchema.optional().nullable(),
  coverImage: libraryImageSchema,
  isPast: z.boolean().default(false),
  title: z.string(),
  location: z.string(),
  fee: z.string().optional().nullable(),
});

const newsSchema = z.object({
  publishedDate: dateSchema,
  important: z.boolean().default(false),
  title: z.string(),
});

const mediaSchema = z.object({
  name: z.string(),
  file: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

// Collections
const postsEN = defineCollection({ type: 'content', schema: postSchema });
const postsJA = defineCollection({ type: 'content', schema: postSchema });

const membersEN = defineCollection({ type: 'content', schema: leaderSchema });
const membersJA = defineCollection({ type: 'content', schema: leaderSchema });

const eventsEN = defineCollection({ type: 'content', schema: eventSchema });
const eventsJA = defineCollection({ type: 'content', schema: eventSchema });

const newsEN = defineCollection({ type: 'content', schema: newsSchema });
const newsJA = defineCollection({ type: 'content', schema: newsSchema });

const mediaBlog = defineCollection({ type: 'data', schema: mediaSchema });
const mediaEvents = defineCollection({ type: 'data', schema: mediaSchema });
const mediaMembers = defineCollection({ type: 'data', schema: mediaSchema });
const mediaOthers = defineCollection({ type: 'data', schema: mediaSchema });

// Singletons (Data type)
const homepage = defineCollection({
  type: 'data',
  schema: z.object({
    heroSubtitle: z.string(),
    heroTitle: z.string(),
    heroTypewriterWords: z.array(z.string()),
    heroDescription: z.string(),
    ctaJoin: z.string(),
    ctaLearn: z.string(),
    featuresTitle: z.string(),
    featuresSubtitle: z.string(),
    featureList: z.array(z.object({
      title: z.string(),
      description: z.string(),
      largeImage: libraryImageSchema,
      icon: z.discriminatedUnion('discriminant', [
        z.object({ discriminant: z.literal('emoji'), value: z.string().nullable().optional() }),
        z.object({ discriminant: z.literal('image'), value: libraryImageSchema }),
      ]),
      colorTheme: z.enum(['orange', 'pink', 'blue', 'purple', 'green']),
    })),
    statsTitle: z.string().optional().nullable(),
    statsSubtitle: z.string().optional().nullable(),
    statsList: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional().nullable(),
    blogTitle: z.string().optional().nullable(),
    blogSubtitle: z.string().optional().nullable(),
    eventsTitle: z.string().optional().nullable(),
    eventsSubtitle: z.string().optional().nullable(),
  })
});

const about = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    section1Title: z.string(),
    section1Content: z.string(),
    section2Title: z.string(),
    mission1Title: z.string(),
    mission1Desc: z.string(),
    mission2Title: z.string(),
    mission2Desc: z.string(),
    section3Title: z.string(),
    activities: z.array(z.string()),
    galleryTitle: z.string().optional(),
    galleryImages: z.array(libraryImageSchema).optional().default([])
  })
});

const join = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    membershipTitle: z.string(),
    membershipBadge: z.string().optional(),
    membershipContent: z.string(),
    membershipButtonText: z.string().optional(),
    membershipButtonLink: z.string().optional(),
    joinSteps: z.array(z.object({
      title: z.string(),
      desc: z.string(),
      icon: z.string()
    })).optional().default([]),
    followTitle: z.string().optional(),
    visualTagline: z.string().optional(),
    memberTitle: z.string(),
    memberBadge: z.string().optional(),
    memberContent: z.string(),
    requirementsTitle: z.string(),
    requirementsList: z.array(z.string()),
    applyButtonText: z.string(),
    applyButtonLink: z.string().optional().nullable(),
    applyButtonNote: z.string().optional(),
    faqTitle: z.string(),
    faqSubtitle: z.string().optional(),
    faqList: z.array(z.object({
      question: z.string(),
      answer: z.string()
    }))
  })
});

const eventsPage = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    calendarUrl: z.string().optional()
  })
});

const global = defineCollection({
  type: 'data',
  schema: z.object({
    siteTitle: z.string().optional().nullable(),
    siteDescription: z.string().optional().nullable(),
    siteImage: libraryImageSchema,
    footerDescription: z.string(),
    footerLinksTitle: z.string(),
    footerConnectTitle: z.string(),
    footerRightsText: z.string(),
    navHome: z.string(),
    navAbout: z.string(),
    navMembers: z.string(),
    navBlog: z.string(),
    navEvents: z.string(),
    navJoin: z.string(),
    navContact: z.string().optional().default('Contact'),
    navPrivacy: z.string().optional().default('Privacy Policy'),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string(),
      icon: z.string(),
      customIcon: libraryImageSchema,
    })).optional().default([]),
  })
});

const contact = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    googleFormUrl: z.string(),
    infoTitle: z.string(),
    infoText: z.string(),
  })
});

const privacy = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    lastUpdated: dateSchema,
  })
});

export const collections = { 
  postsEN, postsJA, 
  membersEN, membersJA, 
  eventsEN, eventsJA, 
  newsEN, newsJA,
  mediaBlog, mediaEvents, mediaMembers, mediaOthers, 
  homepage, about, eventsPage, join, global,
  contact, privacy
};
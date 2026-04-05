import { config, fields, collection, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

// -------------------------------------------------------------------
// Helper Configs
// -------------------------------------------------------------------

const markdocComponents = {
  blogImage: block({
    label: 'Blog Library Image',
    schema: {
      image: fields.relationship({
        label: 'Select Image',
        collection: 'mediaBlog',
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: 'Alt Text (Optional)' }),
      caption: fields.text({ label: 'Caption (Optional)' }),
    },
  }),
  eventImage: block({
    label: 'Event Library Image',
    schema: {
      image: fields.relationship({
        label: 'Select Image',
        collection: 'mediaEvents',
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: 'Alt Text (Optional)' }),
      caption: fields.text({ label: 'Caption (Optional)' }),
    },
  }),
  leaderImage: block({
    label: 'Member Library Image',
    schema: {
      image: fields.relationship({
        label: 'Select Image',
        collection: 'mediaMembers',
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: 'Alt Text (Optional)' }),
      caption: fields.text({ label: 'Caption (Optional)' }),
    },
  }),
  otherImage: block({
    label: 'Other Library Image',
    schema: {
      image: fields.relationship({
        label: 'Select Image',
        collection: 'mediaOthers',
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: 'Alt Text (Optional)' }),
      caption: fields.text({ label: 'Caption (Optional)' }),
    },
  }),
};

const markdocConfig = {
  label: 'Content Body',
  options: {
    heading: [2, 3, 4] as const,
    image: false, // Disable default image button
  },
  components: markdocComponents,
};

const bioMarkdocConfig = {
  label: 'Biography',
  options: {
    image: false,
    table: false,
    codeBlock: false,
    heading: [3, 4] as const,
  },
};

// -------------------------------------------------------------------
// Schemas
// -------------------------------------------------------------------

const createLibraryImageField = (label: string) => fields.conditional(
  fields.select({
    label: label,
    options: [
      { label: 'None', value: 'none' },
      { label: 'Blog Library', value: 'blog' },
      { label: 'Event Library', value: 'events' },
      { label: 'Member Library', value: 'members' },
      { label: 'Other Library', value: 'others' },
    ],
    defaultValue: 'none',
  }),
  {
    none: fields.empty(),
    blog: fields.relationship({ label: 'Image', collection: 'mediaBlog', validation: { isRequired: true } }),
    events: fields.relationship({ label: 'Image', collection: 'mediaEvents', validation: { isRequired: true } }),
    members: fields.relationship({ label: 'Image', collection: 'mediaMembers', validation: { isRequired: true } }),
    others: fields.relationship({ label: 'Image', collection: 'mediaOthers', validation: { isRequired: true } }),
  }
);

const libraryImageField = createLibraryImageField('Image Source');

const globalSchema = {
  // SEO & Metadata
  siteTitle: fields.text({ 
    label: 'Site Title (Browser Tab)', 
    description: 'The default title that appears in the browser tab (e.g. "KeyAstro").'
  }),
  siteDescription: fields.text({ 
    label: 'Site Description (SEO)', 
    multiline: true,
    description: 'Used for Google search results and social sharing cards.'
  }),
  siteImage: createLibraryImageField('Default Social Image (OG Image)'),

  // Footer
  footerDescription: fields.text({ 
    label: 'Footer: Description', 
    multiline: true,
    description: 'The short text that appears at the bottom left of the footer.'
  }),
  footerLinksTitle: fields.text({ label: 'Footer: "Sitemap" Title' }),
  footerConnectTitle: fields.text({ label: 'Footer: "Connect" Title' }),
  footerRightsText: fields.text({ label: 'Footer: Copyright Text' }),
  
  // Flexible Social Links
  socialLinks: fields.array(
    fields.object({
      platform: fields.text({ label: 'Platform Name', validation: { isRequired: true } }),
      url: fields.text({ label: 'URL', validation: { isRequired: true } }),
      icon: fields.select({
        label: 'Icon',
        options: [
          { label: 'Instagram', value: 'instagram' },
          { label: 'Facebook', value: 'facebook' },
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'Twitter / X', value: 'twitter' },
          { label: 'LINE', value: 'line' },
          { label: 'Discord', value: 'discord' },
          { label: 'Slack', value: 'slack' },
          { label: 'GitHub', value: 'github' },
          { label: 'YouTube', value: 'youtube' },
          { label: 'Email', value: 'email' },
          { label: 'Link / Website', value: 'link' },
        ],
        defaultValue: 'link',
      }),
      customIcon: createLibraryImageField('Custom Icon (Optional)'),
    }),
    { 
      label: 'Social Media Links', 
      itemLabel: props => props.fields.platform.value || 'Link'
    }
  ),

  // Navigation Labels
  navHome: fields.text({ label: 'Menu: Home', validation: { isRequired: true } }),
  navAbout: fields.text({ label: 'Menu: About', validation: { isRequired: true } }),
  navMembers: fields.text({ label: 'Menu: Members', validation: { isRequired: true } }),
  navBlog: fields.text({ label: 'Menu: Blog', validation: { isRequired: true } }),
  navEvents: fields.text({ label: 'Menu: Events', validation: { isRequired: true } }),
  navJoin: fields.text({ label: 'Menu: Join', validation: { isRequired: true } }),
  navContact: fields.text({ label: 'Menu: Contact' }),
  navPrivacy: fields.text({ label: 'Menu: Privacy Policy' }),
};

const contactSchema = {
  title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
  subtitle: fields.text({ label: 'Page Subtitle' }),
  googleFormUrl: fields.text({ 
    label: 'Google Form Embed URL', 
    description: 'The "src" URL from the Google Form embed code (starts with https://docs.google.com/forms/d/e/...)',
    validation: { isRequired: true } 
  }),
  infoTitle: fields.text({ label: 'Contact Info Title' }),
  infoText: fields.text({ label: 'Contact Info Description', multiline: true }),
};

const aboutSchema = {
  title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
  subtitle: fields.text({ label: 'Page Subtitle' }),
  section1Title: fields.text({ label: 'Section 1 Title' }),
  section1Content: fields.text({ label: 'Section 1 Content', multiline: true }),
  section2Title: fields.text({ label: 'Section 2 Title' }),
  mission1Title: fields.text({ label: 'Mission Box 1: Title' }),
  mission1Desc: fields.text({ label: 'Mission Box 1: Description', multiline: true }),
  mission2Title: fields.text({ label: 'Mission Box 2: Title' }),
  mission2Desc: fields.text({ label: 'Mission Box 2: Description', multiline: true }),
  section3Title: fields.text({ label: 'Section 3 Title' }),
  activities: fields.array(
    fields.text({ label: 'Activity' }),
    { label: 'Activities List', itemLabel: props => props.value || 'New Activity' }
  ),
  
  // Gallery Section
  galleryTitle: fields.text({ label: 'Gallery Title' }),
  galleryImages: fields.array(
    libraryImageField,
    { label: 'Gallery Images' }
  )
};

const joinSchema = {
  title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
  subtitle: fields.text({ label: 'Page Subtitle' }),
  
  // Membership Section
  membershipTitle: fields.text({ label: 'Membership Section Title' }),
  membershipBadge: fields.text({ label: 'Membership Badge (e.g. Open to Everyone)' }),
  membershipContent: fields.text({ label: 'Membership Text', multiline: true }),
  membershipButtonText: fields.text({ label: 'Membership Button Text (Optional)' }),
  membershipButtonLink: fields.text({ label: 'Membership Button Link (Optional)' }),

  // Visual Steps
  joinSteps: fields.array(
    fields.object({
      title: fields.text({ label: 'Step Title', validation: { isRequired: true } }),
      desc: fields.text({ label: 'Description', validation: { isRequired: true } }),
      icon: fields.text({ label: 'Icon (Emoji)', defaultValue: '📅' }),
    }),
    { label: 'How to Join Steps', itemLabel: props => props.fields.title.value || 'Step' }
  ),
  
  // Social Follow
  followTitle: fields.text({ label: 'Follow Section Title' }),
  
  // Visual Circle Text
  visualTagline: fields.text({ label: 'Visual Circle Text (e.g. No Fees. Just Friends.)', multiline: true }),

  // Member Section
  memberTitle: fields.text({ label: 'Member Recruitment Title' }),
  memberBadge: fields.text({ label: 'Recruitment Badge (e.g. Staff Recruitment)' }),
  memberContent: fields.text({ label: 'Member Recruitment Text', multiline: true }),
  requirementsTitle: fields.text({ label: 'Requirements Title' }),
  requirementsList: fields.array(fields.text({ label: 'Requirement Item' }), { label: 'Requirements List', itemLabel: props => props.value }),
  applyButtonText: fields.text({ label: 'Apply Button Label' }),
  applyButtonLink: fields.text({ label: 'Apply Button URL (Google Form)' }),
  applyButtonNote: fields.text({ label: 'Apply Button Note (e.g. Link active only...)' }),

  // FAQ
  faqTitle: fields.text({ label: 'FAQ Section Title' }),
  faqSubtitle: fields.text({ label: 'FAQ Subtitle' }),
  faqList: fields.array(
    fields.object({
      question: fields.text({ label: 'Question', validation: { isRequired: true } }),
      answer: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
    }),
    { label: 'FAQ Items', itemLabel: props => props.fields.question.value }
  )
};

const eventsPageSchema = {
  title: fields.text({ label: 'Page Title', validation: { isRequired: true } }),
  subtitle: fields.text({ label: 'Page Subtitle' }),
  calendarUrl: fields.text({ label: 'Google Calendar Embed URL', description: 'The "src" URL from the Google Calendar embed code (e.g., https://calendar.google.com/calendar/embed?...)' }),
};

// Factory for Homepage Schema to segregate images
const createHomepageSchema = (lang: 'en' | 'ja') => ({
  heroSubtitle: fields.text({ label: 'Hero: Small Top Label' }),
  heroTitle: fields.text({ label: 'Hero: Main Title', validation: { isRequired: true } }),
  heroTypewriterWords: fields.array(
    fields.text({ label: 'Word' }), 
    { label: 'Hero: Typewriter Words', itemLabel: props => props.value }
  ),
  heroDescription: fields.text({ label: 'Hero: Description', multiline: true }),
  ctaJoin: fields.text({ label: 'Button: Join Label' }),
  ctaLearn: fields.text({ label: 'Button: Learn More Label' }),
  
  featuresTitle: fields.text({ label: 'Features: Section Title' }),
  featuresSubtitle: fields.text({ label: 'Features: Subtitle', multiline: true }),
  featureList: fields.array(
    fields.object({
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
      largeImage: libraryImageField,
      // CONDITIONAL FIELD: Only show relevant input
      icon: fields.conditional(
        fields.select({
          label: 'Icon Type',
          options: [
            { label: 'Emoji', value: 'emoji' },
            { label: 'Custom Image', value: 'image' },
          ],
          defaultValue: 'emoji',
        }),
        {
          emoji: fields.text({ label: 'Emoji Character' }),
          image: libraryImageField,
        }
      ),
      colorTheme: fields.select({
        label: 'Color Theme',
        options: [
          { label: 'Orange', value: 'orange' },
          { label: 'Pink', value: 'pink' },
          { label: 'Blue', value: 'blue' },
          { label: 'Purple', value: 'purple' },
          { label: 'Green', value: 'green' },
        ],
        defaultValue: 'blue'
      }),
    }),
    { label: 'Features List', itemLabel: props => props.fields.title.value || 'Feature' }
  ),

  blogTitle: fields.text({ label: 'Blog Section Title' }),
  blogSubtitle: fields.text({ label: 'Blog Section Subtitle' }),
  eventsTitle: fields.text({ label: 'Events Section Title' }),
  eventsSubtitle: fields.text({ label: 'Events Section Subtitle' }),

  statsTitle: fields.text({ label: 'Stats: Title' }),
  statsSubtitle: fields.text({ label: 'Stats: Subtitle' }),
  statsList: fields.array(
    fields.object({
      label: fields.text({ label: 'Label' }),
      value: fields.text({ label: 'Value' }),
    }),
    { label: 'Stats Grid', itemLabel: props => `${props.fields.label.value}: ${props.fields.value.value}` }
  ),
});

const homepageSchemaEN = createHomepageSchema('en');
const homepageSchemaJA = createHomepageSchema('ja');

// -------------------------------------------------------------------
// Config
// -------------------------------------------------------------------

export default config({
  // Dynamic Storage: 
  // 'local' mode during `npm run dev` (saves to your local computer).
  // 'github' mode during production builds on Cloudflare/Vercel (requires GitHub App setup).
  storage: process.env.NODE_ENV === 'production'
    ? {
        kind: 'github',
        // IMPORTANT: If you fork this, replace this with your actual GitHub username and repository name!
        repo: 'kosuke-satake/keyastro',
      }
    : {
        kind: 'local',
      },
  
  ui: {
    brand: { name: 'KeyAstro Admin' },
    navigation: {
      'Library': ['mediaBlog', 'mediaEvents', 'mediaMembers', 'mediaOthers'],
      'Main Pages': ['homepageEN', 'homepageJA', 'aboutEN', 'aboutJA', 'eventsPageEN', 'eventsPageJA', 'joinEN', 'joinJA', 'contactEN', 'contactJA', 'privacyEN', 'privacyJA'],
      'Content': ['newsEN', 'newsJA', 'postsEN', 'postsJA', 'eventsEN', 'eventsJA'],
      'Team': ['membersEN', 'membersJA'],
      'Settings': ['globalEN', 'globalJA'],
    },
  },

  singletons: {
    globalEN: singleton({ label: 'Global Settings (EN)', path: 'src/content/global/en', schema: globalSchema }),
    globalJA: singleton({ label: 'Global Settings (JA)', path: 'src/content/global/ja', schema: globalSchema }),

    homepageEN: singleton({ label: 'Home Page (EN)', path: 'src/content/homepage/en', schema: homepageSchemaEN }),
    homepageJA: singleton({ label: 'Home Page (JA)', path: 'src/content/homepage/ja', schema: homepageSchemaJA }),

    aboutEN: singleton({ label: 'About Page (EN)', path: 'src/content/about/en', schema: aboutSchema }),
    aboutJA: singleton({ label: 'About Page (JA)', path: 'src/content/about/ja', schema: aboutSchema }),
    eventsPageEN: singleton({ label: 'Events Page (EN)', path: 'src/content/eventsPage/en', schema: eventsPageSchema }),
    eventsPageJA: singleton({ label: 'Events Page (JA)', path: 'src/content/eventsPage/ja', schema: eventsPageSchema }),
    joinEN: singleton({ label: 'Join Page (EN)', path: 'src/content/join/en', schema: joinSchema }),
    joinJA: singleton({ label: 'Join Page (JA)', path: 'src/content/join/ja', schema: joinSchema }),
    contactEN: singleton({ label: 'Contact Page (EN)', path: 'src/content/contact/en', schema: contactSchema }),
    contactJA: singleton({ label: 'Contact Page (JA)', path: 'src/content/contact/ja', schema: contactSchema }),
    privacyEN: singleton({ 
      label: 'Privacy Policy (EN)', 
      path: 'src/content/privacy/en', 
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        content: fields.markdoc({ label: 'Content', options: { heading: [2, 3] } }),
      }
    }),
    privacyJA: singleton({ 
      label: 'Privacy Policy (JA)', 
      path: 'src/content/privacy/ja', 
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        content: fields.markdoc({ label: 'Content', options: { heading: [2, 3] } }),
      }
    }),
  },

  collections: {
    // --- Media Libraries ---
    mediaBlog: collection({
      label: 'Library: Blog',
      slugField: 'name',
      path: 'src/content/mediaBlog/*',
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        file: fields.image({
          label: 'Image File',
          directory: 'public/images/library/blog',
          publicPath: '/images/library/blog/',
          validation: { isRequired: true }
        }),
        alt: fields.text({ label: 'Alt Text' }),
        caption: fields.text({ label: 'Caption' }),
      },
    }),
    mediaEvents: collection({
      label: 'Library: Events',
      slugField: 'name',
      path: 'src/content/mediaEvents/*',
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        file: fields.image({
          label: 'Image File',
          directory: 'public/images/library/events',
          publicPath: '/images/library/events/',
          validation: { isRequired: true }
        }),
        alt: fields.text({ label: 'Alt Text' }),
        caption: fields.text({ label: 'Caption' }),
      },
    }),
    mediaMembers: collection({
      label: 'Library: Members',
      slugField: 'name',
      path: 'src/content/mediaMembers/*',
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        file: fields.image({
          label: 'Image File',
          directory: 'public/images/library/members',
          publicPath: '/images/library/members/',
          validation: { isRequired: true }
        }),
        alt: fields.text({ label: 'Alt Text' }),
        caption: fields.text({ label: 'Caption' }),
      },
    }),
    mediaOthers: collection({
      label: 'Library: Others',
      slugField: 'name',
      path: 'src/content/mediaOthers/*',
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        file: fields.image({
          label: 'Image File',
          directory: 'public/images/library/others',
          publicPath: '/images/library/others/',
          validation: { isRequired: true }
        }),
        alt: fields.text({ label: 'Alt Text' }),
        caption: fields.text({ label: 'Caption' }),
      },
    }),

    // --- News ---
    newsEN: collection({
      label: 'News (EN)',
      slugField: 'title',
      path: 'src/content/newsEN/*',
      format: { contentField: 'content' }, 
      schema: {
        title: fields.slug({ name: { label: 'News Title', validation: { isRequired: true } } }),
        publishedDate: fields.date({ label: 'Date', validation: { isRequired: true } }),
        important: fields.checkbox({ label: 'Mark as Urgent', defaultValue: false }),
        content: fields.markdoc(markdocConfig),
      },
    }),
    newsJA: collection({
      label: 'News (JA)',
      slugField: 'title',
      path: 'src/content/newsJA/*',
      format: { contentField: 'content' }, 
      schema: {
        title: fields.slug({ name: { label: 'News Title', validation: { isRequired: true } } }),
        publishedDate: fields.date({ label: 'Date', validation: { isRequired: true } }),
        important: fields.checkbox({ label: 'Mark as Urgent', defaultValue: false }),
        content: fields.markdoc(markdocConfig),
      },
    }),

    // --- Blog ---
    postsEN: collection({
      label: 'Blog Posts (EN)',
      slugField: 'title',
      path: 'src/content/postsEN/*',
      format: { contentField: 'content' },
      previewUrl: '/en/blog/{slug}',
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        publishedDate: fields.date({ label: 'Published Date', validation: { isRequired: true } }),
        coverImage: libraryImageField,
        author: fields.text({ label: 'Author Name' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true, length: { min: 10 } } }),
        content: fields.markdoc(markdocConfig),
      },
    }),
    postsJA: collection({
      label: 'Blog Posts (JA)',
      slugField: 'title',
      path: 'src/content/postsJA/*',
      format: { contentField: 'content' },
      previewUrl: '/ja/blog/{slug}',
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        publishedDate: fields.date({ label: 'Published Date', validation: { isRequired: true } }),
        coverImage: libraryImageField,
        author: fields.text({ label: 'Author Name' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true, length: { min: 10 } } }),
        content: fields.markdoc(markdocConfig),
      },
    }),

    membersEN: collection({
      label: 'Members (EN)',
      slugField: 'name',
      path: 'src/content/membersEN/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Full Name', validation: { isRequired: true } } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Alumni', value: 'alumni' },
            { label: 'Advisor', value: 'advisor' },
          ],
          defaultValue: 'active',
        }),
        joinedDate: fields.date({ label: 'Joined Month (Pick any day)', description: 'Only the Month and Year will be displayed.', validation: { isRequired: true } }),
        leftDate: fields.date({ label: 'Graduation Month (Pick any day)', description: 'Only required for Alumni.' }),
        avatar: fields.relationship({
          label: 'Profile Picture',
          collection: 'mediaMembers',
        }),
        website: fields.text({ label: 'Website' }),
        linkedin: fields.text({ label: 'LinkedIn' }),
        instagram: fields.text({ label: 'Instagram' }),
        facebook: fields.text({ label: 'Facebook' }),
        github: fields.text({ label: 'GitHub' }),
        twitter: fields.text({ label: 'Twitter' }),
        bio: fields.markdoc(bioMarkdocConfig),
      },
    }),
    membersJA: collection({
      label: 'Members (JA)',
      slugField: 'name',
      path: 'src/content/membersJA/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Full Name', validation: { isRequired: true } } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Alumni', value: 'alumni' },
            { label: 'Advisor', value: 'advisor' },
          ],
          defaultValue: 'active',
        }),
        joinedDate: fields.date({ label: 'Joined Month (Pick any day)', description: 'Only the Month and Year will be displayed.', validation: { isRequired: true } }),
        leftDate: fields.date({ label: 'Graduation Month (Pick any day)' }),
        avatar: fields.relationship({
          label: 'Profile Picture',
          collection: 'mediaMembers',
        }),
        website: fields.text({ label: 'Website' }),
        linkedin: fields.text({ label: 'LinkedIn' }),
        instagram: fields.text({ label: 'Instagram' }),
        facebook: fields.text({ label: 'Facebook' }),
        github: fields.text({ label: 'GitHub' }),
        twitter: fields.text({ label: 'Twitter' }),
        bio: fields.markdoc(bioMarkdocConfig),
      },
    }),

    eventsEN: collection({
      label: 'Events (EN)',
      slugField: 'title',
      path: 'src/content/eventsEN/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Event Name', validation: { isRequired: true } } }),
        date: fields.datetime({ label: 'Start Date/Time', validation: { isRequired: true } }),
        endTime: fields.datetime({ label: 'End Date/Time (Optional)' }),
        location: fields.text({ label: 'Location', validation: { isRequired: true } }),
        fee: fields.text({ label: 'Fee (Optional)', description: 'e.g. "Free" or "500 yen"' }),
        coverImage: libraryImageField,
        isPast: fields.checkbox({ label: 'Archive Event', defaultValue: false }),
        description: fields.markdoc(markdocConfig),
      },
    }),
    eventsJA: collection({
      label: 'Events (JA)',
      slugField: 'title',
      path: 'src/content/eventsJA/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Event Name', validation: { isRequired: true } } }),
        date: fields.datetime({ label: 'Start Date/Time', validation: { isRequired: true } }),
        endTime: fields.datetime({ label: 'End Date/Time (Optional)' }),
        location: fields.text({ label: 'Location', validation: { isRequired: true } }),
        fee: fields.text({ label: 'Fee (Optional)', description: 'e.g. "Free" or "500 yen"' }),
        coverImage: libraryImageField,
        isPast: fields.checkbox({ label: 'Archive Event', defaultValue: false }),
        description: fields.markdoc(markdocConfig),
      },
    }),
  },
});
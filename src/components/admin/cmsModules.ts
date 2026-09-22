import type { BaseField } from './CollectionManager';

export interface CmsModule {
  key: string;
  label: string;
  table: string;
  entityType: string;
  title: string;
  baseFields: BaseField[];
  translatedFields: BaseField[];
  defaults: Record<string, unknown>;
  orderBy?: string;
  ascending?: boolean;
}

const statusField: BaseField = { name: 'status', label: 'Status (draft / published)' };

export const CMS_MODULES: CmsModule[] = [
  {
    key: 'expertise',
    label: 'Expertise',
    table: 'expertise_categories',
    entityType: 'expertise_category',
    title: 'Expertise areas',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'icon', label: 'Icon name' },
      { name: 'sort_order', label: 'Order', type: 'number' },
      { name: 'visible', label: 'Visible', type: 'boolean' },
    ],
    translatedFields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { slug: '', icon: 'code', visible: true },
  },
  {
    key: 'project-categories',
    label: 'Work categories',
    table: 'project_categories',
    entityType: 'project_category',
    title: 'Work categories',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'sort_order', label: 'Order', type: 'number' },
      { name: 'visible', label: 'Visible', type: 'boolean' },
    ],
    translatedFields: [
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { slug: '', visible: true },
  },
  {
    key: 'articles',
    label: 'Publications',
    table: 'articles',
    entityType: 'article',
    title: 'Articles, studies & policy briefs',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'publication_type', label: 'Type (article / study / policy_brief)' },
      { name: 'category', label: 'Category' },
      { name: 'cover_image_url', label: 'Cover image URL', type: 'media' },
      { name: 'document_url', label: 'PDF / document URL', type: 'media' },
      { name: 'published_at', label: 'Published on', type: 'date' },
      { name: 'reading_time', label: 'Reading time (min)', type: 'number' },
      { name: 'author', label: 'Author' },
      statusField,
      { name: 'featured', label: 'Featured', type: 'boolean' },
      { name: 'seo_title', label: 'SEO title' },
      { name: 'seo_description', label: 'SEO description', type: 'textarea' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
    translatedFields: [
      { name: 'title', label: 'Title' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Content', type: 'richtext' },
    ],
    defaults: { slug: '', status: 'draft', publication_type: 'article', author: 'Advaxe Ndayisenga', reading_time: 4, featured: false },
    orderBy: 'sort_order',
  },
  {
    key: 'speaking',
    label: 'Speaking',
    table: 'speaking_events',
    entityType: 'speaking_event',
    title: 'Speaking & teaching',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'event_date', label: 'Date', type: 'date' },
      { name: 'event_type', label: 'Type (talk / workshop / bootcamp)' },
      { name: 'location', label: 'Location' },
      { name: 'role', label: 'Role' },
      { name: 'image_url', label: 'Image URL', type: 'media' },
      { name: 'resource_url', label: 'Slides URL', type: 'media' },
      { name: 'video_url', label: 'Video URL' },
      { name: 'external_url', label: 'Event URL' },
      statusField,
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
    translatedFields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { slug: '', status: 'published', event_type: 'talk' },
    orderBy: 'event_date',
    ascending: false,
  },
  {
    key: 'community',
    label: 'Community',
    table: 'community_contributions',
    entityType: 'community_contribution',
    title: 'Community & contributions',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'organization', label: 'Organization' },
      { name: 'contribution_type', label: 'Type' },
      { name: 'role', label: 'Role' },
      { name: 'start_date', label: 'Start date', type: 'date' },
      { name: 'end_date', label: 'End date', type: 'date' },
      { name: 'image_url', label: 'Image URL', type: 'media' },
      { name: 'external_url', label: 'Link' },
      statusField,
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
    translatedFields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { slug: '', organization: '', contribution_type: 'community', status: 'published' },
  },
  {
    key: 'media',
    label: 'Media',
    table: 'media_appearances',
    entityType: 'media_appearance',
    title: 'Media & appearances',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'media_type', label: 'Type (interview / podcast / article / video)' },
      { name: 'publisher', label: 'Publisher' },
      { name: 'appearance_date', label: 'Date', type: 'date' },
      { name: 'duration', label: 'Duration' },
      { name: 'external_url', label: 'Link' },
      { name: 'image_url', label: 'Image URL', type: 'media' },
      statusField,
      { name: 'featured', label: 'Featured', type: 'boolean' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
    translatedFields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { slug: '', media_type: 'interview', external_url: '', status: 'published', featured: false },
    orderBy: 'appearance_date',
    ascending: false,
  },
  {
    key: 'credentials',
    label: 'Certifications & skills',
    table: 'certifications',
    entityType: 'certification',
    title: 'Certifications & skills',
    baseFields: [
      { name: 'slug', label: 'Slug' },
      { name: 'entry_type', label: 'Type (certification / skill)' },
      { name: 'issuer', label: 'Issuer / institution' },
      { name: 'category', label: 'Category' },
      { name: 'level', label: 'Level' },
      { name: 'issue_date', label: 'Issue date', type: 'date' },
      { name: 'expiry_date', label: 'Expiry date', type: 'date' },
      { name: 'credential_id', label: 'Credential ID' },
      { name: 'credential_url', label: 'Credential link' },
      { name: 'image_url', label: 'Badge / image', type: 'media' },
      statusField,
      { name: 'featured', label: 'Featured', type: 'boolean' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
    translatedFields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { slug: '', entry_type: 'certification', status: 'published', featured: false },
    orderBy: 'sort_order',
  },
  {
    key: 'pages',
    label: 'Pages & SEO',
    table: 'pages',
    entityType: 'page',
    title: 'Pages, metadata and SEO',
    baseFields: [
      { name: 'page_key', label: 'Page key' },
      { name: 'slug', label: 'Slug' },
      { name: 'seo_title', label: 'SEO title' },
      { name: 'seo_description', label: 'SEO description', type: 'textarea' },
      { name: 'og_image_url', label: 'Social image URL', type: 'media' },
      { name: 'canonical_url', label: 'Canonical URL' },
      statusField,
      { name: 'visible', label: 'Visible', type: 'boolean' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
    translatedFields: [
      { name: 'eyebrow', label: 'Eyebrow' },
      { name: 'title', label: 'Title' },
      { name: 'intro', label: 'Intro', type: 'textarea' },
      { name: 'body', label: 'Body', type: 'richtext' },
    ],
    defaults: { page_key: '', slug: '', status: 'published', visible: true },
  },
];

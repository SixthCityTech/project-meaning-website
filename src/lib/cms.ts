import 'server-only';

const origin = 'https://cms.utiliscrm.com';
const slug = 'project-meaning';
export type Article = { slug: string; title: string; thumbnail_url?:string; card_image_url?:string; subtitle?: string; dek?:string; summary?: string; status?: string; visibility?: string; brand_id?:string; sites_to_appear?:{slug?:string}[]; body_html?: string; body?:{type?:string}[]; answer_engine_summary?: string; canonical_url?: string; published_at?: string; updated_at?:string; publication_type?:string; seo_title?:string; meta_description?:string; key_takeaways?:string[]; topics?:string[]; author?: {name?: string;job_title?:string;photo_url?:string;photo_thumbnail_url?:string}; hero_media?:{url?:string;card_url?:string;thumbnail_url?:string;medium_url?:string;alt?:string;caption?:string;credit?:string}; visible_faqs?: {question:string;answer:string;visible:boolean}[] };

async function read(path: string): Promise<unknown> {
  // Never allow a configured endpoint or redirect to exfiltrate the reader token.
  if (process.env.CMS_BASE_URL && process.env.CMS_BASE_URL !== origin) throw new Error('Unexpected CMS origin');
  if (process.env.CMS_BRAND_SLUG && process.env.CMS_BRAND_SLUG !== slug) throw new Error('Unexpected CMS brand');
  const headers: HeadersInit = { Accept: 'application/json' };
  // Server-only optional site-reader credential; never send preview parameters.
  if(process.env.UTILIS_API_TOKEN) headers.Authorization = `Bearer ${process.env.UTILIS_API_TOKEN}`;
  const response = await fetch(`${origin}/api/v1/public/nextjs/sites/${slug}/articles${path}`, {headers, redirect:'error', next:{revalidate:60}, signal:AbortSignal.timeout(20000)});
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`CMS request failed (${response.status})`);
  return response.json();
}
const valid = (a: unknown): a is Article => { if (!a || typeof a !== 'object') return false; const x = a as Article; const date=typeof x.published_at==='string'?Date.parse(x.published_at):NaN; return typeof x.title === 'string' && typeof x.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.slug) && x.status === 'published' && x.visibility === 'public' && Number.isFinite(date) && date<=Date.now() && Array.isArray(x.sites_to_appear) && x.sites_to_appear.some(site => site?.slug === slug); };
export const safeMedia=(value:unknown):string|null => {if(typeof value!=='string')return null;try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='cms.utiliscrm.com'&&u.pathname.startsWith('/uploads/')&&!u.username&&!u.password?u.href:null}catch{return null}};
export const displayDate=(value?:string):string|null=>{if(!value||!Number.isFinite(Date.parse(value)))return null;return new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'America/New_York'}).format(new Date(value))};
export async function getArticles(): Promise<Article[]> { const result = await read(''); const data = result && typeof result === 'object' && 'data' in result ? (result as {data:unknown}).data : result; return Array.isArray(data) ? data.filter(valid) : []; }
export async function getArticle(slugValue:string): Promise<Article|null> { if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue)) return null; const result = await read('/'+encodeURIComponent(slugValue)); const data = result && typeof result === 'object' && 'data' in result ? (result as {data:unknown}).data : result; return valid(data) && data.slug === slugValue ? data : null; }

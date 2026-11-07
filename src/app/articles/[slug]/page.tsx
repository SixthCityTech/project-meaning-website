import Link from 'next/link';
import {notFound} from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import {displayDate,getArticle,safeMedia} from '../../../lib/cms';
import type {Metadata} from 'next';

export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{try{const a=await getArticle((await params).slug);if(!a)return {};let canonical:string|undefined;try{const u=new URL(a.canonical_url||'');if(u.protocol==='https:'&&!u.username&&!u.password&&u.hostname!=='projectmeaning.org'&&(u.hostname==='projectmeaning.com'||u.hostname==='www.projectmeaning.com'||a.is_syndicated_copy===true))canonical=u.href}catch{}const social=a.next_metadata?.openGraph?.images?.map(image=>({url:safeMedia(image?.url),alt:typeof image?.alt==='string'?image.alt:undefined})).filter((image):image is {url:string;alt:string|undefined}=>!!image.url);return {title:a.next_metadata?.title||a.seo_title||a.title,description:a.next_metadata?.description||a.meta_description||undefined,...(canonical?{alternates:{canonical}}:{}),...(social?.length?{openGraph:{type:'article',images:social}}:{}),robots:{index:false,follow:false}}}catch{return {}}}

function prepareBody(html:unknown):string|null {
  if(typeof html!=='string'||!html.trim())return null;
  const supported=new Set(['p','h2','h3','h4','ul','ol','li','strong','b','em','i','a','blockquote','br','span','figure','figcaption','img','hr']);
  const tags=Array.from(html.matchAll(/<\s*\/?\s*([a-z][a-z0-9-]*)\b/gi),m=>m[1].toLowerCase());
  if(tags.some(t=>!supported.has(t)))return null;
  let badImage=false;
  const clean=sanitizeHtml(html,{allowedTags:[...supported],allowedAttributes:{a:['href','title'],img:['src','alt','width','height','loading','decoding']},allowedSchemes:['https','http','mailto'],transformTags:{img:(_tag,attributes)=>{const src=safeMedia(attributes.src);if(!src)badImage=true;return {tagName:'img',attribs:{src:src||'',alt:attributes.alt||'',loading:'lazy',decoding:'async'}}}}});
  return badImage?null:clean;
}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;let article;
  try{article=await getArticle(slug)}catch{return <section className="subhero wrap"><p className="eyebrow">Ideas & essays</p><h1>Temporarily unavailable.</h1><p>Please try again later.</p></section>}
  if(!article)notFound();
  const body=prepareBody(article.body_html);
  if(!body)console.error(`Article body missing or includes unsupported content: ${slug}`);
  const hero=safeMedia(article.hero_media?.url)||safeMedia(article.hero_media?.medium_url);const heroMedium=safeMedia(article.hero_media?.medium_url)||safeMedia(article.hero_media?.card_url);
  const authors=Array.isArray(article.authors)?article.authors.map(entry=>entry?.author).filter((author):author is NonNullable<typeof author>=>!!author&&typeof author.name==='string'&&!!author.name.trim()):[];
  if(!authors.length&&article.author?.name)authors.push(article.author);
  const primaryAuthor=authors[0];const portrait=safeMedia(primaryAuthor?.photo_thumbnail_url);
  const published=displayDate(article.published_at);const updated=displayDate(article.updated_at);
  const takeaways=Array.isArray(article.key_takeaways)?article.key_takeaways.filter((s):s is string=>typeof s==='string'&&!!s.trim()):[];
  const topics=Array.isArray(article.topics)?article.topics.filter((s):s is string=>typeof s==='string'&&!!s.trim()):Array.isArray(article.keywords)?article.keywords.filter((s):s is string=>typeof s==='string'&&!!s.trim()):[];
  const classificationGroups=[['Interpretive lenses',article.classifications?.interpretive_lenses],['Human stakes',article.classifications?.human_stakes],['Future scenarios',article.classifications?.future_scenarios],['Human agency',article.classifications?.human_agency_direction]] as const;
  const classifications=classificationGroups.map(([label,values])=>({label,values:Array.isArray(values)?values.filter((value):value is string=>typeof value==='string'&&!!value.trim()):[]})).filter(group=>group.values.length>0);
  const faqs=Array.isArray(article.visible_faqs)?article.visible_faqs.filter(f=>f?.visible===true&&typeof f.question==='string'&&!!f.question.trim()&&typeof f.answer==='string'&&!!f.answer.trim()):[];
  const schema=article.schema_org_json_ld&&typeof article.schema_org_json_ld==='object'?JSON.stringify(article.schema_org_json_ld).replace(/</g,'\\u003c'):null;
  return <article className="story wrap">
    {schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:schema}}/>}
    <div className="story-breadcrumb"><Link href="/articles">Ideas & essays</Link><span aria-hidden="true"> / </span><span>{article.publication_type||'Article'}</span></div>
    <header className="story-header"><p className="eyebrow">{article.publication_type||'Article'}</p><h1>{article.title}</h1>{(article.dek||article.subtitle)&&<p className="story-deck">{article.dek||article.subtitle}</p>}</header>
    {hero&&<figure className="story-hero"><div className="story-hero-frame"><picture>{heroMedium&&<source media="(max-width: 700px)" srcSet={heroMedium}/>}<img src={hero} alt={article.hero_media?.alt||''} fetchPriority="high" decoding="async"/></picture></div>{article.hero_media?.caption&&<figcaption>{article.hero_media.caption}{article.hero_media.credit?` · ${article.hero_media.credit}`:''}</figcaption>}</figure>}
    <div className="story-layout"><div className="story-column"><div className="story-byline">{portrait&&<img src={portrait} alt="" width="54" height="54" loading="lazy" decoding="async"/>}<div>{authors.length>0&&<strong>By {authors.map(author=>author.name).join(', ')}</strong>}{primaryAuthor?.job_title&&<span>{primaryAuthor.job_title}</span>}<span>{published&&<time dateTime={article.published_at}>{published}</time>}{updated&&updated!==published&&<> · Updated <time dateTime={article.updated_at}>{updated}</time></>}</span></div></div>
    {takeaways.length>0&&<section className="story-takeaways"><p className="eyebrow">At a glance</p><h2>Key takeaways</h2><ul>{takeaways.map((t,i)=><li key={i}>{t}</li>)}</ul></section>}
    {topics.length>0&&<div className="story-topics" aria-label="Topics">{topics.map(t=><span key={t}>{t}</span>)}</div>}
    {classifications.length>0&&<section className="story-classifications" aria-label="Article perspectives">{classifications.map(group=><div key={group.label}><strong>{group.label}</strong><div className="story-topics">{group.values.map(value=><span key={value}>{value}</span>)}</div></div>)}</section>}
    {body?<div className="story-body" dangerouslySetInnerHTML={{__html:body}}/>:<section className="story-unavailable"><h2>Article content is temporarily unavailable.</h2><p>Please try again later.</p></section>}
    <section className="story-invitation"><p className="eyebrow">Keep exploring</p><h2>What matters to you?</h2><p>Explore the ideas behind Project Meaning and the possibilities taking shape.</p><Link className="button primary" href="/meaning-in-action">Explore meaning in action <span aria-hidden="true">↗</span></Link></section>
    {article.answer_engine_summary&&<section className="story-summary"><p className="eyebrow">A moment to reflect</p><h2>Quick answer</h2><p>{article.answer_engine_summary}</p></section>}
    {faqs.length>0&&<section className="story-faq"><p className="eyebrow">Explore further</p><h2>Frequently asked questions</h2>{faqs.map(f=><details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</section>}
    </div><aside className="story-side"><div><p className="eyebrow">Project Meaning</p><p>Thoughtful questions for a more meaningful life.</p><Link href="/articles">Explore all articles ↗</Link></div></aside></div>
  </article>;
}

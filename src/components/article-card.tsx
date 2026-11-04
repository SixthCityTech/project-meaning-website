import Link from 'next/link';
import {displayDate,safeMedia,type Article} from '../lib/cms';

export function ArticleCard({article}:{article:Article}){
  const image=safeMedia(article.hero_media?.card_url)||safeMedia(article.hero_media?.url);
  const date=displayDate(article.published_at);
  return <article className="editorial-card"><Link href={`/articles/${article.slug}`} className="editorial-card-link"><div className="editorial-card-image">{image?<img src={image} alt={article.hero_media?.alt || ''} loading="lazy"/>:<span aria-hidden="true">Project Meaning</span>}</div><div className="editorial-card-content"><p className="editorial-meta">{article.publication_type || 'Article'}{date&&<> <span aria-hidden="true">·</span> <time dateTime={article.published_at}>{date}</time></>}</p><h3>{article.title}</h3>{(article.dek||article.subtitle||article.summary)&&<p className="editorial-excerpt">{article.dek||article.subtitle||article.summary}</p>}<span className="editorial-read">Read article <span aria-hidden="true">↗</span></span></div></Link></article>;
}

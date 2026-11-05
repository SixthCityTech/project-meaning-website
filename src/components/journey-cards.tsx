'use client';

import {useState} from 'react';

const brands = [
  {name:'humanAi Insight', stage:'Understand It', logo:'humanai-optimized.webp', href:'https://humanaiinsight.com', summary:'Explains AI developments and their practical effects on everyday work, business, and life.'},
  {name:'Trophic Shift', stage:'Confront It', logo:'trophic-shift-optimized.webp', href:'https://trophicshift.com', summary:'Tracks emerging AI capabilities, risks, and humanity’s potential displacement as the dominant intelligence.'},
  {name:'Us After AI', stage:'Live Through It', logo:'us-after-ai-optimized.webp', href:'https://usafterai.com', summary:'Explores how people preserve dignity, identity, relationships, and purpose through AI-driven disruption.'},
  {name:'Project Meaning', stage:'Adapt To It', logo:'project-meaning-optimized.webp', href:'https://projectmeaning.com', summary:'Develops practical frameworks, guidance, and resources helping people and communities adapt meaningfully to AI.'},
];

function JourneyCard({brand,index}:{brand:typeof brands[number];index:number}){
  const [flipped,setFlipped]=useState(false);
  const descriptionId=`journey-summary-${index}`;
  return <article className={`journey-flip-card${flipped?' is-flipped':''}`}>
    <a className="journey-card-link" href={brand.href} aria-label={`Visit ${brand.name}`} aria-describedby={descriptionId}>
      <span className="journey-card-inner">
        <span className="journey-face journey-front">
          <span className="journey-number">0{index+1}</span>
          <span className="journey-brand"><img src={`/journey/${brand.logo}`} alt=""/><span className="journey-name">{brand.name}</span></span>
          <span className="journey-stage">{brand.stage}</span>
        </span>
        <span className="journey-face journey-back">
          <span className="journey-back-eyebrow">{brand.stage}</span>
          <span className="journey-back-name">{brand.name}</span>
          <span className="journey-summary" id={descriptionId}>{brand.summary}</span>
          <span className="journey-visit">Visit website <span aria-hidden="true">↗</span></span>
        </span>
      </span>
    </a>
    <button className="journey-info" type="button" onClick={()=>setFlipped(!flipped)} aria-expanded={flipped} aria-controls={descriptionId} aria-label={`${flipped?'Hide':'Show'} ${brand.name} summary`} title={`${flipped?'Hide':'Show'} summary`}><span aria-hidden="true">{flipped?'×':'i'}</span></button>
  </article>;
}

export default function JourneyCards(){return <div className="journey-grid">{brands.map((brand,i)=><JourneyCard key={brand.name} brand={brand} index={i}/>)}</div>}

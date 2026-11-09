const faqs = [
  {question:'What is Project Meaning?',answer:'Project Meaning is a developing initiative exploring how people can find purpose, dignity, connection, and meaning as AI changes work and everyday life.'},
  {question:'Who is Project Meaning for?',answer:'It is for people who are curious about living a fulfilling, human-centered life and want to explore what remains meaningful as AI reshapes work and creation.'},
  {question:'Is Project Meaning against AI or technology?',answer:'No. Project Meaning is not anti-technology. It considers the changes AI may bring while exploring human capacities and practices that help make life meaningful.'},
  {question:'How is Project Meaning different from Us After AI?',answer:'Project Meaning focuses on practical ways to cultivate purpose, creativity, relationships, and contribution in everyday life. Us After AI explores the broader human and societal transition brought about by AI.'},
  {question:'Does Project Meaning offer programs or a membership?',answer:'Project Meaning is in development. The possibilities on this site are areas of inquiry and potential future activity, not current programs or a membership.'},
  {question:'How can I get involved?',answer:'Share your questions, ideas, or interest by emailing info@projectmeaning.com. Your perspective can help shape the initiative as it develops.'},
];

export default function HomeAnswers(){
  return <>
    <section className="home-answer-section section-line" aria-labelledby="home-answer-title"><div className="wrap"><div className="home-answer-card"><p className="eyebrow">Answer engine summary</p><h2 id="home-answer-title">What is Project Meaning?</h2><p>Project Meaning explores how people can find purpose, dignity, connection, and meaning as AI changes work and everyday life. It is for people seeking practical ways to live a fulfilling, human-centered life.</p><ul><li>Explore human identity and purpose in a changing world.</li><li>Reconnect with curiosity, creativity, relationships, and contribution.</li><li>Turn questions about meaning into thoughtful, everyday action.</li></ul><LinkToPhilosophy/></div></div></section>
    <section className="home-faq-section wrap section-line" aria-labelledby="home-faq-title"><div className="home-faq-inner"><p className="eyebrow">FAQ</p><h2 id="home-faq-title">Frequently asked questions</h2><div className="home-faq-list">{faqs.map(({question,answer})=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}
function LinkToPhilosophy(){return <a className="text-link" href="/our-philosophy">Explore our philosophy <span aria-hidden="true">↗</span></a>}

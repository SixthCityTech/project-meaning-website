import {defineConfig} from 'tinacms';

// Tina stores marketing content in Git; editorial articles remain in Utilis.
export default defineConfig({
  branch: process.env.TINA_BRANCH || 'agent/phase-1-prototype',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: { outputFolder:'admin', publicFolder:'public' },
  media: { tina: { mediaRoot:'images', publicFolder:'public' } },
  schema: { collections: [{ name:'site', label:'Website content', path:'content', format:'json', match:{include:'site'}, fields:[
    {type:'string',name:'heroEyebrow',label:'Hero eyebrow'},
    {type:'string',name:'heroTitle',label:'Hero title'},
    {type:'string',name:'heroIntro',label:'Hero introduction',ui:{component:'textarea'}},
    {type:'string',name:'developmentNotice',label:'Development notice',ui:{component:'textarea'}},
    {type:'string',name:'whyTitle',label:'Why section title'},
    {type:'string',name:'whyLead',label:'Why section lead'},
    {type:'string',name:'whyBody',label:'Why section body',ui:{component:'textarea'}},
    {type:'string',name:'closingTitle',label:'Closing title'},
    {type:'string',name:'closingBody',label:'Closing body',ui:{component:'textarea'}}
  ]}] }
});

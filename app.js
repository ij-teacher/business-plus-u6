'use strict';
let questions=[],lastResult=null;
const $=id=>document.getElementById(id);
$('projector').addEventListener('click',()=>{const on=document.body.classList.toggle('projector');$('projector').textContent=on?'Standard mode':'Projector mode';$('projector').setAttribute('aria-pressed',String(on));});
function buildTrip(){const d=$('destination').value,t=$('transport').value,s=$('stay').value;const destination=d==='the beach'?'at the beach':'in '+d;const transport=t==='on foot'?'on foot':'by '+t;const stay=s==='a campsite'?'at a campsite':s==='friends'?'with friends':'in '+s;$('trip-result').textContent='I like to spend my vacation '+destination+' because it is '+$('reason').value+'.\nI '+$('preference').value+' '+$('activity').value+' because I like to '+$('activity-reason').value+'.\nI like to travel '+transport+' because it is '+$('transport-reason').value+'.\nI like to stay '+stay+' because it is '+$('stay-reason').value+'.';}
$('trip-form').addEventListener('submit',e=>{e.preventDefault();buildTrip();});buildTrip();
async function init(){try{const responses=await Promise.all([fetch('data/lesson.json?v=reading-scanning-1'),fetch('data/questions.json')]);if(responses.some(r=>!r.ok))throw Error('load');const [lesson,q]=await Promise.all(responses.map(r=>r.json()));questions=q;
 for(const review of lesson.reviews){const a=document.createElement('article'),label=document.createElement('div'),body=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p');label.className='review-label';label.textContent=review.id;h.textContent=review.title;p.textContent=review.text;body.append(h,p);a.append(label,body);$('reviews').append(a);}
 initReading(lesson.scanning);
 for(const [word,definition] of lesson.vocabulary){const p=document.createElement('p'),b=document.createElement('b');b.textContent=word;p.append(b,document.createElement('br'),document.createTextNode(definition));$('vocabulary').append(p);}
 q.forEach((item,i)=>{const f=document.createElement('fieldset'),l=document.createElement('legend');l.textContent=`${i+1}. ${item.prompt}`;f.append(l);item.options.forEach((option,j)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='q'+i;input.value=String(j);input.required=true;label.append(input,document.createTextNode(option));f.append(label);});const feedback=document.createElement('p');feedback.id='feedback-'+i;feedback.className='feedback';feedback.hidden=true;f.append(feedback);$('questions').append(f);});
 try{const saved=JSON.parse(localStorage.getItem('business-plus-u6-result'));if(saved&&Array.isArray(saved.answers)&&saved.answers.length===q.length){saved.answers.forEach((answer,i)=>{const input=document.querySelector(`input[name="q${i}"][value="${answer}"]`);if(input)input.checked=true;});$('score').textContent='Your previous answers have been restored. Submit to review the explanations.';}}catch{}
 }catch{$('load-error').hidden=false;$('load-error').textContent='The lesson could not be loaded. Refresh the page and make sure you are using the website URL.';$('quiz').querySelector('[type=submit]').disabled=true;}}
$('quiz').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);let total=0;const answers=questions.map((q,i)=>{const a=Number(fd.get('q'+i)),ok=a===q.answer;if(ok)total++;const f=$('feedback-'+i);f.hidden=false;f.className='feedback '+(ok?'correct':'incorrect');f.textContent=(ok?'✓ Correct.':'Try again. Correct answer: '+q.options[q.answer]+'.')+' '+q.explanation;return a;});lastResult={unit:'Business Plus 1 Unit 6',completedAt:new Date().toISOString(),score:total,total:questions.length,answers};$('score').textContent=`Your score: ${total} / ${questions.length}. Read each explanation, then try again.`;try{localStorage.setItem('business-plus-u6-result',JSON.stringify(lastResult));}catch{$('score').textContent+=' This browser cannot save your answers.';}$('score').scrollIntoView({behavior:'smooth',block:'center'});});
$('reset').addEventListener('click',()=>{HTMLFormElement.prototype.reset.call($('quiz'));$('quiz').querySelectorAll('.feedback').forEach(f=>f.hidden=true);$('score').textContent='Your answers have been cleared. You can start again.';lastResult=null;try{localStorage.removeItem('business-plus-u6-result');}catch{}});
init();

function initReading(items){
 const form=$('reading-form'),status=$('reading-score');
 items.forEach((item,i)=>{
  const field=document.createElement('fieldset'),legend=document.createElement('legend');
  legend.textContent=(i+1)+'. '+item.prompt;field.append(legend);
  const choices=document.createElement('div');choices.className='reading-choices';
  for(const letter of ['A','B','C','D']){
   const label=document.createElement('label'),input=document.createElement('input');
   input.type='checkbox';input.name='reading'+i;input.value=letter;
   label.append(input,document.createTextNode(letter));choices.append(label);
  }
  const feedback=document.createElement('p');feedback.id='reading-feedback-'+i;feedback.className='feedback';feedback.hidden=true;
  field.append(choices,feedback);$('reading-questions').append(field);
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();const answers=new FormData(form);let score=0,unanswered=0;
  items.forEach((item,i)=>{
   const selected=answers.getAll('reading'+i),correct=selected.length===item.answers.length&&item.answers.every(letter=>selected.includes(letter));
   if(!selected.length)unanswered++;if(correct)score++;
   const feedback=$('reading-feedback-'+i);feedback.hidden=false;feedback.className='feedback '+(correct?'correct':'incorrect');
   feedback.textContent=(correct?'✓ Correct. ':!selected.length?'No answer selected. Correct answers: '+item.answers.join(', ')+'. ':'Correct answers: '+item.answers.join(', ')+'. ')+item.explanation;
  });
  status.hidden=false;status.textContent='Reading comprehension score: '+score+' / '+items.length+'. '+(unanswered?unanswered+' unanswered. ':'')+'Select every matching comment for each topic. Read the evidence above, then try again.';
  status.scrollIntoView({block:'center',behavior:'smooth'});
 });
 $('reading-reset').addEventListener('click',()=>{
  HTMLFormElement.prototype.reset.call(form);form.querySelectorAll('.feedback').forEach(p=>p.hidden=true);status.hidden=true;status.textContent='';
 });
}

async function initListening(){try{const response=await fetch('data/track32.json');if(!response.ok)throw Error('load');const exercise=await response.json();exercise.items.forEach((item,i)=>{const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=(i+1)+'. '+item.statement;field.append(legend);for(const choice of ['Do','Don’t']){const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='listen'+i;input.value=choice;input.required=true;label.append(input,document.createTextNode(choice));field.append(label);}const feedback=document.createElement('p');feedback.className='feedback';feedback.hidden=true;feedback.id='listen-feedback-'+i;field.append(feedback);$('listening-questions').append(field);});$('listening-form').addEventListener('submit',event=>{event.preventDefault();const answers=new FormData(event.currentTarget);let score=0;exercise.items.forEach((item,i)=>{const correct=answers.get('listen'+i)===item.answer;if(correct)score++;const feedback=$('listen-feedback-'+i);feedback.hidden=false;feedback.className='feedback '+(correct?'correct':'incorrect');feedback.textContent=correct?'✓ Correct.':'Correct answer: '+item.answer+'.';});$('listening-score').hidden=false;$('listening-score').textContent='Your listening score: '+score+' / '+exercise.items.length;});$('listening-reset').addEventListener('click',()=>{HTMLFormElement.prototype.reset.call($('listening-form'));$('listening-score').hidden=true;$('listening-form').querySelectorAll('.feedback').forEach(p=>p.hidden=true);});}catch{$('listening-score').hidden=false;$('listening-score').textContent='The listening exercise could not be loaded. Please refresh the page.';$('listening-form').querySelector('[type=submit]').disabled=true;}}
initListening();

async function initPlaces(){
 const form=$('places-form'),status=$('places-score');form.noValidate=true;
 try{
  const response=await fetch('data/places.json');if(!response.ok)throw Error('load');const data=await response.json();
  data.questions.forEach((item,i)=>{
   const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=(i+1)+'. '+item.statement;field.append(legend);
   for(const choice of ['True','False']){const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='place'+i;input.value=choice;label.append(input,document.createTextNode(choice));field.append(label);}
   const label=document.createElement('label'),correction=document.createElement('textarea');label.textContent='If false, write a corrected sentence:';label.htmlFor='place-correction-'+i;correction.id=label.htmlFor;correction.rows=2;correction.placeholder='Your corrected sentence';field.append(label,correction);
   const feedback=document.createElement('p');feedback.id='place-feedback-'+i;feedback.className='feedback';feedback.hidden=true;field.append(feedback);$('places-questions').append(field);
  });
  form.addEventListener('submit',event=>{
   event.preventDefault();const answers=new FormData(form);let score=0,unanswered=0;
   data.questions.forEach((item,i)=>{const answer=answers.get('place'+i),correct=answer===(item.answer?'True':'False');if(!answer)unanswered++;if(correct)score++;const feedback=$('place-feedback-'+i);feedback.hidden=false;feedback.className='feedback '+(correct?'correct':'incorrect');feedback.textContent=!answer?'Choose True or False for this question.':(correct?'✓ Correct. ':'Correct answer: '+(item.answer?'True':'False')+'. ')+item.explanation;});
   status.hidden=false;status.textContent='True/False score: '+score+' / '+data.questions.length+'. '+(unanswered?unanswered+' unanswered. Choose an answer for each question, then check again.':'Compare your written corrections with the model sentences above. Written corrections are for self-review.');status.scrollIntoView({block:'center',behavior:'smooth'});
  });
  $('places-reset').addEventListener('click',()=>{form.querySelectorAll('input[type=radio]').forEach(input=>input.checked=false);form.querySelectorAll('textarea').forEach(input=>input.value='');form.querySelectorAll('.feedback').forEach(p=>p.hidden=true);status.hidden=false;status.textContent='Answers cleared. You can try again.';});
 }catch{status.hidden=false;status.textContent='The place comparison exercise could not be loaded. Please refresh the page.';form.querySelector('[type=submit]').disabled=true;}
}
initPlaces();


function initAsComparisons(){
 const tasks=[{"topic":"Rent","prompt":"Rents in Singapore are higher than rents in Bangkok.","start":"Rents in Bangkok","answer":"Rents in Bangkok are not as high as rents in Singapore.","evidence":"Bangkok: $800 per month; Singapore: $1,800 per month."},{"topic":"Average age","prompt":"The average age in Indonesia is lower than in Thailand.","start":"The average age in Thailand","answer":"The average age in Thailand is not as low as in Indonesia.","evidence":"Thailand: 35 years; Indonesia: 30 years."},{"topic":"Population","prompt":"The population of Thailand is larger than the population of Singapore.","start":"The population of Singapore","answer":"The population of Singapore is not as large as the population of Thailand.","evidence":"Singapore: 5.3 million; Thailand: 70 million."},{"topic":"Population density","prompt":"Singapore is more crowded than Thailand.","start":"Thailand","answer":"Thailand is not as crowded as Singapore.","evidence":"Thailand: 140 people per sq km; Singapore: 7,800 people per sq km."},{"topic":"Size","prompt":"Indonesia is bigger than Thailand.","start":"Thailand","answer":"Thailand is not as big as Indonesia.","evidence":"Thailand: about 500,000 sq km; Indonesia: about 2 million sq km."}];
 const form=$("as-comparisons-form"),status=$("as-comparisons-status");
 tasks.forEach((task,i)=>{const item=document.createElement("div");item.className="as-writing-item";const label=document.createElement("label");label.htmlFor="as-answer-"+i;const topic=document.createElement("strong");topic.textContent=(i+1)+". "+task.topic;label.append(topic,document.createElement("br"),document.createTextNode(task.prompt));const hint=document.createElement("p");hint.className="small";hint.id="as-start-"+i;hint.textContent="Begin: "+task.start+" …";const input=document.createElement("textarea");input.id=label.htmlFor;input.rows=2;input.placeholder="Write your sentence with not as … as";input.setAttribute("aria-describedby",hint.id);const feedback=document.createElement("p");feedback.className="feedback";feedback.hidden=true;feedback.textContent=task.answer+"\nChart: "+task.evidence;item.append(label,hint,input,feedback);$("as-comparison-questions").append(item);});
 form.addEventListener("submit",event=>{event.preventDefault();form.querySelectorAll(".feedback").forEach(node=>node.hidden=false);status.textContent="Compare your sentences with the model answers. Equivalent wording is possible; written sentences are for self-review.";});
 $("as-comparisons-reset").addEventListener("click",()=>{HTMLFormElement.prototype.reset.call(form);form.querySelectorAll(".feedback").forEach(node=>node.hidden=true);status.textContent="Answers cleared. Try the five sentences again.";});
}
initAsComparisons();


function initEqualComparisons(){
 const equalTasks=[{"context":"Room A: $100 per night. Room B: $100 per night.","sentence":"Room A is as ___ as Room B.","answer":"expensive"},{"context":"Building A: 20 meters tall. Building B: 20 meters tall.","sentence":"Building A is as ___ as Building B.","answer":"tall"},{"context":"Bag A: 3 kg. Bag B: 3 kg.","sentence":"Bag A is as ___ as Bag B.","answer":"heavy"},{"context":"Trip A: 30 minutes. Trip B: 30 minutes.","sentence":"Trip A is as ___ as Trip B.","answer":"long"},{"context":"Visitor A: 25 years old. Visitor B: 25 years old.","sentence":"Visitor A is as ___ as Visitor B.","answer":"old"}];
 const form=$("equal-comparisons-form"),status=$("equal-comparisons-score");
 equalTasks.forEach((task,i)=>{const item=document.createElement("div");item.className="equal-comparison-item";const label=document.createElement("label");label.htmlFor="equal-answer-"+i;label.textContent=(i+1)+". "+task.context+" ("+task.answer+")";const input=document.createElement("input");input.id=label.htmlFor;input.name="equal"+i;input.type="text";input.autocomplete="off";input.setAttribute("aria-label","Question "+(i+1)+": write a complete as … as sentence");const feedback=document.createElement("p");feedback.className="feedback";feedback.hidden=true;feedback.textContent=task.sentence.replace("___",task.answer);item.append(label,input,feedback);$("equal-comparison-questions").append(item);});
 form.addEventListener("submit",event=>{event.preventDefault();form.querySelectorAll(".feedback").forEach(node=>node.hidden=false);status.hidden=false;status.textContent="Compare your sentences with the model answers. Equivalent wording is possible; written sentences are for self-review.";});
 $("equal-comparisons-reset").addEventListener("click",()=>{HTMLFormElement.prototype.reset.call(form);form.querySelectorAll(".feedback").forEach(node=>node.hidden=true);status.hidden=true;status.textContent="";});
}
initEqualComparisons();

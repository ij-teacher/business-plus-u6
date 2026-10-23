'use strict';
(async()=>{
 const form=document.getElementById('word-practice-form'),score=document.getElementById('word-practice-score'),button=form.querySelector('[type=submit]');button.disabled=true;
 const bank=document.querySelector('.word-bank'),bankStatus=document.getElementById('word-bank-status'),inputs=[...form.querySelectorAll('input')];let selected=null;
 const chips=[...bank.querySelectorAll('span')].map(span=>{
  const chip=document.createElement('button');chip.type='button';chip.className='word-chip';chip.textContent=span.textContent==='review'?'reviews':span.textContent;chip.dataset.word=chip.textContent;chip.draggable=true;chip.setAttribute('aria-pressed','false');
  chip.addEventListener('click',()=>{selected=selected===chip.dataset.word?null:chip.dataset.word;chips.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.word===selected)));bankStatus.textContent=selected?'Selected: '+selected+'. Tap a blank, or focus a blank and press Enter.':'Selection cleared.';});
  chip.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',chip.dataset.word);event.dataTransfer.effectAllowed='copy';chip.classList.add('dragging');});
  chip.addEventListener('dragend',()=>{chip.classList.remove('dragging');inputs.forEach(input=>input.classList.remove('drop-target'));});span.replaceWith(chip);return chip;
 });
 const allowed=new Set(chips.map(chip=>chip.dataset.word));
 function refreshBank(){chips.forEach(chip=>chip.classList.toggle('used',inputs.some(input=>input.value.trim().toLowerCase()===chip.dataset.word)));}
 function clearFeedback(input){input.removeAttribute('aria-invalid');document.getElementById(input.getAttribute('aria-describedby')).hidden=true;score.hidden=true;}
 function placeWord(input,word){if(!allowed.has(word))return;input.value=word;clearFeedback(input);selected=null;chips.forEach(chip=>chip.setAttribute('aria-pressed','false'));refreshBank();bankStatus.textContent='Placed '+word+' in '+input.getAttribute('aria-label').toLowerCase()+'.';}
 inputs.forEach(input=>{
  input.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';input.classList.add('drop-target');});
  input.addEventListener('dragleave',()=>input.classList.remove('drop-target'));
  input.addEventListener('drop',event=>{event.preventDefault();input.classList.remove('drop-target');placeWord(input,event.dataTransfer.getData('text/plain').trim().toLowerCase());});
  input.addEventListener('click',()=>{if(selected)placeWord(input,selected);});
  input.addEventListener('keydown',event=>{if(event.key==='Enter'&&selected){event.preventDefault();placeWord(input,selected);}});
  input.addEventListener('input',()=>{clearFeedback(input);refreshBank();});
 });
 const header=document.querySelector('header');function updateSticky(){document.documentElement.style.setProperty('--word-bank-top',(Math.ceil(header.getBoundingClientRect().height)+8)+'px');}
 updateSticky();new ResizeObserver(updateSticky).observe(header);
 try{
  const response=await fetch('data/reading-word-practice.json?v=1');if(!response.ok)throw Error('load');const {items}=await response.json();
  form.addEventListener('submit',event=>{
   event.preventDefault();let total=0,empty=0;
   items.forEach((item,i)=>{const input=document.getElementById('word-answer-'+i),feedback=document.getElementById('word-feedback-'+i),value=input.value.trim().toLowerCase(),correct=value===item.answer;if(correct)total++;if(!value)empty++;
    input.setAttribute('aria-invalid',String(!correct));feedback.hidden=false;feedback.className='feedback '+(correct?'correct':'incorrect');
    const answer=i===3?'Unfortunately':item.answer;
    feedback.textContent=(correct?'✓ Correct. ':'Answer: '+answer+'. ')+(i===6?'Use the plural “reviews” for online customer opinions.':'');
   });
   score.hidden=false;score.textContent='Your score: '+total+' / '+items.length+'. '+(empty?empty+' unanswered. ':'')+'Review the answers above, then try again.';
  });
  document.getElementById('word-practice-reset').addEventListener('click',()=>{form.reset();form.querySelectorAll('.feedback').forEach(p=>{p.hidden=true;p.textContent='';});form.querySelectorAll('input').forEach(input=>input.removeAttribute('aria-invalid'));score.hidden=true;score.textContent='';selected=null;chips.forEach(chip=>chip.setAttribute('aria-pressed','false'));refreshBank();bankStatus.textContent='Answers cleared. Drag a word or select a word and tap a blank.';});
  button.disabled=false;
 }catch{score.hidden=false;score.textContent='The exercise could not be loaded. Please refresh the page.';}
})();

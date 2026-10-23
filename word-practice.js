'use strict';
(async()=>{
 const form=document.getElementById('word-practice-form'),score=document.getElementById('word-practice-score'),button=form.querySelector('[type=submit]');button.disabled=true;
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
  document.getElementById('word-practice-reset').addEventListener('click',()=>{form.reset();form.querySelectorAll('.feedback').forEach(p=>{p.hidden=true;p.textContent='';});form.querySelectorAll('input').forEach(input=>input.removeAttribute('aria-invalid'));score.hidden=true;score.textContent='';});
  button.disabled=false;
 }catch{score.hidden=false;score.textContent='The exercise could not be loaded. Please refresh the page.';}
})();

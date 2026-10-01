/* Camada de dados compartilhada (localStorage). Para produção, troque por API + banco de dados. */
const DB={get(k,d){try{const v=JSON.parse(localStorage.getItem('eh_'+k));return v==null?d:v}catch{return d}},set(k,v){localStorage.setItem('eh_'+k,JSON.stringify(v))}};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const br=s=>s.split('-').reverse().join('/');
const hm=ts=>new Date(ts).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const DIAS=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const HORAS=Array.from({length:12},(_,i)=>String(i+8).padStart(2,'0')+':00');
const PSI_PHONE='5535997416927';
const fone=t=>{t=String(t).replace(/\D/g,'');return t.length<=11?'55'+t:t};
const wa=(t,m)=>`https://wa.me/${fone(t)}?text=${encodeURIComponent(m)}`;
const LOGO='<svg viewBox="0 0 64 64" fill="none" stroke="#72d6c8" stroke-width="3"><path d="M23 12c-8 0-13 7-11 14-6 4-5 14 2 17-1 8 8 13 15 8V17c-1-3-3-5-6-5Z"/><path d="M41 12c8 0 13 7 11 14 6 4 5 14-2 17 1 8-8 13-15 8V17c1-3 3-5 6-5Z"/><path d="M18 27h11M35 27h11M20 41l9-5M44 41l-9-5"/></svg>';

/* Seed: conta do psicólogo e horários padrão */
if(!DB.get('users'))DB.set('users',[{id:'psi',nome:'Erik Henrique Silva',email:'erikhriq2@gmail.com',tel:'35997416927',senha:'erik@2026',role:'psicologo'}]);
if(!DB.get('avail'))DB.set('avail',{1:['09:00','10:00','14:00','15:00'],2:['09:00','10:00','14:00','15:00'],3:['09:00','10:00','14:00','15:00'],4:['09:00','10:00','14:00','15:00'],5:['09:00','10:00']});

const Auth={
  user(){const id=DB.get('session');return id?DB.get('users',[]).find(u=>u.id===id)||null:null},
  login(email,senha){const u=DB.get('users',[]).find(u=>u.email===email.trim().toLowerCase()&&u.senha===senha);if(u)DB.set('session',u.id);return u},
  register(d){const us=DB.get('users',[]);d.email=d.email.trim().toLowerCase();if(us.some(u=>u.email===d.email))return null;const u={id:uid(),role:'paciente',criado:Date.now(),...d};us.push(u);DB.set('users',us);DB.set('session',u.id);return u},
  logout(){localStorage.removeItem('eh_session');location.href='login.html'},
  require(role){const u=this.user();if(!u||u.role!==role){location.href='login.html';return null}return u}
};
const Appt={all:()=>DB.get('appts',[]),save:a=>DB.set('appts',a),taken:(d,h)=>Appt.all().some(a=>a.date===d&&a.time===h&&['pendente','confirmada'].includes(a.status))};
const Chat={thread:pid=>DB.get('msgs',[]).filter(m=>m.pid===pid),send(pid,from,text){const l=DB.get('msgs',[]);l.push({id:uid(),pid,from,text,ts:Date.now()});DB.set('msgs',l)}};
function chatHTML(pid,me){return Chat.thread(pid).map(m=>`<div class="msg ${m.from===me?'me':''}">${esc(m.text)}<small>${hm(m.ts)}</small></div>`).join('')||'<div class="empty">Nenhuma mensagem ainda.</div>'}
function topbar(u,sub){return `<header class="top"><div class="wrap in"><a class="brand" href="index.html"><span class="mark">${LOGO}</span><span><b>ERIK HENRIQUE</b><small>${sub}</small></span></a><div class="who"><span>${esc(u.nome)}</span><a class="btn sm line" style="color:#fff;border-color:rgba(255,255,255,.3)" href="index.html">Site</a><button class="btn sm mint" onclick="Auth.logout()">Sair</button></div></div></header>`}

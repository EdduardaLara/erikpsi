// Função serverless da Vercel: avisa o Erik (WhatsApp via CallMeBot) quando um paciente solicita consulta.
const clean=(s,n=120)=>String(s??'').replace(/[\r\n<>]/g,' ').slice(0,n);

module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
  const {CALLMEBOT_PHONE,CALLMEBOT_APIKEY}=process.env;
  const b=req.body||{};
  if(b.tipo!=='solicitacao')return res.status(400).json({error:'Tipo inválido'});
  const data=clean(b.data,10).split('-').reverse().join('/');
  const text=`Nova solicitação de consulta!\n\nPaciente: ${clean(b.nome)}\nTelefone: ${clean(b.tel,20)}\nData: ${data} às ${clean(b.hora,5)}\n\nAceite ou recuse no painel: https://${req.headers.host}/psicologo.html`;
  const out={whatsapp:false};

  try{if(CALLMEBOT_PHONE&&CALLMEBOT_APIKEY){
    const u=`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent('+'+CALLMEBOT_PHONE.replace(/\D/g,''))}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(CALLMEBOT_APIKEY)}`;
    out.whatsapp=(await fetch(u)).ok}}catch{}

  res.status(200).json(out);
};

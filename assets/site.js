/* Lommo, scripts do site. Sem dependências externas. */
(function(){
'use strict';
var d=document,w=window,root=d.documentElement;
var RM=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=w.matchMedia('(hover: hover) and (pointer: fine)').matches;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
function wait(ms){return new Promise(function(r){setTimeout(r,RM?0:ms)})}

/* ano do rodapé */
$$('[data-ano]').forEach(function(e){e.textContent=new Date().getFullYear()});

/* cabeçalho e contato flutuante */
var hd=$('.hd'),fab=$('.fab'),mbar=$('.mbar');
var ticking=false;
function onScroll(){
  var y=w.scrollY;
  if(hd)hd.classList.toggle('sc',y>12);
  var show=y>w.innerHeight*.55;
  if(fab)fab.classList.toggle('on',show);
  if(mbar)mbar.classList.toggle('on',show);
  progress();
  ticking=false;
}
w.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});

/* menu no celular */
var mb=$('.menu-bt');
function closeMenu(){d.body.classList.remove('open');if(mb){mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-label','Abrir menu')}d.body.style.overflow=''}
if(mb){
  mb.addEventListener('click',function(){
    var o=!d.body.classList.contains('open');
    d.body.classList.toggle('open',o);
    mb.setAttribute('aria-expanded',String(o));
    mb.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');
    d.body.style.overflow=o?'hidden':'';
    if(o){var f=$('.mnav a');if(f)f.focus()}
  });
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.body.classList.contains('open')){closeMenu();mb.focus()}});
  $$('.mnav a').forEach(function(a){a.addEventListener('click',closeMenu)});
}

/* revelação ao rolar */
if('IntersectionObserver' in w&&!RM){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  $$('.rv,.wfw').forEach(function(e){io.observe(e)});
}else{$$('.rv,.wfw').forEach(function(e){e.classList.add('in')})}

/* luz que acompanha o cursor nos cartões */
if(FINE){
  $$('.spot').forEach(function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
  });
}

/* símbolo do herói reage ao cursor */
var sym=$('.sym');
if(sym&&FINE&&!RM){
  var g1=$('.g1',sym),g2=$('.g2',sym),gd=$('.gd',sym);
  var tx=0,ty=0,cx=0,cy=0,raf=null;
  function loop(){
    cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    g1.setAttribute('transform','translate('+(-cx*1.6).toFixed(2)+' '+(-cy*1.2).toFixed(2)+')');
    g2.setAttribute('transform','translate('+(cx*1.6).toFixed(2)+' '+(cy*1.2).toFixed(2)+')');
    gd.setAttribute('transform','translate('+(cx*4.2).toFixed(2)+' '+(cy*4.2).toFixed(2)+')');
    if(Math.abs(tx-cx)>.01||Math.abs(ty-cy)>.01)raf=requestAnimationFrame(loop);else raf=null;
  }
  w.addEventListener('pointermove',function(e){
    tx=(e.clientX/w.innerWidth-.5)*2;ty=(e.clientY/w.innerHeight-.5)*2;
    if(!raf)raf=requestAnimationFrame(loop);
  },{passive:true});
}

/* progresso das etapas e da linha do tempo */
var steps=$$('.steps'),tls=$$('.tl');
function progress(){
  var vh=w.innerHeight;
  steps.forEach(function(s){
    var r=s.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,(vh*.8-r.top)/(r.height+vh*.25)));
    if(RM)p=1;
    s.style.setProperty('--p',p.toFixed(3));
    var it=$$('.step',s);
    it.forEach(function(st,i){st.classList.toggle('on',p>=(i+.35)/it.length)});
  });
  tls.forEach(function(t){
    var r=t.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,(vh*.6-r.top)/r.height));
    if(RM)p=1;
    t.style.setProperty('--p',p.toFixed(3));
    $$('.it',t).forEach(function(it){var rr=it.getBoundingClientRect();it.classList.toggle('on',rr.top<vh*.6||RM)});
  });
}
onScroll();

/* demonstração simulada de IA */
var DEMOS={
  pedidos:{
    titulo:'Mensagens recebidas',
    entrada:[
      {de:'Marina, 09:12',t:'Bom dia! Quanto fica um site para a minha loja de roupas? Queria algo simples.'},
      {de:'Paulo, 09:40',t:'Consigo marcar uma visita na quinta à tarde?'},
      {de:'Renata, 10:05',t:'Vocês atendem aos sábados? E aceitam cartão?'},
      {de:'Carlos, 10:31',t:'Pedi o orçamento semana passada e ninguém me respondeu.'},
      {de:'Júlia, 11:02',t:'Preciso de preço para 3 páginas e formulário de contato.'}
    ],
    tags:[['Orçamento','#F26B4F'],['Agendamento','#8FA8FF'],['Dúvida','#A9B4C6'],['Atenção','#FFC861'],['Orçamento','#F26B4F']],
    run:async function(out,ins){
      var stats=el('div','rowg fade');
      stats.innerHTML=stat('2','orçamentos')+stat('1','agendamento')+stat('1','dúvida')+stat('1','pede atenção');
      out.appendChild(stats);
      await wait(500);
      var tb=el('table','table fade');
      tb.innerHTML='<thead><tr><th>Cliente</th><th>Assunto</th><th>Prioridade</th></tr></thead><tbody>'+
        [['Carlos','Retorno pendente','Alta'],['Marina','Orçamento de site','Média'],['Júlia','Orçamento, 3 páginas','Média'],['Paulo','Visita na quinta','Média'],['Renata','Horário e pagamento','Baixa']]
        .map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'}).join('')+'</tbody>';
      out.appendChild(tb);
      var rows=$$('tbody tr',tb);
      for(var i=0;i<rows.length;i++){await wait(220);rows[i].classList.add('s')}
      await wait(300);
      var s=el('div','sum fade');out.appendChild(s);
      await type(s,'<b>Sugestão:</b> responder o Carlos primeiro, porque ele aguarda retorno há uma semana. Os dois pedidos de orçamento podem receber a mesma resposta inicial.');
    }
  },
  reuniao:{
    titulo:'Anotações soltas da reunião',
    entrada:[
      {de:'Trecho 1',t:'Ana disse que o site antigo não mostra os horários certos e os clientes ligam toda hora perguntando.'},
      {de:'Trecho 2',t:'Ficou combinado que o Bruno revisa os preços até sexta.'},
      {de:'Trecho 3',t:'Discutimos colocar o WhatsApp no topo da página. Todos concordaram.'},
      {de:'Trecho 4',t:'A Ana vai separar as fotos novas da loja até a próxima reunião, dia 12.'}
    ],
    tags:[['Problema','#FFC861'],['Tarefa','#8FA8FF'],['Decisão','#F26B4F'],['Tarefa','#8FA8FF']],
    run:async function(out){
      var s=el('div','sum fade');out.appendChild(s);
      await type(s,'<b>Resumo:</b> o site mostra horários errados e isso gera ligações repetidas. A equipe decidiu colocar o WhatsApp no topo da página.');
      await wait(300);
      var tb=el('table','table fade');
      tb.innerHTML='<thead><tr><th>Tarefa</th><th>Responsável</th><th>Prazo</th></tr></thead><tbody><tr><td>Revisar preços</td><td>Bruno</td><td>Sexta</td></tr><tr><td>Separar fotos da loja</td><td>Ana</td><td>Dia 12</td></tr><tr><td>Corrigir horários no site</td><td>A definir</td><td>A definir</td></tr></tbody>';
      out.appendChild(tb);
      var rows=$$('tbody tr',tb);
      for(var i=0;i<rows.length;i++){await wait(260);rows[i].classList.add('s')}
      await wait(300);
      var n=el('div','sum fade');n.innerHTML='<b>Observação:</b> a terceira tarefa ficou sem responsável na reunião.';out.appendChild(n);
    }
  },
  resposta:{
    titulo:'E-mail de um cliente',
    entrada:[
      {de:'Fernanda, 14:20',t:'Olá! Tenho um consultório e queria saber se vocês fazem site com agendamento online. Também queria entender quanto tempo leva para ficar pronto.'}
    ],
    tags:[['Orçamento','#F26B4F']],
    run:async function(out){
      var s=el('div','sum fade');out.appendChild(s);
      await type(s,'Olá, Fernanda! Obrigado pelo contato. Fazemos, sim, sites com agendamento online para consultórios. O prazo depende do número de páginas e de como você prefere receber os agendamentos. Podemos conversar 20 minutos esta semana para eu entender a rotina do consultório? Assim te envio uma proposta com prazo definido.');
      await wait(300);
      var n=el('div','sum fade');n.innerHTML='<b>Rascunho pronto para revisão.</b> Uma pessoa confere e ajusta antes de enviar.';out.appendChild(n);
    }
  }
};
function el(t,c){var e=d.createElement(t);if(c)e.className=c;return e}
function stat(n,l){return '<div class="stat"><span>'+n+'</span><small>'+l+'</small></div>'}
async function type(node,html){
  if(RM){node.innerHTML=html;return}
  var tmp=d.createElement('div');tmp.innerHTML=html;
  var parts=[];tmp.childNodes.forEach(function(n){parts.push(n)});
  node.classList.add('caret');
  for(var i=0;i<parts.length;i++){
    var p=parts[i];
    if(p.nodeType===3){
      var tn=d.createTextNode('');node.appendChild(tn);
      var txt=p.textContent;
      for(var j=0;j<txt.length;j+=2){tn.textContent=txt.slice(0,j+2);await wait(14)}
    }else{node.appendChild(p.cloneNode(true));await wait(60)}
  }
  node.classList.remove('caret');
}
$$('[data-demo]').forEach(function(box){
  var tabs=$$('.tabs button',box),ins=$('.inp',box),out=$('.out',box),run=$('.run',box),lbl=$('.mid .lbl',box);
  var cur=box.getAttribute('data-demo')||'pedidos',busy=false,token=0;
  function render(k){
    cur=k;token++;busy=false;
    var D=DEMOS[k];
    tabs.forEach(function(t){t.setAttribute('aria-selected',String(t.dataset.k===k));t.tabIndex=t.dataset.k===k?0:-1});
    ins.innerHTML='<h4><span>'+D.titulo+'</span><span>Entrada</span></h4>'+D.entrada.map(function(m){return '<div class="msg"><small>'+m.de+'</small>'+m.t+'<span class="tg"></span></div>'}).join('');
    out.innerHTML='<h4><span>Resultado</span><span>Saída</span></h4><p class="ph">Toque em <b>Organizar</b> para ver a ferramenta trabalhar.</p>';
    run.disabled=false;run.classList.add('go');
    lbl.textContent='Simulação';
  }
  async function go(){
    if(busy)return;busy=true;var my=++token;
    run.disabled=true;run.classList.remove('go');lbl.textContent='Processando';
    var D=DEMOS[cur];var ph=$('.ph',out);if(ph)ph.remove();
    var msgs=$$('.msg',ins);
    for(var i=0;i<msgs.length;i++){
      if(my!==token)return;
      await wait(380);
      var tg=$('.tg',msgs[i]);tg.textContent=D.tags[i][0];tg.style.background=D.tags[i][1];tg.style.color='#101826';
      msgs[i].style.setProperty('--c',D.tags[i][1]);msgs[i].classList.add('t');
    }
    await wait(400);if(my!==token)return;
    await D.run(out,ins);
    if(my!==token)return;
    lbl.textContent='Concluído';
    var rs=el('button','reset');rs.type='button';rs.textContent='Ver de novo';rs.addEventListener('click',function(){render(cur)});out.appendChild(rs);
    var live=$('.live',box);if(live)live.textContent='Simulação concluída. O resultado aparece no painel de saída.';
    busy=false;
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){render(t.dataset.k)});
    t.addEventListener('keydown',function(e){
      var n=null;if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];
      if(n){e.preventDefault();n.focus();render(n.dataset.k)}
    });
  });
  run.addEventListener('click',go);
  render(cur);
});

/* calculadora de tempo */
var calc=$('[data-calc]');
if(calc){
  var fmt=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0});
  var brl=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
  function paint(r){var mn=+r.min,mx=+r.max;r.style.setProperty('--v',((r.value-mn)/(mx-mn)*100)+'%')}
  function upd(){
    var pes=+$('#c-pes',calc).value,hrs=+$('#c-hrs',calc).value,pct=+$('#c-pct',calc).value,val=+$('#c-val',calc).value;
    $$('input[type=range]',calc).forEach(paint);
    $('#o-pes',calc).value=pes+(pes===1?' pessoa':' pessoas');
    $('#o-hrs',calc).value=hrs+' h';
    $('#o-pct',calc).value=pct+'%';
    $('#o-val',calc).value=val?brl.format(val):'Não informar';
    var tasks=$$('.chips input:checked',calc).length;
    var mes=pes*hrs*(52/12)*(pct/100);
    var big=$('#r-h',calc);big.textContent=fmt.format(Math.round(mes));
    $('#r-d',calc).textContent=fmt.format(Math.round(mes/8));
    $('#r-a',calc).textContent=fmt.format(Math.round(mes*12));
    var rv=$('#r-v',calc);rv.parentNode.style.display=val?'':'none';rv.textContent=brl.format(Math.round(mes*val));
    $('#r-t',calc).textContent=tasks?('Você marcou '+tasks+(tasks===1?' tipo de tarefa. No diagnóstico, avaliamos o quanto ela pode ser automatizada.':' tipos de tarefa. No diagnóstico, avaliamos o quanto cada uma pode ser automatizada.')):'Marque ao lado as tarefas que se repetem na sua rotina.';
  }
  $$('input',calc).forEach(function(i){i.addEventListener('input',upd);i.addEventListener('change',upd)});
  upd();
}

/* autoavaliação do site */
var quiz=$('[data-quiz]');
if(quiz){
  var qs=$$('.q',quiz),fg=$('.gauge .fg',quiz),val=$('.gauge .val b',quiz),tt=$('#s-t',quiz),tx=$('#s-x',quiz),pr=$('#s-p',quiz),cta=$('#s-cta',quiz);
  var MSG=[
    [0,'Comece por aqui','Responda as perguntas ao lado. A nota aparece aqui conforme você avança.'],
    [1,'Há muito espaço para crescer','O seu site provavelmente está deixando clientes sem resposta. Um diagnóstico mostra por onde começar sem desperdiçar investimento.'],
    [4,'Uma boa base, com lacunas','Alguns pontos importantes já funcionam. Outros fazem visitantes desistirem antes de falar com você. Vale descobrir quais pesam mais.'],
    [7,'Presença digital bem cuidada','Seu site cobre o essencial. O próximo passo costuma estar na operação: tarefas que a IA pode tirar da rotina.']
  ];
  function upq(){
    var ans=0,yes=0;
    qs.forEach(function(q){var c=$('input:checked',q);if(c){ans++;if(c.value==='1')yes++}});
    var total=qs.length;
    var pct=ans?yes/total:0;
    fg.style.strokeDashoffset=String(100-pct*100);
    fg.style.stroke=yes>=7?'#8FA8FF':(yes>=4?'#F4F1EA':'#F26B4F');
    val.textContent=yes;
    pr.textContent=ans+' de '+total+' respondidas';
    var m=MSG[0];
    if(ans===total){m=yes>=7?MSG[3]:(yes>=4?MSG[2]:MSG[1])}
    else if(ans>0){m=['','Continue respondendo','Faltam '+(total-ans)+(total-ans===1?' pergunta':' perguntas')+' para a sua nota final.']}
    tt.textContent=m[1];tx.textContent=m[2];
    cta.hidden=ans!==total;
    try{if(ans===total)sessionStorage.setItem('lommo_auto',yes+' de '+total)}catch(e){}
  }
  $$('input',quiz).forEach(function(i){i.addEventListener('change',upq)});
  upq();
}

/* formulário do diagnóstico */
var fw=$('[data-form]');
if(fw){
  var f=$('form',fw),btn=$('button[type=submit]',f),msg=$('.fmsg',fw),t0=Date.now();
  try{var au=sessionStorage.getItem('lommo_auto');if(au)$('[name=autoavaliacao]',f).value=au}catch(e){}
  var tel=$('[name=telefone]',f);
  tel.addEventListener('input',function(){
    var v=tel.value.replace(/\D/g,'');if(v.indexOf('55')===0&&v.length>11)v=v.slice(2);v=v.slice(0,11);
    var o=v;
    if(v.length>2)o='('+v.slice(0,2)+') '+v.slice(2);
    if(v.length>7)o='('+v.slice(0,2)+') '+v.slice(2,v.length===11?7:6)+'-'+v.slice(v.length===11?7:6);
    tel.value=o;
  });
  var rules={
    nome:function(v){return v.trim().split(/\s+/).length>=2||'Escreva o nome completo, com sobrenome.'},
    cargo:function(v){return v.trim().length>=2||'Informe o seu cargo ou função.'},
    site:function(v){return v.trim().length>=2||'Informe o site da empresa. Se ainda não tiver, coloque o Instagram ou escreva “não tenho”.'},
    telefone:function(v){var n=v.replace(/\D/g,'');return (n.length===10||n.length===11)||'Informe um telefone com DDD.'},
    email:function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Confira o e-mail. Ele precisa ter o formato nome@empresa.com.'}
  };
  function check(name){
    var i=$('[name='+name+']',f),wrap=i.closest('.fld'),r=rules[name](i.value);
    var ok=r===true;wrap.classList.toggle('bad',!ok);i.setAttribute('aria-invalid',String(!ok));
    $('.err',wrap).textContent=ok?'':r;return ok;
  }
  Object.keys(rules).forEach(function(n){
    var i=$('[name='+n+']',f);
    i.addEventListener('blur',function(){if(i.value)check(n)});
    i.addEventListener('input',function(){if(i.closest('.fld').classList.contains('bad'))check(n)});
  });
  var cs=$('[name=consentimento]',f);
  cs.addEventListener('change',function(){cs.closest('.consent').classList.toggle('bad',!cs.checked)});
  f.addEventListener('submit',async function(e){
    e.preventDefault();msg.className='fmsg';msg.textContent='';
    var first=null;
    Object.keys(rules).forEach(function(n){if(!check(n)&&!first)first=$('[name='+n+']',f)});
    if(!cs.checked){cs.closest('.consent').classList.add('bad');if(!first)first=cs}
    if(first){first.focus();msg.className='fmsg err';msg.textContent='Revise os campos destacados para continuar.';return}
    if($('[name=botcheck]',f).checked)return;
    if(Date.now()-t0<2500){await new Promise(function(r){setTimeout(r,2500)})}
    btn.classList.add('busy');btn.disabled=true;
    var data={};new FormData(f).forEach(function(v,k){if(k!=='botcheck')data[k]=v});
    data.consentimento='Sim, autorizou o contato sobre o diagnóstico';
    data.pagina=location.href;
    try{
      var res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
      var j={};try{j=await res.json()}catch(x){}
      if(res.status===200&&j.success!==false){
        fw.classList.add('ok');
        var nm=$('#done-nome',fw);if(nm)nm.textContent=data.nome.trim().split(/\s+/)[0];
        fw.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
        var h=$('.done h2',fw);if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
        try{sessionStorage.removeItem('lommo_auto')}catch(x){}
      }else{throw new Error(j.message||'erro')}
    }catch(err){
      msg.className='fmsg err';
      msg.innerHTML='Não conseguimos enviar agora. Tente de novo em instantes ou fale direto no <a href="https://wa.me/5547999299875">WhatsApp</a>.';
    }finally{btn.classList.remove('busy');btn.disabled=false}
  });
}

/* ===== versão 2 ===== */
/* símbolo de partículas */
var pst=$('.pstage');
if(pst){
  var cv=$('canvas',pst),cx2=cv.getContext('2d',{alpha:true});
  var DPR=Math.min(1.5,w.devicePixelRatio||1),W2=0,H2=0,N=0,X,Y,VX,VY,TX,TY,PH,CI,SZ;
  var COLS=['#8FA8FF','#B9C8FF','#F4F1EA','#2B50D8','#3D62E8','#F26B4F','#FF8C72'];
  var mouse={x:-9999,y:-9999,on:false},raf=0,visible=true,t=0;
  var SP1='M14 50 V26 C14 10 32 10 32 26 V50',SP2='M32 26 C32 10 50 10 50 26 V44';
  function build(){
    var r=cv.getBoundingClientRect();if(!r.width)return;
    W2=Math.round(r.width*DPR);H2=Math.round(r.height*DPR);cv.width=W2;cv.height=H2;
    var size=Math.min(W2,H2)*.78,ox=(W2-size)/2,oy=(H2-size)/2,sc=size/46.5;
    var off=d.createElement('canvas');off.width=W2;off.height=H2;var o=off.getContext('2d',{willReadFrequently:true});
    o.setTransform(sc,0,0,sc,ox-9.5*sc,oy-9.5*sc);o.lineCap='round';o.lineJoin='round';o.lineWidth=9;o.strokeStyle='#000';o.fillStyle='#000';
    var gap=Math.max(4,Math.round(size/(FINE?80:62)));
    function sample(draw){o.save();o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,W2,H2);o.restore();draw();var data=o.getImageData(0,0,W2,H2).data,pts=[];
      for(var y=0;y<H2;y+=gap)for(var x=0;x<W2;x+=gap){if(data[(y*W2+x)*4+3]>128)pts.push(x+(Math.random()-.5)*gap*.6,y+(Math.random()-.5)*gap*.6)}return pts}
    var A=sample(function(){o.stroke(new Path2D(SP1))}),B=sample(function(){o.stroke(new Path2D(SP2))}),C=sample(function(){o.beginPath();o.arc(50,50,6,0,6.2832);o.fill()});
    var oldN=N,oX=X,oY=Y;N=(A.length+B.length+C.length)/2;
    X=new Float32Array(N);Y=new Float32Array(N);VX=new Float32Array(N);VY=new Float32Array(N);TX=new Float32Array(N);TY=new Float32Array(N);PH=new Float32Array(N);CI=new Uint8Array(N);SZ=new Float32Array(N);
    var k=0;
    function put(arr,cols){for(var i=0;i<arr.length;i+=2){TX[k]=arr[i];TY[k]=arr[i+1];X[k]=k<oldN?oX[k]:Math.random()*W2;Y[k]=k<oldN?oY[k]:Math.random()*H2;PH[k]=Math.random()*6.28;CI[k]=cols[(i/2)%cols.length];SZ[k]=(Math.random()*.9+1.5)*DPR;k++}}
    put(A,[0,0,1,2]);put(B,[3,4,0]);put(C,[5,5,6]);
    if(RM){for(var i=0;i<N;i++){X[i]=TX[i];Y[i]=TY[i]}}
  }
  function draw(){
    cx2.clearRect(0,0,W2,H2);
    for(var c=0;c<COLS.length;c++){cx2.fillStyle=COLS[c];for(var i=0;i<N;i++){if(CI[i]===c){var s=SZ[i];cx2.fillRect(X[i]-s/2,Y[i]-s/2,s,s)}}}
  }
  function frame(){
    raf=0;if(!visible)return;
    t+=.016;var R=100*DPR,R2=R*R,mx=mouse.x,my=mouse.y,mo=mouse.on,amp=1.1*DPR;
    for(var i=0;i<N;i++){
      var tx=TX[i]+Math.sin(t*1.3+PH[i])*amp,ty=TY[i]+Math.cos(t*1.1+PH[i])*amp;
      var vx=(VX[i]+(tx-X[i])*.05),vy=(VY[i]+(ty-Y[i])*.05);
      if(mo){var dx=X[i]-mx,dy=Y[i]-my,d2=dx*dx+dy*dy;if(d2<R2){var dd=Math.sqrt(d2)||1,f=(R-dd)/R*5;vx+=dx/dd*f;vy+=dy/dd*f}}
      vx*=.84;vy*=.84;VX[i]=vx;VY[i]=vy;X[i]+=vx;Y[i]+=vy;
    }
    draw();
    raf=requestAnimationFrame(frame);
  }
  function start(){if(!raf&&!RM&&visible)raf=requestAnimationFrame(frame)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=0}}
  function pos(e){var r=cv.getBoundingClientRect();mouse.x=(e.clientX-r.left)*DPR;mouse.y=(e.clientY-r.top)*DPR;mouse.on=true}
  cv.addEventListener('pointermove',pos,{passive:true});
  cv.addEventListener('pointerdown',function(e){pos(e);for(var i=0;i<N;i++){var a=Math.random()*6.28,s=(Math.random()*16+6)*DPR;VX[i]+=Math.cos(a)*s;VY[i]+=Math.sin(a)*s}start()});
  cv.addEventListener('pointerleave',function(){mouse.on=false});
  var rt;w.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){build();if(RM)draw()},250)});
  d.addEventListener('visibilitychange',function(){if(d.hidden)stop();else start()});
  build();
  if(RM){draw()}else{
    if('IntersectionObserver' in w){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)start();else stop()}).observe(pst)}
    start();
  }
}

/* capítulo do símbolo */
var story=$('.story');
if(story){
  var s1=$('.s1',story),s2=$('.s2',story),sd=$('.sd',story),caps=$$('.cap',story),bar=$('.bar',story);
  function cl(v){return Math.max(0,Math.min(1,v))}
  function upStory(){
    var r=story.getBoundingClientRect(),tot=r.height-w.innerHeight,p=cl(-r.top/tot);
    if(RM)p=1;
    var o1=1-cl(p*3.2),o2=1-cl(p*3.2-1.05);
    s1.style.setProperty('--o',o1.toFixed(3));s1.style.opacity=o1>.995?0:1;
    s2.style.setProperty('--o',o2.toFixed(3));s2.style.opacity=o2>.995?0:1;
    var ds=cl(p*3.2-2.1);sd.style.setProperty('--sc',(ds<1?ds*1.15:1).toFixed(3));
    var idx=p<.34?0:(p<.67?1:2);caps.forEach(function(c,i){c.classList.toggle('on',i===idx||RM)});
    if(bar)bar.style.setProperty('--p',p.toFixed(3));
  }
  w.addEventListener('scroll',function(){requestAnimationFrame(upStory)},{passive:true});upStory();
}

/* cursor próprio e botões magnéticos */
if(FINE&&!RM){
  var c1=el('div','cur'),c2=el('div','cur-r');d.body.appendChild(c1);d.body.appendChild(c2);
  var mx=-100,my=-100,rx=-100,ry=-100,cr=0;
  function ring(){cr=0;rx+=(mx-rx)*.38;ry+=(my-ry)*.38;c2.style.transform='translate3d('+rx+'px,'+ry+'px,0)';if(Math.abs(mx-rx)>.3||Math.abs(my-ry)>.3)cr=requestAnimationFrame(ring)}
  w.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;c1.style.transform='translate3d('+mx+'px,'+my+'px,0)';if(!cr)cr=requestAnimationFrame(ring);d.body.classList.add('cur-on')},{passive:true});
  d.documentElement.addEventListener('mouseleave',function(){d.body.classList.remove('cur-on')});
  d.addEventListener('pointerover',function(e){
    var t=e.target;
    c2.classList.toggle('big',!!t.closest('a,button,label,summary,input[type=range]'));
    var dk=!!t.closest('.coral,.t-coral,.chip input:checked+span');
    c1.classList.toggle('dk',dk);c2.classList.toggle('dk',dk);
  },{passive:true});
  $$('.btn').forEach(function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.18,y=(e.clientY-r.top-r.height/2)*.28;b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'});
    b.addEventListener('pointerleave',function(){b.style.transform=''});
  });
}
})();

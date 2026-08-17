/* ============ LE LONDRES DE SHERLOCK HOLMES — moteur (P0) ============ */
(function(){
"use strict";

// ================== I18N (FR / EN) ==================
let LANG = localStorage.getItem('shlang') || 'fr';
function T(key){ return (UI[LANG]&&UI[LANG][key])!==undefined ? UI[LANG][key] : UI.fr[key]; }
// Accès localisé aux données
function locName(loc){ return (LANG==='en'&&LOC_EN[loc.id]&&LOC_EN[loc.id].name)||loc.name; }
function locDesc(loc){ return (LANG==='en'&&LOC_EN[loc.id]&&LOC_EN[loc.id].desc)||loc.desc; }
function locFun(loc){ return (LANG==='en'&&LOC_EN[loc.id]&&LOC_EN[loc.id].fun)||loc.fun; }
function catLabel(k){ return LANG==='en' ? (CAT_EN[k]||CATEGORIES[k].label) : CATEGORIES[k].label; }
function caseTitle(c){ return LANG==='en'&&CASES_EN[c.id] ? CASES_EN[c.id].title : c.title; }
function caseSub(c){ return LANG==='en'&&CASES_EN[c.id] ? CASES_EN[c.id].sub : c.sub; }
function caseIntro(c){ return LANG==='en'&&CASES_EN[c.id] ? CASES_EN[c.id].intro : c.intro; }
function caseStepText(c,i){ return LANG==='en'&&CASES_EN[c.id] ? CASES_EN[c.id].steps[i] : c.steps[i].text; }
function roomTitle(i){ return LANG==='en' ? ROOM_EN[i].title : ROOM_HOTSPOTS[i].title; }
function roomText(i){ return LANG==='en' ? ROOM_EN[i].text : ROOM_HOTSPOTS[i].text; }
function thamesName(i){ return LANG==='en' ? THAMES_EN.steps[i].name : THAMES_CHASE.steps[i].name; }
function thamesSide(i){ return LANG==='en' ? THAMES_EN.steps[i].side : THAMES_CHASE.steps[i].side; }
function thamesText(i){ return LANG==='en' ? THAMES_EN.steps[i].text : THAMES_CHASE.steps[i].text; }
function engName(s){ const e=ENGLAND_EN[s.name]; return (LANG==='en'&&e&&e.name)||s.name; }
function engText(s){ const e=ENGLAND_EN[s.name]; return (LANG==='en'&&e&&e.text)||s.text; }
function huntRiddle(i){ return LANG==='en' ? HUNT_EN.clues[i].riddle : MORIARTY_HUNT.clues[i].riddle; }
function huntFound(i){ return LANG==='en' ? HUNT_EN.clues[i].found : MORIARTY_HUNT.clues[i].found; }
function quizQ(i){ return LANG==='en' ? QUIZ_EN[i].q : QUIZ[i].q; }
function quizOpts(i){ return LANG==='en' ? QUIZ_EN[i].opts : QUIZ[i].opts; }
function quizWhy(i){ return LANG==='en' ? QUIZ_EN[i].why : QUIZ[i].why; }
function gradeLabel(gi){ return LANG==='en' ? GRADES_EN[gi].label : QUIZ_GRADES[gi].label; }
function gradeDesc(gi){ return LANG==='en' ? GRADES_EN[gi].desc : QUIZ_GRADES[gi].desc; }
function misBrief(i){ return LANG==='en' ? MISSIONS_EN[i] : MISSIONS[i].brief; }


// ---------- CITATIONS BILINGUES ----------
function bq(vo){
  // FR : VO (preuve canon) + VF dessous. EN : VO seule.
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const fr=(LANG==='fr')&&(typeof QUOTES_FR!=='undefined')&&QUOTES_FR[vo];
  return esc('“'+vo+'”')+(fr?'<span class="vf">'+esc(fr)+'</span>':'');
}
// ---------- CARTE ----------
const map = L.map('map',{zoomControl:false, attributionControl:true})
  .setView([51.512,-0.122], 13);
L.control.zoom({position:'bottomright'}).addTo(map);

// ---------- FONDS DE CARTE (registre multi-fonds, sélecteur déroulant) ----------
const NLS_ATTR = 'Cartes historiques : <a href="https://maps.nls.uk/">National Library of Scotland</a> (CC-BY)';
const TRANSPARENT_TILE='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const BASEMAPS = {
  victorian: {
    label:{fr:'🗺️ Londres 1895 (OS d\'époque)',en:'🗺️ London 1895 (period OS)'},
    make:()=>L.layerGroup([
      L.tileLayer('https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png',
        {maxZoom:19, maxNativeZoom:16, attribution:NLS_ATTR+' · OS one-inch 1885-1900'}),
      L.tileLayer('https://mapseries-tilesets.s3.amazonaws.com/london_1890s/{z}/{x}/{y}.png',
        {maxZoom:19, maxNativeZoom:18, minZoom:10, errorTileUrl:TRANSPARENT_TILE,
         attribution:'OS London 5ft 1890s'})]),
    css:'paper' },
  oneinch: {
    label:{fr:'🚂 Angleterre 1890 (une carte au pouce)',en:'🚂 England 1890 (one-inch)'},
    make:()=>L.tileLayer('https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png',
      {maxZoom:19, maxNativeZoom:16, attribution:NLS_ATTR+' · OS one-inch 1885-1900'}),
    css:'paper' },
  night: {
    label:{fr:'🌙 Nuit victorienne (stylisé)',en:'🌙 Victorian night (stylised)'},
    make:()=>L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {attribution:'&copy; OpenStreetMap &copy; CARTO', maxZoom:19}),
    css:'night' },
  parchment: {
    label:{fr:'📜 Parchemin épuré (moderne)',en:'📜 Clean parchment (modern)'},
    make:()=>L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {attribution:'&copy; OpenStreetMap &copy; CARTO', maxZoom:19}),
    css:'parchment' },
  modern: {
    label:{fr:'🏙️ Londres moderne (OSM)',en:'🏙️ Modern London (OSM)'},
    make:()=>L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {attribution:'&copy; OpenStreetMap contributors', maxZoom:19}),
    css:'none' },
  satellite: {
    label:{fr:'🛰️ Vue aérienne actuelle',en:'🛰️ Aerial view today'},
    make:()=>L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {attribution:'&copy; Esri — comparez le Londres de Holmes à celui d\'aujourd\'hui', maxZoom:19}),
    css:'none' }
};
let currentBase=null, currentLayer=null;
function setBase(name){
  if(!BASEMAPS[name]) name='victorian';
  if(name===currentBase) return;
  if(currentLayer){ map.removeLayer(currentLayer); }
  currentLayer=BASEMAPS[name].make(); currentLayer.addTo(map);
  currentBase=name; localStorage.setItem('shbase',name);
  document.body.className=document.body.className.replace(/tile-css-\w+/g,'').trim();
  document.body.classList.add('tile-css-'+BASEMAPS[name].css);
  const sel=document.getElementById('baseSelect'); if(sel) sel.value=name;
}
function buildBaseSelect(){
  const sel=document.getElementById('baseSelect'); if(!sel) return;
  sel.innerHTML=Object.entries(BASEMAPS).map(([k,b])=>
    `<option value="${k}">${b.label[LANG]||b.label.fr}</option>`).join('');
  sel.value=currentBase||'victorian';
  sel.onchange=()=>setBase(sel.value);
}
setBase(localStorage.getItem('shbase')||'victorian');
buildBaseSelect();

// ---------- ÉTAT ----------
const state = { activeCats:new Set(Object.keys(CATEGORIES)), markers:{}, mode:'explore',
  chaseLayer:null, chaseAnim:null };

// ids des lieux sonorisés (défini tôt pour les tooltips)
const VOICE_LOC_IDS=new Set(['stbarts','221b','camden','parklane','tower','jacobson','briony','criterion','northumberland','baker_irregulars']);
// ---------- MARQUEURS ----------
const MAJOR = new Set(['221b','scotlandyard','lauriston','lyceum','swandam','diogenes','northumberland','tower','stbarts','criterion']);
function makeIcon(loc){
  const cat = CATEGORIES[loc.cat];
  const major = MAJOR.has(loc.id) ? ' major' : '';
  return L.divIcon({className:'', html:
    `<div class="sh-marker${major}" style="--mc:${cat.color}">${cat.icon}</div>`,
    iconSize: major? [30,30]:[22,22], iconAnchor: major? [15,15]:[11,11]});
}
// Masquer les lieux mineurs aux faibles zooms pour désencombrer la carte
map.on('zoomend',()=>{ refresh(); });
LOCATIONS.forEach(loc=>{
  const m = L.marker(loc.coords,{icon:makeIcon(loc)})
    .bindTooltip(()=>locName(loc)+(VOICE_LOC_IDS.has(loc.id)?' ♪':''),{className:'sh-tip',direction:'top',offset:[0,-14]})
    .on('click',()=>{
      if(activeGame==='hunt'){ if(huntTry(loc.id)) return; }
      if(activeGame==='missions'){ if(misTry(loc.id)) return; }
      if(activeGame==='fog'){ fogReveal(loc.id); }
      openPanel(loc);
    });
  m._loc = loc; m.addTo(map); state.markers[loc.id]=m;
});

// ---------- PANNEAU ----------
const $ = id=>document.getElementById(id);
function openPanel(loc){
  const cat = CATEGORIES[loc.cat];
  $('panelBadges').innerHTML =
    `<span class="badge ${loc.status==='canon'?'b-canon':'b-deduit'}">${loc.status==='canon'?T('badgeCanon'):T('badgeDeduit')}</span>
     <span class="badge b-cat">${cat.icon} ${catLabel(loc.cat)}</span>`;
  $('panelName').textContent = locName(loc);
  $('panelQuote').innerHTML = bq(loc.quote);
  $('panelRef').textContent = '— '+loc.ref;
  $('panelDesc').textContent = locDesc(loc);
  $('panelFun').textContent = locFun(loc) || '';
  $('panelFun').style.display = loc.fun? 'block':'none';
  $('panelStories').innerHTML = loc.stories.map(s=>`<span class="story-chip">${s}</span>`).join('');
  const clip=clipForLoc(loc.id), pa=document.getElementById('panelAudio');
  if(pa) pa.remove();
  if(clip){
    const div=document.createElement('div'); div.id='panelAudio';
    div.innerHTML=`<button>${T('listen')}${clip.txt}</button>`;
    div.querySelector('button').onclick=()=>playClip(clip.id);
    $('panelStories').after(div);
  }
  const img=$('panelImg');
  if(loc.img){ img.src=loc.img; img.style.display='block'; $('panelImgCap').textContent=T('imgCap'); }
  else { img.src=''; img.style.display='none'; $('panelImgCap').textContent=''; }
  $('panel').classList.add('open');
  map.flyTo(loc.coords, Math.max(map.getZoom(),15), {duration:.9});
}
$('panelClose').onclick=()=>$('panel').classList.remove('open');

// ---------- FILTRES ----------
const counts={}; LOCATIONS.forEach(l=>counts[l.cat]=(counts[l.cat]||0)+1);
function buildFilters(){
  $('filters').innerHTML = Object.entries(CATEGORIES).map(([k,c])=>
    `<button class="f-btn${state.activeCats.has(k)?'':' off'}" data-cat="${k}" style="--fc:${c.color}">${c.icon} ${catLabel(k)}<span class="f-count">${counts[k]||0}</span></button>`).join('');
  document.querySelectorAll('.f-btn').forEach(btn=>{
    btn.onclick=()=>{
      const cat=btn.dataset.cat;
      if(state.activeCats.has(cat)) state.activeCats.delete(cat); else state.activeCats.add(cat);
      btn.classList.toggle('off', !state.activeCats.has(cat));
      refresh();
    };
  });
}
buildFilters();
function refresh(){
  let n=0;
  const z=map.getZoom();
  Object.values(state.markers).forEach(m=>{
    const zoomOk = z>=13 || MAJOR.has(m._loc.id) || z>=12 && m._loc.status==='canon';
    const ok = zoomOk && state.activeCats.has(m._loc.cat) && matchSearch(m._loc);
    if(ok){ m.addTo(map); n++; } else map.removeLayer(m);
  });
  $('locCount').textContent=n; const sb=document.getElementById('statusbar'); if(sb) sb.childNodes[1].textContent=T('locCount');
}

// ---------- RECHERCHE ----------
let q='', storyQ='';
// ---------- FILTRE PAR RÉCIT ----------
const STORY_NAMES={STUD:"A Study in Scarlet",SIGN:"The Sign of the Four",SCAN:"A Scandal in Bohemia",REDH:"The Red-Headed League",IDEN:"A Case of Identity",BOSC:"The Boscombe Valley Mystery",FIVE:"The Five Orange Pips",TWIS:"The Man with the Twisted Lip",BLUE:"The Blue Carbuncle",SPEC:"The Speckled Band",ENGR:"The Engineer's Thumb",NOBL:"The Noble Bachelor",BERY:"The Beryl Coronet",COPP:"The Copper Beeches",SILV:"Silver Blaze",CARD:"The Cardboard Box",YELL:"The Yellow Face",STOC:"The Stockbroker's Clerk",GLOR:"The Gloria Scott",MUSG:"The Musgrave Ritual",REIG:"The Reigate Squires",CROO:"The Crooked Man",RESI:"The Resident Patient",GREE:"The Greek Interpreter",NAVA:"The Naval Treaty",FINA:"The Final Problem",EMPT:"The Empty House",NORW:"The Norwood Builder",DANC:"The Dancing Men",SOLI:"The Solitary Cyclist",PRIO:"The Priory School",BLAC:"Black Peter",CHAS:"Charles Augustus Milverton",SIXN:"The Six Napoleons","3STU":"The Three Students",GOLD:"The Golden Pince-Nez",MISS:"The Missing Three-Quarter",ABBE:"The Abbey Grange",SECO:"The Second Stain",HOUN:"The Hound of the Baskervilles",VALL:"The Valley of Fear",WIST:"Wisteria Lodge",CARDB:"The Cardboard Box",REDC:"The Red Circle",BRUC:"The Bruce-Partington Plans",DYIN:"The Dying Detective",LADY:"Lady Frances Carfax",DEVI:"The Devil's Foot",LAST:"His Last Bow",ILLU:"The Illustrious Client",BLAN:"The Blanched Soldier",MAZA:"The Mazarin Stone","3GAB":"The Three Gables",SUSS:"The Sussex Vampire","3GAR":"The Three Garridebs",THOR:"Thor Bridge",CREE:"The Creeping Man",LION:"The Lion's Mane",VEIL:"The Veiled Lodger",SHOS:"Shoscombe Old Place",RETI:"The Retired Colourman"};
(function(){
  const sel=document.getElementById('storyFilter');
  const used=new Set(); LOCATIONS.forEach(l=>l.stories.forEach(s=>used.add(s)));
  [...used].sort().forEach(s=>{
    const o=document.createElement('option'); o.value=s;
    o.textContent=s+(STORY_NAMES[s]? ' — '+STORY_NAMES[s]:'');
    sel.appendChild(o);
  });
  sel.addEventListener('change',e=>{ storyQ=e.target.value; refresh();
    if(storyQ){ const pts=LOCATIONS.filter(l=>l.stories.includes(storyQ)).map(l=>l.coords);
      if(pts.length) map.fitBounds(L.latLngBounds(pts),{padding:[70,70],maxZoom:14}); }
  });
})();
function matchSearch(loc){
  if(storyQ && !loc.stories.includes(storyQ)) return false;
  if(!q) return true;
  const hay=(loc.name+' '+locName(loc)+' '+locDesc(loc)+' '+loc.stories.join(' ')).toLowerCase();
  return hay.includes(q);
}
$('search').addEventListener('input',e=>{ q=e.target.value.trim().toLowerCase(); refresh(); });

// ---------- MODES ----------
document.querySelectorAll('.mode-btn').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.mode-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.mode=b.dataset.mode;
    $('chasePanel').classList.toggle('hidden', state.mode!=='chases');
    $('aboutPanel').classList.toggle('hidden', state.mode!=='about');
    $('casePanel').classList.toggle('hidden', state.mode!=='cases');
    $('timelinePanel').classList.toggle('hidden', state.mode!=='timeline');
    if(state.mode!=='chases') stopChase();
    if(state.mode!=='cases') exitCase();
    if(state.mode!=='timeline') tlReset();
    $('annexPanel').classList.toggle('hidden', state.mode!=='annex');
    $('gamesPanel').classList.toggle('hidden', state.mode!=='games');
    if(state.mode!=='games') endAllGames();
  };
});

// ---------- POURSUITES ----------
$('chaseList').innerHTML = CHASES.map(c=>
  `<div class="chase-card" data-id="${c.id}"><b>${c.name}</b><p>${c.desc}</p></div>`).join('');
document.querySelectorAll('.chase-card').forEach(card=>{
  card.onclick=()=>startChase(CHASES.find(c=>c.id===card.dataset.id));
});
function stopChase(){
  if(state.chaseAnim) cancelAnimationFrame(state.chaseAnim);
  if(state.chaseLayer){ map.removeLayer(state.chaseLayer); state.chaseLayer=null; }
  $('chaseStatus').textContent='';
}
function startChase(chase){
  stopChase();
  const layer = L.layerGroup().addTo(map); state.chaseLayer=layer;
  const line = L.polyline([], {color:chase.color, weight:4, opacity:.85, dashArray:'8 6'}).addTo(layer);
  const ghost = L.polyline(chase.path, {color:chase.color, weight:2, opacity:.25}).addTo(layer);
  const mover = L.marker(chase.path[0],{icon:L.divIcon({className:'',
    html:`<div class="sh-marker major" style="--mc:${chase.color}">${chase.icon}</div>`,
    iconSize:[38,38],iconAnchor:[19,19]})}).addTo(layer);
  map.fitBounds(ghost.getBounds(),{padding:[60,60]});
  const segs=chase.path.length-1, total=segs*chase.speed;
  const t0=performance.now();
  function frame(t){
    const el=t-t0, prog=Math.min(el/total,1), fi=prog*segs, i=Math.min(Math.floor(fi),segs-1), f=fi-i;
    const a=chase.path[i], b=chase.path[i+1];
    const pos=[a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f];
    mover.setLatLng(pos);
    line.setLatLngs(chase.path.slice(0,i+1).concat([pos]));
    const stepIdx=Math.min(Math.floor(prog*chase.steps.length),chase.steps.length-1);
    $('chaseStatus').textContent='➤ '+chase.steps[stepIdx];
    if(prog<1) state.chaseAnim=requestAnimationFrame(frame);
    else $('chaseStatus').textContent='✔ '+chase.steps[chase.steps.length-1];
  }
  state.chaseAnim=requestAnimationFrame(frame);
}

// ---------- AFFAIRES (SCROLLYTELLING) ----------
let curCase=null, curStep=0, caseLayer=null;
function buildCaseList(){
  $('caseList').innerHTML = CASES.map(c=>
    `<div class="case-card" data-id="${c.id}" style="--cc:${c.color}">
       <b>${caseTitle(c)}</b><div class="cc-sub">${caseSub(c)} · ${c.steps.length} ${T('etapes')}</div><p>${caseIntro(c)}</p></div>`).join('');
  document.querySelectorAll('.case-card').forEach(card=>{
    card.onclick=()=>enterCase(CASES.find(c=>c.id===card.dataset.id));
  });
}
buildCaseList();
function enterCase(c){
  curCase=c; curStep=0;
  $('caseHome').classList.add('hidden'); $('caseView').classList.remove('hidden');
  $('caseHeader').innerHTML=`<b>${caseTitle(c)}</b><div class="cc-sub">${caseSub(c)}</div>`;
  caseLayer=L.layerGroup().addTo(map);
  const pts=c.steps.map(s=>s.coords);
  L.polyline(pts,{color:c.color,weight:2,opacity:.4,dashArray:'4 8'}).addTo(caseLayer);
  c.steps.forEach((s,i)=>{
    L.marker(s.coords,{icon:L.divIcon({className:'',html:
      `<div class="sh-marker" style="--mc:${c.color};font-family:var(--serif);font-size:12px;color:#e8c96a">${i+1}</div>`,
      iconSize:[30,30],iconAnchor:[15,15]})})
      .on('click',()=>{curStep=i;showStep();}).addTo(caseLayer);
  });
  showStep();
}
function exitCase(){
  if(caseLayer){map.removeLayer(caseLayer);caseLayer=null;}
  curCase=null;
  $('caseHome')&&$('caseHome').classList.remove('hidden');
  $('caseView')&&$('caseView').classList.add('hidden');
}
$('caseBack').onclick=exitCase;
function showStep(){
  const s=curCase.steps[curStep];
  $('caseStepCard').innerHTML=
    `<div class="step-loc">${T('step')} ${curStep+1}/${curCase.steps.length} — ${s.loc}</div>`+
    (s.img?`<img src="${s.img}" alt="${s.loc}">`:'')+
    `<div class="step-text">${caseStepText(curCase,curStep)}</div>
     <div class="step-quote">${bq(s.quote)}</div>`;
  $('stepPrev').disabled=curStep===0;
  $('stepPrev').textContent=T('prev');
  $('stepNext').textContent=curStep===curCase.steps.length-1?T('closed'):T('next');
  $('stepDots').innerHTML=curCase.steps.map((_,i)=>
    `<span class="dot${i===curStep?' on':''}" data-i="${i}"></span>`).join('');
  document.querySelectorAll('#stepDots .dot').forEach(d=>d.onclick=()=>{curStep=+d.dataset.i;showStep();});
  map.flyTo(s.coords, s.zoom||16, {duration:1.1});
}
$('stepPrev').onclick=()=>{ if(curStep>0){curStep--;showStep();} };
$('stepNext').onclick=()=>{ if(curCase&&curStep<curCase.steps.length-1){curStep++;showStep();} else exitCase(); };

// ---------- TIMELINE ----------
function tlApply(year){
  $('tlYear').textContent=year>=1914?'1874 – 1914':String(year);
  let vis=0, tot=0;
  Object.values(state.markers).forEach(m=>{
    const yrs=m._loc.stories.map(s=>STORY_YEARS[s]).filter(Boolean);
    const minY=yrs.length?Math.min(...yrs):1874; tot++;
    const el=m.getElement&&m.getElement();
    if(el){ el.classList.toggle('mk-dim', minY>year); }
    if(minY<=year) vis++;
  });
  $('tlInfo').textContent=`${vis} lieux déjà « écrits » en ${Math.min(year,1914)}.`;
}
function tlReset(){ Object.values(state.markers).forEach(m=>{
  const el=m.getElement&&m.getElement(); if(el) el.classList.remove('mk-dim'); });
}
$('tlSlider').addEventListener('input',e=>tlApply(+e.target.value));

// ---------- ANNEXE 1 : LE SALON DU 221B ----------
const seenSpots=new Set();
$('annexBtn221b').onclick=()=>{ $('roomOverlay').classList.remove('hidden'); buildRoom(); };
$('annexBtnThames').onclick=()=>{ $('thamesOverlay').classList.remove('hidden'); buildThames(); };
$('annexBtnEngland').onclick=()=>showEngland();
document.querySelectorAll('.ov-close').forEach(b=>b.onclick=()=>$(b.dataset.ov).classList.add('hidden'));
let roomBuilt=false;
function buildRoom(){
  if(roomBuilt) return; roomBuilt=true;
  $('roomHotspots').innerHTML=ROOM_HOTSPOTS.map((h,i)=>
    `<div class="hotspot" data-i="${i}" style="left:${h.x}%;top:${h.y}%" title="${h.title}">${h.icon}</div>`).join('');
  document.querySelectorAll('.hotspot').forEach(el=>{
    el.onclick=()=>{
      const idx=+el.dataset.i, h=ROOM_HOTSPOTS[idx];
      seenSpots.add(idx); el.classList.add('seen');
      $('roomDetail').innerHTML=`<h4>${h.icon} ${roomTitle(idx)}</h4>`+
        (h.img?`<img src="${h.img}" alt="${roomTitle(idx)}">`:'')+
        `<div class="rq">${bq(h.quote)}</div><div class="rr">— ${h.ref}</div>
         <div class="rt">${roomText(idx)}</div>`+
        (h.warn?`<div class="rw">${LANG==='en'?ROOM_WARN_EN:'⚕️ Contexte historique : la cocaïne était légale en 1888 ; le canon documente aussi le combat de Watson pour en libérer Holmes (« the fiend was not dead, but sleeping » — MISS).'}</div>`:'');
      $('roomProgress').textContent=`${T('roomProgress')} ${seenSpots.size} / ${ROOM_HOTSPOTS.length}`+
        (seenSpots.size===ROOM_HOTSPOTS.length?T('roomDone'):'');
    };
  });
}
// ---------- ANNEXE 2 : LA TAMISE ----------
let thamesMapObj=null, thStep=0;
function buildThames(){
  if(!thamesMapObj){
    thamesMapObj=L.map('thamesMap',{zoomControl:false,attributionControl:false});
    L.tileLayer('https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png',{maxZoom:18,maxNativeZoom:16}).addTo(thamesMapObj);
    L.tileLayer('https://mapseries-tilesets.s3.amazonaws.com/london_1890s/{z}/{x}/{y}.png',{maxZoom:18,minZoom:10,errorTileUrl:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}).addTo(thamesMapObj);
    const pts=THAMES_CHASE.steps.map(s=>s.coords);
    L.polyline(pts,{color:'#37657d',weight:3,opacity:.7,dashArray:'8 6'}).addTo(thamesMapObj);
    THAMES_CHASE.steps.forEach((s,i)=>{
      L.marker(s.coords,{icon:L.divIcon({className:'',html:
        `<div class="sh-marker" style="--mc:#37657d;font-size:12px;color:#e8c96a">${i+1}</div>`,
        iconSize:[30,30],iconAnchor:[15,15]})})
        .on('click',()=>{thStep=i;thShow();}).addTo(thamesMapObj);
    });
  }
  setTimeout(()=>thamesMapObj.invalidateSize(),80);
  thStep=0; thShow();
}
function thShow(){
  const s=THAMES_CHASE.steps[thStep];
  const img = s.img || null;
  $('thamesDetail').innerHTML=
    `<div class="th-side">${thamesSide(thStep)} · ${T('step').toLowerCase()} ${thStep+1}/${THAMES_CHASE.steps.length}</div>
     <h4>${thamesName(thStep)}</h4>`+(img?`<img src="${img}">`:'')+
    `<div class="rt">${thamesText(thStep)}</div><div class="rq">${bq(s.quote)}</div>`;
  $('thDots').innerHTML=THAMES_CHASE.steps.map((_,i)=>`<span class="dot${i===thStep?' on':''}" data-i="${i}"></span>`).join('');
  document.querySelectorAll('#thDots .dot').forEach(d=>d.onclick=()=>{thStep=+d.dataset.i;thShow();});
  thamesMapObj.flyTo(s.coords, 13, {duration:.9});
}
$('thPrev').onclick=()=>{ if(thStep>0){thStep--;thShow();} };
$('thNext').onclick=()=>{ if(thStep<THAMES_CHASE.steps.length-1){thStep++;thShow();} };
// ---------- ANNEXE 3 : L'ANGLETERRE DES AFFAIRES ----------
let englandLayer=null;
function showEngland(){
  if(englandLayer){ map.removeLayer(englandLayer); englandLayer=null; return; }
  englandLayer=L.layerGroup().addTo(map);
  ENGLAND_SITES.forEach(s=>{
    L.marker(s.coords,{icon:L.divIcon({className:'',html:
      `<div class="sh-marker major" style="--mc:#7a4b94">${s.icon}</div>`,iconSize:[38,38],iconAnchor:[19,19]})})
      .bindTooltip(engName(s),{className:'sh-tip',direction:'top',offset:[0,-16]})
      .on('click',()=>{
        $('panelBadges').innerHTML=`<span class="badge b-deduit">${T('badgeOff')}</span><span class="badge b-cat">${s.sigle} · ${s.year}</span>`;
        $('panelName').textContent=engName(s);
        $('panelQuote').innerHTML=bq(s.quote);
        $('panelRef').textContent='— '+s.sigle;
        $('panelDesc').textContent=engText(s);
        $('panelFun').style.display='none';
        $('panelStories').innerHTML='';
        const img=$('panelImg');
        if(s.img){ img.src=s.img; img.style.display='block'; } else { img.src=''; img.style.display='none'; }
        $('panel').classList.add('open');
      }).addTo(englandLayer);
  });
  map.flyTo([51.6,-1.4], 7, {duration:1.3});
}

// ================== JEUX ==================
let activeGame=null, huntIdx=0, quizIdx=0, quizScore=0, quizOrder=[],
    fogCanvas=null, fogCtx=null, fogRevealed=new Set(), fogHud=null,
    misIdx=0, misShillings=0, misTimer=null, misLeft=0, targetMarker=null;

function gShow(html){ $('gamesHome').classList.add('hidden'); $('gameView').classList.remove('hidden'); $('gameBody').innerHTML=html; }
function gHome(){ $('gamesHome').classList.remove('hidden'); $('gameView').classList.add('hidden'); endAllGames(); }
$('gameBack').onclick=gHome;
function endAllGames(){
  activeGame=null; clearTarget(); stopFog(); if(misTimer){clearInterval(misTimer);misTimer=null;}
}
function clearTarget(){ if(targetMarker){ const el=targetMarker.getElement&&targetMarker.getElement(); el&&el.classList.remove('mk-target'); targetMarker=null; } }
function markerById(id){ return state.markers[id]; }

// ---------- CHASSE À MORIARTY ----------
$('gBtnHunt').onclick=()=>{ activeGame='hunt'; huntIdx=0; huntShow(); };
function huntShow(){
  const c=MORIARTY_HUNT.clues[huntIdx];
  gShow(`<h3>${T('huntTitle')}</h3>
    <div class="g-progress">${T('huntClue')} ${huntIdx+1} / ${MORIARTY_HUNT.clues.length}</div>
    ${huntIdx===0?`<p style="font-size:.8rem;line-height:1.6;font-style:italic;color:var(--dim)">${LANG==='en'?HUNT_EN.intro:MORIARTY_HUNT.intro}</p>`:''}
    <div class="g-riddle">🔎 ${huntRiddle(huntIdx)}</div>
    <p style="font-size:.72rem;color:var(--dim)">${T('huntClickHint')}</p>
    <div id="huntFeedback"></div>`);
}
function huntTry(locId){
  if(activeGame!=='hunt') return false;
  const c=MORIARTY_HUNT.clues[huntIdx];
  if(locId===c.target){
    const done = huntIdx===MORIARTY_HUNT.clues.length-1;
    $('huntFeedback').innerHTML=
      `<div class="g-found">✔ ${huntFound(huntIdx)}</div><div class="g-quote">${bq(c.quote)}</div>`+
      (done? `<div class="g-victory"><img src="${MORIARTY_HUNT.reward_img}">${LANG==='en'?HUNT_EN.victory:MORIARTY_HUNT.victory}</div>`
           : `<button class="g-btn" id="huntNext">${T('huntNext')}</button>`);
    if(!done) $('huntNext').onclick=()=>{ huntIdx++; huntShow(); };
    else activeGame=null;
    return true;
  } else {
    $('huntFeedback').innerHTML=`<div class="g-quote" style="border-color:#a03232">${T('huntWrong')}</div>`;
    return true;
  }
}

// ---------- QUIZ ----------
$('gBtnQuiz').onclick=()=>{ activeGame='quiz'; quizIdx=0; quizScore=0;
  quizOrder=[...QUIZ.keys()].sort(()=>Math.random()-.5); quizShow(); };
function quizShow(){
  if(quizIdx>=QUIZ.length){ return quizEnd(); }
  const qi=quizOrder[quizIdx], q=QUIZ[qi];
  const m=markerById(q.loc); if(m) map.flyTo(m._loc.coords, 15, {duration:.9});
  gShow(`<h3>${T('quizTitle')}</h3>
    <div class="g-progress">${T('quizQ')} ${quizIdx+1} / ${QUIZ.length} · ${T('quizScore')} ${quizScore}</div>
    <div class="g-riddle">${quizQ(qi)}</div>
    ${quizOpts(qi).map((o,i)=>`<button class="q-opt" data-i="${i}">${o}</button>`).join('')}
    <div id="quizWhy"></div>`);
  document.querySelectorAll('.q-opt').forEach(btn=>{
    btn.onclick=()=>{
      const i=+btn.dataset.i, good=i===q.a;
      if(good) quizScore++;
      document.querySelectorAll('.q-opt').forEach((b,bi)=>{
        b.disabled=true;
        if(bi===q.a) b.classList.add('good'); else if(bi===i&&!good) b.classList.add('bad');
      });
      $('quizWhy').innerHTML=`<div class="q-why">${good?'✔':'✘'} ${quizWhy(qi)}</div>
        <button class="g-btn" id="quizNext">${quizIdx===QUIZ.length-1?T('quizGrade'):T('quizNext')}</button>`;
      $('quizNext').onclick=()=>{ quizIdx++; quizShow(); };
    };
  });
}
function quizEnd(){
  const gi=QUIZ_GRADES.reduce((acc,g,i)=>quizScore>=g.min?i:acc,0);
  const g=QUIZ_GRADES[gi];
  gShow(`<h3>${T('quizVerdict')}</h3>
    <div class="g-victory"><img class="g-img" src="${g.img}">
    <b style="font-size:1.05rem">${quizScore} / ${QUIZ.length} — ${gradeLabel(gi)}</b><br><br>${gradeDesc(gi)}</div>
    <button class="g-btn" id="quizRetry">${T('quizReplay')}</button>`);
  $('quizRetry').onclick=()=>$('gBtnQuiz').onclick();
  activeGame=null;
}

// ---------- BROUILLARD DE LONDRES ----------
$('gBtnFog').onclick=()=>{ activeGame='fog'; startFog();
  gShow(`<h3>${T('gFog').toUpperCase()}</h3>
    <p style="font-size:.82rem;line-height:1.65">${T('fogIntro').replace('{n}',LOCATIONS.length)}</p>
    <p style="font-size:.72rem;color:var(--dim);font-style:italic">“It is fortunate that I do not live in an age when such things were possible...” — BRUC</p>`); };
function startFog(){
  stopFog(); fogRevealed=new Set();
  fogCanvas=document.createElement('canvas'); fogCanvas.id='fogCanvas'; document.body.appendChild(fogCanvas);
  fogHud=document.createElement('div'); fogHud.className='fog-hud'; document.body.appendChild(fogHud);
  const resize=()=>{ fogCanvas.width=innerWidth; fogCanvas.height=innerHeight-56; drawFog(); };
  fogCanvas._resize=resize; addEventListener('resize',resize);
  map.on('move zoom',drawFog); resize(); updateFogHud();
}
function drawFog(){
  if(!fogCanvas) return;
  fogCtx=fogCanvas.getContext('2d');
  fogCtx.clearRect(0,0,fogCanvas.width,fogCanvas.height);
  fogCtx.fillStyle='rgba(38,33,24,.93)';
  fogCtx.fillRect(0,0,fogCanvas.width,fogCanvas.height);
  fogCtx.globalCompositeOperation='destination-out';
  // trou autour du centre de la carte (la « lanterne » du promeneur)
  const c=map.latLngToContainerPoint(map.getCenter());
  const grad=fogCtx.createRadialGradient(c.x,c.y-0,40,c.x,c.y,190);
  grad.addColorStop(0,'rgba(0,0,0,1)'); grad.addColorStop(1,'rgba(0,0,0,0)');
  fogCtx.fillStyle=grad; fogCtx.beginPath(); fogCtx.arc(c.x,c.y,190,0,7); fogCtx.fill();
  // trous permanents autour des lieux déjà révélés
  fogRevealed.forEach(id=>{
    const m=state.markers[id]; if(!m) return;
    const p=map.latLngToContainerPoint(m.getLatLng());
    const g2=fogCtx.createRadialGradient(p.x,p.y,20,p.x,p.y,90);
    g2.addColorStop(0,'rgba(0,0,0,1)'); g2.addColorStop(1,'rgba(0,0,0,0)');
    fogCtx.fillStyle=g2; fogCtx.beginPath(); fogCtx.arc(p.x,p.y,90,0,7); fogCtx.fill();
  });
  fogCtx.globalCompositeOperation='source-over';
}
function fogReveal(id){ if(activeGame!=='fog') return;
  if(!fogRevealed.has(id)){ fogRevealed.add(id); drawFog(); updateFogHud(); } }
function updateFogHud(){ if(fogHud) fogHud.textContent=T('fogHud')+`${fogRevealed.size} / ${LOCATIONS.length}`+(fogRevealed.size>=LOCATIONS.length?T('fogDone'):''); }
function stopFog(){
  if(fogCanvas){ map.off('move zoom',drawFog); removeEventListener('resize',fogCanvas._resize);
    fogCanvas.remove(); fogCanvas=null; }
  if(fogHud){ fogHud.remove(); fogHud=null; }
}

// ---------- MISSIONS DES IRRÉGULIERS ----------
$('gBtnMissions').onclick=()=>{ activeGame='missions'; misIdx=0; misShillings=0; misShow(); };
function misShow(){
  if(misIdx>=MISSIONS.length) return misEnd();
  const ms=MISSIONS[misIdx]; misLeft=MISSION_TIME;
  clearTarget();
  gShow(`<h3>${T('misTitle')}</h3>
    <div class="g-progress">Mission ${misIdx+1} / ${MISSIONS.length} · ${T('misBourse')} ${misShillings} shillings</div>
    <div class="g-riddle">${misBrief(misIdx)}</div>
    <div class="g-timer" id="misTimer">${misLeft}s</div>
    <div id="misFeedback"></div>`);
  if(misTimer) clearInterval(misTimer);
  misTimer=setInterval(()=>{
    misLeft--; const t=$('misTimer'); if(!t){clearInterval(misTimer);return;}
    t.textContent=misLeft+'s'; t.classList.toggle('low',misLeft<=15);
    if(misLeft<=0){ clearInterval(misTimer);
      $('misFeedback').innerHTML=`<div class="g-quote" style="border-color:#a03232">${T('misLate')}</div>
      <button class="g-btn" id="misNext">${T('misNext')}</button>`;
      $('misNext').onclick=()=>{ misIdx++; misShow(); };
    }
  },1000);
}
function misTry(locId){
  if(activeGame!=='missions'||misLeft<=0) return false;
  const ms=MISSIONS[misIdx];
  if(locId===ms.target){
    clearInterval(misTimer);
    misShillings+=ms.shillings + (misLeft>45?1:0);
    $('misFeedback').innerHTML=`<div class="g-found">${T('misFoundIn')}${MISSION_TIME-misLeft}s ! ${ms.shillings} shilling(s)${misLeft>45?T('misPrime'):''}${T('misInHat')}</div>
      <button class="g-btn" id="misNext">${misIdx===MISSIONS.length-1?T('misLast'):T('misNext')}</button>`;
    $('misNext').onclick=()=>{ misIdx++; misShow(); };
    return true;
  }
  $('misFeedback').innerHTML=`<div class="g-quote" style="border-color:#a03232">${T('misWrong')}</div>`;
  return true;
}
function misEnd(){
  clearTarget(); if(misTimer)clearInterval(misTimer);
  const guinee=misShillings>=21;
  gShow(`<h3>${T('misPayTitle')}</h3>
    <div class="g-victory"><img class="g-img" src="assets/img/game_irregulars.jpg">
    <b>${misShillings} ${T('misEarned')}</b><br><br>${guinee?T('misGuinee'):T('misNoGuinee')}</div>
    <button class="g-btn" id="misRetry">${T('misReplay')}</button>`);
  $('misRetry').onclick=()=>$('gBtnMissions').onclick();
  activeGame=null;
}

// ================== AUDIO ==================
const VOICE_CLIPS = [
 { id:'holmes_afghanistan', who:'Holmes — STUD', txt:'« You have been in Afghanistan, I perceive. »', locs:['stbarts'] },
 { id:'holmes_seventeen',   who:'Holmes — SCAN', txt:'« There are seventeen steps… »', locs:['221b'] },
 { id:'holmes_moriarty',    who:'Holmes — FINA', txt:'« He is the Napoleon of crime, Watson. »', locs:['camden','parklane'] },
 { id:'holmes_aurora',      who:'Holmes — SIGN', txt:'« Pile it on, men!… If we burn the boat we must have them! »', locs:['tower','jacobson'] },
 { id:'holmes_irene',       who:'Holmes — SCAN', txt:'« …she is always the woman. »', locs:['briony'] },
 { id:'watson_london',      who:'Watson — STUD', txt:'« London, that great cesspool… »', locs:['criterion'] },
 { id:'watson_hound',       who:'Watson (Mortimer) — HOUN', txt:'« …the footprints of a gigantic hound! »', locs:['northumberland'] },
 { id:'watson_wisest',      who:'Watson', txt:'« …the best and the wisest man whom I have ever known. »', locs:['baker_irregulars'] }
];
let curClip=null;
function playClip(id){
  if(curClip){ curClip.pause(); curClip=null; }
  curClip=new Audio('assets/audio/'+id+'.mp3'); curClip.volume=.9; curClip.play().catch(()=>{});
}
// galerie dans le panneau Méthode
$('voiceGallery').innerHTML = VOICE_CLIPS.map(v=>
  `<div class="voice-row"><button data-clip="${v.id}">▶</button>
   <div><div class="vr-who">${v.who}</div><div class="vr-txt">${v.txt}</div></div></div>`).join('');
document.querySelectorAll('#voiceGallery button').forEach(b=>b.onclick=()=>playClip(b.dataset.clip));
// bouton écoute dans le panneau lieu
function clipForLoc(id){ return VOICE_CLIPS.find(v=>v.locs.includes(id)); }

// ---------- AMBIANCE (pluie victorienne, WebAudio génératif — zéro fichier) ----------
let ambCtx=null, ambNodes=null, ambMusic=null, hasCustomMusic=null;
// Détection au chargement : si l'utilisateur a déposé assets/audio/ambience.mp3, on l'utilise.
fetch('assets/audio/ambience.mp3',{method:'HEAD'}).then(r=>{hasCustomMusic=r.ok;}).catch(()=>{hasCustomMusic=false;});
$('ambienceBtn').onclick=()=>{
  if(ambNodes||ambMusic){ stopAmbience(); return; }
  if(hasCustomMusic){
    ambMusic=new Audio('assets/audio/ambience.mp3');
    ambMusic.loop=true; ambMusic.volume=0.35;
    ambMusic.play().catch(()=>{ ambMusic=null; startAmbience(); });
    $('ambienceBtn').textContent='🔊'; $('ambienceBtn').classList.add('on');
    $('ambienceBtn').title='Couper la musique d\'ambiance';
    return;
  }
  startAmbience(); };
function startAmbience(){
  ambCtx=ambCtx||new (window.AudioContext||window.webkitAudioContext)();
  ambCtx.resume();
  // pluie = bruit blanc filtré ; rafales = LFO sur le gain ; graves = rumeur de la ville
  const len=ambCtx.sampleRate*2, buf=ambCtx.createBuffer(1,len,ambCtx.sampleRate);
  const d=buf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
  const noise=ambCtx.createBufferSource(); noise.buffer=buf; noise.loop=true;
  const bp=ambCtx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2200; bp.Q.value=.4;
  const lp=ambCtx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=5200;
  const g=ambCtx.createGain(); g.gain.value=.05;
  const lfo=ambCtx.createOscillator(); lfo.frequency.value=.07;
  const lfoG=ambCtx.createGain(); lfoG.gain.value=.02;
  lfo.connect(lfoG); lfoG.connect(g.gain);
  const rumble=ambCtx.createOscillator(); rumble.type='sine'; rumble.frequency.value=44;
  const rg=ambCtx.createGain(); rg.gain.value=.012;
  noise.connect(bp); bp.connect(lp); lp.connect(g); g.connect(ambCtx.destination);
  rumble.connect(rg); rg.connect(ambCtx.destination);
  noise.start(); lfo.start(); rumble.start();
  ambNodes={noise,lfo,rumble};
  $('ambienceBtn').textContent='🔊'; $('ambienceBtn').classList.add('on');
  $('ambienceBtn').title='Couper l\'ambiance';
}
function stopAmbience(){
  if(ambMusic){ ambMusic.pause(); ambMusic=null; }
  if(!ambNodes){
    $('ambienceBtn').textContent='🔇'; $('ambienceBtn').classList.remove('on');
    return;
  }
  Object.values(ambNodes).forEach(n=>{try{n.stop()}catch(e){}});
  ambNodes=null;
  $('ambienceBtn').textContent='🔇'; $('ambienceBtn').classList.remove('on');
  $('ambienceBtn').title='Ambiance sonore : pluie sur Baker Street';
}

// ================== BASCULE DE LANGUE ==================
function applyLang(){
  $('langBtn').textContent = LANG==='fr' ? 'EN' : 'FR';
  document.documentElement.lang=LANG;
  // modes
  const modeKeys={explore:'explore',cases:'cases',chases:'chases',timeline:'timeline',annex:'annex',games:'games',about:'about'};
  document.querySelectorAll('.mode-btn').forEach(b=>{ const k=modeKeys[b.dataset.mode]; if(k) b.textContent=T(k); });
  $('search').placeholder=T('search');
  // splash (si encore présent)
  const se=$('splashEyebrow'); if(se) se.textContent=T('splashEyebrow');
  const ss=$('splashSub'); if(ss) ss.innerHTML=T('splashSub');
  const eb=$('enterBtn'); if(eb) eb.textContent=T('enter');
  // sélecteur de récits
  const sf=$('storyFilter'); if(sf&&sf.options.length) sf.options[0].textContent=T('allStories');
  // panneaux fixes
  const cp=document.querySelector('#chasePanel h3'); if(cp) cp.textContent=T('chasesTitle');
  const ch=document.querySelector('#chasePanel .chase-hint'); if(ch) ch.textContent=T('chasesHint');
  const ct=document.querySelector('#caseHome h3'); if(ct) ct.textContent=T('casesTitle');
  const cs=document.querySelector('#caseHome .chase-hint'); if(cs) cs.textContent=T('casesHint');
  $('caseBack').textContent=T('backCases');
  const at=document.querySelector('#annexPanel h3'); if(at) at.textContent=T('annexTitle');
  const a1=document.querySelector('#annexBtn221b b'); if(a1) a1.textContent=T('annex221b');
  const a1p=document.querySelector('#annexBtn221b p'); if(a1p) a1p.textContent=T('annex221bP');
  const a2=document.querySelector('#annexBtnThames b'); if(a2) a2.textContent=T('annexThames');
  const a2p=document.querySelector('#annexBtnThames p'); if(a2p) a2p.textContent=T('annexThamesP');
  const a3=document.querySelector('#annexBtnEngland b'); if(a3) a3.textContent=T('annexEngland');
  const a3p=document.querySelector('#annexBtnEngland p'); if(a3p) a3p.textContent=T('annexEnglandP');
  const gt=document.querySelector('#gamesHome h3'); if(gt) gt.textContent=T('gamesTitle');
  $('gameBack').textContent=T('backGames');
  const g1=document.querySelector('#gBtnHunt b'); if(g1) g1.textContent=T('gHunt');
  const g1p=document.querySelector('#gBtnHunt p'); if(g1p) g1p.textContent=T('gHuntP');
  const g2=document.querySelector('#gBtnQuiz b'); if(g2) g2.textContent=T('gQuiz');
  const g2p=document.querySelector('#gBtnQuiz p'); if(g2p) g2p.textContent=T('gQuizP');
  const g3=document.querySelector('#gBtnFog b'); if(g3) g3.textContent=T('gFog');
  const g3p=document.querySelector('#gBtnFog p'); if(g3p) g3p.textContent=T('gFogP');
  const g4=document.querySelector('#gBtnMissions b'); if(g4) g4.textContent=T('gMis');
  const g4p=document.querySelector('#gBtnMissions p'); if(g4p) g4p.textContent=T('gMisP');
  // salon 221B & Tamise (têtes)
  const rh=document.querySelector('#roomSide .room-head'); if(rh) rh.innerHTML=T('roomHead')+'<br><span>'+T('roomSub')+'</span>';
  const rhint=document.querySelector('#roomDetail .room-hint'); if(rhint) rhint.textContent=T('roomHint');
  const th=document.querySelector('#thamesSide .room-head'); if(th) th.innerHTML=T('thamesHead')+'<br><span>'+T('thamesSub')+'</span>';
  document.querySelectorAll('.ov-close').forEach(b=>b.textContent=T('backMap'));
  // timeline
  const tlh=document.querySelector('#timelinePanel .tl-head b'); if(tlh) tlh.textContent=T('tlTitle').replace('⏳ ','');
  const tll=document.querySelector('#timelinePanel .tl-legend'); if(tll) tll.childNodes[0].textContent=T('tlLegend')+' ';
  // filtres + listes reconstruits
  buildFilters(); buildCaseList(); buildBaseSelect(); refresh();
}
$('langBtn').onclick=()=>{
  LANG = LANG==='fr' ? 'en' : 'fr';
  localStorage.setItem('shlang',LANG);
  applyLang();
  // rafraîchir les vues ouvertes
  if(curCase){ const c=curCase, s=curStep; exitCase(); enterCase(c); curStep=s; showStep(); }
  if($('panel').classList.contains('open')) $('panelClose').click();
  if(thamesMapObj && !$('thamesOverlay').classList.contains('hidden')) thShow();
};
applyLang();

// ---------- SPLASH ----------
$('enterBtn').onclick=()=>{
  $('splash').classList.add('fade');
  ['topbar','map','vignette','grain','filters','statusbar'].forEach(id=>$(id).classList.remove('hidden'));
  setTimeout(()=>{ map.invalidateSize(); $('splash').remove(); },1200);
};

refresh();
})();

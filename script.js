
const UI={
en:{brand:"worth knowing",eyebrow:"CURATED DIRECTORY · 67 PICKS",title:"Useful Websites",subtitle:"A curated collection of genuinely useful, interesting and accessible websites.",surprise:"Surprise Me",surpriseEyebrow:"YOUR RANDOM PICK",explore:"Explore ↗",directory:"THE DIRECTORY",websites:"websites",results:"results",all:"All",search:"Search websites...",emptyTitle:"Nothing found",emptyText:"Try another search or category.",footer:"A curated collection of genuinely useful, interesting and accessible websites.",reviewed:"Last reviewed: October 2026",disclaimer:"Independent directory. Third-party sites may change their content, availability, pricing or privacy practices.",lang:"Language"},
pt:{brand:"que vale conhecer",eyebrow:"DIRETÓRIO CURADO · 67 ESCOLHAS",title:"Useful Websites",subtitle:"Uma coleção curada de sites realmente úteis, interessantes e acessíveis.",surprise:"Surpreenda-me",surpriseEyebrow:"SUA ESCOLHA ALEATÓRIA",explore:"Explorar ↗",directory:"O DIRETÓRIO",websites:"sites",results:"resultados",all:"Todos",search:"Buscar sites...",emptyTitle:"Nada encontrado",emptyText:"Tente outra busca ou categoria.",footer:"Uma coleção curada de sites realmente úteis, interessantes e acessíveis.",reviewed:"Última revisão: outubro de 2026",disclaimer:"Diretório independente. Sites de terceiros podem alterar conteúdo, disponibilidade, preços ou práticas de privacidade.",lang:"Idioma"},
es:{brand:"que vale la pena conocer",eyebrow:"DIRECTORIO CURADO · 67 SELECCIONES",title:"Useful Websites",subtitle:"Una colección curada de sitios realmente útiles, interesantes y accesibles.",surprise:"Sorpréndeme",surpriseEyebrow:"TU ELECCIÓN ALEATORIA",explore:"Explorar ↗",directory:"EL DIRECTORIO",websites:"sitios",results:"resultados",all:"Todos",search:"Buscar sitios...",emptyTitle:"No se encontró nada",emptyText:"Prueba otra búsqueda o categoría.",footer:"Una colección curada de sitios realmente útiles, interesantes y accesibles.",reviewed:"Última revisión: octubre de 2026",disclaimer:"Directorio independiente. Los sitios de terceros pueden cambiar su contenido, disponibilidad, precios o privacidad.",lang:"Idioma"},
fr:{brand:"à connaître",eyebrow:"RÉPERTOIRE CURATÉ · 67 SÉLECTIONS",title:"Useful Websites",subtitle:"Une sélection de sites vraiment utiles, intéressants et accessibles.",surprise:"Surprenez-moi",surpriseEyebrow:"VOTRE CHOIX ALÉATOIRE",explore:"Explorer ↗",directory:"LE RÉPERTOIRE",websites:"sites",results:"résultats",all:"Tous",search:"Rechercher des sites...",emptyTitle:"Aucun résultat",emptyText:"Essayez une autre recherche ou catégorie.",footer:"Une sélection de sites vraiment utiles, intéressants et accessibles.",reviewed:"Dernière révision : octobre 2026",disclaimer:"Répertoire indépendant. Les sites tiers peuvent modifier leur contenu, disponibilité, tarifs ou pratiques de confidentialité.",lang:"Langue"},
de:{brand:"wissenswert",eyebrow:"KURATIERTES VERZEICHNIS · 67 AUSWAHLEN",title:"Useful Websites",subtitle:"Eine kuratierte Sammlung wirklich nützlicher, interessanter und zugänglicher Websites.",surprise:"Überrasche mich",surpriseEyebrow:"IHRE ZUFALLSAUSWAHL",explore:"Öffnen ↗",directory:"DAS VERZEICHNIS",websites:"Websites",results:"Ergebnisse",all:"Alle",search:"Websites suchen...",emptyTitle:"Nichts gefunden",emptyText:"Versuchen Sie eine andere Suche oder Kategorie.",footer:"Eine kuratierte Sammlung wirklich nützlicher, interessanter und zugänglicher Websites.",reviewed:"Zuletzt geprüft: Oktober 2026",disclaimer:"Unabhängiges Verzeichnis. Drittanbieter können Inhalte, Verfügbarkeit, Preise oder Datenschutzpraktiken ändern.",lang:"Sprache"}
};
let lang=localStorage.getItem("uw-lang")||"en";
let theme=localStorage.getItem("uw-theme")||((matchMedia("(prefers-color-scheme:dark)").matches)?"dark":"light");
let activeCat="All", lastRandom=null;

const $=id=>document.getElementById(id);
function track(eventName, params={}){ if(typeof window.gtag==='function') window.gtag('event',eventName,params); }
let searchTimer=null;
function norm(s){return String(s).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function labelTag(tag){return TAG_LABELS[tag]?.[lang]||tag}
function labelCat(cat){return lang==="en"?cat:CATEGORY_LABELS[lang][cat]||cat}
function updateUI(){
  const u=UI[lang]; document.documentElement.lang=lang; document.title="Useful Websites";
  $("brandTag").textContent=u.brand;$("eyebrow").textContent=u.eyebrow;$("heroTitle").textContent=u.title;$("heroSubtitle").textContent=u.subtitle;
  $("surpriseLabel").textContent=u.surprise;$("surpriseEyebrow").textContent=u.surpriseEyebrow;$("sectionKicker").textContent=u.directory;
  $("searchInput").placeholder=u.search;$("emptyTitle").textContent=u.emptyTitle;$("emptyText").textContent=u.emptyText;$("footerTagline").textContent=u.footer;$("reviewed").textContent=u.reviewed;$("disclaimer").textContent=u.disclaimer;
  $("languageSelect").value=lang;$("themeToggle").textContent=theme==="dark"?"☀️":"🌙";
  renderFilters();render();
}
function renderFilters(){
  const u=UI[lang], cats=["All",...CATEGORIES];
  $("categoryFilters").innerHTML=cats.map(c=>`<button class="filter ${activeCat===c?"active":""}" data-cat="${c}">${c==="All"?u.all:labelCat(c)}</button>`).join("");
  document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{activeCat=b.dataset.cat;track("category_filter",{category:activeCat});renderFilters();render()});
}
function haystack(s){
  const parts=[s.name,s.url,s.category,...s.tags,...(s.searchTerms||[])];
  for(const d of Object.values(s.desc))parts.push(d);
  for(const t of s.tags)parts.push(...Object.values(TAG_LABELS[t]||{}));
  for(const c of Object.values(CATEGORY_LABELS))parts.push(c[s.category]||"");
  return norm(parts.join(" "));
}
function render(){
  const q=norm($("searchInput").value.trim());
  const list=SITES.filter(s=>(activeCat==="All"||s.category===activeCat)&&(!q||haystack(s).includes(q))).sort((a,b)=>a.name.localeCompare(b.name));
  const u=UI[lang]; $("sectionTitle").textContent=`${list.length} ${u.websites}`;$("resultCount").textContent=`${list.length} ${u.results}`;
  $("cards").innerHTML=list.map(s=>`<article class="card"><div class="card-top"><h3>${escapeHtml(s.name)}</h3></div><p>${escapeHtml(s.desc[lang])}</p><div class="tags">${s.tags.map(t=>`<span class="tag">${escapeHtml(labelTag(t))}</span>`).join("")}</div><a class="card-link" href="${s.url}" target="_blank" rel="noopener noreferrer">${u.explore}</a></article>`).join("");
  $("emptyState").hidden=list.length!==0;
}
function randomSite(){
  let pool=SITES.filter(s=>s.id!==lastRandom);
  if(activeCat!=="All")pool=pool.filter(s=>s.category===activeCat);
  const q=norm($("searchInput").value.trim());if(q)pool=pool.filter(s=>haystack(s).includes(q));
  if(!pool.length)return;
  const s=pool[Math.floor(Math.random()*pool.length)];lastRandom=s.id;track("surprise_me",{site:s.name});
  $("surpriseName").textContent=s.name;$("surpriseDescription").textContent=s.desc[lang];$("surpriseLink").textContent=UI[lang].explore;$("surpriseLink").href=s.url;$("surpriseResult").hidden=false;
  $("surpriseResult").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$("languageSelect").addEventListener("change",e=>{lang=e.target.value;localStorage.setItem("uw-lang",lang);track("language_change",{language:lang});updateUI()});
$("themeToggle").onclick=()=>{theme=theme==="dark"?"light":"dark";localStorage.setItem("uw-theme",theme);track("theme_change",{theme});document.body.classList.toggle("dark",theme==="dark");updateUI()};
$("searchInput").addEventListener("input",()=>{render();clearTimeout(searchTimer);searchTimer=setTimeout(()=>{if($("searchInput").value.trim())track("search_used",{language:lang,category:activeCat});},700)});
$("surpriseButton").onclick=randomSite;
document.addEventListener("click",e=>{const link=e.target.closest("a.card-link");if(link){const site=SITES.find(s=>s.url===link.href);track("website_open",{site:site?.name||link.href,category:site?.category||"unknown"});}});
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==$("searchInput")){e.preventDefault();$("searchInput").focus()}if(e.key==="Escape"){$("searchInput").value="";render();$("searchInput").blur()}});
document.body.classList.toggle("dark",theme==="dark");updateUI();

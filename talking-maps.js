// David Bau's Seedrandom (seeded RNG)
!function(a,b){var l,c=eval("this"),d=256,g="random",h=b.pow(d,6),i=b.pow(2,52),j=2*i,k=d-1;function m(r,t,e){var u=[],f=q(function n(r,t){var e,o=[],i=typeof r;if(t&&"object"==i)for(e in r)try{o.push(n(r[e],t-1))}catch(n){}return o.length?o:"string"==i?r:r+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[r,s(a)]:null==r?function(){try{var n;return l&&(n=l.randomBytes)?n=n(d):(n=new Uint8Array(d),(c.crypto||c.msCrypto).getRandomValues(n)),s(n)}catch(n){var r=c.navigator,t=r&&r.plugins;return[+new Date,c,t,c.screen,s(a)]}}():r,3),u),p=new n(u),m=function(){for(var n=p.g(6),r=h,t=0;n<i;)n=(n+t)*d,r*=d,t=p.g(1);for(;j<=n;)n/=2,r/=2,t>>>=1;return(n+t)/r};return m.int32=function(){return 0|p.g(4)},m.quick=function(){return p.g(4)/4294967296},m.double=m,q(s(p.S),a),(t.pass||e||function(n,r,t,e){return e&&(e.S&&o(e,p),n.state=function(){return o(p,{})}),t?(b[g]=n,r):n})(m,f,"global"in t?t.global:this==b,t.state)}function n(n){var r,t=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(t||(n=[t++]);e<d;)i[e]=e++;for(e=0;e<d;e++)i[e]=i[o=k&o+n[e%t]+(r=i[e])],i[o]=r;(u.g=function(n){for(var r,t=0,e=u.i,o=u.j,i=u.S;n--;)r=i[e=k&e+1],t=t*d+i[k&(i[e]=i[o=k&o+r])+(i[o]=r)];return u.i=e,u.j=o,t})(d)}function o(n,r){return r.i=n.i,r.j=n.j,r.S=n.S.slice(),r}function q(n,r){for(var t,e=n+"",o=0;o<e.length;)r[k&o]=k&(t^=19*r[k&o])+e.charCodeAt(o++);return s(r)}function s(n){return String.fromCharCode.apply(0,n)}if(q(b.random(),a),"object"==typeof module&&module.exports){module.exports=m;try{l=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return m}):b["seed"+g]=m}([],Math);

// Seeded modern Fisher-Yates (in-place) shuffle
Array.prototype.shuffle = function(seed){
  let rng = new Math.seedrandom(seed);
  let i = this.length, j, temp;
  while(--i > 0){
    j = Math.floor(rng() * (i+1));
    temp = this[j];
    this[j] = this[i];
    this[i] = temp;
  }
  return this;
}

const RANDOM_LINKS_IN_LIST = 2;

// Handle navigation
function hashChanged(){
  let id = window.location.hash.slice(1);
  if(id == '') id = 'home';
  Array.from(document.querySelectorAll('section')).forEach(s=>s.classList.remove('current'));
  const section = document.querySelector(`section#${id}`);
  if(section) {
    document.body.dataset.current = id;
    section.classList.add('current');
    // Handle random links, if applicable
    let randomLinksList = section.querySelector('.random-links');
    if(randomLinksList){
      let randomSections = Array.from(document.querySelectorAll(`section.map:not(#${section.id})`)).shuffle(id).slice(0, RANDOM_LINKS_IN_LIST);
      randomLinksList.innerHTML = randomSections.map(randomSection=>`<li><a href="#${randomSection.id}">${randomSection.querySelector('h1').innerText}</a></li>`).join('');
    }
  } else {
    alert(`Section missing: ${id}`);
    window.location.hash = '';
  }
}
window.addEventListener('hashchange', hashChanged);
hashChanged();

// Handle clicking special links (e.g. back)
document.addEventListener('click', function(e){
  // Get the nearest <a> or <path> that was clicked
  let a = event.target.closest('a');
  let path = event.target.closest('path');
  if(path){
    // Clicked a country in an interactive map
    const mapContainer = event.target.closest('.clickable-map');
    const targetCountry = path.id;
    const targetCountrySectionCode = `${document.querySelector('section.current').id}-${path.id}`;
    if(document.querySelector(`#${targetCountrySectionCode}`)) window.location.hash = targetCountrySectionCode;
  }
  if(!a) return; // if we didn't click a country or a link then... let's give up, right?
  // Clicked a link: check for special cases
  if(a.classList.contains('back')) {
    window.history.back();
    e.preventDefault();
  }
});

// Add interactive map to migration page
fetch('images/interactive-map.svg').then(r=>r.text()).then(svg=>{
  Array.from(document.querySelectorAll('.clickable-map')).forEach(e=>e.innerHTML=svg);
});

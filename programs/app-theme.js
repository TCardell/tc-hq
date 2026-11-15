const key='tcos.preferences';
function apply(){let p={};try{p=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{};document.documentElement.dataset.theme=p.theme||'hq-black'}
apply();window.addEventListener('storage',e=>{if(e.key===key)apply()});

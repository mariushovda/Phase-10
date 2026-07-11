window.UI={
 show(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id));scrollTo({top:0,behavior:'smooth'})},
 toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)},
 cardHtml(label,color='any'){const cls=label==='★'?'star':color;return `<span class="playing-card ${cls}">${label}</span>`},
 typeName(p){const t=p.tags||[];const names=[];if(t.includes('set'))names.push('Sett');if(t.includes('run'))names.push('Rekke');if(t.includes('color'))names.push('Farge');if(t.includes('star'))names.push('Stjerne');return names.join(' + ')||'Variant'},
 phaseHtml(p,n){const cards=p.groups.reduce((sum,g)=>sum+g.length,0);return `<div class="phase-item"><div class="phase-title"><span class="phase-heading">${n?`<span class="phase-no">${n}</span>`:''}<span>${p.name}</span></span><span class="stars">${'★'.repeat(p.difficulty)}</span></div><div class="phase-meta"><span class="type-badge">${this.typeName(p)}</span><span>${cards} kort</span></div><div class="cards-line">${p.groups.map((g,i)=>`${i?'<span class="plus">+</span>':''}<span class="group">${g.map(x=>this.cardHtml(x,x==='★'?'star':(p.colorGroup===i?p.color:(p.color||'any')))).join('')}</span>`).join('')}</div></div>`}
};

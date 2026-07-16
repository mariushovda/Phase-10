window.Stats={
 games(){return Store.get('games',[])},
 normalize(game){
  const ranking=GameEngine.ranking(game);
  const savedAt=game.savedAt||new Date().toISOString();
  return {...game,schemaVersion:2,boardId:game.boardId||'local-board',savedAt,
   participantKey:[...game.players.map(p=>p.name.trim().toLowerCase())].sort().join('|'),
   finalResults:ranking.map((p,i)=>({name:p.name,place:i+1,score:p.score,phaseIndex:p.phaseIndex}))};
 },
 save(game){const list=this.games();if(!list.some(g=>g.id===game.id)){list.unshift(this.normalize(game));Store.set('games',list)}},
 summary(){
  const games=this.games(),m={};
  games.forEach(g=>{const rank=GameEngine.ranking(g);g.players.forEach(p=>{const place=rank.findIndex(x=>x.name===p.name)+1;m[p.name]??={games:0,wins:0,score:0,place:0,rounds:0,lastWin:null};const s=m[p.name];s.games++;s.score+=Number(p.score)||0;s.place+=place;s.rounds+=Math.max(0,(g.round||1)-1)});if(rank[0]){m[rank[0].name].wins++;m[rank[0].name].lastWin=g.savedAt||g.created}});return m;
 },
 playerRows(){return Object.entries(this.summary()).map(([name,s])=>({name,...s,winPct:s.games?Math.round(s.wins/s.games*100):0,avgPlace:s.games?s.place/s.games:0,avgScore:s.games?s.score/s.games:0})).sort((a,b)=>b.wins-a.wins||b.winPct-a.winPct||a.name.localeCompare(b.name))},
 headToHead(){
  const pairs={};
  this.games().forEach(g=>{const names=g.players.map(p=>p.name);for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){const pair=[names[i],names[j]].sort();const key=pair.join('|');pairs[key]??={players:pair,games:0,wins:{[pair[0]]:0,[pair[1]]:0}};pairs[key].games++;const winner=GameEngine.ranking(g)[0]?.name;if(winner in pairs[key].wins)pairs[key].wins[winner]++}});
  return Object.values(pairs).sort((a,b)=>b.games-a.games);
 },
 groups(){
  const groups={};this.games().forEach(g=>{const names=[...g.players.map(p=>p.name)].sort();const key=names.join('|');groups[key]??={names,games:0,wins:{}};groups[key].games++;const w=GameEngine.ranking(g)[0]?.name;if(w)groups[key].wins[w]=(groups[key].wins[w]||0)+1});return Object.values(groups).sort((a,b)=>b.games-a.games);
 },
 streaks(){
  const games=[...this.games()].reverse(),current={},best={};games.forEach(g=>{const w=GameEngine.ranking(g)[0]?.name;Object.keys(current).forEach(n=>{if(n!==w)current[n]=0});if(w){current[w]=(current[w]||0)+1;best[w]=Math.max(best[w]||0,current[w])}});return best;
 }
};

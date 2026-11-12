type Layer={from:number;to:number;family:string;description:string;source?:string};
type Pressio={depth:number;em?:number|null;pl?:number|null;p0?:number|null};
type Borehole={name:string;layers?:Layer[];pressio?:Pressio[]};

function median(values:number[]){
  if(!values.length)return null;
  const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function mean(values:number[]){return values.length?values.reduce((a,b)=>a+b,0)/values.length:null;}
function round(v:number|null,d=2){if(v===null||!Number.isFinite(v))return null;const f=10**d;return Math.round(v*f)/f;}
function stats(values:number[]){
  const clean=values.filter(Number.isFinite);
  if(!clean.length)return {n:0,mean:null,median:null,min:null,max:null};
  return {n:clean.length,mean:round(mean(clean)),median:round(median(clean)),min:round(Math.min(...clean)),max:round(Math.max(...clean))};
}
function norm(s:string){return s.trim().toLowerCase().replace(/\s+/g," ");}

export function synthesizeGeodata(data:{boreholes?:Borehole[]}){
  const boreholes=data.boreholes||[];
  const allTests:Array<{borehole:string;depth:number;family:string;description:string;em:number;plStar:number;ratio:number|null}>=[];
  for(const b of boreholes){
    const layers=b.layers||[];
    for(const p of b.pressio||[]){
      const depth=Number(p.depth),em=Number(p.em),pl=Number(p.pl),p0=Number(p.p0||0);
      if(!Number.isFinite(depth)||!Number.isFinite(em)||!Number.isFinite(pl)||em<=0||pl<=0)continue;
      const layer=layers.find((l,i)=>depth>=Number(l.from)&&(depth<Number(l.to)||(i===layers.length-1&&depth<=Number(l.to))));
      const family=layer?.family||"Non rattaché";
      const description=layer?.description||family;
      const plStar=Math.max(pl-p0,0);
      allTests.push({borehole:b.name,depth,family,description,em,plStar,ratio:plStar>0?em/plStar:null});
    }
  }
  const projectEm=stats(allTests.map(t=>t.em));
  const projectPl=stats(allTests.map(t=>t.plStar).filter(v=>v>0));
  const groups=new Map<string,typeof allTests>();
  for(const t of allTests){
    const key=norm(t.family);
    const arr=groups.get(key)||[];
    arr.push(t);groups.set(key,arr);
  }
  const units=[...groups.entries()].map(([key,tests])=>{
    const em=stats(tests.map(t=>t.em));
    const plStar=stats(tests.map(t=>t.plStar).filter(v=>v>0));
    const ratios=stats(tests.map(t=>t.ratio??NaN).filter(Number.isFinite));
    const names=[...new Set(tests.map(t=>t.family))];
    const descriptions=[...new Set(tests.map(t=>t.description))];
    const boreholeNames=[...new Set(tests.map(t=>t.borehole))];
    const relativeEm=em.median!==null&&projectEm.median!==null?em.median/projectEm.median:null;
    const relativePl=plStar.median!==null&&projectPl.median!==null&&projectPl.median>0?plStar.median/projectPl.median:null;
    let relativeLevel="non classé";
    if(relativeEm!==null&&relativePl!==null){
      const r=(relativeEm+relativePl)/2;
      relativeLevel=r>=1.35?"nettement supérieur à la médiane du projet":r>=1.05?"supérieur à la médiane du projet":r>=0.75?"proche de la médiane du projet":"inférieur à la médiane du projet";
    }
    const reviewCandidate=tests.length>=2&&boreholeNames.length>=1&&relativeEm!==null&&relativePl!==null&&relativeEm>=1.05&&relativePl>=1.05;
    return {
      key,
      family:names[0]||key,
      descriptions,
      boreholes:boreholeNames,
      borehole_count:boreholeNames.length,
      test_count:tests.length,
      depth_range_m:{min:round(Math.min(...tests.map(t=>t.depth))),max:round(Math.max(...tests.map(t=>t.depth)))},
      Em_MPa:em,
      pl_star_MPa:plStar,
      Em_over_pl_star:ratios,
      relative_level:relativeLevel,
      engineering_review_candidate:reviewCandidate,
      caution:reviewCandidate?"Unité à examiner en priorité par l’ingénieur ; ce classement relatif ne constitue ni une valeur caractéristique ni une validation d’assise.":"Données à examiner avec la stratigraphie, la continuité latérale et le contexte du projet."
    };
  }).sort((a,b)=>(b.pl_star_MPa.median||0)-(a.pl_star_MPa.median||0));

  return {
    project:{borehole_count:boreholes.length,pressio_test_count:allTests.length,Em_MPa:projectEm,pl_star_MPa:projectPl},
    units,
    unmatched_tests:allTests.filter(t=>t.family==="Non rattaché").length,
    methodology:"Regroupement descriptif par famille lithologique. Les essais sont rattachés à l’horizon contenant leur profondeur. Les comparaisons sont relatives aux médianes du projet et ne remplacent pas le choix des valeurs caractéristiques ni la validation de l’ingénieur."
  };
}

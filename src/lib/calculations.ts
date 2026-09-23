function n(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value: number, digits = 3) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function mean(values: number[]) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const x = [...values].sort((a, b) => a - b);
  const i = Math.floor(x.length / 2);
  return x.length % 2 ? x[i] : (x[i - 1] + x[i]) / 2;
}

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const x = [...values].sort((a, b) => a - b);
  const idx = (x.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return x[lo];
  return x[lo] + (x[hi] - x[lo]) * (idx - lo);
}

function std(values: number[]) {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((s, x) => s + (x - m) ** 2, 0) / (values.length - 1));
}

function lines(value: unknown) {
  return String(value ?? "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
}

export function calculateModule(slug: string, raw: Record<string, unknown>) {
  switch (slug) {
    case "strat": return calcStrat(raw);
    case "pressio": return calcPressio(raw);
    case "fonda": return calcFonda(raw);
    case "stab": return calcStab(raw);
    case "sensor": return calcSensor(raw);
    case "struct": return calcStruct(raw);
    case "enviro": return calcEnviro(raw);
    case "hydro": return calcHydro(raw);
    case "pollu": return calcPollu(raw);
    default: throw new Error("Module inconnu");
  }
}

function calcStrat(raw: Record<string, unknown>) {
  const layers = lines(raw.horizons).map((line, index) => {
    const [name, t, gamma, phi, c, em, pl] = line.split(";");
    return { index: index + 1, name: name || `Horizon ${index + 1}`, thickness_m: n(t), gamma_kNm3: n(gamma), phi_deg: n(phi), cohesion_kPa: n(c), Em_MPa: n(em), pl_MPa: n(pl) };
  }).filter((x) => x.thickness_m > 0);
  if (!layers.length) throw new Error("Ajoutez au moins un horizon valide.");
  const total = layers.reduce((s, x) => s + x.thickness_m, 0);
  const weighted = (key: keyof typeof layers[number]) => layers.reduce((s, x) => s + Number(x[key]) * x.thickness_m, 0) / total;
  return {
    total_thickness_m: round(total),
    layer_count: layers.length,
    weighted_parameters: { gamma_kNm3: round(weighted("gamma_kNm3")), phi_deg: round(weighted("phi_deg")), cohesion_kPa: round(weighted("cohesion_kPa")), Em_MPa: round(weighted("Em_MPa")), pl_MPa: round(weighted("pl_MPa")) },
    layers,
    engineering_note: "Pondérations géométriques indicatives : sélectionner ensuite les valeurs représentatives et caractéristiques par unité géotechnique."
  };
}

function calcPressio(raw: Record<string, unknown>) {
  const tests = lines(raw.pressio).map((line) => {
    const [depth, em, pl, p0] = line.split(";");
    const Em = n(em), Pl = n(pl), P0 = n(p0), Ple = Math.max(Pl - P0, 0);
    return { depth_m: n(depth), Em_MPa: Em, pl_MPa: Pl, p0_MPa: P0, pl_star_MPa: round(Ple), Em_over_pl_star: Ple > 0 ? round(Em / Ple, 2) : null };
  }).filter((x) => x.depth_m >= 0 && x.Em_MPa > 0 && x.pl_MPa > 0);
  if (!tests.length) throw new Error("Ajoutez au moins un essai pressiométrique valide.");
  const ems = tests.map((x) => x.Em_MPa), pls = tests.map((x) => x.pl_star_MPa);
  const m = mean(pls), s = std(pls);
  const outliers = tests.filter((x) => s > 0 && Math.abs(x.pl_star_MPa - m) > 2 * s).map((x) => x.depth_m);
  return {
    n: tests.length,
    Em_MPa: { mean: round(mean(ems)), median: round(median(ems)), min: round(Math.min(...ems)), max: round(Math.max(...ems)), stdev: round(std(ems)) },
    pl_star_MPa: { mean: round(m), median: round(median(pls)), min: round(Math.min(...pls)), max: round(Math.max(...pls)), p05_statistical_indicator: round(percentile(pls, 0.05)), stdev: round(s) },
    possible_outlier_depths_m: outliers,
    tests,
    engineering_note: "Le fractile 5 % est fourni comme indicateur statistique. La valeur caractéristique doit être retenue après zonage géotechnique, examen des essais et application du référentiel de calcul."
  };
}

function calcFonda(raw: Record<string, unknown>) {
  const B=n(raw.B), L=n(raw.L), D=n(raw.D), gamma=n(raw.gamma), phi=n(raw.phi), c=n(raw.c), q=n(raw.servicePressure), FS=Math.max(n(raw.FS,3),1), Em=Math.max(n(raw.Em),0.001), nu=n(raw.nu,0.3);
  if (B<=0 || L<=0) throw new Error("Dimensions de fondation invalides.");
  const phir=phi*Math.PI/180;
  const Nq=Math.exp(Math.PI*Math.tan(phir))*Math.tan(Math.PI/4+phir/2)**2;
  const Nc=Math.abs(phi)<1e-6?5.14:(Nq-1)/Math.tan(phir);
  const Ngamma=2*(Nq+1)*Math.tan(phir);
  const overburden=gamma*D;
  const qult=c*Nc+overburden*Nq+0.5*gamma*B*Ngamma;
  const qnetult=Math.max(qult-overburden,0);
  const qallow=qnetult/FS+overburden;
  const settlement_m=q*B*(1-nu**2)/(Em*1000);
  return {
    factors: { Nc: round(Nc,2), Nq: round(Nq,2), Ngamma: round(Ngamma,2) },
    gross_ultimate_bearing_kPa: round(qult,1),
    indicative_allowable_pressure_kPa: round(qallow,1),
    service_pressure_kPa: round(q,1),
    utilization_ratio: qallow>0?round(q/qallow,3):null,
    simplified_elastic_settlement_mm: round(settlement_m*1000,1),
    footing_area_m2: round(B*L,2),
    engineering_note: "Pré-dimensionnement analytique uniquement : intégrer géométrie réelle, facteurs partiels, excentricité/inclinaison, stratification, nappe, tassements par couches et interaction avec l'ouvrage avant validation."
  };
}

function calcStab(raw: Record<string, unknown>) {
  const H=n(raw.H), phi=n(raw.phi), gamma=n(raw.gamma), surcharge=n(raw.surcharge), Hw=Math.min(Math.max(n(raw.waterHeight),0),H), B=n(raw.baseWidth), W=n(raw.wallWeight), mu=n(raw.baseFriction), cb=n(raw.baseCohesion);
  if(H<=0||B<=0||W<=0) throw new Error("Géométrie ou poids du mur invalide.");
  const Ka=Math.tan(Math.PI/4-(phi*Math.PI/180)/2)**2;
  const PaSoil=0.5*Ka*gamma*H**2;
  const PaQ=Ka*surcharge*H;
  const Pw=0.5*9.81*Hw**2;
  const Htot=PaSoil+PaQ+Pw;
  const Mover=PaSoil*H/3+PaQ*H/2+Pw*Hw/3;
  const Mres=W*B/2;
  const Rslide=mu*W+cb*B;
  const fsSlide=Htot>0?Rslide/Htot:Infinity;
  const fsOver=Mover>0?Mres/Mover:Infinity;
  const e=Mover/W;
  const qavg=W/B;
  const qmax=qavg*(1+6*e/B), qmin=qavg*(1-6*e/B);
  return {
    Ka: round(Ka,3),
    horizontal_actions_kN_per_m: { soil: round(PaSoil,2), surcharge: round(PaQ,2), water: round(Pw,2), total: round(Htot,2) },
    safety_indicators: { sliding: Number.isFinite(fsSlide)?round(fsSlide,2):null, overturning: Number.isFinite(fsOver)?round(fsOver,2):null },
    resultant_eccentricity_m: round(e,3),
    middle_third_check: Math.abs(e)<=B/6,
    base_pressure_kPa_per_m: { min: round(qmin,1), max: round(qmax,1) },
    engineering_note: "Contrôle local de mur gravitaire selon hypothèses simplifiées de Rankine. Vérifier stabilité générale, drainage, sismicité, frottement interface et combinaisons de calcul."
  };
}

function calcSensor(raw: Record<string, unknown>) {
  const points=lines(raw.series).map((line)=>{const [d,v]=line.split(";"); const t=new Date(d).getTime(); return {date:d, time:t, value:n(v)};}).filter(x=>Number.isFinite(x.time)).sort((a,b)=>a.time-b.time);
  if(points.length<2) throw new Error("Deux mesures datées au minimum sont nécessaires.");
  const t0=points[0].time; const xs=points.map(p=>(p.time-t0)/86400000); const ys=points.map(p=>p.value); const xm=mean(xs), ym=mean(ys);
  const denom=xs.reduce((s,x)=>s+(x-xm)**2,0); const slope=denom?xs.reduce((s,x,i)=>s+(x-xm)*(ys[i]-ym),0)/denom:0;
  const baseline=ys[0], last=ys[ys.length-1], movement=last-baseline, absMove=Math.abs(movement);
  const warn=n(raw.warningThreshold), alert=n(raw.alertThreshold);
  const status=alert>0&&absMove>=alert?"ALERTE":warn>0&&absMove>=warn?"VIGILANCE":"NORMAL";
  return {
    sensor_type:String(raw.sensorType??"Capteur"), unit:String(raw.unit??""), status,
    first_value:round(baseline,3), last_value:round(last,3), cumulative_change:round(movement,3),
    min:round(Math.min(...ys),3), max:round(Math.max(...ys),3), linear_trend_per_day:round(slope,4), measurement_count:points.length,
    points:points.map(({date,value})=>({date,value})),
    engineering_note:"La tendance est une régression linéaire descriptive. Toute alerte doit être confirmée par contrôle du capteur, contexte météo/chantier et inspection de l'ouvrage."
  };
}

function calcStruct(raw: Record<string, unknown>) {
  const span=n(raw.span), width=n(raw.tributaryWidth), G=n(raw.deadLoad), Q=n(raw.liveLoad), N=n(raw.serviceAxial), B=n(raw.footingB), L=n(raw.footingL);
  if(span<=0||width<=0||B<=0||L<=0) throw new Error("Géométrie invalide.");
  const ulsArea=1.35*G+1.5*Q, serviceArea=G+Q, ulsLine=ulsArea*width, serviceLine=serviceArea*width;
  return {
    area_loads_kPa:{service:round(serviceArea,2),uls:round(ulsArea,2)},
    line_loads_kN_per_m:{service:round(serviceLine,2),uls:round(ulsLine,2)},
    simple_support_reaction_kN:{service:round(serviceLine*span/2,1),uls:round(ulsLine*span/2,1)},
    footing_service_pressure_kPa:round(N/(B*L),1),
    engineering_note:"Combinaison ULS simplifiée 1.35Gk + 1.5Qk. Adapter aux catégories d'actions, combinaisons Eurocodes et modèle structurel réel."
  };
}

function calcEnviro(raw: Record<string, unknown>) {
  const risks=lines(raw.risks).map((line)=>{const [hazard,p,s,control]=line.split(";"); const P=Math.min(Math.max(n(p),1),5), S=Math.min(Math.max(n(s),1),5), C=Math.min(Math.max(n(control),0),100); const score=P*S*(1-C/100); const level=score>=12?"critique":score>=6?"élevé":score>=3?"modéré":"faible"; return {hazard,probability:P,severity:S,control_pct:C,residual_score:round(score,2),level};});
  if(!risks.length) throw new Error("Ajoutez au moins un risque.");
  return {risks:[...risks].sort((a,b)=>b.residual_score-a.residual_score), highest_residual_score:round(Math.max(...risks.map(r=>r.residual_score)),2), engineering_note:"Matrice interne de priorisation. Vérifier en parallèle les prescriptions réglementaires, ICPE/IOTA, déchets, eau et contraintes locales applicables."};
}

function calcHydro(raw: Record<string, unknown>) {
  const Q=n(raw.Q), L=n(raw.length), A=n(raw.area), dh=n(raw.headLoss), pump=n(raw.pumpQ), s=n(raw.drawdown), r=n(raw.radius), rw=n(raw.wellRadius), b=n(raw.aquiferThickness);
  if(L<=0||A<=0||dh<=0) throw new Error("Paramètres Darcy invalides.");
  const k=Q*L/(A*dh);
  let T:null|number=null, kThiem:null|number=null;
  if(pump>0&&s>0&&r>rw&&rw>0){T=pump*Math.log(r/rw)/(2*Math.PI*s); if(b>0) kThiem=T/b;}
  return {darcy_permeability_m_s:round(k,9), thiem_transmissivity_m2_s:T===null?null:round(T,9), thiem_equivalent_k_m_s:kThiem===null?null:round(kThiem,9), engineering_note:"Résultats valables sous hypothèses de milieu homogène et conditions d'essai compatibles. Vérifier géométrie, régime permanent/transitoire, anisotropie et limites hydrauliques."};
}

function calcPollu(raw: Record<string, unknown>) {
  const c=n(raw.concentration), threshold=n(raw.threshold), rho=n(raw.soilDensity), volume=n(raw.volume); if(threshold<=0||rho<=0||volume<=0) throw new Error("Paramètres de comparaison invalides.");
  const soilMassKg=rho*volume*1000; const contaminantKg=c*soilMassKg/1e6; const ratio=c/threshold;
  return {substance:String(raw.substance??"Substance"), concentration_mg_kg:round(c,2), project_comparison_value_mg_kg:round(threshold,2), comparison_ratio:round(ratio,3), indicative_soil_mass_t:round(soilMassKg/1000,1), indicative_contaminant_mass_kg:round(contaminantKg,2), screening_status:ratio>1?"au-dessus de la valeur de comparaison":"au-dessous de la valeur de comparaison", engineering_note:"Calcul de masse indicatif et comparaison de screening. L'acceptabilité dépend des usages, voies d'exposition, fonds géochimiques et filières de gestion."};
}

export const SITE={name:'Ingenierie.expert',url:'https://ingenierie.expert',email:'contact@ingenierie.expert',phoneDisplay:'04 65 84 42 89',phoneHref:'+33465844289',office:'181 chemin des Fontaites, 83170 La Celle',company:'STIB France'} as const;
export const SERVICES=[
['expertise-batiment','Expertise bâtiment & construction','Comprendre les désordres, établir les causes, sécuriser les décisions','Diagnostic technique, expertise amiable ou contradictoire et stratégie de réparation.'],
['expert-assure','Expert d’assuré','Défendre techniquement votre dossier face à l’expertise assurance','Assistance technique de l’assuré, préparation des réunions et chiffrage des solutions.'],
['structure-genie-civil','Structure & génie civil','Diagnostiquer, calculer et conforter les ouvrages','Diagnostic structure, notes de calcul, confortement et ingénierie de l’existant.'],
['geotechnique-fondations','Géotechnique & fondations','Relier le sol, les fondations et le comportement de l’ouvrage','Études G1 à G5, RGA, stabilité et interaction sol-structure.'],
['audit-diagnostic','Audit & diagnostic','Transformer un bâtiment complexe en plan d’action lisible','Audit technique global, diagnostic patrimonial et programmation des travaux.'],
['amo-moe','AMO & maîtrise d’œuvre','Piloter techniquement du besoin jusqu’à la réception','Assistance à maîtrise d’ouvrage, MOE technique, DCE, suivi et réception.'],
['economie-construction','Économie de la construction','Donner une trajectoire économique fiable aux décisions techniques','Estimations, variantes, analyse d’offres et coût global.'],
['environnement-hydraulique','Environnement, eau & sols','Intégrer l’eau, les sols et les contraintes environnementales','Hydrogéologie, hydraulique, pollution des sols et instrumentation.']
].map(([slug,eyebrow,title,summary])=>({slug,eyebrow,title,summary}));
export const ZONES=[
['var-83','83','Var','Toulon · Draguignan · Brignoles · Fréjus · Hyères'],
['bouches-du-rhone-13','13','Bouches-du-Rhône','Marseille · Aix-en-Provence · Aubagne · Salon-de-Provence'],
['alpes-maritimes-06','06','Alpes-Maritimes','Nice · Cannes · Antibes · Grasse · Menton'],
['vaucluse-84','84','Vaucluse','Avignon · Orange · Carpentras · Cavaillon'],
['alpes-de-haute-provence-04','04','Alpes-de-Haute-Provence','Digne-les-Bains · Manosque · Sisteron · Forcalquier'],
['hautes-alpes-05','05','Hautes-Alpes','Gap · Briançon · Embrun · Guillestre'],
['gard-30','30','Gard','Nîmes · Alès · Bagnols-sur-Cèze · Uzès'],
['drome-26','26','Drôme','Valence · Montélimar · Romans-sur-Isère · Nyons'],
['ardeche-07','07','Ardèche','Aubenas · Privas · Annonay · Le Teil']
].map(([slug,dept,name,cities])=>({slug,dept,name,cities}));
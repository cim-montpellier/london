// ============================================================
// PHASE 4 — LA COUCHE LUDIQUE
// Chasse à Moriarty · Quiz Élémentaire · Brouillard de Londres · Missions des Irréguliers
// Tous les indices/questions dérivent de faits vérifiés dans le corpus (canon-first).
// ============================================================

// ---------- 1) LA CHASSE À MORIARTY ----------
// 5 énigmes → 5 lieux existants de la carte. Cliquer le bon marqueur = indice trouvé.
const MORIARTY_HUNT = {
  title:"♟️ La Chasse à Moriarty",
  intro:"Avril 1891. Le professeur a quitté sa chaire pour l'ombre. Cinq traces de son organisation subsistent dans Londres — retrouvez-les DANS L'ORDRE en cliquant les bons lieux sur la carte. « He is the Napoleon of crime, Watson. »",
  reward_img:"assets/img/game_moriarty.jpg",
  clues:[
  { target:"oxfordstreet", riddle:"« Un fourgon à deux chevaux a tenté de m'écraser au coin d'une grande artère commerçante ; une brique est tombée d'un toit un peu plus loin. » Trouvez la rue de la première tentative.",
    found:"Indice 1/5 — Le rapport d'incident mentionne un fourgon « furiously driven ». Les accidents n'existent pas autour du Professeur.",
    quote:"As I walked down Oxford Street a two-horse van furiously driven whizzed round and was on me like a flash." },
  { target:"lowther", riddle:"« Pour semer ses limiers, je changerai de voiture au pas de course dans une galerie marchande entre le Strand et Adelphi. » Où Holmes donne-t-il rendez-vous à Watson ?",
    found:"Indice 2/5 — Le brougham qui attendait au bout de la galerie était conduit par Mycroft en personne.",
    quote:"'Dash through the Arcade... a small brougham will be awaiting you.'" },
  { target:"victoria_station", riddle:"« Le wagon réservé du Continental Express partira avec ou sans ses passagers. Un vieux prêtre italien y somnole déjà. » De quelle gare ?",
    found:"Indice 3/5 — Moriarty est arrivé sur le quai neuf secondes trop tard. Il a affrété un train spécial : la partie continue.",
    quote:"...a tall man push his way furiously through the crowd, and wave his hand as if he desired to have the train stopped." },
  { target:"parklane", riddle:"« Trois ans après les chutes, un héritier de l'organisation abat un jeune noble joueur de cartes dans un salon fermé de l'intérieur. » Trouvez la scène de ce crime impossible.",
    found:"Indice 4/5 — Balle expansive de revolver… tirée par un fusil. L'arsenal de Von Herder porte la signature de feu le Professeur.",
    quote:"The youth... met his death between ten and eleven-twenty on the night of March 30, 1894." },
  { target:"camden", riddle:"« Le meilleur tireur de l'Empire choisira, pour son affût, la même fenêtre vide que ses chasseurs. » Dans quelle maison la traque s'achève-t-elle ?",
    found:"Indice 5/5 — Le colonel Sebastian Moran est tombé dans le piège du buste de cire. Le dernier pion du Professeur quitte l'échiquier.",
    quote:"'Journeys end in lovers' meetings.'" }
  ],
  victory:"♟️ ÉCHEC ET MAT — Vous avez démantelé ce qui restait du réseau Moriarty. « The Napoleon of crime » n'est plus qu'un dossier dans les scrap-books du 221B. Holmes vous décerne le titre d'Agent très spécial de Baker Street."
};

// ---------- 2) LE QUIZ « ÉLÉMENTAIRE ! » ----------
// 20 questions géolocalisées. Chaque bonne réponse fait voler la carte vers le lieu.
const QUIZ = [
{ loc:"stbarts", q:"Quels sont les premiers mots de Holmes à Watson ?", opts:["« Enchanté, docteur. »","« You have been in Afghanistan, I perceive. »","« Elementary, my dear Watson. »","« Vous cherchez un logement, je présume ? »"], a:1,
  why:"La déduction inaugurale du laboratoire de Barts (STUD). Quant à « Elementary, my dear Watson » — la phrase n'apparaît jamais telle quelle dans le canon !" },
{ loc:"221b", q:"Combien de marches mènent au salon du 221B ?", opts:["Treize","Quinze","Dix-sept","Vingt et une"], a:2,
  why:"« There are seventeen steps, because I have both seen and observed » (SCAN)." },
{ loc:"lauriston", q:"Quel mot est écrit en lettres de sang à Lauriston Gardens ?", opts:["RACHEL","REVENGE","RACHE","MORIARTY"], a:2,
  why:"RACHE — « vengeance » en allemand. Lestrade y voyait un « Rachel » inachevé (STUD)." },
{ loc:"briony", q:"Comment Holmes découvre-t-il la cachette de la photographie chez Irene Adler ?", opts:["Il fouille la maison de nuit","Une fausse alerte au feu","Il soudoie la femme de chambre","Il suit le mari"], a:1,
  why:"« When a woman thinks that her house is on fire... » — la fusée fumigène de Watson fait le reste (SCAN)." },
{ loc:"saxecoburg", q:"Pourquoi Holmes frappe-t-il le trottoir de Saxe-Coburg Square avec sa canne ?", opts:["Pour appeler un fiacre","Pour tester si la cave s'étend devant la maison","Par tic nerveux","Pour alerter Watson"], a:1,
  why:"Il vérifie si le tunnel part vers l'avant ou l'arrière — puis va « voir les genoux » du commis (REDH)." },
{ loc:"threadneedle", q:"Que gardait la cave de la City & Suburban Bank ?", opts:["Des lingots d'or sud-africains","30 000 napoléons d'or français","Les joyaux de la Couronne","Des obligations d'État"], a:1,
  why:"L'emprunt en or français : « we have every reason to believe that... » (REDH)." },
{ loc:"swandam", q:"Qui Watson trouve-t-il dans la fumerie d'opium du Bar of Gold ?", opts:["Neville St. Clair","Holmes déguisé en vieillard","Moriarty","Le colonel Moran"], a:1,
  why:"« It took all my self-control to prevent me from breaking out into a cry of astonishment » (TWIS)." },
{ loc:"coventgarden", q:"Comment Holmes fait-il parler le volailler Breckinridge ?", opts:["En le menaçant de la police","En pariant un souverain","En achetant toutes ses oies","En se déguisant en inspecteur"], a:1,
  why:"« When you see a man with whiskers of that cut... you can always draw him by a bet » (BLUE)." },
{ loc:"lyceum", q:"Où Mary Morstan a-t-elle rendez-vous dans SIGN ?", opts:["Sous l'horloge de Waterloo","Au troisième pilier du Lyceum","Devant le British Museum","Au foyer de l'Opéra"], a:1,
  why:"« Be at the third pillar from the left outside the Lyceum Theatre to-night at seven o'clock. »" },
{ loc:"pinchin", q:"Qui est Toby, que Watson va chercher à Pinchin Lane ?", opts:["Un indicateur","Un chien au flair prodigieux","Un gamin des rues","Un cocher de confiance"], a:1,
  why:"« Half spaniel and half lurcher » — Holmes le préfère à toute la police de Londres (SIGN)." },
{ loc:"diogenes", q:"Quelle est LA règle du Diogenes Club ?", opts:["Interdit aux femmes","Il est interdit de parler","Membres sur cooptation royale","Jeu d'échecs obligatoire"], a:1,
  why:"Trois signalements pour bavardage valent exclusion. Le club des « most unsociable men in town » (GREE)." },
{ loc:"aldgate", q:"Pourquoi le corps de Cadogan West ne portait-il presque pas de sang ?", opts:["Il a été lavé","Il est tombé du TOIT d'un wagon","Il a été tué ailleurs puis déposé sur la voie","Empoisonnement"], a:1,
  why:"Les deux à la fois : tué ailleurs, posé SUR le toit à Caulfield Gardens, tombé à l'aiguillage d'Aldgate (BRUC)." },
{ loc:"camden", q:"Qu'est-ce qui trompe le colonel Moran depuis la maison vide ?", opts:["Un sosie engagé par Holmes","Un buste de cire tourné par Mrs Hudson","Une ombre découpée dans du carton","Un miroir"], a:1,
  why:"Le buste d'Oscar Meunier, de Grenoble — tourné du genou toutes les quinze minutes (EMPT)." },
{ loc:"appledore", q:"Que fait Holmes pour préparer le cambriolage chez Milverton ?", opts:["Il achète les plans de la villa","Il se fiance avec la femme de chambre","Il corrompt le majordome","Il creuse un tunnel"], a:1,
  why:"Sous le nom d'Escott, plombier prometteur. Fiançailles stratégiques (CHAS)." },
{ loc:"northumberland", q:"Que vole-t-on à Sir Henry au Northumberland Hotel ?", opts:["Son portefeuille","Une bottine neuve puis une vieille","Sa montre de gousset","Les titres de Baskerville Hall"], a:1,
  why:"La neuve, jamais portée, ne sentait rien : il fallait une bottine imprégnée pour le Chien (HOUN)." },
{ loc:"regentstreet", q:"Quel nom l'espion du fiacre 2704 donne-t-il au cocher ?", opts:["Professeur Moriarty","Sherlock Holmes","John Clay","Dr Watson"], a:1,
  why:"Stapleton signe son forfait avec le nom de son adversaire. Holmes salue l'insolence (HOUN)." },
{ loc:"scotlandyard", q:"Lequel de ces inspecteurs n'appartient PAS au canon ?", opts:["Lestrade","Gregson","Hopkins","Abberline"], a:3,
  why:"Abberline est l'inspecteur réel de l'affaire Jack l'Éventreur — jamais dans le canon. Les autres totalisent des dizaines d'apparitions." },
{ loc:"victoria_station", q:"Sous quel déguisement Holmes attend-il Watson dans le Continental Express ?", opts:["Vieux libraire","Prêtre italien","Marin norvégien","Cocher"], a:1,
  why:"« A venerable Italian priest » — même Watson n'y voit que du feu (FINA)." },
{ loc:"baker_irregulars", q:"Combien Holmes paie-t-il chaque Irrégulier de Baker Street ?", opts:["Un penny","Un shilling par jour","Une guinée par semaine","Un souverain par mission"], a:1,
  why:"Un shilling par jour, plus une guinée de prime à qui trouve (STUD/SIGN)." },
{ loc:"tower", q:"Que contient le coffre d'Agra à l'arrivée de la poursuite ?", opts:["Rubis et saphirs","La moitié du trésor","Rien","Une lettre de Jonathan Small"], a:2,
  why:"Vide : Small a semé le trésor sur dix milles de Tamise. « The treasure is hidden where the key is » (SIGN)." }
];
const QUIZ_GRADES = [
  { min:0,  label:"Client du 221B", desc:"Vous montez les dix-sept marches pour la première fois. Mrs Hudson vous prépare du thé.", img:"assets/img/badge_client.jpg" },
  { min:8,  label:"Irrégulier de Baker Street", desc:"Wiggins vous accepte dans la troupe : un shilling par jour, et l'œil partout.", img:"assets/img/badge_irregular.jpg" },
  { min:14, label:"Associé du Détective", desc:"« You see, but you also observe. » Watson vous cède son fauteuil près du feu.", img:"assets/img/badge_watson.jpg" },
  { min:18, label:"L'Égal de Mycroft", desc:"Holmes lui-même admet : « It is a pity you did not take to detection as a profession. »", img:"assets/img/badge_mycroft.jpg" }
];

// ---------- 3) LES MISSIONS DES IRRÉGULIERS ----------
const MISSIONS = [
{ target:"swandam", brief:"Wiggins : « Un gentleman a disparu dans une fumerie d'opium derrière les wharves, à l'est de London Bridge. Trouve-la, et vite ! »", shillings:2 },
{ target:"lyceum", brief:"« Une demoiselle doit retrouver un inconnu au troisième pilier d'un théâtre du Strand, à sept heures. Repère l'endroit avant elle ! »", shillings:2 },
{ target:"coventgarden", brief:"« L'oie de Noël venait d'un étal du grand marché aux légumes et volailles. Cours vérifier chez Breckinridge ! »", shillings:1 },
{ target:"diogenes", buddy:true, brief:"« Le frère de M. Holmes lit ses journaux dans le club le plus silencieux de Pall Mall. Défense de parler — trouve-le sans bruit ! »", shillings:2 },
{ target:"lauriston", brief:"« Y a un mot écrit en rouge sur un mur de Brixton, dans une maison vide. La police y est déjà — faufile-toi ! »", shillings:3 },
{ target:"aldgate", brief:"« On a trouvé un mort sur les voies du métro, près d'une station de l'Est, avec des papiers secrets en poche. File aux aiguillages ! »", shillings:3 },
{ target:"briony", brief:"« Une villa de St. John's Wood avec une dame qui chante mieux que les anges. M. Holmes veut l'adresse — Serpentine Avenue, paraît-il. »", shillings:2 },
{ target:"appledore", brief:"« Le pire homme de Londres garde ses lettres dans un coffre, sur les hauteurs de Hampstead. Va repérer la villa — sans te faire mordre ! »", shillings:3 }
];
const MISSION_TIME = 75; // secondes par mission

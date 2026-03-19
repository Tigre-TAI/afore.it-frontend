/**
 * FAQ 数据库 - WhatsApp客户服务真实对话导入
 * 自动生成于 1773746434.805844
 * 总QA对数: 132
 * 来源: WhatsApp真实客户交互
 * 
 * 置信度说明:
 * - 0.95: WhatsApp真实客户对话（最可靠）
 * - 0.85: 人工验证的FAQ
 * - 0.6-0.7: AI生成的回复
 */// 废物玩意 错误的置信度

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
  relatedProducts?: string[];
  language: string;
  confidence: number;
  source: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "whatsapp_001",
    category: "online",
    question: "👍",
    keywords: ["batterie"],
    answer: "Buonasera Sempre meglio installarla e mettere online le batterie Cosicché, se in un futuro dovessero esserci problemi con le batterie, noi possiamo collegarci da remoto e risolvere",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_002",
    category: "generale",
    question: "I cablaggi si dovrebbero trovare dal schema che mi hai mandato",
    keywords: ["cablaggi", "dovrebbero", "trovare", "dal", "schema", "inverter"],
    answer: "Si I parametri dell'inverter te li ho corretti io da remoto L'impianto può immettere?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_003",
    category: "generale",
    question: "Ok a domani grazie mille",
    keywords: ["domani", "mille"],
    answer: "Perfetto A domani",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_004",
    category: "configurazione",
    question: "Salve buongiorno la contatto per la configurazione dell’impianto grazie che vi occorre ? <Questo messaggio è stato modificato>",
    keywords: ["salve", "buongiorno", "contatto", "configurazione", "dell’impianto", "batterie"],
    answer: "Buongiorno Che batterie hai? Mi puoi inviare anche SN logger",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_005",
    category: "generale",
    question: "Scusami sarebbe",
    keywords: ["scusami", "sarebbe", "antenna"],
    answer: "Antenna",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["antenna"]
  },
  {
    id: "whatsapp_006",
    category: "generale",
    question: "Inverter ?",
    keywords: ["inverter", "inverter"],
    answer: "Si",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_007",
    category: "generale",
    question: "Scusami è la prima volta",
    keywords: ["scusami", "prima", "volta"],
    answer: "Vai tranquillo",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_008",
    category: "generale",
    question: "Grazie",
    keywords: [],
    answer: "https://drive.google.com/file/d/1o6BsOCACinJPOXsWWLYctOqkkyk6eUfu/view?usp=drive_link https://drive.google.com/file/d/1dCXXLcNg5fsqyictuqku49w6qdVRqXwY/view?usp=drive_link Il cliente quando sarà disponibile?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_009",
    category: "generale",
    question: "Ora vado a farla e vi dico",
    keywords: ["ora", "vado", "farla", "dico"],
    answer: "OKok Lo stai collegando in modalità AP?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_010",
    category: "online",
    question: "Perfetto",
    keywords: ["perfetto", "app solarman"],
    answer: "‎Assistenza Fabrizio.vcf (file allegato) Fammi sapere quando arriva il cliente per sistemare l'app",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_011",
    category: "generale",
    question: "Meter e non emettere",
    keywords: ["meter", "emettere", "meter"],
    answer: "Ok Settaggi giusti Sto aggiornando software",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_012",
    category: "generale",
    question: "?",
    keywords: [],
    answer: "Impostato tutto?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_013",
    category: "batterie",
    question: "Tranquillo",
    keywords: ["tranquillo"],
    answer: "Aggiornamenti finiti Riavvia impianto e fai prova di carico Ora rilevo, anche se circa 200W, il consumo Ok Fai prova dicarico Collega un carico rilevante, tipo un phon",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_014",
    category: "batterie",
    question: "Run lampeggia",
    keywords: ["run", "lampeggia", "inverter", "batterie"],
    answer: "Attualmente non stanno più caricando perché l'inverter non produce più E il run è giusto che lampeggia Indica che le batterie sono in funzione Ha provato a fare una prova di carico?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie"]
  },
  {
    id: "whatsapp_015",
    category: "generale",
    question: "Okk provo",
    keywords: ["okk", "provo"],
    answer: "Ok fammi sapere se riesci",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_016",
    category: "generale",
    question: "Ok ok grazie",
    keywords: [],
    answer: "Di nulla",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_017",
    category: "generale",
    question: "Ok grazie",
    keywords: ["inverter"],
    answer: "https://drive.google.com/file/d/1QHy1D49YMlmrWKi6D1Tb-gNHNL4WR-Z_/view?usp=drive_link https://drive.google.com/file/d/1P1_kzGj2nLM_IL3JEjOjC5dydHL17clQ/view?usp=drive_link Aggiorno inverter Non toccare nulla",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_018",
    category: "online",
    question: "Appena ritorno al cantiere",
    keywords: ["appena", "ritorno", "cantiere", "inverter", "batterie", "antenna"],
    answer: "Ok Ora sto vedendo meglio che questa è l'antenna dell'inverter Le batterie che hai sono le HS giusto?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie", "antenna"]
  },
  {
    id: "whatsapp_019",
    category: "online",
    question: "Si",
    keywords: ["batterie", "antenna"],
    answer: "Eh scusami ma non ricordavo che avevi queste batterie E le HS non hanno più bisogno dell'antenna Quindi stai apposto così Okok",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie", "antenna"]
  },
  {
    id: "whatsapp_020",
    category: "generale",
    question: "Sì 😀",
    keywords: [],
    answer: "L'hai rinserita prima di andare via?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_021",
    category: "troubleshooting",
    question: "Va benissimo grazie e buona giornata alla prossima grazie per la disponibilità",
    keywords: ["benissimo", "buona", "giornata", "alla", "prossima"],
    answer: "Di nulla Alla prossima e buona giornata a te Qual è il problema? Hai eliminato questo messaggio. Io non vedo consumi",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_022",
    category: "online",
    question: "Ha scaricato SOLARMAN Smart",
    keywords: ["scaricato", "solarman", "smart", "app solarman"],
    answer: "Poi? OK Fammi sapere OK Ottimo Buona serata Alla prossima",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_023",
    category: "generale",
    question: "Scusa ho sbagliato",
    keywords: ["scusa", "sbagliato"],
    answer: "Vai tranquillo 😂",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_024",
    category: "installazione",
    question: "Appena lo facciamo ti farò sapere",
    keywords: ["appena", "facciamo", "farò", "sapere"],
    answer: "Ok Quindi oggi lo possiamo solo installare, senza poter fare prove per vedere se legge i carichi",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_025",
    category: "online",
    question: "No cerco di metterlo in rete",
    keywords: ["cerco", "metterlo", "rete"],
    answer: "Le giro il manuale per metterlo online Così posso collegarmi da remoto ed effettuare i controlli https://drive.google.com/file/d/1tOW5d-eQmFwN_KOM9hIcYRTBq2lt2LsM/view?usp=drive_link",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_026",
    category: "generale",
    question: "Al momento non vi sono carichi come bisogna farla",
    keywords: ["momento", "sono", "carichi", "come", "bisogna"],
    answer: "Ma non ci sono proprio o non li rileva?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_027",
    category: "generale",
    question: "Ferro",
    keywords: ["ferro"],
    answer: "Quindi i consumi medi quanti sono?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_028",
    category: "generale",
    question: "Tu non vedi carichi adesso ?",
    keywords: ["vedi", "carichi", "adesso", "meter"],
    answer: "Allora molto probabilmente il meter non è montato a monte dei carichi No 0",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_029",
    category: "generale",
    question: "No stanno lavorando",
    keywords: ["stanno", "lavorando"],
    answer: "Sopra che ci sta?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_030",
    category: "online",
    question: "Mi dici come fare l’applicazione al cliente ? Scusami e",
    keywords: ["dici", "come", "fare", "l’applicazione", "cliente"],
    answer: "2 minuti e ti chiamo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_031",
    category: "generale",
    question: "Non sto più nell’azienda",
    keywords: ["sto", "più", "nell’azienda"],
    answer: "Fatti mandare l'email del cliente",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_032",
    category: "generale",
    question: "Ho invertito le fasi dell inverter",
    keywords: ["invertito", "fasi", "dell", "inverter", "inverter"],
    answer: "Ok Vai tranquillo",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_033",
    category: "batterie",
    question: "Prossima operazione ?",
    keywords: ["prossima", "operazione", "inverter", "batterie"],
    answer: "Vedi se le batterie scaricano Spengi le stringhe dal sezionatore sotto inverter e collega un carico e vedi, sempre da schermo inverter, se le batterie scaricano",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie"]
  },
  {
    id: "whatsapp_034",
    category: "batterie",
    question: "Ok",
    keywords: ["inverter", "meter"],
    answer: "Sopra anche inverter Devono andare entrambe sopra meter Inverter e carico",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "meter"]
  },
  {
    id: "whatsapp_035",
    category: "generale",
    question: "Bene",
    keywords: ["bene"],
    answer: "Quando sei sul posto scrivimi e facciamo tutto",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_036",
    category: "batterie",
    question: "Ci sono",
    keywords: ["sono", "inverter", "batterie", "meter"],
    answer: "Eccomi SN logger e foto batterie Okok Meter giusto?! Sopra carichi e inverter quindi? L'impianto può immettere?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie", "meter"]
  },
  {
    id: "whatsapp_037",
    category: "troubleshooting",
    question: "Sì",
    keywords: ["inverter", "meter"],
    answer: "Errore cablaggio meter Come lo hai collegato a inverter? il cavo rosso sotto quale pin va lato inverter? Prova ad invertire sotto meter",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "meter"]
  },
  {
    id: "whatsapp_038",
    category: "installazione",
    question: "Fatto",
    keywords: ["fatto", "meter"],
    answer: "C'è qualcosa che non va Continuo a non vedere nulla Foto cablaggio meter",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_039",
    category: "online",
    question: "No",
    keywords: ["app solarman"],
    answer: "OK Va bene Come sempre, contattami quando sei sul posto Solarman Smart OK ‎Assistenza Fabrizio.vcf (file allegato)",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_040",
    category: "online",
    question: "Ok tranquillo grazie",
    keywords: ["tranquillo", "app solarman"],
    answer: "Eccomi Come hai creato l'app al cliente? Che procedimento hai eseguito?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_041",
    category: "batterie",
    question: "😉",
    keywords: ["batterie"],
    answer: "Io però, per le batterie non posso aiutarti in quanto non sono un nostro prodotto Okok La prossima volta compra le nostre batterie Hailei e ti dò assistenza a 360° per l'impianto 😂 Ottimo 💪🏻 Mi sembra tutto ok",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_042",
    category: "generale",
    question: "Ma il toroide va collegato ?",
    keywords: ["toroide", "collegato", "meter"],
    answer: "https://drive.google.com/file/d/1f3scokTScoV7aUfg3D6cOgBvg5XuqP2_/view?usp=drive_link Collegala direttamente sotto contatore",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_043",
    category: "online",
    question: "Magnetotermico è apposto, cos'altro può essere?",
    keywords: ["magnetotermico", "apposto", "cos'altro", "può", "essere", "inverter"],
    answer: "Allora bisogna ricontrollare tutta la linea enel dell'inverter, e capire perché non arriva tensione Ho ricontrollato ora e vedo sia la tensione enel che i carichi",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_044",
    category: "generale",
    question: "Altrimenti è un casino",
    keywords: ["altrimenti", "casino"],
    answer: "Aspetta, ma tu quindi hai anche fotovoltaico?!",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_045",
    category: "generale",
    question: "Sì certo",
    keywords: ["certo", "inverter", "meter"],
    answer: "Ah ok, allora deve andare dopo il meter Quindi contatore -> meter -> colonnina -> carichi e inverter",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "meter"]
  },
  {
    id: "whatsapp_046",
    category: "generale",
    question: "Ok vabene grazie a dopo 👋",
    keywords: ["vabene", "dopo"],
    answer: "A dopo",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_047",
    category: "generale",
    question: "Ok ti aspetto",
    keywords: ["aspetto"],
    answer: "👍🏻",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_048",
    category: "batterie",
    question: "Risolto",
    keywords: ["risolto", "batterie"],
    answer: "Si ho messo \"No Battery\" Aggiornamenti finiti Riavvia tutto",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_049",
    category: "generale",
    question: "Sì sì è ok l’impianto",
    keywords: ["l’impianto"],
    answer: "Okok Ok Scrivimi quando sei sul posto",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_050",
    category: "generale",
    question: "Ok perfetto ora ci provo",
    keywords: ["perfetto", "ora", "provo"],
    answer: "Ok Ottimo Vai tranquillo Alla prossima e buona serata",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_051",
    category: "generale",
    question: "Sì ma non la trova",
    keywords: ["trova"],
    answer: "Prova a riavviare la colonnina",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_052",
    category: "generale",
    question: "Fatto niente",
    keywords: ["fatto", "niente"],
    answer: "Ottimo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_053",
    category: "generale",
    question: "Non me la trova strano",
    keywords: ["trova", "strano"],
    answer: "Un momento Prova con questa procedura",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_054",
    category: "online",
    question: "Dopo provo",
    keywords: ["dopo", "provo", "inverter", "app solarman"],
    answer: "Ok Okok L'app non ha ancora caricato i dati Intanto imposta l'inverter Io non vedo ancora nulla",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "app-solarman"]
  },
  {
    id: "whatsapp_055",
    category: "online",
    question: "Connessione lenta forse 🤔",
    keywords: ["connessione", "lenta", "forse", "inverter", "batterie"],
    answer: "Imposta no battery da schermo inverter",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie"]
  },
  {
    id: "whatsapp_056",
    category: "generale",
    question: "Come è",
    keywords: ["come"],
    answer: "https://drive.google.com/file/d/1CARtm8hzJ2G9qrEAehZZKbS7u_IYCMWs/view?usp=drive_link 5432 Segui questo manuale",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_057",
    category: "generale",
    question: "Poi",
    keywords: ["poi"],
    answer: "Imposta il resto dei settaggi spiegati nel manuale",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_058",
    category: "generale",
    question: "Qua diluvia",
    keywords: ["qua", "diluvia"],
    answer: "Ma l'impianto è stato installato all'aperto ?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_059",
    category: "generale",
    question: "Che devo istallare più",
    keywords: ["devo", "istallare", "più", "meter"],
    answer: "Mandami una foto di come è stato installato l'impianto Meter?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_060",
    category: "generale",
    question: "Blocca",
    keywords: ["blocca"],
    answer: "OK Quindi tu non lo hai impostato?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_061",
    category: "generale",
    question: "Non so come si fa",
    keywords: ["come", "inverter"],
    answer: "Sta scritto sul manuale che ti ho inviato prima Ci sono tutti i settaggi dell'inverter",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_062",
    category: "generale",
    question: "Ci provo",
    keywords: ["provo"],
    answer: "Ok Quando hai fatto, scrivimi Segui passo passo il manuale che ti ho girato",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_063",
    category: "online",
    question: "Appena puoi controlla se ho fatto bene grazie",
    keywords: ["appena", "puoi", "controlla", "fatto", "bene"],
    answer: "Ok Fammi sapere quando è on",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_064",
    category: "generale",
    question: "Vai",
    keywords: ["vai"],
    answer: "Settaggi corretti",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_065",
    category: "generale",
    question: "Ho fatto bene ?",
    keywords: ["fatto", "bene"],
    answer: "Faccio aggiornamenti",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_066",
    category: "generale",
    question: "Certo",
    keywords: ["certo"],
    answer: "Finito",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_067",
    category: "generale",
    question: "Top",
    keywords: ["top"],
    answer: "L'impianto mi sembra ok",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_068",
    category: "generale",
    question: "Asp",
    keywords: ["asp", "meter"],
    answer: "Devi anche cambiare tipo di sistema E calibrare i ct dal meter",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_069",
    category: "test",
    question: "Simo connessi",
    keywords: ["simo", "connessi"],
    answer: "Controllo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_070",
    category: "batterie",
    question: "Ok fatto",
    keywords: ["fatto"],
    answer: "Rileva il carico?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_071",
    category: "generale",
    question: "Puoi fare",
    keywords: ["puoi", "fare"],
    answer: "Arrivo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_072",
    category: "generale",
    question: "Meter",
    keywords: ["meter", "meter"],
    answer: "Hai bisogno del modello con i ct é un 60kW",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_073",
    category: "batterie",
    question: "Prova di carico ?",
    keywords: ["prova", "carico"],
    answer: "Aspetta Finisco gli aggiornamenti prima",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_074",
    category: "generale",
    question: "Ok scusami",
    keywords: ["scusami"],
    answer: "Di nulla tranquillo 0 immissione?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_075",
    category: "generale",
    question: "Per ora",
    keywords: ["ora"],
    answer: "Fatto Aggiornamenti finiti",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_076",
    category: "generale",
    question: "Fatto ?",
    keywords: ["fatto"],
    answer: "Si",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_077",
    category: "generale",
    question: "Facciamo un’altro impianto ? Hai tempo ?",
    keywords: ["facciamo", "un’altro", "impianto", "tempo"],
    answer: "Sisi vai Stesse impostazioni dei precedenti?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_078",
    category: "generale",
    question: "Sì sono uguali",
    keywords: ["sono", "uguali", "inverter", "meter"],
    answer: "Settaggi corretti eccetto il meter, che era impostato su CT Sto aggiornando inverter",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "meter"]
  },
  {
    id: "whatsapp_079",
    category: "generale",
    question: "Perfetto grazie dopo ci provo",
    keywords: ["perfetto", "dopo", "provo"],
    answer: "Ok Sto ancora aggiornando",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_080",
    category: "generale",
    question: "Mi sembra che abbiamo finito",
    keywords: ["sembra", "abbiamo", "finito"],
    answer: "Si Okok Sono qui",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_081",
    category: "installazione",
    question: "Ti aspetto",
    keywords: ["aspetto", "inverter", "meter"],
    answer: "Intanto ricontrolla cablaggio meter Sopra carichi e inverter in parallelo? Ok",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "meter"]
  },
  {
    id: "whatsapp_082",
    category: "generale",
    question: "A dopo",
    keywords: ["dopo"],
    answer: "Eccomi L'impianto immette",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_083",
    category: "generale",
    question: "No per ora",
    keywords: ["ora", "inverter"],
    answer: "Eh però ora sta immettendo Lo hai impostato da inverter?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_084",
    category: "online",
    question: "No tramite indirizzo ip",
    keywords: ["tramite", "indirizzo"],
    answer: "Segui sempre questo manuale per mettere online l'impianto Perchè stai cercando di metterlo online in questo modo?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_085",
    category: "batterie",
    question: "Grazie mille",
    keywords: ["mille", "inverter", "batterie"],
    answer: "Assistenza Tecnica Afore Italia, sono Emanuele. 🕘 Orari di apertura: Lunedì – Venerdì 09:00 – 13:00 / 14:00 – 18:00 Per poterti assistere nel modo più rapido ed efficace possibile, ti chiedo gentilmente di fornirmi le seguenti informazioni: 🔹 SN inverter 🔹 SN logger 🔹 Foto batterie",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie"]
  },
  {
    id: "whatsapp_086",
    category: "generale",
    question: "Alla prossima",
    keywords: ["alla", "prossima"],
    answer: "Alla prossima",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_087",
    category: "installazione",
    question: "😉😉😉",
    keywords: ["😉😉😉", "app solarman"],
    answer: "Okok Alla prossima Buona serata 24/02/26 h10.00 -> Corso App h11.00 -> Corso Installazione",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_088",
    category: "generale",
    question: "Dove ?",
    keywords: ["dove"],
    answer: "Come si chiama la tua azienda?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_089",
    category: "generale",
    question: "Eulux s p a",
    keywords: ["eulux"],
    answer: "Ok Ti ho iscritto",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_090",
    category: "generale",
    question: "Perfetto grazie",
    keywords: ["perfetto"],
    answer: "Di nulla",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_091",
    category: "generale",
    question: "Nn va",
    keywords: [],
    answer: "Riavviala E riprova",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_092",
    category: "generale",
    question: "Aspetta un po",
    keywords: ["aspetta"],
    answer: "OK Il bluetooth è acceso?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_093",
    category: "generale",
    question: "La Wi-Fi è 2.4 come da manuale",
    keywords: ["wi-fi", "2.4", "come", "manuale"],
    answer: "Dammi qualche minuto",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_094",
    category: "installazione",
    question: "Questo è istallato in azienda",
    keywords: ["questo", "istallato", "azienda", "inverter", "meter"],
    answer: "Ciao Salvatore tutto bene, tu? Comunicazione meter/inverter Ricontrolla il cablaggio",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "meter"]
  },
  {
    id: "whatsapp_095",
    category: "generale",
    question: "3 4 ip contatto giusto ?",
    keywords: ["contatto", "giusto"],
    answer: "2/25 4/24",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_096",
    category: "generale",
    question: "Cosa dobbiamo fare",
    keywords: ["cosa", "dobbiamo", "fare"],
    answer: "Lo facciamo per ultimo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_097",
    category: "generale",
    question: "Tiene",
    keywords: ["tiene"],
    answer: "Deve cambiare il tipo di sistema, altrimenti non vedrai i consumi",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_098",
    category: "generale",
    question: "No dove devo andare",
    keywords: ["dove", "devo", "andare"],
    answer: "!",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_099",
    category: "generale",
    question: "Sì fatto",
    keywords: ["fatto", "meter"],
    answer: "Ok Ok Hai i ct con questo meter, giusto?!",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_100",
    category: "generale",
    question: "Ok sto eseguendo",
    keywords: ["sto", "eseguendo"],
    answer: "Okok Quando hai fatto, mandami sn logger, così accedo all'impianto e do una controllata",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_101",
    category: "batterie",
    question: "Sii",
    keywords: ["sii", "batterie"],
    answer: "2 Stringhe? 5 batterie?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_102",
    category: "generale",
    question: "Però posso la sett prossima",
    keywords: ["però", "posso", "sett", "prossima"],
    answer: "Ok",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_103",
    category: "generale",
    question: "Sì 80A",
    keywords: ["80a"],
    answer: "Ok Sto aggiornando software Non toccare nulla",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_104",
    category: "generale",
    question: "Piove",
    keywords: ["piove"],
    answer: "Ok La poca produzione ha senso allora",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_105",
    category: "batterie",
    question: "Stanno lavorando",
    keywords: ["stanno", "lavorando"],
    answer: "Prova di carico fatta?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_106",
    category: "generale",
    question: "Mi sembra che va 😃",
    keywords: ["sembra"],
    answer: "Si anche per me sembra sia tutto ok Tienilo monitorato nei prossimi giorni",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_107",
    category: "batterie",
    question: "Verifico",
    keywords: ["verifico", "batterie"],
    answer: "Ok Noi alle 18.00 stacchiamo Ho verificato i parametri e sono ok Aggiornamenti fatti Prova di carico l'hai fatta tu e tutto ok Vedo 2 stringhe e 2 batterie Giusto?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_108",
    category: "troubleshooting",
    question: "Giusto",
    keywords: ["giusto"],
    answer: "Perfetto L'impianto sembra tutto ok Tienilo monitorato nei prossimi giorni, e se ci dovesse essere qualunque problema, contattaci Ti auguro una buona serata",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_109",
    category: "batterie",
    question: "Hanno bisogno di te",
    keywords: ["hanno", "bisogno", "inverter", "batterie"],
    answer: "Buon pomeriggio Ho bisogno di SN INVERTER, SN LOGGER e foto batterie E faccio un controllo",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie"]
  },
  {
    id: "whatsapp_110",
    category: "configurazione",
    question: "Devono configurare",
    keywords: ["devono", "configurare", "inverter", "batterie"],
    answer: "Ok Ditemi modello inverter e batterie, così vi invio il manuale",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter", "batterie"]
  },
  {
    id: "whatsapp_111",
    category: "batterie",
    question: "Buon pomeriggio batterie atom aes 5,12",
    keywords: ["buon", "pomeriggio", "batterie", "atom", "aes", "atom aes", "batterie"],
    answer: "Ok",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["atom-aes", "batterie"]
  },
  {
    id: "whatsapp_112",
    category: "troubleshooting",
    question: "Mi da errore B06",
    keywords: ["errore", "b06"],
    answer: "L'impianto è stato messo online? Così posso controllare da remoto",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_113",
    category: "online",
    question: "Purtroppo non c’è il cliente in casa e dovrò metterlo online verso le 17",
    keywords: ["purtroppo", "c’è", "cliente", "casa", "dovrò"],
    answer: "Basta la password del wifi di casa del cliente E ovviamente il nome del wifi",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_114",
    category: "generale",
    question: "Okk",
    keywords: ["okk"],
    answer: "Ho bisogno del nome azienda, nome installatore e numero telefono Perfetto Per iscrivervi al corso, ho bisogno dei nominativi e numeri di telefono",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_115",
    category: "configurazione",
    question: "Lo aggiunto",
    keywords: ["aggiunto", "meter", "afore can"],
    answer: "Ok Parametro batteria da settare per all-in-one è Afore Can L'impianto può immettere? Hai installato meter?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter", "afore-can"]
  },
  {
    id: "whatsapp_116",
    category: "generale",
    question: "Ok va benissimo grazie",
    keywords: ["benissimo"],
    answer: "Vedo quasi 5kW di consumo.. sono reali?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_117",
    category: "configurazione",
    question: "Poi può mandarmi anche il manuale per la configurazione così la prossima volta faccio io direttamente grazie",
    keywords: ["poi", "può", "mandarmi", "anche", "manuale", "inverter"],
    answer: "Ti invio sai quello per inverter+WB che quello inverter+LS https://drive.google.com/file/d/1CARtm8hzJ2G9qrEAehZZKbS7u_IYCMWs/view?usp=drive_link https://drive.google.com/file/d/1WAXoZEIJAw4gIgMw6Tjk96TAqtHVZrjL/view?usp=drive_link Fatta la prova di carico?",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_118",
    category: "online",
    question: "C’è lii ok fatta tramite app stavo facendo così perché di solito tramite app non riuscivo",
    keywords: ["c’è", "lii", "fatta", "tramite", "app", "app solarman"],
    answer: "Prova di carico fatta?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_119",
    category: "troubleshooting",
    question: "Si è tutto apposto",
    keywords: ["tutto", "apposto"],
    answer: "Ok L'impianto mi sembra ok Tienilo monitorato nei prossimi giorni, e se ci dovesse essere qualunque problema o riscontri qualche anomalia, contattami",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_120",
    category: "generale",
    question: "Come da manuale",
    keywords: ["come", "manuale"],
    answer: "Prova anche questo modo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_121",
    category: "generale",
    question: "🙏🙏🙏🙏🙏",
    keywords: ["🙏🙏🙏🙏🙏"],
    answer: "Ottimo.. di nulla",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_122",
    category: "tecnico",
    question: "Chiediamo L aiuto di @⁨Assistenza Emanuele⁩",
    keywords: ["chiediamo", "aiuto", "@⁨assistenza", "emanuele⁩"],
    answer: "Buongiorno Non arriva tensione da Enel",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_123",
    category: "generale",
    question: "Buongiorno a te",
    keywords: ["buongiorno"],
    answer: "Controllate il magnetotermico, che molto probabilmente è abbassato Nono, è onilne",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_124",
    category: "online",
    question: "💪",
    keywords: ["inverter"],
    answer: "Per quanto riguarda il \"Parzialmente offline\" ho visto che c'è un dispositivo offline della sezione inverter Provate a rimuoverlo e dovrebbe tornare completamente online Avete fatto qualche controllo sulla rete? Controllo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["inverter"]
  },
  {
    id: "whatsapp_125",
    category: "generale",
    question: "Sì c’è il meter",
    keywords: ["c’è", "meter", "meter"],
    answer: "L'impianto può immettere?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["meter"]
  },
  {
    id: "whatsapp_126",
    category: "batterie",
    question: "Al momento no",
    keywords: ["momento", "batterie"],
    answer: "Che batterie avete installato e quante?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie"]
  },
  {
    id: "whatsapp_127",
    category: "batterie",
    question: "2 batterie",
    keywords: ["batterie", "batterie", "meter"],
    answer: "L'impianto non era stato impostato a immissione 0 e il parametro batteria era errato Il meter non rileva nulla Come è stato cablato?",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["batterie", "meter"]
  },
  {
    id: "whatsapp_128",
    category: "installazione",
    question: "Come da schema",
    keywords: ["come", "schema"],
    answer: "è da ricontrollare il cablaggio",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_129",
    category: "test",
    question: "Ok va benissimo",
    keywords: ["benissimo"],
    answer: "Quando andate sul posto, mi contattate e facciamo un controllo",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_130",
    category: "generale",
    question: "Va bene grazi",
    keywords: ["bene", "grazi"],
    answer: "Di nulla",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  },
  {
    id: "whatsapp_131",
    category: "installazione",
    question: "Per me va benissimo",
    keywords: ["benissimo", "app solarman"],
    answer: "24/02/26 h10.00 -> Corso App h11.00 -> Corso Installazione",
    language: "en",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: ["app-solarman"]
  },
  {
    id: "whatsapp_132",
    category: "generale",
    question: "Mei Marco 3458574113",
    keywords: ["mei", "marco", "3458574113"],
    answer: "Ok grazie",
    language: "it",
    confidence: 0.95,
    source: "whatsapp",
    relatedProducts: []
  }
];

/**
 * 根据用户问题找到最匹配的 FAQ
 * 使用关键词匹配和相似度算法
 * 支持多语言：意大利语 (it) 和英语 (en)
 */
export function findBestFAQ(userQuestion: string, language: string = 'it', threshold = 0.4): FAQItem | null {
  const question = userQuestion.toLowerCase();
  
  // 关键词匹配评分，优先同语言的FAQ
  let bestMatch: { item: FAQItem; score: number } | null = null;
  
  for (const faq of FAQ_DATA) {
    // 语言匹配加权：同语言的FAQ得分提升20%
    const languageBoost = faq.language === language ? 0.2 : 0;
    
    let score = 0;
    
    // 检查关键词匹配
    const matchedKeywords = faq.keywords.filter(keyword => 
      question.includes(keyword.toLowerCase())
    ).length;
    
    if (matchedKeywords > 0) {
      score = (matchedKeywords / faq.keywords.length) + languageBoost;
    } else {
      // 简单的字符相似度（编辑距离）
      score = calculateSimilarity(question, faq.question.toLowerCase()) + languageBoost;
    }
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { item: faq, score };
    }
  }
  
  // 如果相似度高于阈值，返回结果
  if (bestMatch && bestMatch.score >= threshold) {
    return bestMatch.item;
  }
  
  return null;
}

/**
 * 自动检测语言（意大利语或英语）
 */
export function detectLanguage(text: string): 'it' | 'en' {
  // 意大利语高权重关键词（强指示符）
  const italianStrongKeywords = [
    'grazie', 'buongiorno', 'buonasera', 'scusami', 'però', 'allora', 'ciao',
    'non riesco', 'come posso', 'mi dispiace', 'per favore', 'come si',
    'come', 'cosa', 'da quando', 'quale'
  ];
  
  // 意大利语中等权重关键词
  const italianWeakKeywords = [
    'batterie', 'inverter', 'antenna', 'configurare', 'metto', 'online',
    'impianto', 'contattami', 'collegarmi', 'installare', 'ok', 'cablaggio',
    'tensione', 'stringhe', 'parametro'
  ];
  
  // 英语高权重关键词
  const englishStrongKeywords = [
    'hello', 'help', 'please', 'thank', 'sorry', 'cannot', 'problem',
    'how to', 'what is', 'can you', 'should i'
  ];
  
  const textLower = text.toLowerCase();
  
  // 计算得分
  const italianStrongScore = italianStrongKeywords.filter(kw => textLower.includes(kw)).length * 2;
  const italianWeakScore = italianWeakKeywords.filter(kw => textLower.includes(kw)).length;
  const englishScore = englishStrongKeywords.filter(kw => textLower.includes(kw)).length * 2;
  
  const totalItalianScore = italianStrongScore + italianWeakScore;
  
  // 如果有明确的意大利语强关键词或综合分数更高，返回意大利语
  if (italianStrongScore > 0 || (totalItalianScore > englishScore && totalItalianScore > 0)) {
    return 'it';
  }
  
  return 'en';
}

/**
 * 计算两个字符串的相似度（简单版本）
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * 编辑距离算法（Levenshtein distance）
 */
function getEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

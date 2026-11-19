import { api, listAll } from "../convert/api.ts";
import { imageField, type Media } from "../convert/media.ts";
import { syncSchema } from "../convert/sync-schema.ts";

const library = await listAll<Media>("/media");
const media = new Map([...library.map((item) => [item.storageKey.replace(/\.[a-z]+$/, ""), item] as const), ...library.map((item) => [item.id, item] as const)]);
const photo = (key: string, alt: string) => {
	const found = media.get(key);
	if (!found) throw new Error(`no media ${key}`);
	return imageField(found, alt);
};

const INTRO_FIRST = "I over 130 år har Glass Service Svendsen & Sønn levert glassløsninger av høy kvalitet til privatpersoner og bedrifter.";
const INTRO_REST =
	"Vi hjelper deg med alt fra bytte av vinduer og reparasjon av glass til skreddersydde dusjløsninger, glassrekkverk, speil og moderne interiørglass. Med lang erfaring, solid fagkunnskap og fokus på kvalitet sørger vi for løsninger som kombinerer funksjonalitet, sikkerhet og estetikk. Enten du skal oppgradere boligen, sikre bygget eller skape et lysere og mer moderne miljø, er Glass.no din erfarne samarbeidspartner – fra idé til ferdig montert løsning.";

const layout = [
	{
		_type: "hero",
		kicker: "Siden 1889",
		heading: "Glass.no – Din ekspert på glass, vinduer og glassløsninger",
		lead: INTRO_FIRST,
		primary_label: "Book Befaring",
		primary_url: "/book-befaring/",
		secondary_label: "SE KAMPANJEN",
		secondary_url: "/kampanje/",
		image: photo("01M7TMMKHCQ777HSB1GQSRRXX5", "Black Week: 50 % rabatt på Gilje vinduer og balkongdører"),
		float_label: "Man - Fre 08:00-17:00",
		float_title: "Skift til kvalitetsvindu fra GILJE!",
	},
	{
		_type: "logos",
		items: [
			{ title: "NorDan", image: photo("01M7TMJEJAC8GM4GWXMSHSSEES", "NorDan") },
			{ title: "Velux", image: photo("01M7TMJEKMEEGVMNRJZQWY0320", "Velux") },
			{ title: "Gilje", image: photo("01M7TMJESNQK34SGW479GRX8PH", "Gilje") },
			{ title: "Lyssand", image: photo("01M7TMJEPDDFRG14441Y9KGT5V", "Lyssand") },
			{ title: "Diplomat Dører", image: photo("01M7TMJETX70SB12ECK4TMT9G5", "Diplomat Dører") },
			{ title: "Vemundvik Snekkerfabrikk", image: photo("01M7TMJEW51QQSF0Z5727SJ00S", "Vemundvik Snekkerfabrikk") },
			{ title: "Fjerdingstad", image: photo("01M7TMJEQNX18VHJYJ34RHZP66", "Fjerdingstad") },
			{ title: "Nordvest Vinduet", image: photo("01M7TMJEN2D82ATX04KRRR5440", "Nordvest Vinduet") },
		],
	},
	{
		_type: "services",
		label: "Vinduer",
		heading: "Våre mest Populære Tjenester",
		layout: "list",
		items: [
			{ title: "Bytte vindu", text: "En komplett oppgradering for økt komfort, lavere energikostnader og et nytt, vakkert utseende på din bolig.", url: "/bytte-vindu/", image: photo("01M7TMJN7ZQCAETGQ0XHHT990P", "Bytte vindu") },
			{ title: "bytte glass i vindu", text: "En smart og kostnadseffektiv måte å reparere eller oppgradere dine eksisterende vinduer for bedre isolasjon.", url: "/bytte-glass-i-vindu/", image: photo("01M7TMJNBYX7W36ZEX25DAQZXZ", "Bytte glass i vindu") },
			{ title: "Velux", text: "Forvandle mørke loft og rom under skråtak til lyse og luftige oppholdsrom med kvalitetsvinduer fra Velux.", url: "/velux/", image: photo("01M7TMJV32VSTQHYY2Z222A63T", "Velux takvindu") },
		],
	},
	{
		_type: "statement",
		text: INTRO_REST,
		strong: "fra idé til ferdig montert løsning",
	},
	{
		_type: "services",
		heading: "Dører",
		layout: "cards",
		items: [
			{ title: "Smijernsdør", text: "Skap et eksklusivt og industrielt preg med skreddersydde romdelere og dører i stål og glass.", url: "/smijernsdor/", image: photo("01M7TMJ97V2P59Y21GJHA66WZE", "Smijernsdør") },
			{ title: "Ytterdør", text: "Skap et eksklusivt og industrielt preg med skreddersydde romdelere og dører i stål og glass.", url: "/ytterdor/", image: photo("01M7TMK2FYPD3KNFYXM6YR9MZY", "Ytterdør") },
			{ title: "dusjdør", text: "Forny badet med en elegant og måltilpasset dusjløsning i herdet sikkerhetsglass som er enkel å holde ren.", url: "/dusjdor/", image: photo("01M7TMKDCC38BFX9WWZEYJ38MQ", "Dusjdør") },
		],
	},
	{
		_type: "services",
		heading: "Glasstyper",
		layout: "list",
		items: [
			{ title: "Plexiglass", text: "Et lett, slitesterkt og værbestandig alternativ til glass, perfekt for båtvinduer, skjerming og kreative prosjekter.", url: "/plexiglass/", image: photo("01M7TMKGRCD0P76TRKDRJ0JAEV", "Plexiglass") },
			{ title: "Sikkerhetsglass", text: "Beskytt mennesker og verdier med herdet eller laminert glass. Den trygge løsningen for rekkverk, dører og utsatte flater.", url: "/sikkerhetsglass/", image: photo("01M7TMKGVDG1GXN52Y917VFW1K", "Sikkerhetsglass") },
			{ title: "Isolerglass", text: "Kutt strømregningen og fjern kaldras ved å bytte til moderne 2- eller 3-lags energiglass i dine vinduer.", url: "/isolerglass/", image: photo("01M7TMKGYGRNEK572397EHNVRS", "Isolerglass") },
		],
	},
	{
		_type: "features",
		label: "Hvorfor velge oss",
		heading: "Hvorfor velge Glass.no?",
		intro: "I et marked med mange valg, er det noen grunnleggende verdier som skiller oss ut. Når du velger oss som din partner, får du:",
		bullets: "Over 130 års erfaring\nKompromissløs kvalitet\nLokal forankring i Oslo\nGratis befaring",
		facts: "98% | Kundetilfredshet\n135 år | MED erfaring",
		items: [
			{ title: "døgn service", text: "Vi er tilgjengelig 24/7 for akutte behov - bare ring.", icon: photo("01M7TMJG3AWDKNGAKEZ05CR8QR", "") },
			{ title: "Kunnskap", text: "Erfarne fagfolk med spesialsering innen glass og montering.", icon: photo("01M7TMJG4PAMHDQ0F9PX2M9TAC", "") },
			{ title: "Ferdig montert", text: "Vi leverer og monterer - enkelt og klart.", icon: photo("01M7TMJG1XGASE5GFV0ME27Q96", "") },
			{ title: "Prisgunstig", text: "Høy kvalitet til priser som tåler sammenligning.", icon: photo("01M7TMJG9W99S39GJ0RB7W017K", "") },
			{ title: "Fornøyde kunder", text: "Våre kunder kommer tilbake - det sier alt.", icon: photo("01M7TMJGAZ01DQ18WC50GT85JT", "") },
			{ title: "Gratis befaring", text: "Vi kommer på befaring - helt uforpliktende.", icon: photo("01M7TMJGCEY5SQNMR1PWKC7EGH", "") },
		],
	},
	{
		_type: "faq",
		label: "FAQ",
		heading: "Ofte stilte spørsmål",
		intro: "Her har vi samlet svar på noen av de spørsmålene vi oftest får. Finner du ikke svaret du leter etter, er du hjertelig velkommen til å ta kontakt med oss.",
		items: [
			{ question: "Hva koster det å bytte et vindu eller få en glassløsning?", answer: "Prisen på et prosjekt varierer basert på flere faktorer, som størrelse, materialvalg (tre, PVC, aluminium), type glass (isolerglass, sikkerhetsglass, etc.) og kompleksiteten ved monteringen. For å gi deg en nøyaktig pris, tilbyr vi alltid et skreddersydd og uforpliktende tilbud. Kontakt oss med dine mål eller en beskrivelse av prosjektet, så hjelper vi deg." },
			{ question: "Bør jeg bytte hele vinduet eller kun glasset?", answer: "Dette er et veldig godt spørsmål. Hvis vinduskarmen er i god stand – uten råte, sprekker eller funksjonssvikt – er det ofte en smart og kostnadseffektiv løsning å kun bytte selve glasset til et moderne isolerglass. Hvis karmen derimot er slitt og dårlig, anbefaler vi å bytte hele vinduet for å sikre et tett og varig resultat. Vi gir deg alltid en ærlig anbefaling basert på en vurdering av dine vinduer." },
			{ question: "Hvordan er prosessen fra jeg kontakter dere til jobben er ferdig?", answer: "Prosessen vår er enkel og oversiktlig:\n• Første kontakt: Du tar kontakt med oss via telefon eller e-post, og vi diskuterer ditt behov.\n• Befaring og tilbud: Vi kommer ofte på en gratis og uforpliktende befaring for å ta mål og vurdere jobben. Deretter mottar du et detaljert tilbud fra oss.\n• Bestilling: Når du godkjenner tilbudet, bestiller vi de skreddersydde materialene for ditt prosjekt.\n• Montering: Våre erfarne fagfolk avtaler en tid som passer for deg og utfører jobben effektivt og profesjonelt." },
			{ question: "Hvor lang tid tar et vanlig prosjekt?", answer: "Tidsbruken avhenger helt av type prosjekt. En enkel reparasjon eller bytte av et glass kan ofte gjøres raskt. Større prosjekter som krever skreddersydde produkter, som nye vinduer eller en innglasset balkong, vil ha en leveringstid fra produsent. Vi vil alltid gi deg en estimert og realistisk tidsramme i tilbudet ditt." },
			{ question: "Hvilke områder betjener dere, og tar dere små oppdrag?", answer: "Vi holder til sentralt i Pilestredet og betjener i hovedsak hele Oslo-området. Og ja, absolutt! Vi er like glade for å hjelpe deg med å bytte et enkelt knust glass i en dør som vi er for å ta på oss store, komplette vindusutskiftninger for borettslag og næringsbygg. Ingen jobb er for liten for oss." },
		],
	},
	{
		_type: "contact",
		heading: "Få svar på dine spørsmål",
		address: "Pilestredet 41A\nOslo",
		hours: "Man - Fre | 08:00-17:00",
		phone: "+47 91 58 49 40",
		image: photo("01M7TMKYKXCSD018S633CMTB21", "Glass-Service Svendsen og Sønn sin servicebil"),
		show_form: true,
	},
];

await syncSchema();
const page = await api<{ item: { id: string } }>("/content/pages/hjem");
await api(`/content/pages/${page.item.id}`, { method: "PUT", body: { data: { layout }, skipRevision: true, replaceBlocks: true } });
await api(`/content/pages/${page.item.id}/publish`, { method: "POST", body: {} });
console.log(`wrote ${layout.length} blocks to hjem`);

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
		image: photo("01M7TMJ4DMRMS7NC1VF7RZ5JM5", "Stue med vindu fra gulv til tak og utsikt over et snødekt landskap"),
		float_label: "Man - Fre 08:00-17:00",
		float_title: "Skift til kvalitetsvindu fra GILJE!",
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
		_type: "contact",
		heading: "Ofte stilte spørsmål",
		intro: "Her har vi samlet svar på noen av de spørsmålene vi oftest får. Finner du ikke svaret du leter etter, er du hjertelig velkommen til å ta kontakt med oss.",
		address: "Pilestredet 41A\nOslo",
		hours: "Man - Fre | 08:00-17:00",
		phone: "+47 91 58 49 40",
		image: photo("01M7TMKYKXCSD018S633CMTB21", "Glass-Service Svendsen og Sønn sin servicebil"),
	},
];

await syncSchema();
const page = await api<{ item: { id: string } }>("/content/pages/hjem");
await api(`/content/pages/${page.item.id}`, { method: "PUT", body: { data: { layout }, skipRevision: true, replaceBlocks: true } });
await api(`/content/pages/${page.item.id}/publish`, { method: "POST", body: {} });
console.log(`wrote ${layout.length} blocks to hjem`);

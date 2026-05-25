"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// --- DATA OBJECTEN (EXACTE EN VOLLEDIGE LIJST MET SCHONE BENAMINGEN) ---

const imageDescriptions: Record<string, string> = {
  "Nansen De Scheepskat": "Scheepskat van de Belgica.",
  "Roald Amundsen": "Eerste stuurman; later poolpionier.",
  "George Lecointe": "Kapitein, hydrograaf en navigator.",
  "Henryck Arctowski": "Geoloog en meteoroloog van de expeditie.",
  "Frederick Albert Cook": "Scheepsarts die scheurbuik hielp tegengaan.",
  "Emile Racovitza": "Zoöloog en bioloog aan boord.",
  "Adrien De Gerlache": "Belgische commandant van de Belgica.",
  "Emile Danco": "Verantwoordelijk voor geofysische waarnemingen.",
  "George Lecointe Portret": "Lecointe als navigator en wetenschapper.",
  "Henryck Arctowski Onderzoek": "Arctowski’s wetenschappelijke metingen.",
  "Roald Amundsen Ijs": "Amundsen deed poolervaring op in het ijs.",
  "Adrien De Gerlache Portret": "De Gerlache, leider van de expeditie.",
  "Belgica": "De Belgica, omgebouwd voor poolonderzoek.",
  "Belgica Vast In Ijs": "Het schip zat maanden vast in het pakijs.",
  "Belgica In Antwerpen": "Vertrek uit Antwerpen op 16 augustus 1897.",
  "Inspectie Van De Belgica": "Voorbereiding van het schip voor de reis.",
  "Belgica In Antwerpen Kade": "Uitgezwaaid in de Antwerpse haven.",
  "Belgica Zee": "Route via Madeira, Rio en Montevideo.",
  "Bemanning Van De Belgica": "Internationale bemanning van de expeditie.",
  "De Belgica In Oostende": "De Belgica later opnieuw in onderzoek ingezet.",
  "Postkaart Belgica": "Herinnering aan het beroemde pools schip.",
  "Herinneringskaart": "Kaart ter nagedachtenis aan de expeditie.",
  "Isfjord": "Fjord op Spitsbergen in het poolgebied.",
  "Lecointe Kaart Een": "Een van Lecointe’s poolkaarten.",
  "Lecointe Kaart Twee": "Kaart van kustlijnen en zeewegen.",
  "Lecointe Kaart Drie": "Hydrografische kaart uit de expeditie.",
  "Lecointe Kaart Vier": "Gedetailleerde kaart van de Antarctische kust.",
  "Lecointe Kaart Vijf": "Wetenschappelijke kaart van de expeditie.",
  "Lecointe Kaart Zes": "Kaart van ijsrand en kuststructuur.",
  "Lecointe Kaart Zeven": "Laatste kaart uit de reeks.",
  "Arctowski En Thoulet Figuur Twee": "Wetenschappelijke figuur uit de expeditie.",
  "Arctowski En Thoulet Figuur Zes": "Illustratie van poolwaarnemingen.",
  "Scheepsplan": "Technisch plan van de Belgica.",
  "Successor": "Latere opvolger in de collectie."
};

const expeditions = [
  { label: 'Antarctica (1897)', id: '1897' },
  { label: 'De Koning Boudewijnbasis (1957–1961)', id: '1957' },
  { label: 'Hubert & Dansercoer (1997–1998)', id: '1997' }
];

const expeditionCrew: Record<string, string[]> = {
  '1897': [
    'Adrien de Gerlache', 'Georges Lecointe', 'Roald Amundsen', 'Frederick A. Cook', 'Henryk Arctowski', 'Emil Racoviță', 'Émile Danco', 'Max Van Rysselberghe', 'Antoni B. Dobrowolski', 'Henri Somers', 'Carl August Wiencke', 'Johan Koren', 'Jan Van Mirlo', 'Louis Michotte', 'Adam Tollefsen', 'Ludvig-Hjalmar Johansen', 'Engebret Knudsen', 'Gustave-Gaston Dufour'
  ],
  '1957': [
    'Adrien de Gerlache', 'Georges Lecointe', 'Henryk Arctowski', 'Max Van Rysselberghe'
  ],
  '1997': [
    'Adrien de Gerlache', 'Georges Lecointe', 'Max Van Rysselberghe'
  ]
};

const timelineEvents: Array<{ id: string; exp: string; date: string; title: string; desc: string }> = [
  // Belgica (1897–1899) - 10 events
  { id: 'e1', exp: '1897', date: 'aug 1897', title: 'Vertrek Antwerpen', desc: 'Vertrek uit Antwerpen.' },
  { id: 'e2', exp: '1897', date: 'sep 1897', title: 'Madeira', desc: 'Kort tussenstop en bevoorrading.' },
  { id: 'e3', exp: '1897', date: 'okt 1897', title: 'Rio de Janeiro', desc: 'Tussenstop; bemanning aangevuld.' },
  { id: 'e4', exp: '1897', date: 'dec 1897', title: 'Punta Arenas', desc: 'Laatste stop voor Antarctica.' },
  { id: 'e5', exp: '1898', date: 'jan 1898', title: 'Gerlache Strait', desc: 'Passage in kaart gebracht.' },
  { id: 'e6', exp: '1898', date: 'feb 1898', title: 'In het pakijs', desc: 'Schip raakt vast; overwintering begint.' },
  { id: 'e7', exp: '1898', date: 'mrt 1898', title: 'Wiencke verdronken', desc: 'Een bemanningslid raakt om het leven.' },
  { id: 'e8', exp: '1898', date: 'jun 1898', title: 'Danco overleden', desc: 'Verlies van een wetenschapper aan boord.' },
  { id: 'e9', exp: '1899', date: 'feb 1899', title: 'Bevrijding', desc: 'Schip komt los uit het ijs.' },
  { id: 'e10', exp: '1899', date: 'nov 1899', title: 'Terugkeer Antwerpen', desc: 'Terugkeer naar huisbasis.' },

  // Koning Boudewijnbasis (1957–1961) - 6 events
  { id: 'e11', exp: '1957', date: 'dec 1957', title: 'Bouw gestart', desc: 'Start bouw van de basis (kerst 1957).' },
  { id: 'e12', exp: '1957', date: 'jan 1958', title: 'Zomermetingen', desc: 'Vroege meteorologische waarnemingen.' },
  { id: 'e13', exp: '1957', date: 'jul 1959', title: 'Wintermetingen', desc: 'Belangrijke wintermetingen uitgevoerd.' },
  { id: 'e14', exp: '1957', date: 'dec 1960', title: 'Uitbreiding', desc: 'Faciliteiten werden uitgebreid.' },
  { id: 'e15', exp: '1957', date: 'dec 1961', title: 'Sluiting', desc: 'Einde van de eerste operationele periode.' },
  { id: 'e16', exp: '1957', date: 'jan 1962', title: 'Archivering', desc: 'Start van gegevensarchivering.' },

  // Hubert & Dansercoer (1997–1998) - 6 events
  { id: 'e17', exp: '1997', date: 'jan 1997', title: 'Start expeditie', desc: 'Begin van de oversteek.' },
  { id: 'e18', exp: '1997', date: 'mrt 1997', title: 'Powerkite tests', desc: 'Optimalisatie van kite-techniek.' },
  { id: 'e19', exp: '1997', date: 'jul 1997', title: 'Halverwege', desc: 'Halverwege bereikt; korte evaluatie.' },
  { id: 'e20', exp: '1997', date: 'feb 1998', title: 'Windrecord', desc: 'Record van 271 km in 24 uur.' },
  { id: 'e21', exp: '1997', date: 'apr 1998', title: 'Aankomst', desc: 'Doorkruising voltooid.' },
  { id: 'e22', exp: '1997', date: 'mei 1998', title: 'Rapportage', desc: 'Nazorg en publicatie van resultaten.' }
];


type RoutePoint = {
  lat: number;
  lon: number;
  label: string;
  date: string;
  note: string;
};

type WeatherPoint = {
  dateLabel: string;
  axisLabel: string;
  label: string;
  value: number;
  note: string;
  critical?: {
    title: string;
    text: string;
  };
};

// Historisch interessante content voor progressive disclosure (Datapanel + Detail)
const expeditionInfo: Record<string, { title: string, subtitle: string, text: string, detailText: string, quote: string, weatherSummary: string, weatherBullets: string[], weatherPoints: WeatherPoint[] }> = {
  '1897': { 
    title: "De Belgica-expeditie (1897–1899)",
    subtitle: "Geleid door Adrien de Gerlache — eerste wetenschappelijke expeditie naar Antarctica",
    text: "De Belgica-expeditie (1897–1899) was geleid door Adrien de Gerlache. Het was de eerste wetenschappelijke Belgisch-geïnitieerde expeditie naar Antarctica en kende een onbedoelde overwintering toen het schip vast kwam te zitten in het ijs.",
    detailText: "AANLOOP & CONTEXT (1895–1896):\n→ uitdaging Antarctica geformuleerd op congres in Londen\n→ Adrien de Gerlache start voorbereidingen\n→ schip Patria wordt Belgica\n\nDE REIS (1897–1899):\n→ vertrek uit Antwerpen met internationale bemanning (Gerlache, Amundsen, Cook, Lecointe)\n→ 22 jan 1898: dood van Wiencke tijdens storm (eerste dodelijk slachtoffer)\n→ feb 1898: ontdekking Gerlachestraat; schip raakt vast in het ijs\n→ winter 1898: 13 maanden ijsdrift in Bellingshausenzee; scheurbuik en honger; Emile Danco sterft; overleven deels met rauw vlees (Cook)\n→ 1899: bevrijding uit het ijs en terugkeer naar Antwerpen\n\nWETENSCHAPPELIJKE ERFENIS:\n→ 1959: Antarctisch Verdrag (vrede & wetenschap)\n→ 1991: Protocol van Madrid (natuurbescherming)\n\nEERSTE KEREN & SLEUTELCIJFERS:\n→ 1e wetenschappelijke expeditie; 1e overwintering van een schip in Antarctica; 1e ski op vasteland (Amundsen); 1e sleeëntocht en vroege meteorologische jaarreeks\n→ 13 maanden bevroren in het ijs; totale duur ca. 2 jaar 2 maanden; 1 dode (Wiencke), 1 gestorven aan boord (Emile Danco)\n\nROUTE (hoogtepunten):\n1. Antwerpen (vertrek 1897) → bevoorrading Zuid-Amerika → 2. Antarctisch schiereiland (aankomst 1898; Gerlachestraat & eilanden) → 3. Peter I Island / ijsvast → 4. Bellingshausenzee (lange drift) → 5. Terugkeer Antwerpen (1899)",
    quote: "De Belgica legde de basis voor de moderne Belgische poolwetenschap.",
    weatherSummary: "Temperatuurverloop en sleutelmomenten van de overwintering.",
    weatherBullets: [
      '13 maanden ijsdrift',
      'Emile Danco overleden',
      'Scheurbuik bestreden met vers vlees'
    ],
    weatherPoints: [
      { dateLabel: 'aug 1897', axisLabel: 'aug 1897', label: 'Vertrek Antwerpen', value: 15, note: 'ca. +15°C' },
      { dateLabel: 'jan 1898', axisLabel: 'jan 1898', label: 'Antarctische zomer', value: -7.5, note: 'ca. −5°C tot −10°C' },
      { dateLabel: 'mrt 1898', axisLabel: 'mrt 1898', label: 'Vastgevroren', value: -20, note: 'ca. −20°C' },
      { dateLabel: 'jun 1898', axisLabel: 'jun 1898', label: 'Poolwinter', value: -32.5, note: 'ca. −30°C tot −35°C' },
      { dateLabel: 'feb 1899', axisLabel: 'feb 1899', label: 'Bevrijding', value: -12.5, note: 'ca. −10°C tot −15°C' }
    ]
  },
  '1957': {
    title: "De Koning Boudewijnbasis (1957–1961)",
    subtitle: "Geleid door Gaston de Gerlache — eerste Belgische basis in Queen Maud Land",
    text: "De Koning Boudewijnbasis was de eerste Belgische wetenschappelijke basis op Antarctica (Queen Maud Land), opgezet onder leiding van Gaston de Gerlache, zoon van Adrien.",
    detailText: "LOCATIE & PERIODE:\n→ 70°26' Z, 24°19' O (Queen Maud Land)\n→ Bouw gestart 1957 (Kerstdag) — operationeel tijdens 1957–1961\n\nKERNFEITEN:\n→ Zomer (dec–feb): ca. −10°C tot −15°C\n→ Winter (jun–aug): ca. −25°C tot −30°C\n→ Zuiderlicht waargenomen en geregistreerd\n→ Basis werd later gesloten en deels herbouwd in samenwerkingen (1964–1967)",
    quote: "De basis markeert de start van langdurig Belgisch onderzoek in Antarctica.",
    weatherSummary: "Korte weersamenvatting en locatiegegevens.",
    weatherBullets: [
      "70°26' Z, Queen Maud Land",
      'Zomer: −10 tot −15°C',
      'Winter: −25 tot −30°C',
      'Zuiderlicht waargenomen'
    ],
    weatherPoints: [
      { dateLabel: 'dec 1957', axisLabel: 'dec 1957', label: 'Start bouw', value: -12, note: 'Bouw gestart (kerstdag 1957)' },
      { dateLabel: 'jan 1958', axisLabel: 'jan 1958', label: 'Zomer', value: -12.5, note: 'Zomermetingen' },
      { dateLabel: 'jul 1959', axisLabel: 'jul 1959', label: 'Winter', value: -27.5, note: 'Wintermeting' },
      { dateLabel: 'dec 1961', axisLabel: 'dec 1961', label: 'Sluiting', value: -15, note: 'Definitieve sluiting later in jaren 60' }
    ]
  },
  '1997': {
    title: "Hubert & Dansercoer (1997–1998)",
    subtitle: "Alain Hubert & Dixie Dansercoer — trans-Antarctische oversteek",
    text: "Hubert & Dansercoer maakten in 1997–1998 een Noord–Zuid doorkruising van Antarctica: 3.924 km in 99 dagen, met powerkite-verplaatsingen en recordafstanden.",
    detailText: "BELGISCHE AVONTURIERS (1997–1998):\n→ 3.924 km afgelegd (Noord–Zuid) in 99 dagen\n→ pieksnelheid door wind: 271 km in 24 uur\n→ gebruik van powerkites voor voortstuwing\n→ belangrijke prestatie in moderne poolexploratie\n\nCIJFERS:\n→ 3.924 km\n→ 99 dagen\n→ 271 km (24u rekord)\n→ 150 km per sneeuwstaal (indicatief)\n→ 1998 aankomst op Zuidpool\n",
    quote: "Een moderne Belgische prestatie in de traditie van poolonderzoek.",
    weatherSummary: "Korte weerschets en prestaties tijdens doortocht.",
    weatherBullets: [
      'Gemiddelde temp: −20 tot −23°C',
      'Recordpieken dankzij wind',
      '99 dagen, 3.924 km'
    ],
    weatherPoints: [
      { dateLabel: 'jan 1997', axisLabel: 'jan 1997', label: 'Start', value: -21, note: 'Start kustgebied' },
      { dateLabel: 'jul 1997', axisLabel: 'jul 1997', label: 'Onderweg', value: -22.5, note: 'Gemiddelde temperaturen' },
      { dateLabel: 'feb 1998', axisLabel: 'feb 1998', label: 'Record', value: -20, note: '271 km in 24 uur' },
      { dateLabel: 'apr 1998', axisLabel: 'apr 1998', label: 'Einde', value: -21.5, note: 'Aankomst / einde traject' }
    ]
  },
  'modern': { 
    title: "Scientia Contemporanea", 
    subtitle: "De erfenis van de Belgica",
    text: "De Belgica-expedities gelden vandaag als belangrijke vroege bijdragen aan poolonderzoek. Hun waarnemingen over ijs, weer, zee en biodiversiteit vormen een historisch referentiepunt voor moderne klimaat- en oceaanstudies.",
    detailText: "INTERNATIONALE ERFENIS:\nDe combinatie van wetenschappelijke nieuwsgierigheid, internationale bemanning en overlevingsvermogen maakte de Belgica tot een mijlpaal in de Heroic Age of Antarctic Exploration. De reis liet zien hoe essentieel systematische metingen zijn voor het begrijpen van het poolklimaat.",
    quote: "\"De Belgica toonde dat wetenschap in extreme omstandigheden nog altijd vooruitgang kan boeken.\"",
    weatherSummary: "De Belgica-data blijven belangrijk voor poolonderzoek.",
    weatherBullets: [
      'Meerdere expedities naast elkaar',
      'Temperatuur, ijs en weer'
    ],
    weatherPoints: [
      { dateLabel: 'jan 1900', axisLabel: 'jan 1900', label: '1900', value: -10, note: 'referentiepunt' },
      { dateLabel: 'jan 1950', axisLabel: 'jan 1950', label: '1950', value: -15, note: 'groeiende meetreeksen' },
      { dateLabel: 'jan 2000', axisLabel: 'jan 2000', label: '2000', value: -20, note: 'satelliet- en veldmetingen' }
    ]
  }
};

const rawImageData = [
  { cleanName: "Nansen De Scheepskat", file: "12495_nansen-de-scheepskat.jpg", exp: "1897" },
  { cleanName: "Roald Amundsen", file: "12496_roald-amundsen.jpg", exp: "1897" },
  { cleanName: "George Lecointe", file: "12498_george-lecointe.jpg", exp: "1897" },
  { cleanName: "Henryck Arctowski", file: "12499_henryck-arctowski.jpg", exp: "1897" },
  { cleanName: "Frederick Albert Cook", file: "12500_frederick-albert-cook.jpg", exp: "1897" },
  { cleanName: "Emile Racovitza", file: "12501_emile-racovitza.jpg", exp: "1897" },
  { cleanName: "Adrien De Gerlache", file: "12504_adrien-de-gerlache.jpg", exp: "1897" },
  { cleanName: "Emile Danco", file: "12513_emile-danco.jpg", exp: "1897" },
  { cleanName: "George Lecointe Portret", file: "12556_george-lecointe.jpg", exp: "1897" },
  { cleanName: "Henryck Arctowski Onderzoek", file: "12557_henryck-arctowski.jpg", exp: "1897" },
  { cleanName: "Roald Amundsen Ijs", file: "12785_roald-amundsen.jpg", exp: "1897" },
  { cleanName: "Adrien De Gerlache Portret", file: "3141_adrien-de-gerlache.jpg", exp: "1897" },
  { cleanName: "Belgica", file: "3142_belgica.jpg", exp: "1897" },
  { cleanName: "Belgica Vast In Ijs", file: "3146_belgica.jpg", exp: "1897" },
  { cleanName: "Belgica In Antwerpen", file: "5311_belgica-in-antwerpen-1897.jpg", exp: "1897" },
  { cleanName: "Inspectie Van De Belgica", file: "5316_inspectie-van-de-belgica.jpg", exp: "1897" },
  { cleanName: "Belgica In Antwerpen Kade", file: "5318_belgica-in-antwerpen.jpg", exp: "1897" },
  { cleanName: "Belgica Zee", file: "5602_belgica.jpg", exp: "1897" },
  { cleanName: "Bemanning Van De Belgica", file: "9399_bemanning-van-de-belgica.jpg", exp: "1897" },
  { cleanName: "De Belgica In Oostende", file: "8995_de-belgica-in-oostende-in-1905.jpg", exp: "1957" },
  { cleanName: "Postkaart Belgica", file: "9397_postkaart-getiteld-qyacht-belgica-du-duc-dorleans-et-la-gareq-de-kaart-is-afkomstig-uit-de-collectie-van-omer-vilain.jpg", exp: "1957" },
  { cleanName: "Herinneringskaart", file: "9398_herinneringskaart.jpg", exp: "1957" },
  { cleanName: "Isfjord", file: "5322_isfjord.jpg", exp: "1957" },
  { cleanName: "Lecointe Kaart Een", file: "32321_lecointe-1903-kaart-1.jpg", exp: "1997" },
  { cleanName: "Lecointe Kaart Twee", file: "32322_lecointe-1903-kaart-2.jpg", exp: "1997" },
  { cleanName: "Lecointe Kaart Drie", file: "32323_lecointe-1903-kaart-3.jpg", exp: "1997" },
  { cleanName: "Lecointe Kaart Vier", file: "32324_lecointe-1903-kaart-4.jpg", exp: "1997" },
  { cleanName: "Lecointe Kaart Vijf", file: "32325_lecointe-1903-kaart-5.jpg", exp: "1997" },
  { cleanName: "Lecointe Kaart Zes", file: "32326_lecointe-1903-kaart-6.jpg", exp: "1997" },
  { cleanName: "Lecointe Kaart Zeven", file: "32327_lecointe-1903-kaart-7.jpg", exp: "1997" },
  { cleanName: "Arctowski En Thoulet Figuur Twee", file: "32666_arctowski-en-thoulet-1901-fig-2.jpg", exp: "1997" },
  { cleanName: "Arctowski En Thoulet Figuur Zes", file: "32670_arctowski-en-thoulet-1901-fig-6.jpg", exp: "1997" },
  { cleanName: "Scheepsplan", file: "5603_scheepsplan.jpg", exp: "1997" },
  { cleanName: "Successor", file: "babcb16a-1a1f-11ed-b07d-02b7b76bf47f.jpg.webp", exp: "modern" }
];

const alphabetizedImageData = [...rawImageData].sort((a, b) => a.cleanName.localeCompare(b.cleanName));

const yearFilterOptions = [
  { label: 'Alle jaren', value: 'all' },
  { label: '1897', value: '1897' },
  { label: '1957–1961', value: '1957' },
  { label: '1997–1998', value: '1997' },
  { label: 'Modern', value: 'modern' }
];

const photoCategoryOptions = [
  { label: 'Alles', value: 'all' },
  { label: 'Kaarten', value: 'kaarten' },
  { label: 'Bemanning', value: 'bemanning' }
];

const crewPhotoNames = new Set([
  'nansen de scheepskat',
  'roald amundsen',
  'george lecointe',
  'henryck arctowski',
  'frederick albert cook',
  'emile racovitza',
  'adrien de gerlache',
  'emile danco',
  'george lecointe portret',
  'henryck arctowski onderzoek',
  'roald amundsen ijs',
  'adrien de gerlache portret',
  'bemanning van de belgica'
]);

const getPhotoCategory = (cleanName: string) => {
  const lowerName = cleanName.toLowerCase();

  if (
    lowerName.includes('kaart') ||
    lowerName.includes('scheepsplan') ||
    lowerName.includes('postkaart') ||
    lowerName.includes('herinneringskaart')
  ) {
    return 'kaarten';
  }

  if (crewPhotoNames.has(lowerName) || lowerName.includes('portret') || lowerName.includes('onderzoek')) {
    return 'bemanning';
  }

  return 'overig';
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [slots, setSlots] = useState<(string | null)[]>(new Array(6).fill(null));
  const [lastReplacedIndex, setLastReplacedIndex] = useState(0);
  const [activeExpedition, setActiveExpedition] = useState<string | null>(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showPhotos, setShowPhotos] = useState(true);
  const [markerInfo, setMarkerInfo] = useState<{title: string, date: string, note: string, pos: {x: number, y: number}} | null>(null);
  
  const [showFilterTab, setShowFilterTab] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<'all'|'1897'|'1957'|'1997'>('all');

  const [randomStyles] = useState(() => 
    Array.from({ length: 6 }, () => ({
      rotate: (Math.random() * 6 - 3).toFixed(2) + 'deg',
      translateX: (Math.random() * 20 - 10).toFixed(2) + 'px'
    }))
  );

  const slotsRef = useRef<(string | null)[]>([]);
  const activeExpeditionRef = useRef<string | null>(null);
  const showPhotosRef = useRef(true);
  const isMouseDownRef = useRef(false);
  const isAutoRotating = useRef(true);
  const ignorePointerRef = useRef(false);
  
  const searchQueryRef = useRef("");

  useEffect(() => { slotsRef.current = slots; }, [slots]);
  useEffect(() => { 
    activeExpeditionRef.current = activeExpedition;
    if (activeExpedition) isAutoRotating.current = true;
    setMarkerInfo(null);
  }, [activeExpedition]);
  useEffect(() => { 
    showPhotosRef.current = showPhotos; 
    setMarkerInfo(null);
  }, [showPhotos]);

  useEffect(() => { searchQueryRef.current = searchQuery; }, [searchQuery]);

  // Als de tijdlijn-popup opent, default filter naar de actieve expeditie (indien aanwezig)
  useEffect(() => {
    if (showTimelinePopup) {
      setTimelineFilter(activeExpedition ? (activeExpedition as '1897'|'1957'|'1997') : 'all');
    }
  }, [showTimelinePopup, activeExpedition]);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    const photoGroup = new THREE.Group();
    const routeGroup = new THREE.Group();
    masterGroup.add(photoGroup);
    masterGroup.add(routeGroup);
    const targetScale = new THREE.Vector3(1, 1, 1);

    const loader = new THREE.TextureLoader();
    const earthRadius = 4.0;
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius, 64, 64),
      new THREE.MeshBasicMaterial({ map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg') })
    );
    masterGroup.add(earth);

    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
    };

    const routesData: Array<{ id: string; center: { lat: number; lon: number }; points: RoutePoint[] }> = [
      { 
        id: '1897', 
        center: { lat: -70, lon: -85 }, 
        points: [
            {lat: 51.21, lon: 4.40, label: "Vertrek Antwerpen", date: "16 aug 1897", note: "De Belgica vertrok uit Antwerpen met een internationale wetenschappelijke bemanning."}, 
            {lat: 32.66, lon: -16.91, label: "Madeira", date: "aug 1897", note: "De expeditie deed Madeira aan tijdens de reis naar het zuiden."}, 
            {lat: -22.90, lon: -43.17, label: "Rio de Janeiro", date: "sep 1897", note: "In Rio de Janeiro sloot Frederick Cook zich bij de expeditie aan."}, 
            {lat: -34.83, lon: -56.16, label: "Montevideo", date: "okt 1897", note: "In Montevideo werd de bemanning opnieuw aangevuld en bevoorraad."}, 
            {lat: -53.16, lon: -70.93, label: "Punta Arenas", date: "dec 1897", note: "Deze zuidelijke haven was de laatste grote stop vóór Antarctica."}, 
            {lat: -64.83, lon: -63.00, label: "Gerlache Strait", date: "jan 1898", note: "De passage werd tijdens de expeditie in kaart gebracht en kreeg later de naam Gerlache Strait."}, 
            {lat: -71.50, lon: -85.00, label: "Ingevroren in het ijs", date: "28 feb 1898", note: "De Belgica raakte hier definitief vast in het Antarctische pakijs."}
        ] 
      },
      { id: '1957', center: { lat: 72, lon: 0 }, points: [
          {lat: 51.23, lon: 2.92, label: "Oostende", date: "1905", note: "De Belgica werd opnieuw ingezet voor een noordelijke wetenschappelijke expeditie."}, 
          {lat: 60.39, lon: 5.32, label: "Bergen", date: "1905", note: "De route liep langs de Noorse kust richting Arctische wateren."}, 
          {lat: 78.22, lon: 15.62, label: "Spitsbergen", date: "1905", note: "Spitsbergen vormde een belangrijk gebied voor ijs- en klimaatobservaties."}, 
          {lat: 75.0, lon: -18.0, label: "Groenland Zee", date: "1905", note: "Hier verrichtte de expeditie metingen aan zee, ijs en stroming."}
      ] },
      { id: '1997', center: { lat: 68, lon: 40 }, points: [
          {lat: 51.21, lon: 4.40, label: "Antwerpen", date: "1907", note: "Vanuit Antwerpen begon de Belgica aan een hydrografische tocht naar het noorden."}, 
          {lat: 70.66, lon: 23.68, label: "Hammerfest", date: "1907", note: "Hammerfest was een belangrijke noordelijke tussenstop in Noorwegen."}, 
          {lat: 72.0, lon: 45.0, label: "Barentszzee", date: "1907", note: "In de Barentszzee werden kustlijnen en vaarwegen nauwkeurig opgemeten."}, 
          {lat: 74.0, lon: 60.0, label: "Novaya Zemlya", date: "1907", note: "De expeditie werkte hier aan de kaarting van Siberische en Arctische wateren."}
      ] }
    ];

    routesData.forEach(route => {
      const curvePoints = route.points.map(p => latLongToVector3(p.lat, p.lon, earthRadius + 0.08));
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      
      const routeContainer = new THREE.Group();
      routeContainer.userData = { id: route.id };

      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.03, 8, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
      });
      const routeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      routeContainer.add(routeMesh);

      route.points.forEach((p) => {
        const pointPos = latLongToVector3(p.lat, p.lon, earthRadius + 0.12);
        
        const markerGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          transparent: true,
          opacity: 0 
        });
        const marker = new THREE.Mesh(markerGeom, markerMat);
        marker.position.copy(pointPos);
        
        const hitboxGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitbox = new THREE.Mesh(hitboxGeom, hitboxMat);
        hitbox.userData = { isMarker: true, label: p.label, date: p.date, note: p.note, expId: route.id };
        marker.add(hitbox);

        routeContainer.add(marker);
        
        const ringGeom = new THREE.RingGeometry(0.1, 0.12, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.copy(pointPos);
        ring.lookAt(new THREE.Vector3(0,0,0));
        routeContainer.add(ring);
      });
      
      routeGroup.add(routeContainer);
    });

    const imageData = [...rawImageData].sort(() => Math.random() - 0.5);
    const radius = 6.0; 
    
    imageData.forEach((item, i) => {
      const url = `/Belgica_Antarctica/${item.file}`;
      loader.load(url, (texture) => {
        const phi = Math.acos(-1 + (2 * i) / imageData.length);
        const theta = Math.sqrt(imageData.length * Math.PI) * phi;
        const baseWidth = 1.2;
        const aspect = texture.image.width / texture.image.height;
        const finalHeight = baseWidth / aspect;
        const group = new THREE.Group();
        const photo = new THREE.Mesh(
          new THREE.PlaneGeometry(baseWidth, finalHeight), 
          new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0 })
        );
        group.add(photo);
        group.position.set(radius * Math.cos(theta) * Math.sin(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(phi));
        group.lookAt(0, 0, 0);
        group.userData = { url: url, exp: item.exp, cleanName: item.cleanName.toLowerCase() }; 
        photoGroup.add(group);
      });
    });

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.5;
    const mouse = new THREE.Vector2();
    let dragStart = { x: 0, y: 0, time: 0 };

    const onPointerUp = (e: PointerEvent) => {
      console.debug('[debug] onPointerUp target=', (e.target as any)?.tagName, 'ignore=', ignorePointerRef.current);
      if (ignorePointerRef.current) return;
      try { if ((e.target as HTMLElement)?.closest && (e.target as HTMLElement).closest('button')) { console.debug('[debug] onPointerUp from button - ignoring'); return; } } catch {}
      isMouseDownRef.current = false;
      if (Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y) < 10 && (Date.now() - dragStart.time < 300)) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        if (showPhotosRef.current) {
          const photoIntersects = raycaster.intersectObjects(photoGroup.children, true);
          if (photoIntersects.length > 0) {
            let obj = photoIntersects[0].object;
            while(obj.parent && !obj.userData.url) obj = obj.parent;
            
            const mat = (photoIntersects[0].object as THREE.Mesh).material as THREE.MeshBasicMaterial;
            if(mat.opacity > 0.2) {
              handlePhotoClick(obj.userData.url);
            }
            return;
          }
        }
        
        const markerIntersects = raycaster.intersectObjects(routeGroup.children, true);
        const validMarker = markerIntersects.find(hit => hit.object.userData.isMarker && hit.object.userData.expId === activeExpeditionRef.current);
        
        if (validMarker) {
           const vector = validMarker.object.getWorldPosition(new THREE.Vector3()).project(camera);
           setMarkerInfo({
             title: validMarker.object.userData.label,
             date: validMarker.object.userData.date,
             note: validMarker.object.userData.note,
             pos: {
               x: (vector.x * 0.5 + 0.5) * window.innerWidth,
               y: (-(vector.y * 0.5) + 0.5) * window.innerHeight
             }
           });
        } else {
          setMarkerInfo(null);
        }
      }
    };

    const canvas = renderer.domElement;
    const handleCanvasPointerDown = (e: PointerEvent) => {
      console.debug('[debug] canvas pointerdown target=', (e.target as any)?.tagName, 'ignore=', ignorePointerRef.current);
      try { if ((e.target as HTMLElement)?.closest && (e.target as HTMLElement).closest('button')) { console.debug('[debug] pointerdown from button - ignoring'); return; } } catch {}
      if (ignorePointerRef.current) return;
      isMouseDownRef.current = true;
      isAutoRotating.current = false;
      dragStart = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const handleCanvasPointerMove = (e: PointerEvent) => {
      try { if ((e.target as HTMLElement)?.closest && (e.target as HTMLElement).closest('button')) return; } catch {}
      if (ignorePointerRef.current) return;
      if (isMouseDownRef.current) {
        masterGroup.rotation.y += e.movementX * 0.005;
        masterGroup.rotation.x += e.movementY * 0.005;
        setMarkerInfo(null);
      }
    };

    canvas.addEventListener('pointerdown', handleCanvasPointerDown as any);
    canvas.addEventListener('pointerup', onPointerUp as any);
    canvas.addEventListener('pointermove', handleCanvasPointerMove as any);

    const animate = () => {
      requestAnimationFrame(animate);
      const isSelected = slotsRef.current.some(s => s !== null);
      const currentExp = activeExpeditionRef.current;
      const currentShowPhotos = showPhotosRef.current;
      const query = searchQueryRef.current.toLowerCase();
      const time = Date.now() * 0.001;

      if (currentExp && !isMouseDownRef.current && isAutoRotating.current) {
        const routeData = routesData.find(r => r.id === currentExp);
        if (routeData) {
          const targetX = (routeData.center.lat) * (Math.PI / 180);
          const targetY = (-routeData.center.lon) * (Math.PI / 180);
          const rotationEase = currentShowPhotos ? 0.05 : 0.12;
          masterGroup.rotation.x += (targetX - masterGroup.rotation.x) * rotationEase;
          masterGroup.rotation.y += (targetY - masterGroup.rotation.y) * rotationEase;
        }
      }

      const scaleValue = currentShowPhotos ? 1 : 1.6;
      targetScale.set(scaleValue, scaleValue, scaleValue);
      masterGroup.scale.lerp(targetScale, currentShowPhotos ? 0.08 : 0.28);

      photoGroup.rotation.y += isSelected ? 0.0002 : 0.0015;
      
      photoGroup.children.forEach((group) => {
        const localY = new THREE.Vector3(0, 1, 0);
        localY.applyQuaternion(group.quaternion);
        localY.applyQuaternion(masterGroup.quaternion);
        if (localY.y < 0) group.children[0].rotation.z = Math.PI; else group.children[0].rotation.z = 0;
        const mat = (group.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        
        let targetPhotoOp = 0;
        if (currentShowPhotos) {
          const matchesExpedition = currentExp ? group.userData.exp === currentExp : true;
          const matchesQuery = query === "" ? true : group.userData.cleanName.includes(query);
          
          targetPhotoOp = (matchesExpedition && matchesQuery) ? 1.0 : 0.05;
        }
        
        mat.opacity += (targetPhotoOp - mat.opacity) * 0.1;
      });

      routeGroup.children.forEach((container) => {
        const isSelectedRoute = container.userData.id === currentExp;
        
        container.children.forEach((child) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          let targetOp = isSelectedRoute ? 0.9 : (currentExp === null ? 0.2 : 0.05);
          
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
             if (isSelectedRoute) {
               targetOp = 0.7 + Math.sin(time * 5) * 0.3; // Motion study pulsar animatie
             }
          }
          
          if (mat) mat.opacity += (targetOp - mat.opacity) * 0.1;
        });
      });

      renderer.render(scene, camera);
    };
    animate();
    return () => { 
      try {
        const c = renderer.domElement;
        c.removeEventListener('pointerdown', handleCanvasPointerDown as any);
        c.removeEventListener('pointerup', onPointerUp as any);
        c.removeEventListener('pointermove', handleCanvasPointerMove as any);
      } catch {}
      renderer.dispose(); 
    };
  }, []);

  const handlePhotoClick = (url: string) => {
    setSlots(prev => {
      if (prev.includes(url)) {
        setSelectedPhotoUrl(url === selectedPhotoUrl ? null : url);
        return prev;
      }
      const newSlots = [...prev];
      const emptyIndex = newSlots.findIndex(s => s === null);
      if (emptyIndex !== -1) {
        newSlots[emptyIndex] = url;
      } else {
        newSlots[lastReplacedIndex] = url;
        setLastReplacedIndex((lastReplacedIndex + 1) % 6);
      }
      return newSlots;
    });
  };

  const handleExpeditionSelect = (id: string) => {
    setActiveExpedition(id);
    setSelectedPhotoUrl(null);
    setNotification("Sleep je vinger over de wereldbol en ontdek de foto's van deze expeditie");
    setTimeout(() => setNotification(null), 10000);
  };

  const closeSlot = (index: number) => {
    console.debug('[debug] closeSlot called', index, 'currentActiveExpedition=', activeExpedition);
    const urlToRemove = slots[index];
    if (urlToRemove === selectedPhotoUrl) setSelectedPhotoUrl(null);
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = null;
      return newSlots;
    });
  };

  const getDescription = (url: string | null) => {
    if (!url) return "";
    const fileName = url.split('/').pop() || "";
    const foundItem = rawImageData.find(item => item.file === fileName);
    const cleanName = foundItem ? foundItem.cleanName : "";
    return imageDescriptions[cleanName] || "Loresum notitia deest.";
  };

  const filteredPhotos = alphabetizedImageData.filter(item => 
    item.cleanName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedYearFilter === 'all' || item.exp === selectedYearFilter) &&
    (selectedCategoryFilter === 'all' || getPhotoCategory(item.cleanName) === selectedCategoryFilter)
  );

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, overflow: 'hidden', background: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        body, html { margin: 0; padding: 0; overflow: hidden; height: 100%; }
        @keyframes softFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .floating-slot { animation: softFloat 6s ease-in-out infinite; }
        
        .info-bubble, .marker-popup {
          position: absolute;
          background: rgba(0,0,0,0.85);
          color: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: opacity 0.3s;
          z-index: 2000;
        }

        .info-bubble {
          font-size: 11px;
          width: 200px;
          pointer-events: none;
        }

        .marker-popup {
          font-size: 12px;
          font-weight: bold;
          pointer-events: none;
          transform: translate(-50%, -100%);
          margin-top: -20px;
          white-space: normal;
          width: 240px;
          animation: popupFadeIn 0.2s ease-out;
        }

        @keyframes popupFadeIn {
          from { opacity: 0; transform: translate(-50%, -80%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }

        @keyframes pointPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
          50% { transform: scale(1.18); filter: drop-shadow(0 0 6px rgba(0,0,0,0.45)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
        }

        .nav-button {
          padding: 15px 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #000;
          transition: all 0.2s ease-in-out;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          color: #000;
        }
        .nav-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .nav-button:disabled {
          cursor: not-allowed;
          opacity: 0.3;
          border-color: #ccc;
        }
        .expedition-toast {
          position: absolute;
          bottom: 160px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          color: white;
          padding: 12px 25px;
          border-radius: 50px;
          font-size: 13px;
          z-index: 3000;
          pointer-events: none;
          animation: fadeInOut 10s forwards;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          5% { opacity: 1; transform: translate(-50%, 0); }
          95% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }

        .photo-grid-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px;
          border: 1px solid #eee;
          cursor: pointer;
          transition: background 0.2s;
        }
        .photo-grid-item:hover {
          background: #f5f5f5;
          border-color: #000;
        }

        .search-bar-container {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5000;
          display: flex;
          align-items: center;
          border: 1px solid #000;
          background: #fff;
          width: 380px;
          padding: 12px 18px;
          box-sizing: border-box;
        }
        .search-bar-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: Arial, sans-serif;
        }
      `}</style>

      {notification && <div className="expedition-toast">{notification}</div>}
      
      {markerInfo && (
        <div className="marker-popup" style={{ left: markerInfo.pos.x, top: markerInfo.pos.y }}>
          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{markerInfo.title}</div>
          <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '6px' }}>{markerInfo.date}</div>
          <div style={{ fontSize: '11px', fontWeight: 500, lineHeight: '1.4' }}>{markerInfo.note}</div>
        </div>
      )}

      {/* --- MINIMALISTISCHE ZOEKBALK BOVENAAN --- */}
      <div className="search-bar-container">
        <span style={{ marginRight: '12px', fontSize: '16px' }}>🔍</span>
        <input 
          type="text" 
          className="search-bar-input"
          placeholder="ZOEK / FILTER DATA..." 
          value={searchQuery}
          onFocus={() => setShowFilterTab(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!showFilterTab) setShowFilterTab(true);
          }}
        />
        {showFilterTab && (
          <button 
            onClick={() => { setShowFilterTab(false); setSearchQuery(""); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginLeft: '10px' }}
            title="Sluit database"
          >
            ✕
          </button>
        )}
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' }} />
      
      <div style={{ position: 'absolute', left: '80px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '30px', zIndex: 1500, alignItems: 'flex-start' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={slots[i] ? "floating-slot" : ""} style={{ width: 'auto', height: '20vh', position: 'relative', animationDelay: `${i * 0.8}s` }}>
            {slots[i] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div onClick={() => handlePhotoClick(slots[i]!)} style={{ position: 'relative', transform: `rotate(${randomStyles[i].rotate})`, cursor: 'pointer', border: selectedPhotoUrl === slots[i] ? '2px solid black' : 'none' }}>
                  <img src={slots[i]!} alt="selected" style={{ height: '20vh', width: 'auto', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }} />
                  <button onPointerDown={(e) => { console.debug('[debug] close-btn onPointerDown', i); e.stopPropagation(); ignorePointerRef.current = true; try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} }} onPointerUp={(e) => { console.debug('[debug] close-btn onPointerUp', i); e.stopPropagation(); try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} closeSlot(i); setTimeout(() => { ignorePointerRef.current = false; }, 0); }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); isMouseDownRef.current = false; ignorePointerRef.current = false; closeSlot(i); }} style={{ position: 'absolute', top: '-10px', left: '-10px', width: '22px', height: '22px', background: 'black', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                </div>
                {selectedPhotoUrl === slots[i] && <div className="info-bubble" style={{ position: 'relative' }}>{getDescription(slots[i])}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', right: '80px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '30px', zIndex: 1500, alignItems: 'flex-end' }}>
        <div className={slots[3] ? "floating-slot" : ""} style={{ width: 'auto', height: '20vh', position: 'relative', animationDelay: '2.4s' }}>
          {slots[3] && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
               {selectedPhotoUrl === slots[3] && <div className="info-bubble" style={{ position: 'relative' }}>{getDescription(slots[3])}</div>}
               <div onClick={() => handlePhotoClick(slots[3]!)} style={{ position: 'relative', transform: `rotate(${randomStyles[3].rotate})`, cursor: 'pointer', border: selectedPhotoUrl === slots[3] ? '2px solid black' : 'none' }}>
                <img src={slots[3]!} alt="selected" style={{ height: '20vh', width: 'auto', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }} />
                <button onPointerDown={(e) => { console.debug('[debug] close-btn onPointerDown 3'); e.stopPropagation(); ignorePointerRef.current = true; try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} }} onPointerUp={(e) => { console.debug('[debug] close-btn onPointerUp 3'); e.stopPropagation(); try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} closeSlot(3); setTimeout(() => { ignorePointerRef.current = false; }, 0); }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); isMouseDownRef.current = false; ignorePointerRef.current = false; closeSlot(3); }} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '22px', height: '22px', background: 'black', color: 'white', border: 'none', borderRadius: '50%' }}>✕</button>
              </div>
            </div>
          )}
        </div>

        {/* --- DATAPANEL (RECHTS) --- */}
        {activeExpedition && expeditionInfo[activeExpedition] && (
          <div style={{ width: '380px', padding: '28px 24px', backgroundColor: 'rgba(255, 255, 255, 0.98)', borderLeft: '4px solid #000', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>{expeditionInfo[activeExpedition].title}</h2>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#444', textTransform: 'uppercase', fontWeight: '700' }}>{expeditionInfo[activeExpedition].subtitle}</h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', lineHeight: '1.7', color: '#222' }}>{expeditionInfo[activeExpedition].text}</p>
            {expeditionCrew[activeExpedition] && (
              <div style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#333' }}>
                <strong style={{ fontSize: '11px', textTransform: 'uppercase', marginRight: '6px', color: '#6b7280' }}>Crew:</strong>
                <span style={{ fontSize: '12px', color: '#111' }}>{expeditionCrew[activeExpedition].slice(0,6).join(', ')}{expeditionCrew[activeExpedition].length > 6 ? '…' : ''}</span>
              </div>
            )}
            
            <button
              onClick={() => setShowDetailPopup(true)}
              style={{ background: 'transparent', border: '1px solid #000', padding: '10px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', width: '100%', letterSpacing: '0.6px', transition: 'all 0.2s' }}
            >
              Temperatuurverloop →
            </button>

            <button
              onClick={() => {
                // open timeline modal and default filter to the currently selected expedition
                setTimelineFilter(activeExpedition ? (activeExpedition as '1897'|'1957'|'1997') : 'all');
                setShowTimelinePopup(true);
                setNotification('Tijdlijn geopend');
                setTimeout(() => setNotification(null), 4000);
                setTimeout(() => {
                  try {
                    const el = document.getElementById('chronotimeline');
                    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } catch (e) {}
                }, 120);
              }}
              style={{ background: 'transparent', border: '1px solid #000', padding: '10px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', width: '100%', letterSpacing: '0.6px', marginTop: '10px' }}
            >
              Tijdlijn →
            </button>

            {/* Compact infographic removed from datapanel; available via "Temperatuurverloop" */}
          </div>
        )}

        {[4, 5].map((i) => (
          <div key={i} className={slots[i] ? "floating-slot" : ""} style={{ width: 'auto', height: '20vh', position: 'relative', animationDelay: `${i * 0.8}s` }}>
            {slots[i] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {selectedPhotoUrl === slots[i] && <div className="info-bubble" style={{ position: 'relative' }}>{getDescription(slots[i])}</div>}
                <div onClick={() => handlePhotoClick(slots[i]!)} style={{ position: 'relative', transform: `rotate(${randomStyles[i].rotate})`, cursor: 'pointer', border: selectedPhotoUrl === slots[i] ? '2px solid black' : 'none' }}>
                  <img src={slots[i]!} alt="selected" style={{ height: '20vh', width: 'auto', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }} />
                  <button onPointerDown={(e) => { console.debug('[debug] close-btn onPointerDown', i); e.stopPropagation(); ignorePointerRef.current = true; try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} }} onPointerUp={(e) => { console.debug('[debug] close-btn onPointerUp', i); e.stopPropagation(); try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} closeSlot(i); setTimeout(() => { ignorePointerRef.current = false; }, 0); }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); isMouseDownRef.current = false; ignorePointerRef.current = false; closeSlot(i); }} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '22px', height: '22px', background: 'black', color: 'white', border: 'none', borderRadius: '50%' }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- CHRONOLOGISCHE INTERACTIEVE TIJDLIJN (ASLIJN-LOOK) --- */}
      <div id="chronotimeline" style={{ 
        position: 'absolute', 
        bottom: '80px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        display: 'flex', 
        gap: '30px', 
        zIndex: 1000,
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(255,255,255,0.95)',
        border: 'none',
        boxShadow: 'none'
      }}>
        
        {/* De doorlopende tijdlijn-aslijn (UI element) */}
        <div style={{ 
          position: 'absolute', 
          left: '40px', 
          right: '160px', 
          height: '2px', 
          background: '#000', 
          zIndex: 1
        }} />

        {/* Tijdsnodes */}
        <div style={{ display: 'flex', gap: '40px', zIndex: 2 }}>
          {expeditions.map((exp) => (
            <div key={exp.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <button 
                className="nav-button" 
                onClick={() => handleExpeditionSelect(exp.id)} 
                style={{ 
                  background: activeExpedition === exp.id ? '#000' : '#fff', 
                  color: activeExpedition === exp.id ? '#fff' : '#000',
                  borderRadius: '0px', 
                  padding: '10px 20px',
                  fontSize: '12px'
                }}
              >
                {exp.label}
              </button>
              
              {/* verbindend streepje verwijderd per verzoek */}
            </div>
          ))}
        </div>
        
        {/* Systeemknoppen voorzien van strakke inline SVG Icons */}
        <div style={{ display: 'flex', gap: '15px', zIndex: 2, marginLeft: '20px', borderLeft: '1px solid #000', paddingLeft: '20px' }}>
          <button 
            className="nav-button" 
            disabled={!activeExpedition}
            onClick={() => {
              if (showPhotos) {
                // user is hiding photos: stop rotation, clear markers and clear opened slots
                isAutoRotating.current = true;
                setMarkerInfo(null);
                setSlots(new Array(6).fill(null));
                setSelectedPhotoUrl(null);
              }
              setShowPhotos(prev => !prev);
            }} 
            style={{ background: showPhotos ? 'rgba(255, 255, 255, 0.9)' : '#000', color: showPhotos ? '#000' : '#fff', width: '50px', padding: '10px' }}
            title={showPhotos ? "Verberg foto's" : "Toon foto's"}
          >
            {showPhotos ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>

          <button
            className="nav-button"
            onPointerDown={(e) => { e.stopPropagation(); ignorePointerRef.current = true; try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} }}
            onPointerUp={(e) => { e.stopPropagation(); try { (e.nativeEvent as any)?.stopImmediatePropagation(); } catch {} setActiveExpedition(null); setSelectedPhotoUrl(null); setShowPhotos(true); setTimeout(() => { ignorePointerRef.current = false; }, 0); }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); isMouseDownRef.current = false; ignorePointerRef.current = false; setActiveExpedition(null); setSelectedPhotoUrl(null); setShowPhotos(true); }}
            style={{ background: activeExpedition === null ? '#000' : 'rgba(255, 255, 255, 0.9)', color: activeExpedition === null ? '#fff' : '#000', width: '50px', padding: '10px' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* --- GROOT FILTER TABBLAD (ALFABETISCH + LIVE ZOEKBAAR) --- */}
      {showFilterTab && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.98)', zIndex: 4000, display: 'flex', flexDirection: 'column', padding: '120px 80px 60px 80px', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Media Database (Alfabetisch)</h2>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>KLIK OP EEN NAAM OM HIERONDER IN EEN SLOT TE ZETTEN</span>
          </div>

          <div style={{ flex: 1, display: 'flex', gap: '24px', minHeight: 0 }}>
            <aside style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #ddd', paddingRight: '18px', overflowY: 'auto' }}>
              <div style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.98)', paddingBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Filter op jaar</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                  {yearFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedYearFilter(option.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #000',
                        background: selectedYearFilter === option.value ? '#000' : '#fff',
                        color: selectedYearFilter === option.value ? '#fff' : '#000',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Filter op type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                  {photoCategoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedCategoryFilter(option.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #000',
                        background: selectedCategoryFilter === option.value ? '#000' : '#fff',
                        color: selectedCategoryFilter === option.value ? '#fff' : '#000',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedYearFilter('all');
                    setSelectedCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #000',
                    background: '#f5f5f5',
                    color: '#000',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Reset filters
                </button>
              </div>
            </aside>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', paddingBottom: '40px' }}>
              {filteredPhotos.length > 0 ? (
                filteredPhotos.map((item, index) => {
                  const url = `/Belgica_Antarctica/${item.file}`;
                  return (
                    <div 
                      key={index} 
                      className="photo-grid-item"
                      onClick={() => {
                        handlePhotoClick(url);
                        setShowFilterTab(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={url} alt={item.cleanName} style={{ width: activeExpedition === '1957' ? '80px' : '60px', height: activeExpedition === '1957' ? '80px' : '60px', objectFit: 'cover', border: '1px solid #000' }} />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.cleanName}</div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginTop: '2px' }}>Expeditie: {item.exp}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', fontSize: '14px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Geen media gevonden voor deze zoekopdracht.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- VERDIEPENDE DETAILWEERGAVE (RIJKE HISTORISCHE INHOUD) --- */}
      {showDetailPopup && activeExpedition && expeditionInfo[activeExpedition] && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(1px)' }}>
              <div style={{ background: 'white', padding: '12px', border: '2px solid #000', width: '95vw', maxWidth: '1200px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', boxSizing: 'border-box', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                      <h2 style={{ margin: 0, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, lineHeight: '1.15' }}>{expeditionInfo[activeExpedition].title}</h2>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.6px' }}>{expeditionInfo[activeExpedition].subtitle}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="nav-button" onClick={() => setShowDetailPopup(false)} style={{ background: '#000', color: '#fff', padding: '8px 12px', fontSize: '18px', lineHeight: '1' }} aria-label="Sluit detailweergave">×</button>
                  </div>
                </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'center' }}>
                      <div style={{ width: '100%', maxWidth: 'calc(95vw - 48px)', margin: '0 auto', background: '#f3f4f6', border: '1px solid #d1d5db', padding: '28px 30px', borderRadius: '2px', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#6b7280', marginBottom: '8px' }}>Weerdata per expeditie</div>
                        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#111827', fontWeight: 600 }}>{expeditionInfo[activeExpedition].weatherSummary}</div>
                        {expeditionInfo[activeExpedition].weatherBullets.length > 0 && (
                          <ul style={{ margin: '10px 0 0 20px', padding: 0, color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                            {expeditionInfo[activeExpedition].weatherBullets.map((bullet) => (
                              <li key={bullet} style={{ marginBottom: '6px' }}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div style={{ width: '100%', maxWidth: 'calc(95vw - 48px)', margin: '0 auto', padding: '0 12px' }}>
                        <InteractiveTemperatureChart pointData={expeditionInfo[activeExpedition].weatherPoints} />
                      </div>
                    </div>
              </div>
        </div>
      )}

      {/* --- LEGE TIJDLIJN-TAB (WIT, ZELFDE STIJL ALS DETAIL) --- */}
      {showTimelinePopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(1px)' }}>
          <div style={{ background: 'white', padding: '12px', border: '2px solid #000', width: '95vw', maxWidth: '1200px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', boxSizing: 'border-box', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                  <h2 style={{ margin: 0, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, lineHeight: '1.15' }}>Tijdlijn</h2>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.6px' }}>Chronologische weergave</h4>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="nav-button" onClick={() => setShowTimelinePopup(false)} style={{ background: '#000', color: '#fff', padding: '8px 12px', fontSize: '18px', lineHeight: '1' }} aria-label="Sluit tijdlijn">×</button>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', minHeight: '240px' }}>
              <div style={{ width: '100%', maxWidth: 'calc(95vw - 40px)', margin: '0 auto', background: '#fff', border: '1px solid #e5e7eb', padding: '28px', borderRadius: '6px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                    {timelineFilter === 'all' ? (
                      <>
                        <button onClick={() => setTimelineFilter('all')} style={{ padding: '8px 12px', border: '2px solid #000', background: '#000', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Alle expedities</button>
                        <button onClick={() => setTimelineFilter('1897')} style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', color: '#000', cursor: 'pointer', fontWeight: 700 }}>{expeditionInfo['1897'].title}</button>
                        <button onClick={() => setTimelineFilter('1957')} style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', color: '#000', cursor: 'pointer', fontWeight: 700 }}>{expeditionInfo['1957'].title}</button>
                        <button onClick={() => setTimelineFilter('1997')} style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', color: '#000', cursor: 'pointer', fontWeight: 700 }}>{expeditionInfo['1997'].title}</button>
                      </>
                    ) : (
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#111' }}>
                        {timelineFilter === '1897' ? expeditionInfo['1897'].title : timelineFilter === '1957' ? expeditionInfo['1957'].title : expeditionInfo['1997'].title}
                      </div>
                    )}
                  </div>

                  <div style={{ maxHeight: '58vh', overflowY: 'auto', paddingRight: '6px' }}>
                    {timelineEvents.filter(ev => timelineFilter === 'all' ? true : ev.exp === timelineFilter).map(ev => (
                      <div key={ev.id} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
                        <div style={{ width: '110px', fontSize: '13px', color: '#6b7280', fontWeight: 700 }}>{ev.date}</div>
                        <div style={{ flex: 1, background: '#f3f4f6', border: '1px solid #d1d5db', padding: '16px 18px', borderRadius: '2px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#111' }}>{ev.title}</div>
                          <div style={{ fontSize: '13px', color: '#374151', marginTop: '6px' }}>{ev.desc}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>{ev.exp === '1897' ? 'Belgica (1897–1899)' : ev.exp === '1957' ? 'De Koning Boudewijnbasis (1957–1961)' : 'Hubert & Dansercoer (1997–1998)'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Interactieve grafiek component (in file) --- */}
    </main>
  );
}

function InteractiveTemperatureChart({ dataProp, pointData, compact }: { dataProp?: number[]; pointData?: WeatherPoint[]; compact?: boolean } = {}) {
  const defaultData = [15,12,8,4,-2,-8,-14,-20,-28,-30,-33,-35,-33,-30,-28,-25,-22,-18,-14,-10,-6,0,5,8,10,12,14,15,14];
  const isCustomSeries = Boolean(pointData?.length);
  const data = pointData?.map(point => point.value) ?? dataProp ?? defaultData;
  const labels = pointData?.map(point => point.dateLabel) ?? (() => {
    const months = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
    const labels: string[] = [];
    let y = 1897, m = 7; // start in aug 1897
    for (let i = 0; i < data.length; i++) {
      m += 1;
      if (m > 11) { m = 0; y += 1; }
      const month = months[m];
      labels.push(`${month} ${y}`);
    }
    return labels;
  })();

  const criticalMap: Record<number, { title: string; text: string }> = {
    0: { title: 'Vertrek Antwerpen', text: 'Vertrek uit Antwerpen; de expeditie begint aan haar lange reis naar het zuiden.' },
    5: { title: 'Storm — Wiencke verdronken', text: 'Zware storm; Carl Wiencke valt overboord en verdronk tijdens de expeditie.' },
    7: { title: 'Vastgevroren in het ijs', text: 'De Belgica raakt vast in het pakijs en overwintert gedwongen in Antarctica.' },
    10: { title: 'Emile Danco sterft', text: 'Emile Danco overlijdt aan de gevolgen van de barre omstandigheden aan boord.' },
    18: { title: 'Bevrijding uit het ijs', text: 'De bemanning ervaart uiteindelijk moment van bevrijding wanneer het schip loskomt.' },
    28: { title: 'Aankomst Antwerpen', text: 'Terugkeer naar Antwerpen; de expeditie eindigt en de bemanning keert huiswaarts.' }
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [selectedCritical, setSelectedCritical] = useState<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{x:number,y:number,text:string} | null>(null);

  useEffect(() => {
    setSelectedCritical(null);
    setHoverInfo(null);
  }, [pointData]);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;
    const length = (path.getTotalLength && path.getTotalLength()) || 0;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);

    const duration = 2000;
    const start = performance.now();

    const easeInOutQuart = (t: number) => t < 0.5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2,4)/2;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeInOutQuart(t);
      path.style.strokeDashoffset = String(Math.max(0, length * (1 - eased)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // compute coordinates (adjust when compact)
  const padding = compact ? 20 : 34;
  const width = compact ? 780 : 1020; // viewBox width
  const height = compact ? 180 : 300; // viewBox height
  const innerW = width - padding*2;
  const innerH = height - padding*2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const points = data.map((v,i) => {
    const x = data.length === 1 ? padding + innerW / 2 : padding + (i/(data.length-1)) * innerW;
    const y = padding + ((max - v)/range) * innerH;
    return { x, y, v, i };
  });

  const lineD = points.map((p, idx) => `${idx===0?'M':'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const areaD = `${lineD} L ${padding+innerW} ${padding+innerH} L ${padding} ${padding+innerH} Z`;
  const yTicks = Array.from(new Set([min, -20, -10, 0, 10, max])).sort((a, b) => b - a);
  const formatTemperature = (value: number) => Number.isInteger(value) ? `${value}°C` : `${value.toFixed(1)}°C`;
  const activePoint = selectedCritical !== null ? pointData?.[selectedCritical] : undefined;

  const handlePointHover = (e: any, p: {x:number,y:number,v:number,i:number}) => {
    const point = pointData?.[p.i];
    const name = point?.label ?? criticalMap[p.i]?.title;
    const dateLabel = point?.dateLabel ?? labels[p.i];
    setHoverInfo({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, text: `${dateLabel}${name ? ` — ${name}` : ''} — ${formatTemperature(p.v)}` });
  };

  const handlePointLeave = () => setHoverInfo(null);

  return (
    <div style={{ width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '100%', background: '#fff', padding: '18px 22px', borderRadius: '8px', color: '#111', margin: '0 auto', border: '1px solid #e5e7eb' }}>
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '300px', display: 'block' }}>
          <defs>
            <linearGradient id="gradFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8fc9ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#378ADD" stopOpacity="0.06" />
            </linearGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* axes grid */}
          <rect x="0" y="0" width={width} height={height} fill="none" />
          {/* Y grid lines */}
          {yTicks.map((val, idx) => {
            const y = padding + ((max - val)/(max - min)) * innerH;
            return (
              <g key={idx}>
                <line x1={padding} x2={padding+innerW} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                <text x={padding - 8} y={y + 4} fontSize={11} fill="#6b7280" textAnchor="end">{formatTemperature(val)}</text>
              </g>
            );
          })}

          <text x={padding} y={18} fontSize={12} fill="#374151" fontWeight={700}>Temperatuur (°C)</text>

          {/* area under curve */}
          <path d={areaD} fill="url(#gradFill)" opacity={0.9} />

          {/* animated line */}
          <path ref={pathRef} d={lineD} fill="none" stroke="#378ADD" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'none' }} />

          {/* points */}
          {points.map(p => {
            const customPoint = pointData?.[p.i];
            const isCritical = Boolean(customPoint) || criticalMap[p.i] !== undefined;
            const r = isCritical ? 7 : 3.5;
            const fill = isCritical ? '#fff' : '#fff';
            return (
              <g key={p.i} transform={`translate(${p.x}, ${p.y})`}>
                <circle cx={0} cy={0} r={r} fill={fill} stroke={isCritical? '#111' : '#378ADD'} strokeWidth={isCritical?2:1} style={{ cursor: 'pointer', animation: isCritical ? 'pointPulse 1.8s ease-in-out infinite' : undefined }}
                  onMouseMove={(e) => handlePointHover(e, p)} onMouseLeave={handlePointLeave}
                  onClick={(e) => { e.stopPropagation(); if (isCritical) setSelectedCritical(p.i); }} />
              </g>
            );
          })}

          {/* X labels - show every 3rd to keep readable */}
          {labels.map((m, idx) => {
            const p = points[idx];
            if (!p) return null;
            if (!isCustomSeries && idx % 3 !== 0 && idx !== labels.length-1) return null;
            const isLast = idx === labels.length - 1;
            const isSecondLast = idx === labels.length - 2;
            return (
              <text
                key={idx}
                x={p.x + (isSecondLast ? -8 : isLast ? 8 : 0)}
                y={padding+innerH+20}
                fontSize={11}
                fill="#374151"
                textAnchor={isSecondLast ? 'end' : isLast ? 'start' : 'middle'}
              >
                {m}
              </text>
            );
          })}

        </svg>
        {/* hover tooltip */}
        {hoverInfo && (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: hoverInfo.x + 12, top: hoverInfo.y - 8, background: 'rgba(17,24,39,0.92)', color: '#fff', padding: '6px 8px', borderRadius: '6px', pointerEvents: 'none', fontSize: '12px' }}>{hoverInfo.text}</div>
          </div>
        )}

        {/* critical info pane */}
        {selectedCritical !== null && (
          <div style={{ marginTop: '16px', background: '#f3f4f6', padding: '18px', borderRadius: '2px', color: '#111', display: 'flex', gap: '14px', alignItems: 'flex-start', border: '1px solid #d1d5db' }}>
            <div style={{ width: '12px', height: '12px', background: '#fff', border: '1px solid #111', borderRadius: '50%' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280' }}>{pointData ? 'Weerpunt' : 'Gebeurtenis'}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '2px' }}>{pointData ? activePoint?.label : criticalMap[selectedCritical].title}</div>
              {pointData && activePoint?.dateLabel && (
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', marginTop: '2px' }}>{activePoint.dateLabel}</div>
              )}
              <div style={{ fontSize: '13px', color: '#374151', marginTop: '6px', lineHeight: '1.45' }}>{pointData ? `${formatTemperature(activePoint?.value ?? 0)}${activePoint?.note ? ` · ${activePoint.note}` : ''}` : criticalMap[selectedCritical].text}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
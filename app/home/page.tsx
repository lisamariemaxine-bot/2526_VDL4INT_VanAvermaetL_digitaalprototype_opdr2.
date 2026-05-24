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
  { label: 'Groenland (1905)', id: '1905' },
  { label: 'Kara-zee (1907)', id: '1907' }
];

const expeditionCrew: Record<string, string[]> = {
  '1897': [
    'Adrien de Gerlache', 'Georges Lecointe', 'Roald Amundsen', 'Frederick A. Cook', 'Henryk Arctowski', 'Emil Racoviță', 'Émile Danco', 'Max Van Rysselberghe', 'Antoni B. Dobrowolski', 'Henri Somers', 'Carl August Wiencke', 'Johan Koren', 'Jan Van Mirlo', 'Louis Michotte', 'Adam Tollefsen', 'Ludvig-Hjalmar Johansen', 'Engebret Knudsen', 'Gustave-Gaston Dufour'
  ],
  '1905': [
    'Adrien de Gerlache', 'Georges Lecointe', 'Henryk Arctowski', 'Max Van Rysselberghe'
  ],
  '1907': [
    'Adrien de Gerlache', 'Georges Lecointe', 'Max Van Rysselberghe'
  ]
};

type RoutePoint = {
  lat: number;
  lon: number;
  label: string;
  date: string;
  note: string;
};

// Historisch interessante content voor progressive disclosure (Datapanel + Detail)
const expeditionInfo: Record<string, { title: string, subtitle: string, text: string, detailText: string, quote: string }> = {
  '1897': { 
    title: "Belgische Antarctische Expeditie (1897–1899)", 
    subtitle: "De Eerste Antarctische Overwintering",
    text: "De Belgica-expeditie van 1897-1899 was de eerste die bewust of onbewust een Antarctische winter doorbracht. Na vertrek uit Antwerpen op 16 augustus 1897 voer het schip via Madeira, Rio de Janeiro en Montevideo naar de Antarctische wateren, waar het op 28 februari 1898 vast kwam te zitten in het pakijs.",
    detailText: "WETENSCHAP EN OVERLEVEN:\nDe bemanning deed meteorologische, oceanografische en hydrografische metingen terwijl het schip vastzat in het ijs. Frederick Cook en Adrien de Gerlache stimuleerden de bemanning om vers pinguïn- en zeehondenvlees te eten om scheurbuik te beperken. Henryk Arctowski en Emil Racoviță verrichtten waardevolle waarnemingen over weer, zeeleven en het poolmilieu, en Roald Amundsen deed ervaring op die later belangrijk werd in zijn eigen poolcarrière.",
    quote: "\"We are imprisoned in an endless sea of ice. Time weighs heavily upon us as the darkness slowly advances.\" — Frederick Cook, 1898."
  },
  '1905': { 
    title: "Iter Boreale Occidentis", 
    subtitle: "Onderzoek in de Groenlandzee",
    text: "In 1905 voer de Belgica opnieuw uit voor een noordelijke wetenschappelijke reis. De expeditie onderzocht de Groenlandzee en de omgeving van Spitsbergen, met aandacht voor stromingen, ijscondities en diepzee-omstandigheden.",
    detailText: "WETENSCHAPPELIJKE CONTEXT:\nDe reis maakte deel uit van de latere onderzoeksfase van de Belgica en van Adrien de Gerlache. Zulke noordelijke expedities leverden gegevens op over zee-ijs, temperatuur, stromingen en de geografische structuur van het Arctische gebied, en bouwden voort op de ervaring die de bemanning in Antarctica had opgedaan.",
    quote: "\"De metingen in deze koude zeeën zijn geen luxe, maar de basis voor begrip van het poolklimaat.\""
  },
  '1907': { 
    title: "Mares Karae Mappatio", 
    subtitle: "Hydrografie in de Kara-zee",
    text: "De Belgica-expeditie van 1907 richtte zich op de Barentszzee en de Kara-zee. Het team onderzocht kustlijnen, stromingen en vaarwegen ten noorden van Siberië onder moeilijke ijs- en weersomstandigheden.",
    detailText: "HYDROGRAFISCHE RESULTATEN:\nDe expeditie bracht onbekende of slecht beschreven delen van de Arctische kust in kaart. Die informatie was waardevol voor latere navigatie en voor de verdere wetenschappelijke verkenning van het hoge noorden.",
    quote: "\"Elke meting in dit gebied helpt een leegte op de kaart te vullen.\""
  },
  'modern': { 
    title: "Scientia Contemporanea", 
    subtitle: "De erfenis van de Belgica",
    text: "De Belgica-expedities gelden vandaag als belangrijke vroege bijdragen aan poolonderzoek. Hun waarnemingen over ijs, weer, zee en biodiversiteit vormen een historisch referentiepunt voor moderne klimaat- en oceaanstudies.",
    detailText: "INTERNATIONALE ERFENIS:\nDe combinatie van wetenschappelijke nieuwsgierigheid, internationale bemanning en overlevingsvermogen maakte de Belgica tot een mijlpaal in de Heroic Age of Antarctic Exploration. De reis liet zien hoe essentieel systematische metingen zijn voor het begrijpen van het poolklimaat.",
    quote: "\"De Belgica toonde dat wetenschap in extreme omstandigheden nog altijd vooruitgang kan boeken.\""
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
  { cleanName: "De Belgica In Oostende", file: "8995_de-belgica-in-oostende-in-1905.jpg", exp: "1905" },
  { cleanName: "Postkaart Belgica", file: "9397_postkaart-getiteld-qyacht-belgica-du-duc-dorleans-et-la-gareq-de-kaart-is-afkomstig-uit-de-collectie-van-omer-vilain.jpg", exp: "1905" },
  { cleanName: "Herinneringskaart", file: "9398_herinneringskaart.jpg", exp: "1905" },
  { cleanName: "Isfjord", file: "5322_isfjord.jpg", exp: "1905" },
  { cleanName: "Lecointe Kaart Een", file: "32321_lecointe-1903-kaart-1.jpg", exp: "1907" },
  { cleanName: "Lecointe Kaart Twee", file: "32322_lecointe-1903-kaart-2.jpg", exp: "1907" },
  { cleanName: "Lecointe Kaart Drie", file: "32323_lecointe-1903-kaart-3.jpg", exp: "1907" },
  { cleanName: "Lecointe Kaart Vier", file: "32324_lecointe-1903-kaart-4.jpg", exp: "1907" },
  { cleanName: "Lecointe Kaart Vijf", file: "32325_lecointe-1903-kaart-5.jpg", exp: "1907" },
  { cleanName: "Lecointe Kaart Zes", file: "32326_lecointe-1903-kaart-6.jpg", exp: "1907" },
  { cleanName: "Lecointe Kaart Zeven", file: "32327_lecointe-1903-kaart-7.jpg", exp: "1907" },
  { cleanName: "Arctowski En Thoulet Figuur Twee", file: "32666_arctowski-en-thoulet-1901-fig-2.jpg", exp: "1907" },
  { cleanName: "Arctowski En Thoulet Figuur Zes", file: "32670_arctowski-en-thoulet-1901-fig-6.jpg", exp: "1907" },
  { cleanName: "Scheepsplan", file: "5603_scheepsplan.jpg", exp: "1907" },
  { cleanName: "Successor", file: "babcb16a-1a1f-11ed-b07d-02b7b76bf47f.jpg.webp", exp: "modern" }
];

const alphabetizedImageData = [...rawImageData].sort((a, b) => a.cleanName.localeCompare(b.cleanName));

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
  const [showDetailPopup, setShowDetailPopup] = useState(false);

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
      { id: '1905', center: { lat: 72, lon: 0 }, points: [
          {lat: 51.23, lon: 2.92, label: "Oostende", date: "1905", note: "De Belgica werd opnieuw ingezet voor een noordelijke wetenschappelijke expeditie."}, 
          {lat: 60.39, lon: 5.32, label: "Bergen", date: "1905", note: "De route liep langs de Noorse kust richting Arctische wateren."}, 
          {lat: 78.22, lon: 15.62, label: "Spitsbergen", date: "1905", note: "Spitsbergen vormde een belangrijk gebied voor ijs- en klimaatobservaties."}, 
          {lat: 75.0, lon: -18.0, label: "Groenland Zee", date: "1905", note: "Hier verrichtte de expeditie metingen aan zee, ijs en stroming."}
      ] },
      { id: '1907', center: { lat: 68, lon: 40 }, points: [
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

      const scaleValue = currentShowPhotos ? 1 : 1.14;
      targetScale.set(scaleValue, scaleValue, scaleValue);
      masterGroup.scale.lerp(targetScale, currentShowPhotos ? 0.08 : 0.12);

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
    setShowPhotos(true);
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
    item.cleanName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div style={{ width: '350px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.98)', borderLeft: '4px solid #000', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{expeditionInfo[activeExpedition].title}</h2>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>{expeditionInfo[activeExpedition].subtitle}</h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '1.6', color: '#222' }}>{expeditionInfo[activeExpedition].text}</p>
            {expeditionCrew[activeExpedition] && (
              <div style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#333' }}>
                <strong style={{ fontSize: '11px', textTransform: 'uppercase', marginRight: '6px' }}>Crew:</strong>
                <span style={{ fontSize: '12px' }}>{expeditionCrew[activeExpedition].slice(0,6).join(', ')}{expeditionCrew[activeExpedition].length > 6 ? '…' : ''}</span>
              </div>
            )}
            
            <button 
              onClick={() => setShowDetailPopup(true)}
              style={{ background: 'transparent', border: '1px solid #000', padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', width: '100%', letterSpacing: '0.5px', transition: 'all 0.2s' }}
            >
              Bekijk Verdiepende Details →
            </button>
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
      <div style={{ 
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
              
              {/* Verbindend verticaal streepje */}
              <div style={{ 
                width: '2px', 
                height: '8px', 
                background: '#000', 
                marginTop: '2px' 
              }} />
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
                isAutoRotating.current = true;
                setMarkerInfo(null);
              }
              setShowPhotos(!showPhotos);
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
                    <img src={url} alt={item.cleanName} style={{ width: activeExpedition === '1905' ? '80px' : '60px', height: activeExpedition === '1905' ? '80px' : '60px', objectFit: 'cover', border: '1px solid #000' }} />
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
      )}

      {/* --- VERDIEPENDE DETAILWEERGAVE (RIJKE HISTORISCHE INHOUD) --- */}
      {showDetailPopup && activeExpedition && expeditionInfo[activeExpedition] && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(1px)' }}>
          <div style={{ background: 'white', padding: '40px', border: '2px solid #000', maxWidth: '550px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{expeditionInfo[activeExpedition].title}</h2>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{expeditionInfo[activeExpedition].subtitle}</h4>
            
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#111', margin: '0 0 25px 0', whiteSpace: 'pre-line' }}>
              {expeditionInfo[activeExpedition].detailText}
            </p>

            <blockquote style={{ margin: '0 0 30px 0', paddingLeft: '15px', borderLeft: '3px solid #000', fontStyle: 'italic', fontSize: '13px', color: '#444', lineHeight: '1.5' }}>
              {expeditionInfo[activeExpedition].quote}
            </blockquote>

            <button 
              className="nav-button" 
              onClick={() => setShowDetailPopup(false)}
              style={{ width: '100%', background: '#000', color: '#fff', fontSize: '13px' }}
            >
              Sluit Detailweergave
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */

"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// --- DATA OBJECTEN ---

const imageDescriptions: Record<string, string> = {
  "12495_nansen-de-scheepskat.jpg": "Loresum felis nautica, glacialis explorationis particeps. In nocte polari perpetua dormit, spiritus navis manet.",
  "12496_roald-amundsen.jpg": "Juvenis explorator loresum, primus inter pares. Viae gelidae mensor, mox ad polos mundi perventurus.",
  "12498_george-lecointe.jpg": "Magister navis et astrorum loresum. Per mare incognitum cursum tenet, sidera sequens in tenebris.",
  "12499_henryck-arctowski.jpg": "Geologus loresum, terrae secreta sub glacie quaerens. Nomina eius in chartis mundi aeterna manent.",
  "12500_frederick-albert-cook.jpg": "Medicus loresum, saluti nautarum invigilans. Victus ex aqua et carne frigida, morbos depellit.",
  "12501_emile-rawovitza.jpg": "Biologus loresum, species novas in profundis inveniens. Vita sub glacie occulta mox revelatur.",
  "12504_adrien-de-gerlache.jpg": "Dux et conditor loresum. Fortunam suam mari glaciali dedit, ut scientia mundi cresceret.",
  "12513_emile-danco.jpg": "Physicus loresum, vires magneticas mundi explorans. In medio itinere ad astra conversus est.",
  "3142_belgica.jpg": "Navis loresum, in glacie immobilis per menses tredecim. Lignum contra glaciem, animus contra solitudinem.",
  "5311_belgica-in-antwerpen-1897.jpg": "Profectio loresum sub clamore multitudinis. Portus relinquitur, mare altum et frigidum petitur.",
  "9399_bemanning-van-de-belgica.jpg": "Cohors loresum ex variis gentibus collecta. Unitati in diversitate, robur in frigore maximo.",
  "8995_de-belgica-in-oostende-in-1905.jpg": "Iterum ad mare loresum, verilla nova sub caelo antiquo. Renovatio explorationis et messionis scientiae.",
  "5322_isfjord.jpg": "Sinus loresum, ubi aqua et glacies in aeternum pugnant. Mensurae abyssi profundae hic peractae sunt.",
  "5603_scheepsplan.jpg": "Architectura loresum, robur quercus et ferrum. Machina contra naturam ferocem designata.",
  "babcb16a-1a1f-11ed-b07d-02b7b76bf47f.jpg.webp": "Successor loresum, traditio in metallo novo. Scientia hodierna, spiritus antiquus explorationis."
};

const expeditions = [
  { label: 'Antarctica (1897)', id: '1897' },
  { label: 'Groenland (1905)', id: '1905' },
  { label: 'Kara-zee (1907)', id: '1907' }
];

const expeditionInfo: Record<string, { title: string, text: string }> = {
  '1897': { 
    title: "Expeditio Australis I", 
    text: "Loresum ipsum dolor sit amet, Antarcticae glaciem penetrans. Prima hiems in orbe terrarum extremo peracta est. Nautae in tenebris perpetuis scientiam quaerebant, dum navis inter montes crystallinos immota manebat. Glacies undique, sed animus ardens." 
  },
  '1905': { 
    title: "Iter Boreale Occidentis", 
    text: "Loresum borealis exploratio ad litora Groenlandiae. Oceanographia profunda et mensoribus aquarum gelidarum dedicata. Per nebulas et fluitantes montes glacie, iter ad fines mundi septentrionalis tentatum est sub auspiciis scientiae." 
  },
  '1907': { 
    title: "Mares Karae Mappatio", 
    text: "Loresum mare orientis, ubi venti feroces et glacies aeterna regnant. Abyssi profundae in chartas redactae sunt, et secreta benthos sub superficie rigida revelata. Labor improbus in climate hostili, ad maiorem mundi cognitionem." 
  },
  'modern': { 
    title: "Scientia Contemporanea", 
    text: "Loresum hodiernum, ubi technologia et traditio in unum fluunt. Navis nova maria explorans, a mutabilitate climatis ad profunditates ignotas. Investigatio perennis in nomine Belgicae, ad futurum orbis terrarum conservandum." 
  }
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [slots, setSlots] = useState<(string | null)[]>(new Array(6).fill(null));
  const [lastReplacedIndex, setLastReplacedIndex] = useState(0);
  const [activeExpedition, setActiveExpedition] = useState<string | null>('1897');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showPhotos, setShowPhotos] = useState(true);
  const [markerInfo, setMarkerInfo] = useState<{title: string, pos: {x: number, y: number}} | null>(null);
  
  const [randomStyles] = useState(() => 
    Array.from({ length: 6 }, () => ({
      rotate: (Math.random() * 6 - 3).toFixed(2) + 'deg',
      translateX: (Math.random() * 20 - 10).toFixed(2) + 'px'
    }))
  );

  const slotsRef = useRef<(string | null)[]>([]);
  const activeExpeditionRef = useRef<string | null>('1897');
  const showPhotosRef = useRef(true);
  const isMouseDownRef = useRef(false);
  const isAutoRotating = useRef(true);

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

    const routesData = [
      { 
        id: '1897', 
        center: { lat: -70, lon: -85 }, 
        points: [
            {lat: 51.21, lon: 4.40, label: "Vertrek Antwerpen"}, 
            {lat: 32.66, lon: -16.91, label: "Madeira"}, 
            {lat: -22.90, lon: -43.17, label: "Rio de Janeiro"}, 
            {lat: -34.83, lon: -56.16, label: "Montevideo"}, 
            {lat: -53.16, lon: -70.93, label: "Punta Arenas"}, 
            {lat: -64.83, lon: -63.00, label: "Gerlache Strait"}, 
            {lat: -71.50, lon: -85.00, label: "Ingevroren in het ijs"}
        ] 
      },
      { id: '1905', center: { lat: 72, lon: 0 }, points: [
          {lat: 51.23, lon: 2.92, label: "Oostende"}, 
          {lat: 60.39, lon: 5.32, label: "Bergen"}, 
          {lat: 78.22, lon: 15.62, label: "Spitsbergen"}, 
          {lat: 75.0, lon: -18.0, label: "Groenland Zee"}
      ] },
      { id: '1907', center: { lat: 68, lon: 40 }, points: [
          {lat: 51.21, lon: 4.40, label: "Antwerpen"}, 
          {lat: 70.66, lon: 23.68, label: "Hammerfest"}, 
          {lat: 72.0, lon: 45.0, label: "Barentszzee"}, 
          {lat: 74.0, lon: 60.0, label: "Novaya Zemlya"}
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

      route.points.forEach((p, idx) => {
        const pointPos = latLongToVector3(p.lat, p.lon, earthRadius + 0.12);
        
        // Zichtbare marker
        const markerGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          transparent: true,
          opacity: 0 
        });
        const marker = new THREE.Mesh(markerGeom, markerMat);
        marker.position.copy(pointPos);
        
        // ONZICHTBARE HITBOX (Groter gemaakt voor makkelijker klikken)
        const hitboxGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitbox = new THREE.Mesh(hitboxGeom, hitboxMat);
        hitbox.userData = { isMarker: true, label: p.label, expId: route.id };
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

    const rawImageData = [
      { file: "12495_nansen-de-scheepskat.jpg", exp: "1897" },
      { file: "12496_roald-amundsen.jpg", exp: "1897" },
      { file: "12498_george-lecointe.jpg", exp: "1897" },
      { file: "12499_henryck-arctowski.jpg", exp: "1897" },
      { file: "12500_frederick-albert-cook.jpg", exp: "1897" },
      { file: "12501_emile-racovitza.jpg", exp: "1897" },
      { file: "12504_adrien-de-gerlache.jpg", exp: "1897" },
      { file: "12513_emile-danco.jpg", exp: "1897" },
      { file: "12556_george-lecointe.jpg", exp: "1897" },
      { file: "12557_henryck-arctowski.jpg", exp: "1897" },
      { file: "12785_roald-amundsen.jpg", exp: "1897" },
      { file: "3141_adrien-de-gerlache.jpg", exp: "1897" },
      { file: "3142_belgica.jpg", exp: "1897" },
      { file: "3146_belgica.jpg", exp: "1897" },
      { file: "5311_belgica-in-antwerpen-1897.jpg", exp: "1897" },
      { file: "5316_inspectie-van-de-belgica.jpg", exp: "1897" },
      { file: "5318_belgica-in-antwerpen.jpg", exp: "1897" },
      { file: "5602_belgica.jpg", exp: "1897" },
      { file: "9399_bemanning-van-de-belgica.jpg", exp: "1897" },
      { file: "8995_de-belgica-in-oostende-in-1905.jpg", exp: "1905" },
      { file: "9397_postkaart-getiteld-qyacht-belgica-du-duc-dorleans-et-la-gareq-de-kaart-is-afkomstig-uit-de-collectie-van-omer-vilain.jpg", exp: "1905" },
      { file: "9398_herinneringskaart.jpg", exp: "1905" },
      { file: "5322_isfjord.jpg", exp: "1905" },
      { file: "32321_lecointe-1903-kaart-1.jpg", exp: "1907" },
      { file: "32322_lecointe-1903-kaart-2.jpg", exp: "1907" },
      { file: "32323_lecointe-1903-kaart-3.jpg", exp: "1907" },
      { file: "32324_lecointe-1903-kaart-4.jpg", exp: "1907" },
      { file: "32325_lecointe-1903-kaart-5.jpg", exp: "1907" },
      { file: "32326_lecointe-1903-kaart-6.jpg", exp: "1907" },
      { file: "32327_lecointe-1903-kaart-7.jpg", exp: "1907" },
      { file: "32666_arctowski-en-thoulet-1901-fig-2.jpg", exp: "1907" },
      { file: "32670_arctowski-en-thoulet-1901-fig-6.jpg", exp: "1907" },
      { file: "5603_scheepsplan.jpg", exp: "1907" },
      { file: "babcb16a-1a1f-11ed-b07d-02b7b76bf47f.jpg.webp", exp: "modern" }
    ];

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
        group.userData = { url: url, exp: item.exp }; 
        photoGroup.add(group);
      });
    });

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.5; // Maakt detectie gevoeliger
    const mouse = new THREE.Vector2();
    let dragStart = { x: 0, y: 0, time: 0 };

    const onPointerUp = (e: PointerEvent) => {
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
            // eslint-disable-next-line react-hooks/immutability
            handlePhotoClick(obj.userData.url);
            return;
          }
        }
        
        // ALTIJD checken voor markers als showPhotos false is OF als er geen foto is geraakt
        const markerIntersects = raycaster.intersectObjects(routeGroup.children, true);
        const validMarker = markerIntersects.find(hit => hit.object.userData.isMarker && hit.object.userData.expId === activeExpeditionRef.current);
        
        if (validMarker) {
           const vector = validMarker.object.getWorldPosition(new THREE.Vector3()).project(camera);
           setMarkerInfo({
             title: validMarker.object.userData.label,
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

    window.addEventListener('pointerdown', (e) => { isMouseDownRef.current = true; isAutoRotating.current = false; dragStart = { x: e.clientX, y: e.clientY, time: Date.now() }; });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', (e) => { 
        if (isMouseDownRef.current) { 
            masterGroup.rotation.y += e.movementX * 0.005; 
            masterGroup.rotation.x += e.movementY * 0.005; 
            setMarkerInfo(null);
        } 
    });

    const animate = () => {
      requestAnimationFrame(animate);
      const isSelected = slotsRef.current.some(s => s !== null);
      const currentExp = activeExpeditionRef.current;
      const currentShowPhotos = showPhotosRef.current;
      const time = Date.now() * 0.001;

      if (currentExp && !isMouseDownRef.current && isAutoRotating.current) {
        const routeData = routesData.find(r => r.id === currentExp);
        if (routeData) {
          const targetX = (routeData.center.lat) * (Math.PI / 180);
          const targetY = (-routeData.center.lon) * (Math.PI / 180);
          masterGroup.rotation.x += (targetX - masterGroup.rotation.x) * 0.05;
          masterGroup.rotation.y += (targetY - masterGroup.rotation.y) * 0.05;
        }
      }
      photoGroup.rotation.y += isSelected ? 0.0002 : 0.0015;
      
      photoGroup.children.forEach((group) => {
        const localY = new THREE.Vector3(0, 1, 0);
        localY.applyQuaternion(group.quaternion);
        localY.applyQuaternion(masterGroup.quaternion);
        if (localY.y < 0) group.children[0].rotation.z = Math.PI; else group.children[0].rotation.z = 0;
        const mat = (group.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        
        let targetPhotoOp = 0;
        if (currentShowPhotos) {
          targetPhotoOp = currentExp ? (group.userData.exp === currentExp ? 1.0 : 0.1) : 1.0;
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
               targetOp = 0.7 + Math.sin(time * 5) * 0.3;
             }
          }
          
          if (mat) mat.opacity += (targetOp - mat.opacity) * 0.1;
        });
      });

      renderer.render(scene, camera);
    };
    animate();
    return () => { renderer.dispose(); };
  }, []);

  function handlePhotoClick(url: string) {
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
    return imageDescriptions[fileName] || "Loresum notitia deest.";
  };

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
          white-space: nowrap;
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
      `}</style>

      {notification && <div className="expedition-toast">{notification}</div>}
      
      {markerInfo && (
        <div className="marker-popup" style={{ left: markerInfo.pos.x, top: markerInfo.pos.y }}>
          {markerInfo.title}
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' }} />
      
      <div style={{ position: 'absolute', left: '80px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '30px', zIndex: 1500, alignItems: 'flex-start' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={slots[i] ? "floating-slot" : ""} style={{ width: 'auto', height: '20vh', position: 'relative', animationDelay: `${i * 0.8}s` }}>
            {slots[i] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div onClick={() => handlePhotoClick(slots[i]!)} style={{ position: 'relative', transform: `rotate(${randomStyles[i].rotate})`, cursor: 'pointer', border: selectedPhotoUrl === slots[i] ? '2px solid black' : 'none' }}>
                  <img src={slots[i]!} alt="selected" style={{ height: '20vh', width: 'auto', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }} />
                  <button onClick={(e) => { e.stopPropagation(); closeSlot(i); }} style={{ position: 'absolute', top: '-10px', left: '-10px', width: '22px', height: '22px', background: 'black', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '10px' }}>✕</button>
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
                <button onClick={(e) => { e.stopPropagation(); closeSlot(3); }} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '22px', height: '22px', background: 'black', color: 'white', border: 'none', borderRadius: '50%' }}>✕</button>
              </div>
            </div>
          )}
        </div>

        {activeExpedition && expeditionInfo[activeExpedition] && (
          <div style={{ width: '350px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.98)', borderLeft: '4px solid #000', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', textTransform: 'uppercase' }}>{expeditionInfo[activeExpedition].title}</h2>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{expeditionInfo[activeExpedition].text}</p>
          </div>
        )}

        {[4, 5].map((i) => (
          <div key={i} className={slots[i] ? "floating-slot" : ""} style={{ width: 'auto', height: '20vh', position: 'relative', animationDelay: `${i * 0.8}s` }}>
            {slots[i] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {selectedPhotoUrl === slots[i] && <div className="info-bubble" style={{ position: 'relative' }}>{getDescription(slots[i])}</div>}
                <div onClick={() => handlePhotoClick(slots[i]!)} style={{ position: 'relative', transform: `rotate(${randomStyles[i].rotate})`, cursor: 'pointer', border: selectedPhotoUrl === slots[i] ? '2px solid black' : 'none' }}>
                  <img src={slots[i]!} alt="selected" style={{ height: '20vh', width: 'auto', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }} />
                  <button onClick={(e) => { e.stopPropagation(); closeSlot(i); }} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '22px', height: '22px', background: 'black', color: 'white', border: 'none', borderRadius: '50%' }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px', zIndex: 1000 }}>
        {expeditions.map((exp) => (
          <button key={exp.id} className="nav-button" onClick={() => handleExpeditionSelect(exp.id)} style={{ background: activeExpedition === exp.id ? '#000' : 'rgba(255, 255, 255, 0.9)', color: activeExpedition === exp.id ? '#fff' : '#000' }}>{exp.label}</button>
        ))}
        
        <button 
          className="nav-button" 
          disabled={!activeExpedition}
          onClick={() => setShowPhotos(!showPhotos)} 
          style={{ background: showPhotos ? 'rgba(255, 255, 255, 0.9)' : '#000', color: showPhotos ? '#000' : '#fff', width: '60px' }}
          title={showPhotos ? "Verberg foto's" : "Toon foto's"}
        >
          {showPhotos ? '👁️' : '🕶️'}
        </button>

        <button className="nav-button" onClick={() => { setActiveExpedition(null); setSelectedPhotoUrl(null); setShowPhotos(true); }} style={{ background: activeExpedition === null ? '#000' : 'rgba(255, 255, 255, 0.9)', color: activeExpedition === null ? '#fff' : '#000', width: '60px' }}>✕</button>
      </div>
    </main>
  );
}
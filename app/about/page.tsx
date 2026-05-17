"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BarChart2, Plus, Search, Trash2, X, ChevronRight, ChevronLeft, TrendingUp 
} from 'lucide-react';

// ==========================================
// 1. CONFIGURATIE & CONSTANTEN
// ==========================================

const DEEP_FOREST = "#062010"; 
const BRAND_PINK = "#C8A2A8"; 
const YELLOW_BEIGE = "#E6D5B8"; 

const TAB_COLORS: Record<string, string[]> = {
  home: ["#1B5E20", "#8BC34A", YELLOW_BEIGE, "#FF69B4"], 
  add: [BRAND_PINK, YELLOW_BEIGE, "#FFB6C1", "#FADADD"],  
  stats: [DEEP_FOREST, "#166534", "#2E7D32", YELLOW_BEIGE] 
};

const TARGETS = { kcal: 2000, protein: 150, carbs: 250, fat: 70, fiber: 30 };

const MACRO_COLORS = {
  protein: "#166534", 
  carbs: "#93c5fd",   
  fat: YELLOW_BEIGE  
};

// ==========================================
// 2. TYPES & INTERFACES
// ==========================================

interface FoodItem {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface LoggedMeal extends FoodItem {
  id: number;
  amount: number;
  date: string; 
}

// ==========================================
// 3. MOCK DATA & HELPERS
// ==========================================

const FOOD_DATABASE: FoodItem[] = [
  { name: 'Appel', kcal: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4 },
  { name: 'Banaan', kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
  { name: 'Kipfilet', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Skyr (naturel)', kcal: 63, protein: 11, carbs: 4, fat: 0.2 },
  { name: 'Havermout', kcal: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6 },
  { name: 'Pindakaas', kcal: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
  { name: 'Rijstwafel', kcal: 387, protein: 8, carbs: 80, fat: 3 },
  { name: 'Ei (gekookt)', kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
];

const generateFakeData = (): LoggedMeal[] => {
  const fakeMeals: LoggedMeal[] = [];
  const weekTemplate = [
    { name: 'Havermout met banaan', kcal: 350, protein: 12, carbs: 60, fat: 6, amount: 250 },
    { name: 'Skyr met apple', kcal: 220, protein: 33, carbs: 20, fat: 1, amount: 300 },
    { name: 'Kipfilet met rijst', kcal: 550, protein: 45, carbs: 55, fat: 8, amount: 400 },
    { name: 'Handje noten', kcal: 190, protein: 6, carbs: 5, fat: 16, amount: 30 },
    { name: 'Gebakken eieren op brood', kcal: 380, protein: 20, carbs: 25, fat: 18, amount: 150 },
    { name: 'Tonijnsalade', kcal: 280, protein: 40, carbs: 5, fat: 10, amount: 200 },
    { name: 'Pasta Bolognese', kcal: 650, protein: 35, carbs: 70, fat: 22, amount: 450 },
    { name: 'Zalmfilet met groenten', kcal: 500, protein: 35, carbs: 10, fat: 28, amount: 350 },
    { name: 'Proteïne shake', kcal: 150, protein: 25, carbs: 3, fat: 2, amount: 300 }
  ];

  for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('nl-NL');
    const dailyCount = 3 + (i % 2); 
    for (let j = 0; j < dailyCount; j++) {
      const templateItem = weekTemplate[(i + j) % weekTemplate.length];
      fakeMeals.push({
        ...templateItem,
        id: Math.random() + Date.now() - (i * 100000),
        date: dateStr,
      });
    }
  }
  return fakeMeals;
};

// ==========================================
// 4. SUB-COMPONENTEN (UI PARTS)
// ==========================================

function MacroRow({ label, current, target, color, unit }: any) {
    const percentage = Math.min((current / target) * 100, 100);
    return (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-3xl border border-white/20 shadow-sm">
            <div className="flex justify-between items-end mb-2">
                <p className="text-[11px] font-black uppercase text-slate-500 tracking-tight">{label}</p>
                <p className="text-sm font-black" style={{ color: DEEP_FOREST }}>
                    {Math.round(current)}{unit} <span className="text-[10px] text-slate-400">/ {target}{unit}</span>
                </p>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: color }} 
                />
            </div>
        </div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-full border border-slate-100">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
    );
}

function StatsDashboard({ history, targets, todayStr, primaryColor, brandPink }: any) {
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekOffset, setWeekOffset] = useState(0);

  const displayedWeek = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - (i + (weekOffset * 7)));
      const dStr = d.toLocaleDateString('nl-NL');
      const dayData = history.find(([date]: any) => date === dStr);
      
      const totalKcal = dayData ? dayData[1].reduce((sum: number, m: any) => sum + m.kcal, 0) : 0;
      const totalProtein = dayData ? dayData[1].reduce((sum: number, m: any) => sum + m.protein, 0) : 0;
      const totalCarbs = dayData ? dayData[1].reduce((sum: number, m: any) => sum + m.carbs, 0) : 0;
      const totalFat = dayData ? dayData[1].reduce((sum: number, m: any) => sum + m.fat, 0) : 0;

      days.push({ 
        fullDate: dStr,
        dayNum: d.getDate(),
        kcal: totalKcal, 
        protein: totalProtein, 
        carbs: totalCarbs, 
        fat: totalFat,
        label: d.toLocaleDateString('nl-NL', { weekday: 'short' }).charAt(0) 
      });
    }
    return days;
  }, [history, weekOffset]);

  const chartHeight = 160;
  const chartWidth = 280; 
  const yAxisWidth = 30;
  const maxMacroValue = 160; 
  const barGroupWidth = (chartWidth / displayedWeek.length);
  const singleBarWidth = 6;

  const avgKcal = Math.round(displayedWeek.reduce((a, b) => a + b.kcal, 0) / 7);
  const selectedDayMeals = history.find(([date]: any) => date === selectedDate)?.[1] || [];

  // Berekening voor de status uitleg
  const kcalDiff = Math.abs(targets.kcal - avgKcal);
  const isUnderTarget = avgKcal < targets.kcal;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div style={{ backgroundColor: brandPink }} className="p-5 rounded-[2rem] text-white shadow-md">
          <p className="text-[10px] font-bold text-white/70 uppercase">Week Gem.</p>
          <p className="text-2xl font-black text-white">{avgKcal} <span className="text-xs text-white/70 font-bold uppercase">kcal</span></p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-5 rounded-[2rem] border border-white/20 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-emerald-600" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
            </div>
          <p style={{ color: primaryColor }} className="text-sm font-black">{isUnderTarget ? 'Onder doel' : 'Boven doel'}</p>
          <p className="text-[9px] font-bold text-slate-400 leading-tight mt-1">
            {isUnderTarget 
                ? `Je verbruikt gemiddeld ${kcalDiff} kcal minder dan je dagelijkse doel.` 
                : `Je zit gemiddeld ${kcalDiff} kcal boven je ingestelde dagdoel.`}
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
            <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-2 bg-white/50 rounded-full text-slate-600 hover:bg-white transition-colors"><ChevronLeft size={20} /></button>
            <span style={{ color: primaryColor }} className="text-xs font-black uppercase tracking-widest">{weekOffset === 0 ? 'Deze week' : `${weekOffset} ${weekOffset === 1 ? 'week' : 'weken'} geleden`}</span>
            <button onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} className={`p-2 rounded-full transition-colors ${weekOffset === 0 ? 'text-slate-300' : 'bg-white/50 text-slate-600 hover:bg-white'}`} disabled={weekOffset === 0}><ChevronRight size={20} /></button>
        </div>
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-[2rem] border border-white/20 shadow-sm">
            {displayedWeek.map((day) => (
            <button key={day.fullDate} onClick={() => setSelectedDate(day.fullDate)} style={{ backgroundColor: selectedDate === day.fullDate ? brandPink : 'transparent', color: selectedDate === day.fullDate ? 'white' : '#64748b' }} className={`flex flex-col items-center justify-center w-10 h-14 rounded-2xl transition-all ${selectedDate === day.fullDate ? "shadow-lg scale-105" : "hover:bg-white/40"}`}>
                <span className="text-[10px] font-bold uppercase mb-1">{day.label}</span>
                <span className="text-sm font-black">{day.dayNum}</span>
            </button>
            ))}
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex flex-col mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 style={{ color: primaryColor }} className="text-sm font-black flex items-center gap-2">Macro Verdeling (g)</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedDate}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <LegendItem color={MACRO_COLORS.protein} label="Eiwit" />
              <LegendItem color={MACRO_COLORS.carbs} label="Koolhydraten" />
              <LegendItem color={MACRO_COLORS.fat} label="Vet" />
            </div>
        </div>

        <div className="relative w-full overflow-visible">
          <svg viewBox={`0 0 ${chartWidth + yAxisWidth} ${chartHeight + 20}`} className="w-full h-auto overflow-visible">
            {[0, 50, 100, 150].map((val) => {
              const y = chartHeight - ((val / maxMacroValue) * chartHeight);
              return (
                <g key={val}>
                  <text x="0" y={y + 4} className="text-[9px] fill-slate-300 font-bold">{val}</text>
                  <line x1={yAxisWidth} y1={y} x2={chartWidth + yAxisWidth} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                </g>
              );
            })}
            
            {displayedWeek.map((day, i) => {
              const groupX = yAxisWidth + (i * barGroupWidth) + (barGroupWidth / 4);
              const pHeight = (day.protein / maxMacroValue) * chartHeight;
              const cHeight = (day.carbs / maxMacroValue) * chartHeight;
              const fHeight = (day.fat / maxMacroValue) * chartHeight;

              return (
                <g key={day.fullDate}>
                  <motion.rect 
                    initial={{ height: 0, y: chartHeight }}
                    animate={{ height: pHeight, y: chartHeight - pHeight }}
                    x={groupX} width={singleBarWidth} fill={MACRO_COLORS.protein} rx="2"
                  />
                  <motion.rect 
                    initial={{ height: 0, y: chartHeight }}
                    animate={{ height: cHeight, y: chartHeight - cHeight }}
                    x={groupX + singleBarWidth + 2} width={singleBarWidth} fill={MACRO_COLORS.carbs} rx="2"
                  />
                  <motion.rect 
                    initial={{ height: 0, y: chartHeight }}
                    animate={{ height: fHeight, y: chartHeight - fHeight }}
                    x={groupX + (singleBarWidth + 2) * 2} width={singleBarWidth} fill={MACRO_COLORS.fat} rx="2"
                  />
                  <text x={groupX + singleBarWidth + 2} y={chartHeight + 15} textAnchor="middle" className="text-[9px] fill-slate-400 font-bold">{day.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Log Detail */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-[1.5rem] p-4 shadow-sm">
          <h5 style={{ color: primaryColor }} className="text-[10px] font-black uppercase mb-3 opacity-60">
             {selectedDate === todayStr ? 'Vandaag gegeten' : `Gegeten op ${selectedDate}`}
          </h5>
          {selectedDayMeals.length > 0 ? (
              <div className="space-y-3">
                  {selectedDayMeals.map((m: any) => (
                      <div key={m.id} className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                          <div><p style={{ color: primaryColor }} className="font-bold">{m.name}</p></div>
                          <span style={{ color: brandPink }} className="font-black">{m.kcal} kcal</span>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-xs text-slate-500 italic text-center py-4">Geen data voor deze dag.</p>
          )}
      </div>
    </motion.div>
  );
}

// ==========================================
// 5. HOOFDCOMPONENT (EXPORT)
// ==========================================

export default function FoodTracker() {
  const [activeTab, setActiveTab] = useState('home');
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState<string>("100");

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('food_tracker_v5');
    if (saved && JSON.parse(saved).length > 0) {
      setMeals(JSON.parse(saved));
    } else {
      const initialData = generateFakeData();
      setMeals(initialData);
      localStorage.setItem('food_tracker_v5', JSON.stringify(initialData));
    }
  }, []);

  // --- Memos & Variabelen ---
  const todayStr = new Date().toLocaleDateString('nl-NL');
  const todayMeals = meals.filter(m => m.date === todayStr);

  const history = useMemo(() => {
    const groups: { [key: string]: LoggedMeal[] } = {};
    meals.forEach(m => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    return Object.entries(groups).sort((a, b) => {
      const [da, ma, ya] = a[0].split('-').map(Number);
      const [db, mb, yb] = b[0].split('-').map(Number);
      return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
    });
  }, [meals]);

  const totals = useMemo(() => todayMeals.reduce((acc, m) => ({
    kcal: acc.kcal + m.kcal, 
    protein: acc.protein + m.protein, 
    carbs: acc.carbs + m.carbs, 
    fat: acc.fat + m.fat,
    fiber: acc.fiber + (m.fiber || 0)
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }), [todayMeals]);

  const liveMacros = useMemo(() => {
    if (!selectedFood) return null;
    const factor = (parseInt(amount) || 0) / 100;
    return {
      kcal: Math.round(selectedFood.kcal * factor),
      protein: (selectedFood.protein * factor).toFixed(1),
      carbs: (selectedFood.carbs * factor).toFixed(1),
      fat: (selectedFood.fat * factor).toFixed(1)
    };
  }, [selectedFood, amount]);

  // --- Actions ---
  const addMeal = () => {
    if (!selectedFood) return;
    const factor = (parseInt(amount) || 0) / 100;
    const newMeal: LoggedMeal = {
      id: Date.now(),
      date: todayStr,
      name: selectedFood.name,
      amount: parseInt(amount) || 0,
      kcal: Math.round(selectedFood.kcal * factor),
      protein: Number((selectedFood.protein * factor).toFixed(1)),
      carbs: Number((selectedFood.carbs * factor).toFixed(1)),
      fat: Number((selectedFood.fat * factor).toFixed(1)),
      fiber: Number(((selectedFood.fiber || 0) * factor).toFixed(1)),
    };
    setMeals([newMeal, ...meals]);
    setActiveTab('home');
    setSearchQuery('');
    setSelectedFood(null);
    setAmount("100");
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-hidden p-2 font-sans bg-[#F0F2F5]">
      <div 
        style={{ borderColor: DEEP_FOREST }} 
        className="w-full max-w-[390px] h-[844px] rounded-[3rem] relative shadow-2xl overflow-hidden flex flex-col border-[8px] bg-white"
      >
        {/* ACHTERGROND ANIMATIE */}
        <div className="absolute right-0 top-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          {TAB_COLORS[activeTab].map((color, idx) => (
            <motion.div 
              key={idx}
              animate={{ 
                  x: idx % 2 === 0 ? [0, 40, -20, 0] : [0, -50, 30, 0], 
                  y: idx % 2 === 0 ? [0, -30, 20, 0] : [0, 60, -40, 0],
                  backgroundColor: color 
              }} 
              transition={{ duration: 12 + idx * 3, repeat: Infinity, ease: "linear", backgroundColor: { duration: 1.5 } }} 
              className={`absolute w-[${250 + idx * 50}px] h-[${250 + idx * 50}px] rounded-full blur-[100px] opacity-50`}
              style={{ 
                top: `${idx * 20}%`, 
                right: idx % 2 === 0 ? '-5rem' : '2rem' 
              }}
            />
          ))}
        </div>

        {/* WHITE SHAPE OVERLAY */}
        <div className="absolute left-0 top-0 h-full w-[42%] z-[1] bg-white" style={{ borderTopRightRadius: '120px 50%', borderBottomRightRadius: '120px 50%', boxShadow: '40px 0 80px 20px white' }} />

        {/* HEADER */}
        <div className="px-8 pt-12 pb-4 flex justify-between items-center relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-800/50 uppercase tracking-widest">
                {activeTab === 'stats' ? 'Trends' : 'Vandaag'}
            </p>
            <h2 style={{ color: DEEP_FOREST }} className="text-2xl font-black">
                {activeTab === 'stats' ? 'Dashboard' : ''}
            </h2>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-6 no-scrollbar pt-4 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="mb-6">
                    <h1 style={{ color: DEEP_FOREST }} className="text-3xl font-black leading-none">
                        Welkom terug,<br />
                        <span style={{ color: BRAND_PINK }}>Lisa Marie</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm mt-2">Klaar om je doelen te crushen?</p>
                </div>

                <section style={{ backgroundColor: DEEP_FOREST }} className="rounded-[2.5rem] p-8 text-white mb-6 relative overflow-hidden shadow-lg">
                    <div className="flex justify-between items-start mb-4 text-white">
                        <div>
                            <span className="text-4xl font-black tracking-tighter">{Math.max(0, TARGETS.kcal - totals.kcal)}</span>
                            <p className="text-[10px] font-bold uppercase opacity-90">kcal over</p>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold">{totals.kcal}</span>
                            <p className="text-[10px] font-bold uppercase opacity-90">gegeten</p>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full" style={{ backgroundColor: BRAND_PINK }} animate={{width: `${Math.min((totals.kcal / TARGETS.kcal) * 100, 100)}%`}} />
                    </div>
                </section>

                <div className="space-y-4 mb-8">
                    <MacroRow label="Eiwit" current={totals.protein} target={TARGETS.protein} color={MACRO_COLORS.protein} unit="g" />
                    <MacroRow label="Koolhydraten" current={totals.carbs} target={TARGETS.carbs} color={MACRO_COLORS.carbs} unit="g" />
                    <MacroRow label="Vet" current={totals.fat} target={TARGETS.fat} color={MACRO_COLORS.fat} unit="g" />
                </div>

                <h3 style={{ color: DEEP_FOREST }} className="font-black text-lg mb-4">Logboek Vandaag</h3>
                <div className="space-y-3 pb-24">
                  {todayMeals.length === 0 && <p className="text-slate-800/40 text-sm font-bold italic">Nog niets gelogd vandaag...</p>}
                  {todayMeals.map(m => (
                    <div key={m.id} className="bg-white/70 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center group shadow-sm border border-white/40">
                      <div>
                        <p style={{ color: DEEP_FOREST }} className="font-black text-sm">{m.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{m.amount}g • {m.kcal} kcal</p>
                      </div>
                      <button onClick={() => setMeals(meals.filter(i => i.id !== m.id))} style={{ color: BRAND_PINK }}><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'add' && (
              <motion.div key="a" initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} className="pt-2">
                 <div className="relative mb-6">
                    <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input 
                      autoFocus placeholder="Zoek in database..." 
                      className="w-full bg-white/80 backdrop-blur-md border-none shadow-sm rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-[#166534]" 
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
                
                {!selectedFood ? (
                    <div className="space-y-2">
                    {FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(food => (
                        <button key={food.name} onClick={() => setSelectedFood(food)} className="w-full text-left p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 flex justify-between items-center active:scale-[0.98] transition-transform shadow-sm">
                            <p style={{ color: DEEP_FOREST }} className="font-bold">{food.name}</p>
                            <Plus size={18} className="text-slate-400" />
                        </button>
                    ))}
                    </div>
                ) : (
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
                        <button onClick={() => setSelectedFood(null)} className="mb-4 text-xs font-bold text-slate-500 flex items-center gap-1"><X size={14}/> Terug naar zoeken</button>
                        <h2 style={{ color: DEEP_FOREST }} className="text-2xl font-black mb-2">{selectedFood.name}</h2>
                        
                        <div className="mb-6">
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Hoeveelheid (gram)</label>
                          <input type="number" className="w-full bg-white/50 rounded-2xl py-4 px-6 text-2xl font-black border-2 border-slate-100 focus:border-[#166534] outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-center">
                              <p className="text-[8px] font-black uppercase text-slate-400">kcal</p>
                              <p style={{ color: DEEP_FOREST }} className="text-sm font-black">{liveMacros?.kcal}</p>
                            </div>
                            <div className="text-center border-l border-slate-100">
                              <p className="text-[8px] font-black uppercase text-slate-400">eiwit</p>
                              <p style={{ color: MACRO_COLORS.protein }} className="text-sm font-black">{liveMacros?.protein}g</p>
                            </div>
                            <div className="text-center border-l border-slate-100">
                              <p className="text-[8px] font-black uppercase text-slate-400">koolh</p>
                              <p style={{ color: MACRO_COLORS.carbs }} className="text-sm font-black">{liveMacros?.carbs}g</p>
                            </div>
                            <div className="text-center border-l border-slate-100">
                              <p className="text-[8px] font-black uppercase text-slate-400">vet</p>
                              <p style={{ color: MACRO_COLORS.fat }} className="text-sm font-black">{liveMacros?.fat}g</p>
                            </div>
                        </div>

                        <button onClick={addMeal} style={{ backgroundColor: BRAND_PINK }} className="w-full py-5 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all">Bevestig</button>
                    </div>
                )}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <StatsDashboard history={history} targets={TARGETS} todayStr={todayStr} primaryColor={DEEP_FOREST} brandPink={BRAND_PINK} />
            )}
          </AnimatePresence>
        </main>

        {/* TAB NAVIGATION */}
        <nav className="h-20 bg-white/60 backdrop-blur-2xl border-t border-slate-100 flex items-center justify-between relative z-20 pb-4">
          <div className="flex-1 flex justify-center">
            <button onClick={() => setActiveTab('home')} className="p-2" style={{ color: activeTab === 'home' ? DEEP_FOREST : '#94a3b8' }}>
              <Home size={22} strokeWidth={activeTab === 'home' ? 3 : 2} />
            </button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <button onClick={() => {setActiveTab('add'); setSelectedFood(null);}} style={{ backgroundColor: BRAND_PINK }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button onClick={() => setActiveTab('stats')} className="p-2" style={{ color: activeTab === 'stats' ? DEEP_FOREST : '#94a3b8' }}>
              <BarChart2 size={22} strokeWidth={activeTab === 'stats' ? 3 : 2} />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
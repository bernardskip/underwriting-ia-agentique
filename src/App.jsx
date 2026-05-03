import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  AlertTriangle, Cpu, FileText, Banknote, ShieldCheck, 
  Sliders, Scale, Leaf, TrendingDown, Award, Ban,
  Download, GitCompare, Cloud, HardDrive, Info
} from 'lucide-react';

// Formateur en Euros
const formatEuro = (val) => new Intl.NumberFormat('fr-FR', { 
  style: 'currency', 
  currency: 'EUR', 
  maximumFractionDigits: 0 
}).format(val);

// Formateur custom pour les tooltips
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border border-slate-100">
        <p className="font-bold text-slate-700">{payload[0].payload.name || payload[0].name}</p>
        <p className="text-indigo-600 font-black">{formatEuro(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// NOUVEAU : Formateur custom pour écarter les labels du radar et gérer les retours à la ligne
const CustomRadarTick = ({ payload, x, y, cx, cy, textAnchor }) => {
  // 1. Éloignement du label par rapport au centre (vecteur)
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const pushOut = 15; // Force d'écartement RÉAJUSTÉE pour le radar taille max
  const newX = x + (dx / dist) * pushOut;
  const newY = y + (dy / dist) * pushOut;

  // 2. Détection des parenthèses pour le retour à la ligne
  const value = payload.value;
  let line1 = value;
  let line2 = "";
  
  if (value.includes(" (")) {
    const parts = value.split(" (");
    line1 = parts[0];
    line2 = "(" + parts[1];
  }

  return (
    <text x={newX} y={newY} textAnchor={textAnchor} fontSize={10} fill="#475569" fontWeight="bold">
      <tspan x={newX} dy={line2 ? "-0.4em" : "0.3em"}>{line1}</tspan>
      {line2 && <tspan x={newX} dy="1.2em">{line2}</tspan>}
    </text>
  );
};

const App = () => {
  // 1. Paramètres du Client (Exposition métier)
  const [caClient, setCaClient] = useState(250); 
  const [secteur, setSecteur] = useState(1.5); 
  const [niveauAutonomie, setNiveauAutonomie] = useState(3); 
  const [donneesSensibles, setDonneesSensibles] = useState(2); 
  
  // 2. Environnement Réglementaire & Architecture 
  const [euAiAct, setEuAiAct] = useState(1.2); 
  const [modeleLLM, setModeleLLM] = useState('cloud_openai');
  const [tauxCession, setTauxCession] = useState(30); 

  // 3. Structuration du Programme (Mitigation & Exclusions)
  const [franchise, setFranchise] = useState(250000); 
  const [hasGuardrails, setHasGuardrails] = useState(false); 
  const [hasAudit, setHasAudit] = useState(true); 
  const [exclureIP, setExclureIP] = useState(false); 
  const [exclureCorporel, setExclureCorporel] = useState(false); 

  // 4. A/B Testing - Scénario Sauvegardé
  const [scenarioA, setScenarioA] = useState(null);

  // 5. Moteur de Pricing Actuariel
  const calculs = useMemo(() => {
    const isLocal = modeleLLM === 'local_os';
    const cloudDependencyMultiplier = isLocal ? 0.4 : 1.5; 
    const selfHostedCyberRisk = isLocal ? 1.4 : 1.0; 

    // A. EXPOSITION BRUTE
    const baseExposure = caClient * 1000000 * 0.10; 
    let pmlBrut = baseExposure * secteur * (niveauAutonomie / 2.5) * (donneesSensibles / 1.5) * euAiAct;

    // B. MITIGATION & EXCLUSIONS
    let riskDiscount = 1;
    if (hasGuardrails) riskDiscount -= 0.15; 
    if (hasAudit) riskDiscount -= 0.10; 
    if (exclureIP) riskDiscount -= 0.10; 
    if (exclureCorporel && secteur >= 1.5) riskDiscount -= 0.25; 
    else if (exclureCorporel) riskDiscount -= 0.05;

    riskDiscount = Math.max(0.40, riskDiscount);
    const pmlNet = pmlBrut * riskDiscount;

    // C. PRIME PURE & FRANCHISE
    const probabiliteBrute = (niveauAutonomie * 0.015) + (donneesSensibles * 0.01);
    let probabiliteSinistre = probabiliteBrute * riskDiscount;
    let primePure = pmlNet * probabiliteSinistre;
    
    const discountFranchise = Math.max(0.40, 1 - (franchise / 10000000));
    primePure = primePure * discountFranchise;

    const primePureSansPrevention = pmlBrut * probabiliteBrute * discountFranchise;
    const primeCommercialeSansPrevention = primePureSansPrevention * 1.45;

    // D. CHARGEMENTS & RÉASSURANCE
    const primeCommerciale = primePure * 1.45; 
    const primeCedee = primeCommerciale * (tauxCession / 100); 
    const primeNetteConservee = primeCommerciale - primeCedee; 

    // E. ECONOMIE DE PREVENTION (ROI)
    const economiePrevention = primeCommercialeSansPrevention - primeCommerciale;

    // F. SCORE ESG & GOUVERNANCE IA
    let baseEsg = 70;
    let esgScore = baseEsg - (niveauAutonomie * 5) - (donneesSensibles * 2) - ((euAiAct - 1) * 20);
    if (hasGuardrails) esgScore += 15;
    if (hasAudit) esgScore += 20;
    if (isLocal) esgScore += 10; 
    esgScore = Math.min(100, Math.max(0, esgScore));

    // G. VENTILATION DES RISQUES (Radar)
    let cyberRisk = Math.min(100, 20 * donneesSensibles * secteur * riskDiscount * selfHostedCyberRisk);
    let eoRisk = Math.min(100, 15 * niveauAutonomie * euAiAct * riskDiscount);
    let complianceRisk = Math.min(100, 30 * euAiAct * (donneesSensibles / 2));
    let biRisk = Math.min(100, 25 * niveauAutonomie * riskDiscount * cloudDependencyMultiplier); 
    
    if (exclureIP) eoRisk *= 0.6; 
    if (exclureCorporel && secteur >= 1.5) eoRisk *= 0.4; 

    return {
      pml: pmlNet,
      pmlBrut,
      reductionPML: (1 - riskDiscount) * 100,
      primeCommerciale,
      primeNetteConservee,
      primeCedee,
      economiePrevention,
      esgScore,
      radarData: [
        { subject: 'Cyber Extorsion', A: cyberRisk, fullMark: 100 },
        { subject: 'E&O (Hallucination)', A: eoRisk, fullMark: 100 },
        { subject: 'Perte Exploitation', A: biRisk, fullMark: 100 },
        { subject: 'Amendes (EU AI Act)', A: complianceRisk, fullMark: 100 },
      ],
      barData: [
        { name: 'Prime Nette (Assureur)', value: primeNetteConservee, color: '#4f46e5' },
        { name: 'Prime Cédée (Réassureur)', value: primeCedee, color: '#0ea5e9' },
      ]
    };
  }, [caClient, secteur, niveauAutonomie, donneesSensibles, franchise, hasGuardrails, hasAudit, exclureIP, exclureCorporel, euAiAct, modeleLLM, tauxCession]);

  const handleCaChange = (e) => {
    let val = Number(e.target.value);
    setCaClient(val < 0 ? 0 : val);
  };

  const saveScenarioA = () => {
    setScenarioA({
      name: `Franchise ${formatEuro(franchise)} | ${isLocalLLM ? 'Local' : 'Cloud'} | ${hasGuardrails ? 'Sécurisé' : 'Standard'}`,
      primeCommerciale: calculs.primeCommerciale,
      pml: calculs.pml,
      esgScore: calculs.esgScore
    });
  };

  const resetScenarioA = () => setScenarioA(null);

  const handlePrint = () => {
    window.print();
  };

  const isLocalLLM = modeleLLM === 'local_os';

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 flex flex-col print:bg-white print:p-0">
      
      {/* HEADER AVEC BOUTON EXPORT */}
      <header className="max-w-7xl mx-auto w-full mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-6 gap-4 shrink-0 print:border-b-2 print:border-slate-800 print:pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 print:bg-slate-800 print:shadow-none">
            <Cpu className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Agentic AI : Underwriting Term Sheet
            </h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest print:text-slate-500">
              AlgoPolis - Stratégie RC Pro, Cyber & Réassurance
            </p>
          </div>
        </div>
        
        {/* BOUTON D'ACTION MÉTIER (PDF) - Caché à l'impression */}
        <button 
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg shadow-slate-200 print:hidden"
        >
          <Download className="w-4 h-4" /> Imprimer / PDF
        </button>
      </header>

      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 print:gap-4">
        
        {/* COLONNE GAUCHE : INPUTS (Cachée à l'impression pour faire propre) */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* BLOC 1 : PROFIL ASSURÉ */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Profil d'Exposition
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                  CA Exposé à l'IA
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input 
                    type="range" min="1" max="2000" 
                    value={caClient} 
                    onChange={handleCaChange} 
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                  <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-sm">
                    <input 
                      type="number" 
                      value={caClient} 
                      onChange={handleCaChange}
                      className="w-16 text-right outline-none font-black text-indigo-600 bg-transparent text-sm"
                    />
                    <span className="ml-1 text-[10px] font-bold text-slate-400">M€</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-2 block">Secteur d'Activité</label>
                  <select value={secteur} onChange={(e) => setSecteur(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none">
                    <option value={0.6}>Tech / SaaS (Très Faible)</option>
                    <option value={1.0}>Retail / Services Pro (Standard)</option>
                    <option value={1.5}>Industrie / Supply Chain (Élevé)</option>
                    <option value={2.0}>Finance / Assurance (Critique)</option>
                    <option value={2.8}>Santé / Infra. Critiques (Extrême)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-2 block">Autonomie (Scale L1-L5)</label>
                  <select value={niveauAutonomie} onChange={(e) => setNiveauAutonomie(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none">
                    <option value={1}>L1 - Assistant (Brouillon validé)</option>
                    <option value={2}>L2 - Co-pilote (Human in the loop)</option>
                    <option value={3}>L3 - Agent restreint (Kill-switch)</option>
                    <option value={4}>L4 - Agent autonome (Périmètre fixe)</option>
                    <option value={5}>L5 - IA Systémique (Zero-Touch)</option>
                  </select>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isLocalLLM ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
                <label className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-2 ${isLocalLLM ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {isLocalLLM ? <HardDrive className="w-3 h-3" /> : <Cloud className="w-3 h-3" />} 
                  Modèle Fondamental (LLM)
                </label>
                <select value={modeleLLM} onChange={(e) => setModeleLLM(e.target.value)} className={`w-full p-2 bg-white border rounded-xl text-xs font-bold outline-none ${isLocalLLM ? 'border-emerald-200 text-emerald-700' : 'border-blue-200 text-blue-700'}`}>
                  <option value="cloud_openai">Cloud API (Risque Accumulation)</option>
                  <option value="local_os">Modèle Local (Risque Cyber interne)</option>
                </select>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <label className="text-[10px] font-bold uppercase text-amber-600 mb-2 flex items-center gap-2">
                  <Scale className="w-3 h-3" /> Régulation EU AI Act
                </label>
                <select value={euAiAct} onChange={(e) => setEuAiAct(Number(e.target.value))} className="w-full p-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-700 outline-none">
                  <option value={1}>Risque Minimal / Limité</option>
                  <option value={1.5}>Risque Élevé</option>
                  <option value={2.5}>Risque Inacceptable</option>
                </select>
              </div>
            </div>
          </div>

          {/* BLOC 2 : STRUCTURATION & RÉASSURANCE */}
          <div className="bg-slate-800 p-6 rounded-[2rem] shadow-lg border border-slate-700 text-white">
            <h2 className="text-xs font-black uppercase text-indigo-300 mb-6 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Structuration & Traités
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex justify-between">
                  <span>Rétention Client (Franchise)</span>
                  <span className="text-emerald-400 font-bold">{formatEuro(franchise)}</span>
                </label>
                <input 
                  type="range" min="0" max="5000000" step="50000"
                  value={franchise} 
                  onChange={(e) => setFranchise(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex justify-between">
                  <span>Cession Réassurance (Quota Share)</span>
                  <span className="text-sky-400 font-bold">{tauxCession} %</span>
                </label>
                <input 
                  type="range" min="0" max="90" step="10"
                  value={tauxCession} 
                  onChange={(e) => setTauxCession(Number(e.target.value))} 
                  className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500" 
                />
              </div>

              <div className="pt-4 border-t border-slate-600 grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-[9px] uppercase text-slate-400 font-bold mb-2">Prévention</p>
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${hasGuardrails ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-700 border-slate-500'}`}>
                      {hasGuardrails && <ShieldCheck className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={hasGuardrails} onChange={() => setHasGuardrails(!hasGuardrails)} />
                    <span className="text-[10px] font-bold text-slate-200 leading-tight">Garde-fous LLM (RAG)</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${hasAudit ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-700 border-slate-500'}`}>
                      {hasAudit && <ShieldCheck className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={hasAudit} onChange={() => setHasAudit(!hasAudit)} />
                    <span className="text-[10px] font-bold text-slate-200 leading-tight">Audit Red-Teaming</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] uppercase text-slate-400 font-bold mb-2">Exclusions (IP / BI)</p>
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${exclureIP ? 'bg-rose-500 border-rose-500' : 'bg-slate-700 border-slate-500'}`}>
                      {exclureIP && <Ban className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={exclureIP} onChange={() => setExclureIP(!exclureIP)} />
                    <span className="text-[10px] font-bold text-slate-200 leading-tight">Propriété Intellectuelle (IP)</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${exclureCorporel ? 'bg-rose-500 border-rose-500' : 'bg-slate-700 border-slate-500'}`}>
                      {exclureCorporel && <Ban className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={exclureCorporel} onChange={() => setExclureCorporel(!exclureCorporel)} />
                    <span className="text-[10px] font-bold text-slate-200 leading-tight">Dommages Corporels</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-600">
                <button 
                  onClick={saveScenarioA}
                  className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  <GitCompare className="w-4 h-4" /> Sauvegarder comme Scénario A
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : DASHBOARD DE PRICING (OUTPUTS) - S'étend à l'impression */}
        <div className="lg:col-span-8 space-y-6 relative print:col-span-12 print:w-full">
          
          {/* PANNEAU A/B TESTING - STICKY EN HAUT */}
          {scenarioA && (
            <div className="sticky top-4 z-50 bg-slate-900/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-indigo-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 print:hidden">
              <div className="flex-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1 flex items-center gap-2">
                  <GitCompare className="w-4 h-4" /> Comparateur : Actuel vs Scénario A
                </h3>
                <p className="text-xs font-bold text-slate-300">Réf Scénario A : {scenarioA.name}</p>
              </div>
              
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Delta Prime</p>
                  <p className={`text-xl font-black ${calculs.primeCommerciale < scenarioA.primeCommerciale ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculs.primeCommerciale < scenarioA.primeCommerciale ? '-' : '+'}{formatEuro(Math.abs(calculs.primeCommerciale - scenarioA.primeCommerciale))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Delta PML</p>
                  <p className={`text-xl font-black ${calculs.pml < scenarioA.pml ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculs.pml < scenarioA.pml ? '-' : '+'}{formatEuro(Math.abs(calculs.pml - scenarioA.pml))}
                  </p>
                </div>
              </div>
              <button onClick={resetScenarioA} className="bg-slate-700 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 p-2 rounded-xl transition-colors">
                <Ban className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* LIGNE DES KPIS PRINCIPAUX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rose-100 relative overflow-hidden group print:border-2 print:border-rose-200">
              <AlertTriangle className="absolute -right-8 -bottom-8 w-40 h-40 text-rose-50 opacity-50 group-hover:opacity-100 transition-opacity print:opacity-20" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Exposition Maximale (PML)</h3>
                  {calculs.reductionPML > 0 && (
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 rounded-full uppercase">
                      -{calculs.reductionPML.toFixed(0)}% Risque
                    </span>
                  )}
                </div>
                <p className="text-4xl lg:text-5xl font-black mb-2 tracking-tight text-slate-800">{formatEuro(calculs.pml)}</p>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Plafond d'exposition ajusté selon les exclusions contractuelles et la prévention technique.
                </p>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-xl shadow-indigo-200 border border-indigo-500 relative overflow-hidden group print:bg-white print:text-slate-800 print:shadow-none print:border-2 print:border-indigo-600">
              <Banknote className="absolute -right-8 -bottom-8 w-40 h-40 text-indigo-500 opacity-50 group-hover:opacity-70 transition-opacity print:text-indigo-50 print:opacity-100" />
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-3 print:text-indigo-600">Prime Commerciale Totale</h3>
                <p className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{formatEuro(calculs.primeCommerciale)}</p>
                <p className="text-xs font-medium text-indigo-200 leading-relaxed print:text-slate-500">
                  Prime globale payée par l'assuré (100% du risque avant réassurance et commissions).
                </p>
              </div>
            </div>
          </div>

          {/* LE RADAR GÉANT EN PLEINE LARGEUR */}
          <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-stretch gap-8 print:break-inside-avoid">
            
            <div className="flex-1 w-full h-[300px] md:h-[350px] flex flex-col">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center shrink-0">
                Radar de Risque Systémique
              </h3>
              <div className="flex-1 w-full relative min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="85%" data={calculs.radarData} margin={{ top: 20, right: 55, bottom: 20, left: 55 }}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={<CustomRadarTick />} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar 
                      name="Exposition" 
                      dataKey="A" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fill="#818cf8" 
                      fillOpacity={0.4} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Panneau d'Analyse Dynamique */}
            <div className="md:w-1/3 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 mb-4">
                <Info className="w-4 h-4" /> Analyse en temps réel
              </h4>
              
              <ul className="space-y-4 text-xs font-medium text-slate-600">
                {isLocalLLM ? (
                  <li><strong className="text-emerald-600">Modèle Local :</strong> Réduit massivement le risque de Perte d'Exploitation (pas de dépendance API), mais accroît l'exposition Cyber interne.</li>
                ) : (
                  <li><strong className="text-rose-600">Modèle Cloud :</strong> Dépendance forte au fournisseur tiers. Risque d'accumulation et de Perte d'Exploitation élevé.</li>
                )}

                {hasGuardrails && (
                  <li><strong className="text-emerald-600">Garde-Fous Actifs :</strong> Le bridage LLM (RAG) diminue la surface de réponse, réduisant directement le risque d'Hallucination (E&O).</li>
                )}

                {exclureCorporel ? (
                  <li><strong className="text-indigo-600">Exclusion Corporelle :</strong> Le risque vital est transféré à l'assuré, écrasant la sévérité du PML pour l'assureur.</li>
                ) : (
                  <li><strong className="text-amber-600">RC Corporelle Couverte :</strong> Exposition maximale en cas de décision algorithmique entraînant des dommages physiques.</li>
                )}

                {euAiAct >= 1.5 && (
                  <li><strong className="text-rose-600">Régulation Stricte :</strong> IA classée Haut Risque (EU AI Act). L'exposition aux amendes administratives déforme considérablement le radar.</li>
                )}
              </ul>
            </div>
          </div>

          {/* ANALYSES AVANCÉES (ESG & ROI) ET GRAPHIQUE BARRE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
            
            <div className="space-y-6 flex flex-col justify-between">
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" /> ROI de la Prévention
                  </h3>
                  <p className="text-2xl font-black text-emerald-700">
                    {calculs.economiePrevention > 0 ? `-${formatEuro(calculs.economiePrevention)}` : '0 €'}
                  </p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Économie de prime annuelle estimée</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div className="bg-teal-50 p-6 rounded-[2rem] border border-teal-100 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1 flex items-center gap-2">
                    <Leaf className="w-4 h-4" /> Score Gouvernance IA (ESG)
                  </h3>
                  <p className="text-2xl font-black text-teal-700">{calculs.esgScore} / 100</p>
                  <p className="text-[9px] font-bold text-teal-500 uppercase mt-1">Évaluation extra-financière du risque</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-teal-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 h-64 md:h-full flex flex-col">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest text-center">
                Ventilation : Rétention vs Cession ({tauxCession}% Quota Share)
              </h3>
              <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calculs.barData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" fontWeight="bold" tickMargin={10} border="none" />
                    <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} fontSize={10} stroke="#cbd5e1" />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                      {calculs.barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER : La touche institutionnelle AlgoPolis */}
      <footer className="max-w-7xl mx-auto w-full mt-12 mb-4 pt-8 border-t border-slate-200 shrink-0 print:border-t-2 print:border-slate-800">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">AlgoPolis</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Laboratoire de recherche en IA, Impact Économique et ESG
          </p>
          <div className="pt-4 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">
              Auteur : Paul Bernardski
            </p>
            <span className="w-8 h-[1px] bg-indigo-200"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

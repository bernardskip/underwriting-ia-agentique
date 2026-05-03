import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { 
  AlertTriangle, Cpu, FileText, Banknote, ShieldCheck, 
  Sliders, Scale, Leaf, TrendingDown, Award 
} from 'lucide-react';

// Formateur en Euros
const formatEuro = (val) => new Intl.NumberFormat('fr-FR', { 
  style: 'currency', 
  currency: 'EUR', 
  maximumFractionDigits: 0 
}).format(val);

// Formateur custom pour les tooltips des graphiques
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

const App = () => {
  // 1. Paramètres du Client (Exposition métier)
  const [caClient, setCaClient] = useState(150); 
  const [secteur, setSecteur] = useState(1.5); 
  const [niveauAutonomie, setNiveauAutonomie] = useState(3); 
  const [donneesSensibles, setDonneesSensibles] = useState(2); 
  
  // 2. Environnement Réglementaire & Transfert
  const [euAiAct, setEuAiAct] = useState(1.2); 
  const [tauxCession, setTauxCession] = useState(30); 

  // 3. Structuration du Programme (Mitigation)
  const [franchise, setFranchise] = useState(100000); 
  const [hasGuardrails, setHasGuardrails] = useState(false); 
  const [hasAudit, setHasAudit] = useState(true); 

  // 4. Moteur de Pricing Actuariel
  const calculs = useMemo(() => {
    // A. EXPOSITION BRUTE
    const baseExposure = caClient * 1000000 * 0.10; 
    let pmlBrut = baseExposure * secteur * (niveauAutonomie / 2) * (donneesSensibles / 1.5) * euAiAct;

    // B. MITIGATION (Réduction du risque)
    let riskDiscount = 1;
    if (hasGuardrails) riskDiscount -= 0.15; 
    if (hasAudit) riskDiscount -= 0.10; 
    const pmlNet = pmlBrut * riskDiscount;

    // C. PRIME PURE & FRANCHISE
    const probabiliteBrute = (niveauAutonomie * 0.02) + (donneesSensibles * 0.01);
    let probabiliteSinistre = probabiliteBrute * riskDiscount;
    
    let primePure = pmlNet * probabiliteSinistre;
    const discountFranchise = Math.max(0.50, 1 - (franchise / 2000000));
    primePure = primePure * discountFranchise;

    // Calcul de la prime SANS prévention (pour le calcul du ROI)
    const primePureSansPrevention = pmlBrut * probabiliteBrute * discountFranchise;
    const primeCommercialeSansPrevention = primePureSansPrevention * 1.45;

    // D. CHARGEMENTS & RÉASSURANCE
    const primeCommerciale = primePure * 1.45; 
    const primeCedee = primeCommerciale * (tauxCession / 100); 
    const primeNetteConservee = primeCommerciale - primeCedee; 

    // E. ECONOMIE DE PREVENTION (ROI)
    const economiePrevention = primeCommercialeSansPrevention - primeCommerciale;

    // F. SCORE ESG & GOUVERNANCE IA (Note sur 100)
    let baseEsg = 70;
    let esgScore = baseEsg - (niveauAutonomie * 5) - (donneesSensibles * 2) - ((euAiAct - 1) * 20);
    if (hasGuardrails) esgScore += 15;
    if (hasAudit) esgScore += 20;
    esgScore = Math.min(100, Math.max(0, esgScore));

    // G. VENTILATION DES RISQUES (Radar)
    const cyberRisk = Math.min(100, 20 * donneesSensibles * secteur * riskDiscount);
    const eoRisk = Math.min(100, 15 * niveauAutonomie * euAiAct * riskDiscount);
    const complianceRisk = Math.min(100, 30 * euAiAct * (donneesSensibles / 2));
    const biRisk = Math.min(100, 25 * niveauAutonomie * riskDiscount); 

    return {
      pml: pmlNet,
      primeCommerciale,
      primeNetteConservee,
      primeCedee,
      economiePrevention,
      esgScore,
      radarData: [
        { subject: 'Cyber Extorsion', A: cyberRisk, fullMark: 100 },
        { subject: 'E&O (Hallucination)', A: eoRisk, fullMark: 100 },
        { subject: 'Perte Exploitation', A: biRisk, fullMark: 100 },
        { subject: 'Amendes Réglementaires', A: complianceRisk, fullMark: 100 },
      ],
      barData: [
        { name: 'Prime Nette (Assureur)', value: primeNetteConservee, color: '#4f46e5' },
        { name: 'Prime Cédée (Réassureur)', value: primeCedee, color: '#0ea5e9' },
      ]
    };
  }, [caClient, secteur, niveauAutonomie, donneesSensibles, franchise, hasGuardrails, hasAudit, euAiAct, tauxCession]);

  // Handler propre pour le CA
  const handleCaChange = (e) => {
    let val = Number(e.target.value);
    setCaClient(val < 0 ? 0 : val);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 flex flex-col">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto w-full mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-6 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
            <Cpu className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Agentic AI : Underwriting Engine
            </h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              AlgoPolis - Stratégie RC Pro, Cyber & Réassurance
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* COLONNE GAUCHE : INPUTS */}
        <div className="lg:col-span-4 space-y-6">
          
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
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-2 block">Secteur</label>
                  <select value={secteur} onChange={(e) => setSecteur(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none">
                    <option value={0.8}>Retail</option>
                    <option value={1.2}>Industrie</option>
                    <option value={1.8}>Finance/Santé</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-2 block">Autonomie</label>
                  <select value={niveauAutonomie} onChange={(e) => setNiveauAutonomie(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none">
                    <option value={1}>L1 (Copilot)</option>
                    <option value={3}>L3 (Agentique)</option>
                    <option value={5}>L5 (Zero-Touch)</option>
                  </select>
                </div>
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
                  type="range" min="0" max="1000000" step="50000"
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

              <div className="pt-4 border-t border-slate-600 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${hasGuardrails ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-700 border-slate-500'}`}>
                    {hasGuardrails && <ShieldCheck className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={hasGuardrails} onChange={() => setHasGuardrails(!hasGuardrails)} />
                  <span className="text-xs font-bold text-slate-200">Garde-fous LLM (RAG)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${hasAudit ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-700 border-slate-500'}`}>
                    {hasAudit && <ShieldCheck className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={hasAudit} onChange={() => setHasAudit(!hasAudit)} />
                  <span className="text-xs font-bold text-slate-200">Audit Red-Teaming annuel</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : DASHBOARD DE PRICING (OUTPUTS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* LIGNE DES KPIS PRINCIPAUX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rose-100 relative overflow-hidden group">
              <AlertTriangle className="absolute -right-8 -bottom-8 w-40 h-40 text-rose-50 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-3">Probable Maximum Loss (PML)</h3>
                <p className="text-4xl lg:text-5xl font-black mb-2 tracking-tight text-slate-800">{formatEuro(calculs.pml)}</p>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Plafond d'exposition ajusté selon les normes de l'EU AI Act et la prévention.
                </p>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-xl shadow-indigo-200 border border-indigo-500 relative overflow-hidden group">
              <Banknote className="absolute -right-8 -bottom-8 w-40 h-40 text-indigo-500 opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-3">Prime Commerciale Totale</h3>
                <p className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{formatEuro(calculs.primeCommerciale)}</p>
                <p className="text-xs font-medium text-indigo-200 leading-relaxed">
                  Prime globale (100%) payée par l'assuré pour transférer le risque cognitif.
                </p>
              </div>
            </div>
          </div>

          {/* NOUVEAU BLOC : ANALYSES AVANCÉES (ESG & ROI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> ROI de la Prévention
                </h3>
                <p className="text-2xl font-black text-emerald-700">
                  {calculs.economiePrevention > 0 ? `-${formatEuro(calculs.economiePrevention)}` : '0 €'}
                </p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Économie de prime annuelle</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Banknote className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-[2rem] border border-teal-100 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1 flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Score de Gouvernance IA (ESG)
                </h3>
                <p className="text-2xl font-black text-teal-700">{calculs.esgScore} / 100</p>
                <p className="text-[9px] font-bold text-teal-500 uppercase mt-1">Évaluation extra-financière</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-teal-500" />
              </div>
            </div>
          </div>

          {/* LIGNE DES GRAPHIQUES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 h-80 flex flex-col">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest text-center">
                Ventilation : Rétention vs Cession
              </h3>
              <div className="flex-1 w-full min-h-[200px]">
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

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 h-80 flex flex-col">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest text-center">
                Radar de Risque Systémique
              </h3>
              <div className="flex-1 w-full min-h-[200px]">
                {/* Correction du margin et de l'outerRadius pour empêcher les coupures */}
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="50%" data={calculs.radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" fontSize={9} stroke="#64748b" fontWeight="bold" tick={{ fill: '#475569', fontSize: 9 }} />
                    <Radar 
                      name="Exposition" 
                      dataKey="A" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fill="#818cf8" 
                      fillOpacity={0.4} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER : La touche institutionnelle AlgoPolis */}
      <footer className="max-w-7xl mx-auto w-full mt-12 mb-4 pt-8 border-t border-slate-200 shrink-0">
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

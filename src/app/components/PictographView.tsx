import { useNavigate, useParams } from "react-router";
import { X, AlertCircle } from "lucide-react";
import { mockMedications } from "../data/mockData";
import { MorningIcon, NoonIcon, NightIcon, PillIcon, FoodIcon, NoFoodIcon } from "./CustomIcons";

export function PictographView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const medication = mockMedications.find(med => med.id === id);

  if (!medication) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-[#1B3022]/40 mx-auto mb-6" strokeWidth={2.5} />
          <p className="serif text-3xl text-[#1B3022]/70 mb-8">Medication not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-10 py-5 bg-[#1B3022] text-white serif text-2xl font-bold rounded-[28px] min-h-[64px] glass-shadow grain-texture"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Minimal Header */}
      <header className="px-8 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h1 className="serif text-4xl font-bold text-[#1B3022] mb-2 leading-tight">
              {medication.name}
            </h1>
            <p className="text-lg text-[#1B3022]/60 tracking-wide">Your Instructions</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-16 h-16 bg-white/70 hover:bg-white active:bg-white/90 rounded-full flex items-center justify-center transition-all glass-shadow flex-shrink-0"
            aria-label="Close and return home"
          >
            <X className="w-8 h-8 text-[#1B3022]" strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* Main Content - Large Instruction Cards */}
      <main className="flex-1 px-8 py-6 space-y-8 pb-8">
        
        {/* HERO CARD - Dosage (LARGEST ELEMENT) */}
        <div className="bg-white rounded-[32px] p-10 glass-shadow-lg grain-texture">
          <p className="text-xl text-[#1B3022]/60 mb-6 text-center tracking-widest uppercase">How Much</p>
          <div className="flex flex-col items-center justify-center gap-8">
            <PillIcon size={140} />
            {/* LARGEST TEXT ON SCREEN */}
            <div className="text-center">
              <div className="serif text-[120px] leading-none font-bold text-[#1B3022] mb-4">
                {medication.dosage.amount}
              </div>
              <p className="serif text-4xl font-bold text-[#1B3022]/80 tracking-wide">
                {medication.dosage.unit.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Timing Card */}
        <div className="bg-white rounded-[32px] p-10 glass-shadow grain-texture">
          <p className="text-xl text-[#1B3022]/60 mb-8 text-center tracking-widest uppercase">When to Take</p>
          <div className="grid grid-cols-3 gap-6">
            {/* Morning */}
            <div className={`flex flex-col items-center transition-all ${
              medication.timing.morning ? 'opacity-100' : 'opacity-20'
            }`}>
              <MorningIcon size={100} />
              <p className="serif text-xl font-bold text-[#1B3022] mt-4">Morning</p>
            </div>

            {/* Noon */}
            <div className={`flex flex-col items-center transition-all ${
              medication.timing.noon ? 'opacity-100' : 'opacity-20'
            }`}>
              <NoonIcon size={100} />
              <p className="serif text-xl font-bold text-[#1B3022] mt-4">Noon</p>
            </div>

            {/* Night */}
            <div className={`flex flex-col items-center transition-all ${
              medication.timing.night ? 'opacity-100' : 'opacity-20'
            }`}>
              <NightIcon size={100} />
              <p className="serif text-xl font-bold text-[#1B3022] mt-4">Night</p>
            </div>
          </div>
        </div>

        {/* Food Instructions Card */}
        {medication.withFood !== null && (
          <div className={`rounded-[32px] p-10 glass-shadow grain-texture ${
            medication.withFood 
              ? 'bg-[#2D5F3F]/10 border-4 border-[#2D5F3F]/30' 
              : 'bg-[#D37B5C]/10 border-4 border-[#D37B5C]/30'
          }`}>
            <p className="text-xl text-[#1B3022]/60 mb-8 text-center tracking-widest uppercase">
              {medication.withFood ? 'Take With Food' : 'Take on Empty Stomach'}
            </p>
            <div className="flex justify-center">
              {medication.withFood ? (
                <FoodIcon size={120} />
              ) : (
                <NoFoodIcon size={120} />
              )}
            </div>
          </div>
        )}

        {/* Full Instructions - Calm Typography */}
        <div className="bg-white/50 backdrop-blur-sm rounded-[32px] p-10 glass-shadow">
          <p className="text-xl text-[#1B3022]/60 mb-6 tracking-widest uppercase">Complete Instructions</p>
          <p className="text-2xl text-[#1B3022] leading-relaxed tracking-wide">
            {medication.instructions}
          </p>
        </div>
      </main>

      {/* Action Buttons - Generous Spacing */}
      <footer className="px-8 py-8 bg-[#F5F2ED]">
        <div className="space-y-4">
          <button
            onClick={() => navigate("/scan")}
            className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[28px] py-7 serif text-3xl font-bold transition-all min-h-[80px] glass-shadow-lg grain-texture"
            aria-label="Scan another medicine"
          >
            Scan Another
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white/70 hover:bg-white active:bg-white/90 text-[#1B3022] rounded-[28px] py-6 serif text-2xl font-bold transition-all min-h-[72px] glass-shadow"
            aria-label="Return to home"
          >
            Done
          </button>
        </div>
      </footer>
    </div>
  );
}
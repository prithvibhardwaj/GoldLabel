import { useNavigate } from "react-router";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { mockMedications } from "../data/mockData";
import { format, formatDistanceToNow } from "date-fns";

export function HistoryView() {
  const navigate = useNavigate();

  // Sort by date (most recent first)
  const sortedMeds = [...mockMedications].sort((a, b) =>
    b.scannedAt.getTime() - a.scannedAt.getTime()
  );

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <header className="px-8 pt-10 pb-8">
        <div className="flex items-center gap-5 mb-2">
          <button
            onClick={() => navigate("/")}
            className="w-16 h-16 bg-white/70 hover:bg-white active:bg-white/90 rounded-full flex items-center justify-center transition-all glass-shadow"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-8 h-8 text-[#1B3022]" strokeWidth={3} />
          </button>
          <h1 className="serif text-4xl font-bold text-[#1B3022]">Your Timeline</h1>
        </div>
        <p className="text-xl text-[#1B3022]/60 tracking-wide ml-[84px]">
          {sortedMeds.length} scanned medication{sortedMeds.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Main Content - Vertical Timeline */}
      <main className="flex-1 px-8 py-6">
        {sortedMeds.length === 0 ? (
          <div className="bg-white/50 rounded-[32px] p-16 text-center glass-shadow">
            <Clock className="w-24 h-24 text-[#1B3022]/30 mx-auto mb-8" strokeWidth={2} />
            <p className="serif text-3xl font-bold text-[#1B3022]/60 mb-4">No History Yet</p>
            <p className="text-xl text-[#1B3022]/50 tracking-wide">
              Scanned medications will appear here
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-[#1B3022]/20 rounded-full" />

            <div className="space-y-6">
              {sortedMeds.map((med, _index) => (
                <div key={med.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-8 w-12 h-12 bg-[#1B3022] rounded-full flex items-center justify-center glass-shadow-lg z-10">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>

                  {/* Card */}
                  <button
                    onClick={() => navigate(`/verify/${med.id}`)}
                    className="w-full ml-16 bg-white hover:bg-white/90 active:bg-white/70 rounded-[28px] p-8 text-left transition-all glass-shadow grain-texture"
                    style={{ minHeight: "140px" }}
                    aria-label={`View scan from ${formatDistanceToNow(med.scannedAt, { addSuffix: true })}`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        {/* Time as PRIMARY TEXT - Large and Bold */}
                        <h3 className="serif text-4xl font-bold text-[#1B3022] mb-2">
                          {format(med.scannedAt, "h:mm a")}
                        </h3>

                        {/* Date as secondary large text */}
                        <p className="text-2xl text-[#1B3022]/80 tracking-wide mb-2">
                          {format(med.scannedAt, "MMMM d, yyyy")}
                        </p>

                        {/* Relative time */}
                        <p className="text-lg text-[#1B3022]/50 tracking-wide">
                          {formatDistanceToNow(med.scannedAt, { addSuffix: true })}
                        </p>
                      </div>

                      {/* Small Square Thumbnail of Printed Label */}
                      <div className="w-28 h-28 bg-white rounded-2xl border-[3px] border-[#1B3022]/20 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                        <div className="scale-50">
                          <div className="grid grid-cols-2 gap-1">
                            {/* Mini pictogram icons as thumbnail preview */}
                            <div className="w-12 h-12 bg-[#FFEB3B] rounded-lg"></div>
                            <div className="w-12 h-12 bg-[#D37B5C] rounded-lg"></div>
                            <div className="w-12 h-12 bg-[#6B7FD7] rounded-lg"></div>
                            <div className="w-12 h-12 bg-[#A5D6A7] rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer with action */}
      <footer className="px-8 py-8">
        <button
          onClick={() => navigate("/scan")}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[28px] py-7 serif text-3xl font-bold transition-all min-h-[80px] glass-shadow-lg grain-texture"
          aria-label="Scan new medication"
        >
          Scan New Medication
        </button>
      </footer>
    </div>
  );
}
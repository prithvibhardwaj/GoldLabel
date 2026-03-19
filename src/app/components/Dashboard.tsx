import { useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Phone, Mail } from "lucide-react";
import { mockMedications } from "../data/mockData";
import { format, formatDistanceToNow, isToday, isThisWeek } from "date-fns";

// Tiny label sticker thumbnail — 4 coloured pictogram squares
function LabelThumbnail() {
  return (
    <div className="w-20 h-20 bg-white rounded-2xl border-[3px] border-[#1B3022]/15 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
      <div className="grid grid-cols-2 gap-[3px] p-1">
        <div className="w-7 h-7 rounded-md" style={{ background: "#FDB462" }} />
        <div className="w-7 h-7 rounded-md" style={{ background: "#D37B5C" }} />
        <div className="w-7 h-7 rounded-md" style={{ background: "#6B7FD7" }} />
        <div className="w-7 h-7 rounded-md" style={{ background: "#A5D6A7" }} />
      </div>
    </div>
  );
}

type TabId = "today" | "week" | "all";

const TABS: { id: TabId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "all", label: "All" },
];

function filterMeds(meds: typeof mockMedications, tab: TabId) {
  if (tab === "today") return meds.filter((m) => isToday(m.scannedAt));
  if (tab === "week") return meds.filter((m) => isThisWeek(m.scannedAt, { weekStartsOn: 1 }));
  return meds;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const sortedMeds = [...mockMedications].sort(
    (a, b) => b.scannedAt.getTime() - a.scannedAt.getTime()
  );

  const filteredMeds = filterMeds(sortedMeds, activeTab);

  return (
    <div className="min-h-dvh bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-4">
        <h1 className="serif text-4xl font-bold text-[#1B3022] leading-tight mb-1">
          GoldLabel
        </h1>
        <p className="text-lg text-[#1B3022]/60 tracking-wide">
          Your scan history
        </p>
      </header>

      {/* Tab bar */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 bg-white/50 backdrop-blur-sm rounded-[16px] p-1 glass-shadow">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-[12px] py-2.5 text-[15px] font-semibold tracking-wide transition-all ${
                activeTab === tab.id
                  ? "bg-[#1B3022] text-white shadow-md"
                  : "text-[#1B3022]/55 hover:text-[#1B3022]/80"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scan History List — scrollable */}
      <main className="flex-1 px-6 pb-56 overflow-y-auto">
        {filteredMeds.length === 0 ? (
          <div className="bg-white/60 rounded-[24px] p-12 text-center glass-shadow mt-4">
            <Camera className="w-16 h-16 text-[#1B3022]/25 mx-auto mb-5" strokeWidth={1.5} />
            <p className="serif text-2xl font-bold text-[#1B3022]/50 mb-2">
              {activeTab === "today" ? "No scans today" : activeTab === "week" ? "No scans this week" : "No scans yet"}
            </p>
            <p className="text-lg text-[#1B3022]/40 tracking-wide">
              Tap "Scan Label" below to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeds.map((med) => (
              <button
                key={med.id}
                onClick={() => navigate(`/print-preview/${med.id}`)}
                className="w-full bg-white/70 backdrop-blur-sm hover:bg-white active:bg-white/90 rounded-[20px] px-6 py-5 text-left transition-all glass-shadow grain-texture"
                style={{ minHeight: "88px" }}
                aria-label={`View label scanned at ${format(med.scannedAt, "h:mm a")}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Time — primary, largest */}
                    <h2 className="serif text-3xl font-bold text-[#1B3022] leading-tight">
                      {format(med.scannedAt, "h:mm a")}
                    </h2>
                    {/* Date — secondary */}
                    <p className="text-[17px] text-[#1B3022]/75 tracking-wide mt-0.5">
                      {format(med.scannedAt, "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-[#1B3022]/45 mt-0.5">
                      {formatDistanceToNow(med.scannedAt, { addSuffix: true })}
                    </p>
                  </div>
                  {/* Label thumbnail */}
                  <LabelThumbnail />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Contact / Help Section */}
        <div className="mt-8 mb-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-[20px] px-5 py-5 glass-shadow">
            <p className="text-[11px] font-bold text-[#1B3022]/40 uppercase tracking-widest mb-3">
              Need Help?
            </p>
            <div className="space-y-3">
              <a
                href="tel:1800-222-0222"
                className="flex items-center gap-3 group"
                aria-label="Call support hotline"
              >
                <div className="w-9 h-9 bg-[#1B3022]/8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B3022]/15 transition-colors">
                  <Phone className="w-4 h-4 text-[#1B3022]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] text-[#1B3022]/50 leading-tight">Hotline</p>
                  <p className="text-[16px] font-semibold text-[#1B3022]">1800-222-0222</p>
                </div>
              </a>
              <div className="border-t border-[#1B3022]/8" />
              <a
                href="mailto:help@goldlabel.sg"
                className="flex items-center gap-3 group"
                aria-label="Email support"
              >
                <div className="w-9 h-9 bg-[#1B3022]/8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B3022]/15 transition-colors">
                  <Mail className="w-4 h-4 text-[#1B3022]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] text-[#1B3022]/50 leading-tight">Email</p>
                  <p className="text-[16px] font-semibold text-[#1B3022]">help@goldlabel.sg</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky "Scan Label" CTA */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-6 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/95 to-transparent z-30"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))", maxWidth: "430px", marginLeft: "auto", marginRight: "auto" }}
      >
        <button
          onClick={() => navigate("/scan")}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[999px] py-5 flex items-center justify-center gap-3 transition-all glass-shadow-lg transform active:scale-[0.98]"
          style={{ minHeight: "64px" }}
          aria-label="Scan a new medicine label"
        >
          <Camera className="w-6 h-6" strokeWidth={2.5} />
          <span className="serif text-2xl font-bold">Scan Label</span>
        </button>
      </footer>
    </div>
  );
}
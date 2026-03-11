import { useNavigate, useParams, useLocation } from "react-router";
import { ArrowLeft, Printer } from "lucide-react";
import {
  TIME_OPTIONS,
  HOW_TO_TAKE_OPTIONS,
  SIDE_EFFECT_OPTIONS,
  getIcon,
  type OptionSelection,
} from "./PictogramData";
import { PillIcon } from "./CustomIcons";


export function PrintPreview() {
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const location = useLocation();

  const {
    timeSelections = { morning: "v0" } as Record<string, string>,
    pillCount = 1,
    howToTakeSelection = { optionId: "crush", variantId: "v0" } as OptionSelection,
    sideEffectSelection = { optionId: "drowsiness", variantId: "v0" } as OptionSelection,
    howLong = "",
    others = "",
    includeOnLabel = {},
  } = location.state || {};

  const inc = (key: string) => includeOnLabel?.[key] !== false;
  const showDuration = inc("howLong") && howLong?.trim().length > 0;
  const showOthers = inc("others") && others?.trim().length > 0;

  // Build visible sections — one per category, equal grid columns
  type Section = { key: string; label: string; content: React.ReactNode };
  const sections: Section[] = [];

  if (inc("timeOfDay") && Object.keys(timeSelections).length > 0) {
    const timeIcons = TIME_OPTIONS
      .filter((o) => o.id in timeSelections)
      .map((o) => getIcon(TIME_OPTIONS, o.id, timeSelections[o.id], 36));
    const iconSize = timeIcons.length > 2 ? 26 : timeIcons.length > 1 ? 32 : 40;
    const timeIconsResized = TIME_OPTIONS
      .filter((o) => o.id in timeSelections)
      .map((o) => getIcon(TIME_OPTIONS, o.id, timeSelections[o.id], iconSize));
    sections.push({
      key: "time",
      label: "Time",
      content: (
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {timeIconsResized.map((icon, i) => <span key={i}>{icon}</span>)}
        </div>
      ),
    });
  }

  if (inc("dosage")) {
    const pillSize = pillCount > 5 ? 16 : pillCount > 3 ? 20 : 26;
    sections.push({
      key: "dosage",
      label: "Dosage",
      content: (
        <div className="flex items-center justify-center gap-0.5 flex-wrap">
          {Array.from({ length: pillCount }).map((_, i) => (
            <PillIcon key={i} size={pillSize} />
          ))}
        </div>
      ),
    });
  }

  if (inc("howToTake")) {
    sections.push({
      key: "howToTake",
      label: "How to take",
      content: getIcon(HOW_TO_TAKE_OPTIONS, howToTakeSelection.optionId, howToTakeSelection.variantId, 40),
    });
  }

  if (inc("sideEffects")) {
    sections.push({
      key: "sideEffects",
      label: "Side effects",
      content: getIcon(SIDE_EFFECT_OPTIONS, sideEffectSelection.optionId, sideEffectSelection.variantId, 40),
    });
  }

  const handlePrint = () => {
    alert("Printing label…\n\nIn production, this would connect to a label printer or generate a PDF.");
    navigate("/");
  };

  return (
    <div className="min-h-dvh bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-5 bg-[#F5F2ED]">
        <div className="flex items-center gap-4 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all glass-shadow flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1B3022]" strokeWidth={2.5} />
          </button>
          <h1 className="serif text-3xl font-bold text-[#1B3022] leading-tight">Print Preview</h1>
        </div>
        <p className="text-[15px] text-[#1B3022]/55 ml-[60px]">Your confirmed label combination</p>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-36">
        <p className="text-[13px] text-[#1B3022]/40 uppercase tracking-widest font-semibold mb-5">
          Physical sticker label
        </p>

        <div
          className="bg-white rounded-2xl border border-[#1B3022]/12 w-full"
          style={{ maxWidth: "340px", boxShadow: "0 8px 32px rgba(27,48,34,0.14), 0 2px 8px rgba(27,48,34,0.08)" }}
        >
          {/* Equal-width grid — one section per included category */}
          {sections.length > 0 && (
            <div
              style={{ display: "grid", gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}
            >
              {sections.map((sec, i) => (
                <div
                  key={sec.key}
                  className={`flex flex-col items-center justify-center gap-2 py-5 px-2 ${i > 0 ? "border-l border-[#1B3022]/10" : ""}`}
                >
                  <div className="flex items-center justify-center" style={{ minHeight: "44px" }}>
                    {sec.content}
                  </div>
                  <p className="text-[8px] font-bold text-[#1B3022] uppercase tracking-widest text-center leading-tight">
                    {sec.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Text row */}
          {(showDuration || showOthers) && (
            <div className="border-t border-[#1B3022]/10 mx-4 py-3">
              <p className="text-[11px] text-[#1B3022]/80 text-center leading-relaxed font-medium">
                {showDuration ? `Take for ${howLong}` : ""}
                {showDuration && showOthers ? "  ·  " : ""}
                {showOthers ? others : ""}
              </p>
            </div>
          )}
        </div>

        <p className="text-[13px] text-[#1B3022]/40 text-center mt-6 leading-relaxed px-8">
          This sticker will be printed and attached to your medicine bottle
        </p>
      </main>

      {/* Print button */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-6 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/95 to-transparent z-30"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))", maxWidth: "430px", marginLeft: "auto", marginRight: "auto" }}
      >
        <button
          onClick={handlePrint}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[999px] py-5 serif text-2xl font-bold transition-all glass-shadow-lg transform active:scale-[0.98] flex items-center justify-center gap-3"
          style={{ minHeight: "64px" }}
        >
          <Printer className="w-6 h-6" strokeWidth={2} />
          <span>Print Label</span>
        </button>
      </footer>
    </div>
  );
}

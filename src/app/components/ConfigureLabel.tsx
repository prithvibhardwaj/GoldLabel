import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ArrowLeft, Pencil, X, Check } from "lucide-react";
import {
  TIME_OPTIONS,
  HOW_TO_TAKE_OPTIONS,
  SIDE_EFFECT_OPTIONS,
  getIcon,
  type PictogramOption,
  type OptionSelection,
} from "./PictogramData";
import { PillIcon } from "./CustomIcons";



// ─── Label formats ────────────────────────────────────────────────────────────
type LabelFormat = "box" | "bottle" | "ziplock";

const FORMAT_OPTIONS: { id: LabelFormat; label: string; emoji: string; desc: string }[] = [
  { id: "box", label: "Box", emoji: "📦", desc: "Square grid" },
  { id: "bottle", label: "Bottle", emoji: "🧴", desc: "Wide strip" },
  { id: "ziplock", label: "Ziplock", emoji: "🫙", desc: "Narrow strip" },
];

// ─── Bottom sheet picker ──────────────────────────────────────────────────────
function BottomSheet({
  categoryLabel,
  options,
  currentOptionId,
  currentVariantId,
  onSelect,
  onClose,
  multiSelect,
  multiSelections,
  onMultiToggle,
}: {
  categoryLabel: string;
  options: PictogramOption[];
  currentOptionId?: string;
  currentVariantId?: string;
  onSelect?: (optionId: string, variantId: string) => void;
  onClose: () => void;
  multiSelect?: boolean;
  multiSelections?: Record<string, string>;
  onMultiToggle?: (optionId: string, variantId: string) => void;
}) {
  // For variant picking within bottom sheet
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F2ED] rounded-t-[28px] px-6 pt-5 pb-8 glass-shadow-lg"
        style={{ maxWidth: "430px", marginLeft: "auto", marginRight: "auto", paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="serif text-xl font-bold text-[#1B3022]">{categoryLabel}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#1B3022]/10 rounded-full flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#1B3022]" />
          </button>
        </div>
        <p className="text-[13px] text-[#1B3022]/50 mb-4">
          {multiSelect ? "Select all that apply · tap again to pick a style" : "Tap to select · tap again for style options"}
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {options.map((opt) => {
            const isSelected = multiSelect
              ? !!(multiSelections && opt.id in multiSelections)
              : currentOptionId === opt.id;
            const varId = multiSelect
              ? multiSelections?.[opt.id] ?? "v0"
              : (isSelected ? (currentVariantId ?? "v0") : "v0");
            const icon = opt.variants.find(v => v.id === varId)?.icon(52) ?? opt.variants[0].icon(52);
            const isExpanded = expandedOptionId === opt.id;

            return (
              <div key={opt.id} className="flex-shrink-0 snap-center" style={{ width: "96px" }}>
                <button
                  onClick={() => {
                    if (multiSelect) {
                      onMultiToggle?.(opt.id, varId);
                    } else {
                      if (isSelected) {
                        setExpandedOptionId(isExpanded ? null : opt.id);
                      } else {
                        onSelect?.(opt.id, "v0");
                        setExpandedOptionId(opt.id);
                      }
                    }
                  }}
                  className={`w-full flex flex-col items-center rounded-[16px] p-3 transition-all ${
                    isSelected
                      ? "border-[3px] border-[#1B3022] bg-white shadow-md"
                      : "border-[2px] border-transparent bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-center h-14">{icon}</div>
                  <p className="text-[11px] font-semibold text-[#1B3022] text-center mt-2 leading-tight">{opt.label}</p>
                  {isSelected && <div className="w-4 h-4 bg-[#1B3022] rounded-full flex items-center justify-center mt-1.5">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>}
                </button>
                {/* Variant strip */}
                {isSelected && (isExpanded || !multiSelect) && opt.variants.length > 1 && (
                  <div className="flex gap-1 mt-1.5 justify-center">
                    {opt.variants.map((v) => {
                      const varActive = multiSelect
                        ? multiSelections?.[opt.id] === v.id
                        : currentVariantId === v.id || (!currentVariantId && v.id === "v0");
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            if (multiSelect) onMultiToggle?.(opt.id, v.id);
                            else onSelect?.(opt.id, v.id);
                          }}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            varActive ? "border-[#1B3022] bg-[#1B3022]/10" : "border-[#1B3022]/20 bg-white"
                          }`}
                          title={v.label}
                        >
                          <div className="scale-50 origin-center">{v.icon(28)}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dosage special: variant rows handled elsewhere */}
      </div>
    </>
  );
}

// ─── Dosage bottom sheet ──────────────────────────────────────────────────────
function DosageSheet({ pillCount, onChange, onClose }: {
  pillCount: number;
  onChange: (n: number) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F2ED] rounded-t-[28px] px-6 pt-5 pb-8 glass-shadow-lg"
        style={{ maxWidth: "430px", marginLeft: "auto", marginRight: "auto", paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="serif text-xl font-bold text-[#1B3022]">Dosage</h3>
          <button onClick={onClose} className="w-9 h-9 bg-[#1B3022]/10 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-[#1B3022]" />
          </button>
        </div>
        <p className="text-[14px] text-[#1B3022]/50 mb-4">Pills per dose</p>
        {/* Grid of pill counts */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`h-11 rounded-[10px] text-lg font-bold transition-all ${
                pillCount === n
                  ? "bg-[#1B3022] text-white shadow-md"
                  : "bg-white/80 text-[#1B3022] hover:bg-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {/* Pill preview */}
        <div className="flex items-center justify-center gap-1 flex-wrap bg-white/60 rounded-[16px] p-4 min-h-[64px]">
          {Array.from({ length: pillCount }).map((_, i) => (
            <PillIcon key={i} size={pillCount > 6 ? 20 : pillCount > 4 ? 26 : 32} />
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Live Label Card ──────────────────────────────────────────────────────────
function LiveLabel({
  format,
  timeSelections,
  pillCount,
  howToTakeSelection,
  sideEffectSelection,
  howLong,
  others,
  includeOnLabel,
  onTapCategory,
}: {
  format: LabelFormat;
  timeSelections: Record<string, string>;
  pillCount: number;
  howToTakeSelection: OptionSelection;
  sideEffectSelection: OptionSelection;
  howLong: string;
  others: string;
  includeOnLabel: Record<string, boolean>;
  onTapCategory: (cat: string) => void;
}) {
  const inc = (key: string) => includeOnLabel?.[key] !== false;
  const showDuration = inc("howLong") && howLong?.trim().length > 0;
  const showOthers = inc("others") && others?.trim().length > 0;

  type CatDef = { key: string; label: string; content: React.ReactNode };
  const cats: CatDef[] = [];

  if (inc("timeOfDay") && Object.keys(timeSelections).length > 0) {
    const iconSize = Object.keys(timeSelections).length > 2 ? 22 : Object.keys(timeSelections).length > 1 ? 28 : 36;
    cats.push({
      key: "time",
      label: "Time",
      content: (
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {TIME_OPTIONS.filter(o => o.id in timeSelections).map((o, i) =>
            <span key={i}>{getIcon(TIME_OPTIONS, o.id, timeSelections[o.id], iconSize)}</span>
          )}
        </div>
      ),
    });
  }
  if (inc("dosage")) {
    const sz = pillCount > 5 ? 14 : pillCount > 3 ? 18 : 24;
    cats.push({
      key: "dosage",
      label: "Dosage",
      content: <div className="flex items-center justify-center gap-0.5 flex-wrap">
        {Array.from({ length: pillCount }).map((_, i) => <PillIcon key={i} size={sz} />)}
      </div>,
    });
  }
  if (inc("howToTake")) {
    cats.push({
      key: "howToTake",
      label: "How to take",
      content: getIcon(HOW_TO_TAKE_OPTIONS, howToTakeSelection.optionId, howToTakeSelection.variantId, format === "ziplock" ? 28 : 36),
    });
  }
  if (inc("sideEffects")) {
    cats.push({
      key: "sideEffects",
      label: "Side effects",
      content: getIcon(SIDE_EFFECT_OPTIONS, sideEffectSelection.optionId, sideEffectSelection.variantId, format === "ziplock" ? 28 : 36),
    });
  }

  // Layout logic
  const isZiplock = format === "ziplock";
  const isBottle = format === "bottle";

  return (
    <div
      className="bg-white rounded-2xl border border-[#1B3022]/12 overflow-hidden mx-auto transition-all duration-300"
      style={{
        width: isZiplock ? "200px" : isBottle ? "340px" : "300px",
        boxShadow: "0 8px 32px rgba(27,48,34,0.14), 0 2px 8px rgba(27,48,34,0.08)",
      }}
    >
      {/* Pictogram grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isZiplock
            ? "1fr"
            : isBottle
            ? `repeat(${cats.length}, 1fr)`
            : `repeat(${Math.min(cats.length, 2)}, 1fr)`,
        }}
      >
        {cats.map((cat, i) => {
          const isRight = !isZiplock && !isBottle && i % 2 === 1;
          const isBottom = !isZiplock && !isBottle && i >= 2;
          return (
            <button
              key={cat.key}
              onClick={() => onTapCategory(cat.key)}
              className={`relative group flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-[#1B3022]/5 active:bg-[#1B3022]/10 ${
                isRight ? "border-l border-[#1B3022]/10" : ""
              } ${isBottom ? "border-t border-[#1B3022]/10" : ""} ${
                isZiplock ? "border-b border-[#1B3022]/10 last:border-b-0" : ""
              } ${isBottle && i > 0 ? "border-l border-[#1B3022]/10" : ""}`}
              style={{ padding: isZiplock ? "10px 16px" : isBottle ? "14px 8px" : "14px 8px", minHeight: isZiplock ? "52px" : "72px" }}
              aria-label={`Edit ${cat.label}`}
            >
              {/* Edit badge */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-5 h-5 bg-[#1B3022] rounded-full flex items-center justify-center shadow">
                  <Pencil className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex items-center justify-center" style={{ minHeight: isZiplock ? "28px" : "40px" }}>
                {cat.content}
              </div>
              <p className="text-[8px] font-bold text-[#1B3022] uppercase tracking-widest text-center leading-tight">
                {cat.label}
              </p>
            </button>
          );
        })}
      </div>
      {/* Text row */}
      {(showDuration || showOthers) && (
        <div className="border-t border-[#1B3022]/10 px-4 py-2">
          <p className="text-[10px] text-[#1B3022]/80 text-center leading-relaxed font-medium">
            {showDuration ? `Take for ${howLong}` : ""}
            {showDuration && showOthers ? "  ·  " : ""}
            {showOthers ? others : ""}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function ConfigureLabel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const {
    language = "en",
    dosage: ocrDosage = "1",
    howLong = "",
    others = "",
    includeOnLabel = {},
  } = location.state || {};

  const parseCount = (text: string) => {
    const match = String(text).match(/\d+/);
    const n = match ? parseInt(match[0], 10) : 1;
    return Math.min(Math.max(1, n), 10);
  };

  const [timeSelections, setTimeSelections] = useState<Record<string, string>>({ morning: "v0" });
  const [howToTakeSelection, setHowToTakeSelection] = useState<OptionSelection>({ optionId: "crush", variantId: "v0" });
  const [sideEffectSelection, setSideEffectSelection] = useState<OptionSelection>({ optionId: "drowsiness", variantId: "v0" });
  const [pillCount, setPillCount] = useState(parseCount(ocrDosage));
  const [labelFormat, setLabelFormat] = useState<LabelFormat>("box");
  const [openSheet, setOpenSheet] = useState<string | null>(null); // "time"|"dosage"|"howToTake"|"sideEffects"

  const closeSheet = () => setOpenSheet(null);

  const handleAssemble = () => {
    navigate(`/print-preview/${id || "1"}`, {
      state: {
        timeSelections,
        pillCount,
        howToTakeSelection,
        sideEffectSelection,
        language,
        howLong,
        others,
        includeOnLabel,
        labelFormat,
      },
    });
  };

  return (
    <div className="min-h-dvh bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 bg-[#F5F2ED] sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all glass-shadow flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1B3022]" strokeWidth={2.5} />
          </button>
          <h1 className="serif text-3xl font-bold text-[#1B3022] leading-tight">
            Preview &amp; Alternatives
          </h1>
        </div>
        <p className="text-[15px] text-[#1B3022]/55 ml-[60px]">
          Tap any pictogram to swap it — or just hit Confirm
        </p>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 px-6 py-3 pb-40 overflow-y-auto">
        {/* Live label */}
        <div className="flex justify-center mb-6">
          <LiveLabel
            format={labelFormat}
            timeSelections={timeSelections}
            pillCount={pillCount}
            howToTakeSelection={howToTakeSelection}
            sideEffectSelection={sideEffectSelection}
            howLong={howLong}
            others={others}
            includeOnLabel={includeOnLabel}
            onTapCategory={(cat) => setOpenSheet(cat)}
          />
        </div>

        <p className="text-[12px] text-[#1B3022]/40 text-center mb-6 leading-relaxed">
          Tap a pictogram cell to see alternatives for that category
        </p>

        {/* Format selector */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-[#1B3022]/40 uppercase tracking-widest mb-2 px-1">
            Label format
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FORMAT_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => setLabelFormat(f.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-[14px] transition-all ${
                  labelFormat === f.id
                    ? "bg-[#1B3022] text-white shadow-md"
                    : "bg-white/70 text-[#1B3022] glass-shadow hover:bg-white"
                }`}
                aria-pressed={labelFormat === f.id}
              >
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-[13px] font-bold">{f.label}</span>
                <span className={`text-[10px] ${labelFormat === f.id ? "text-white/70" : "text-[#1B3022]/45"}`}>{f.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* CTA */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-6 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/95 to-transparent z-30"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))", maxWidth: "430px", marginLeft: "auto", marginRight: "auto" }}
      >
        <button
          onClick={handleAssemble}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[999px] py-5 serif text-xl font-bold transition-all glass-shadow-lg transform active:scale-[0.98]"
          style={{ minHeight: "64px" }}
        >
          Confirm Label →
        </button>
      </footer>

      {/* Bottom sheets */}
      {openSheet === "time" && (
        <BottomSheet
          categoryLabel="Time of Day"
          options={TIME_OPTIONS}
          multiSelect
          multiSelections={timeSelections}
          onMultiToggle={(optionId, variantId) => {
            setTimeSelections((prev) => {
              if (optionId in prev) {
                // If same variant, remove
                if (prev[optionId] === variantId && Object.keys(prev).length > 1) {
                  const next = { ...prev };
                  delete next[optionId];
                  return next;
                }
                return { ...prev, [optionId]: variantId };
              }
              return { ...prev, [optionId]: variantId };
            });
          }}
          onClose={closeSheet}
        />
      )}
      {openSheet === "dosage" && (
        <DosageSheet pillCount={pillCount} onChange={setPillCount} onClose={closeSheet} />
      )}
      {openSheet === "howToTake" && (
        <BottomSheet
          categoryLabel="How to Take Medication"
          options={HOW_TO_TAKE_OPTIONS}
          currentOptionId={howToTakeSelection.optionId}
          currentVariantId={howToTakeSelection.variantId}
          onSelect={(optionId, variantId) => {
            setHowToTakeSelection({ optionId, variantId });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}
      {openSheet === "sideEffects" && (
        <BottomSheet
          categoryLabel="Side Effects"
          options={SIDE_EFFECT_OPTIONS}
          currentOptionId={sideEffectSelection.optionId}
          currentVariantId={sideEffectSelection.variantId}
          onSelect={(optionId, variantId) => {
            setSideEffectSelection({ optionId, variantId });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}

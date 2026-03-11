import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  TIME_OPTIONS,
  HOW_TO_TAKE_OPTIONS,
  SIDE_EFFECT_OPTIONS,
  getIcon,
  type PictogramOption,
  type OptionSelection,
} from "./PictogramData";
import { PillIcon } from "./CustomIcons";

// Translated labels for text fields
const TEXT_LABELS: Record<string, { durationLabel: string; othersLabel: string }> = {
  en: { durationLabel: "How long to take for", othersLabel: "Others" },
  ta: { durationLabel: "எவ்வளவு நேரம் எடுக்க வேண்டும்", othersLabel: "மற்றவை" },
  zh: { durationLabel: "服用时长", othersLabel: "其他" },
  hi: { durationLabel: "कितने दिन लेना है", othersLabel: "अन्य" },
  ms: { durationLabel: "Berapa lama perlu diambil", othersLabel: "Lain-lain" },
};

// ─── Variant picker panel ────────────────────────────────────────────────────

function VariantPicker({
  option,
  currentVariantId,
  onSelect,
  onClose,
}: {
  option: PictogramOption;
  currentVariantId: string | undefined;
  onSelect: (variantId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="mt-2 bg-white rounded-[16px] p-4 glass-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold text-[#1B3022]">
          Choose style for <span className="text-[#D37B5C]">{option.label}</span>
        </p>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F5F2ED]">
          <X className="w-4 h-4 text-[#1B3022]/60" />
        </button>
      </div>
      <div className="flex gap-3">
        {option.variants.map((variant) => {
          const isActive = currentVariantId === variant.id || (!currentVariantId && variant.id === "v0");
          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              className={`flex-1 flex flex-col items-center rounded-[12px] p-3 transition-all ${
                isActive
                  ? "border-[3px] border-[#1B3022] bg-white shadow-md"
                  : "border-[2px] border-transparent bg-[#F5F2ED] hover:border-[#1B3022]/20"
              }`}
            >
              <div className="flex items-center justify-center" style={{ height: "58px" }}>
                {variant.icon(58)}
              </div>
              {isActive && (
                <div className="mt-2 w-5 h-5 bg-[#1B3022] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Option card in carousel ─────────────────────────────────────────────────

function OptionCard({
  option,
  isSelected,
  currentVariantId,
  isPickerOpen,
  onTap,
  onRemove,
  multiSelect,
}: {
  option: PictogramOption;
  isSelected: boolean;
  currentVariantId: string | undefined;
  isPickerOpen: boolean;
  onTap: () => void;
  onRemove?: () => void;
  multiSelect: boolean;
}) {
  const icon = isSelected && currentVariantId
    ? option.variants.find((v) => v.id === currentVariantId)?.icon(64) ?? option.variants[0].icon(64)
    : option.variants[0].icon(64);

  return (
    <button
      onClick={onTap}
      className={`relative flex-shrink-0 flex flex-col items-center rounded-[16px] p-4 transition-all snap-center ${
        isSelected
          ? isPickerOpen
            ? "border-[3px] border-[#D37B5C] bg-white shadow-lg scale-105"
            : "border-[3px] border-[#1B3022] bg-white shadow-lg scale-105"
          : "border-[2px] border-transparent bg-white/80 glass-shadow hover:border-[#1B3022]/20"
      }`}
      style={{ width: "118px", minHeight: "148px" }}
      aria-label={`${option.label} — tap to choose style`}
    >
      {/* Remove button (multi-select only) */}
      {multiSelect && isSelected && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="absolute top-2 left-2 w-5 h-5 bg-[#D37B5C] rounded-full flex items-center justify-center"
          aria-label={`Remove ${option.label}`}
        >
          <X className="w-3 h-3 text-white" strokeWidth={3} />
        </button>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isPickerOpen ? "bg-[#D37B5C]" : "bg-[#1B3022]"}`}>
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </div>
      )}

      <div className="flex items-center justify-center mb-3 h-16">{icon}</div>
      <p className="text-center text-[13px] font-semibold text-[#1B3022] leading-tight">{option.label}</p>
      <p className="text-center text-[10px] text-[#1B3022]/40 mt-1 leading-tight">
        {isSelected ? "Tap to change style" : "Tap to choose"}
      </p>
    </button>
  );
}

// ─── Full picker: carousel + variant panel ───────────────────────────────────

function PictogramPicker({
  options,
  selections,  // { optionId: variantId }
  onSelect,    // (optionId, variantId) => void
  onRemove,    // (optionId) => void
  multiSelect = false,
}: {
  options: PictogramOption[];
  selections: Record<string, string>;
  onSelect: (optionId: string, variantId: string) => void;
  onRemove?: (optionId: string) => void;
  multiSelect?: boolean;
}) {
  const [variantPickerFor, setVariantPickerFor] = useState<string | null>(null);

  const handleOptionTap = (optionId: string) => {
    setVariantPickerFor((prev) => (prev === optionId ? null : optionId));
  };

  const handleVariantSelect = (optionId: string, variantId: string) => {
    onSelect(optionId, variantId);
    setVariantPickerFor(null);
  };

  const activeOption = options.find((o) => o.id === variantPickerFor);

  return (
    <div>
      {/* Options carousel */}
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            option={opt}
            isSelected={opt.id in selections}
            currentVariantId={selections[opt.id]}
            isPickerOpen={variantPickerFor === opt.id}
            onTap={() => handleOptionTap(opt.id)}
            onRemove={() => onRemove?.(opt.id)}
            multiSelect={multiSelect}
          />
        ))}
      </div>

      {/* Variant picker — appears when an option is tapped */}
      {activeOption && (
        <VariantPicker
          option={activeOption}
          currentVariantId={selections[activeOption.id]}
          onSelect={(variantId) => handleVariantSelect(activeOption.id, variantId)}
          onClose={() => setVariantPickerFor(null)}
        />
      )}
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

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

  // Parse a pill count from OCR dosage string (e.g. "3 pills each time" → 3)
  const parseCount = (text: string) => {
    const match = String(text).match(/\d+/);
    const n = match ? parseInt(match[0], 10) : 1;
    return Math.min(Math.max(1, n), 10);
  };

  // Multi-select time: { optionId: variantId }
  const [timeSelections, setTimeSelections] = useState<Record<string, string>>({ morning: "v0" });
  // Single-select: { optionId, variantId }
  const [howToTakeSelection, setHowToTakeSelection] = useState<OptionSelection>({ optionId: "crush", variantId: "v0" });
  const [sideEffectSelection, setSideEffectSelection] = useState<OptionSelection>({ optionId: "drowsiness", variantId: "v0" });
  // Dosage: number of pills
  const [pillCount, setPillCount] = useState(parseCount(ocrDosage));
  // Which category accordion is open
  const [activeCategory, setActiveCategory] = useState<string | null>("time");

  const handleTimeSelect = (optionId: string, variantId: string) => {
    setTimeSelections((prev) => ({ ...prev, [optionId]: variantId }));
  };

  const handleTimeRemove = (optionId: string) => {
    setTimeSelections((prev) => {
      const next = { ...prev };
      delete next[optionId];
      return next;
    });
  };

  const handleSingleSelect = (
    setter: React.Dispatch<React.SetStateAction<OptionSelection>>
  ) => (optionId: string, variantId: string) => {
    setter({ optionId, variantId });
  };

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
      },
    });
  };

  const { durationLabel, othersLabel } = TEXT_LABELS[language] ?? TEXT_LABELS.en;
  const inc = (key: string) => includeOnLabel?.[key] !== false;
  const showDuration = inc("howLong") && howLong?.trim().length > 0;
  const showOthers = inc("others") && others?.trim().length > 0;

  // Preview icons for collapsed cards
  const firstTimeId = Object.keys(timeSelections)[0];
  const timePreviewIcon = firstTimeId
    ? getIcon(TIME_OPTIONS, firstTimeId, timeSelections[firstTimeId], 40)
    : null;
  const howToTakePreviewIcon = getIcon(HOW_TO_TAKE_OPTIONS, howToTakeSelection.optionId, howToTakeSelection.variantId, 40);
  const sideEffectPreviewIcon = getIcon(SIDE_EFFECT_OPTIONS, sideEffectSelection.optionId, sideEffectSelection.variantId, 40);

  const allCategories = [
    {
      id: "time",
      includeKey: "timeOfDay",
      label: "Time of Day",
      subtitle: Object.keys(timeSelections).length
        ? TIME_OPTIONS.filter((o) => o.id in timeSelections).map((o) => o.label).join(" + ")
        : "Tap to select",
      previewIcon: timePreviewIcon,
    },
    {
      id: "dosage",
      includeKey: "dosage",
      label: "Dosage",
      subtitle: `${pillCount} pill${pillCount !== 1 ? "s" : ""} per dose`,
      previewIcon: <PillIcon size={40} />,
    },
    {
      id: "howToTake",
      includeKey: "howToTake",
      label: "How to take med",
      subtitle: HOW_TO_TAKE_OPTIONS.find((o) => o.id === howToTakeSelection.optionId)?.label ?? "",
      previewIcon: howToTakePreviewIcon,
    },
    {
      id: "sideEffects",
      includeKey: "sideEffects",
      label: "Side effects",
      subtitle: SIDE_EFFECT_OPTIONS.find((o) => o.id === sideEffectSelection.optionId)?.label ?? "",
      previewIcon: sideEffectPreviewIcon,
    },
  ];
  const categories = allCategories.filter((c) => inc(c.includeKey));

  return (
    <div className="min-h-dvh bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-5 bg-[#F5F2ED] sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all glass-shadow flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1B3022]" strokeWidth={2.5} />
          </button>
          <h1 className="serif text-3xl font-bold text-[#1B3022] leading-tight">
            Preview & Alternatives
          </h1>
        </div>
        <p className="text-[15px] text-[#1B3022]/55 ml-[60px]">
          Tap a card to open it, then tap an icon to see its style alternatives
        </p>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 px-6 py-3 pb-36 space-y-3 overflow-y-auto">
        <p className="text-[11px] font-semibold text-[#1B3022]/40 uppercase tracking-widest px-1 pt-1">
          Pictogram categories
        </p>

        {categories.map((cat) => {
          const isOpen = activeCategory === cat.id;
          return (
            <div key={cat.id}>
              {/* Category header */}
              <button
                onClick={() => setActiveCategory(isOpen ? null : cat.id)}
                className={`w-full rounded-[18px] px-5 py-4 transition-all text-left flex items-center gap-4 ${
                  isOpen
                    ? "bg-[#1B3022] text-white shadow-lg"
                    : "bg-white/80 text-[#1B3022] glass-shadow"
                }`}
                style={{ minHeight: "72px" }}
                aria-expanded={isOpen}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${isOpen ? "bg-white/15" : "bg-[#F5F2ED]"}`}>
                  {cat.previewIcon && (
                    <div className="scale-[0.55] origin-center">{cat.previewIcon}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="serif text-[18px] font-bold leading-tight">{cat.label}</p>
                  <p className={`text-[13px] mt-0.5 truncate ${isOpen ? "text-white/70" : "text-[#1B3022]/55"}`}>
                    {isOpen ? "Tap an icon to choose style" : cat.subtitle}
                  </p>
                </div>
                <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180 text-white/80" : "text-[#1B3022]/50"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="mt-3">
                  {cat.id === "time" && (
                    <>
                      <p className="text-[12px] text-[#1B3022]/50 mb-2 px-1">
                        Multi-select · tap icon to pick style · tap <span className="text-[#D37B5C]">×</span> to remove
                      </p>
                      <PictogramPicker
                        options={TIME_OPTIONS}
                        selections={timeSelections}
                        onSelect={handleTimeSelect}
                        onRemove={handleTimeRemove}
                        multiSelect
                      />
                    </>
                  )}

                  {cat.id === "dosage" && (
                    <div className="bg-white/80 rounded-[16px] p-5 glass-shadow">
                      <p className="serif text-[15px] font-bold text-[#1B3022] mb-3">Pills per dose</p>
                      <select
                        value={pillCount}
                        onChange={(e) => setPillCount(Number(e.target.value))}
                        className="w-full bg-[#F5F2ED] border-[2px] border-[#1B3022]/15 focus:border-[#1B3022] focus:outline-none rounded-[12px] px-4 py-3 text-xl font-semibold text-[#1B3022] transition-all"
                        style={{ minHeight: "54px" }}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                          <option key={n} value={n}>{n} pill{n !== 1 ? "s" : ""}</option>
                        ))}
                      </select>
                      <div className="flex items-center justify-center gap-1 mt-4 flex-wrap">
                        {Array.from({ length: pillCount }).map((_, i) => (
                          <PillIcon key={i} size={pillCount > 5 ? 24 : pillCount > 3 ? 30 : 38} />
                        ))}
                      </div>
                    </div>
                  )}

                  {cat.id === "howToTake" && (
                    <PictogramPicker
                      options={HOW_TO_TAKE_OPTIONS}
                      selections={{ [howToTakeSelection.optionId]: howToTakeSelection.variantId }}
                      onSelect={handleSingleSelect(setHowToTakeSelection)}
                    />
                  )}

                  {cat.id === "sideEffects" && (
                    <PictogramPicker
                      options={SIDE_EFFECT_OPTIONS}
                      selections={{ [sideEffectSelection.optionId]: sideEffectSelection.variantId }}
                      onSelect={handleSingleSelect(setSideEffectSelection)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Text section — only render if at least one text field is included */}
        {(showDuration || showOthers) && (
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-[#1B3022]/40 uppercase tracking-widest px-1 mb-3">
              Text on label
            </p>
            <div className="bg-white/70 rounded-[18px] p-5 glass-shadow space-y-4">
              {showDuration && (
                <div>
                  <p className="text-[12px] font-semibold text-[#1B3022]/50 uppercase tracking-widest mb-1">{durationLabel}</p>
                  <p className="text-[17px] text-[#1B3022]">{howLong}</p>
                </div>
              )}
              {showOthers && (
                <div className={showDuration ? "border-t border-[#1B3022]/10 pt-4" : ""}>
                  <p className="text-[12px] font-semibold text-[#1B3022]/50 uppercase tracking-widest mb-1">{othersLabel}</p>
                  <p className="text-[17px] text-[#1B3022]">{others}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-[13px] text-[#1B3022]/45 text-center px-4 pt-1 leading-relaxed">
          One pictogram per category + text values will be assembled into your final printed label.
        </p>
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
          Confirm Label Combination →
        </button>
      </footer>
    </div>
  );
}

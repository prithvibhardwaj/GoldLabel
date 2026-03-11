import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

type FieldType = "pictogram" | "text";

interface Field {
  key: string;
  label: string;
  placeholder: string;
  type: FieldType;
  defaultValue: string;
  description?: string;
}

const FIELDS: Field[] = [
  { key: "timeOfDay", label: "Time of Day", defaultValue: "Morning + Night", placeholder: "e.g. Morning", type: "pictogram" },
  { key: "howLong", label: "How long to take for", defaultValue: "2 weeks", placeholder: "e.g. 2 weeks", type: "text" },
  { key: "dosage", label: "Dosage", defaultValue: "3 pills each time", placeholder: "e.g. 2 tablets", type: "pictogram" },
  { key: "howToTake", label: "How to take med", defaultValue: "Crush pill", placeholder: "e.g. With food", type: "pictogram" },
  { key: "sideEffects", label: "Side effects", defaultValue: "Drowsiness", placeholder: "e.g. Drowsiness", type: "pictogram" },
  {
    key: "others",
    label: "Others",
    defaultValue: "",
    placeholder: "Any other meaningful notes…",
    type: "text",
    description: "Any extracted text that doesn't fall into the 5 categories above but is still meaningful — excludes junk like clinic address, medication name, or dispensary info. Auto-populated by OCR.",
  },
];

function TypeTag({ type }: { type: FieldType }) {
  if (type === "pictogram") {
    return (
      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-semibold tracking-wide"
        style={{ background: "#1B3022", color: "white", fontSize: "13px" }}>
        Pictogram
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-semibold tracking-wide border-2"
      style={{ borderColor: "#D37B5C", color: "#D37B5C", fontSize: "13px" }}>
      Text
    </span>
  );
}

function LabelToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[#1B3022]" : "bg-[#1B3022]/20"
      }`}
      aria-checked={checked}
      role="switch"
      aria-label="Include on label"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function ConfirmInformation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.defaultValue]))
  );

  const [includeOnLabel, setIncludeOnLabel] = useState<Record<string, boolean>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, true]))
  );

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInclude = (key: string) => {
    setIncludeOnLabel((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    navigate("/language-selection", { state: { ...formData, includeOnLabel } });
  };

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
            Confirm Information
          </h1>
        </div>
        <p className="text-[15px] text-[#1B3022]/55 tracking-wide ml-[60px]">
          Review extracted details and choose what appears on the label
        </p>
      </header>

      {/* Scrollable form */}
      <main className="flex-1 px-6 py-4 pb-36 overflow-y-auto space-y-5">
        {FIELDS.map((field) => {
          const included = includeOnLabel[field.key];
          return (
            <div
              key={field.key}
              className={`bg-white/70 backdrop-blur-sm rounded-[18px] px-5 py-4 glass-shadow transition-opacity ${
                included ? "opacity-100" : "opacity-60"
              }`}
            >
              {/* Label row */}
              <div className="flex items-center gap-2 mb-2">
                <label
                  htmlFor={field.key}
                  className="serif text-lg font-bold text-[#1B3022] flex-1"
                >
                  {field.label}
                </label>
                <TypeTag type={field.type} />
              </div>

              {/* Description for Others */}
              {field.description && (
                <p className="text-[12px] text-[#1B3022]/50 mb-3 leading-relaxed">
                  {field.description}
                </p>
              )}

              {/* Input */}
              <input
                id={field.key}
                type="text"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                disabled={!included}
                className="w-full bg-[#F5F2ED] border-[2px] border-[#1B3022]/15 focus:border-[#1B3022] focus:outline-none rounded-[12px] px-4 py-3 text-xl text-[#1B3022] transition-all disabled:cursor-not-allowed"
                style={{ minHeight: "54px" }}
                aria-label={field.label}
              />

              {/* Include on label toggle */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1B3022]/10">
                <span className="text-[12px] text-[#1B3022]/55 font-medium">
                  {included ? "Included on label" : "Excluded from label"}
                </span>
                <LabelToggle
                  checked={included}
                  onChange={() => toggleInclude(field.key)}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* Sticky CTA */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-6 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/95 to-transparent z-30"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))", maxWidth: "430px", marginLeft: "auto", marginRight: "auto" }}
      >
        <button
          onClick={handleNext}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[999px] py-5 serif text-2xl font-bold transition-all glass-shadow-lg transform active:scale-[0.98]"
          style={{ minHeight: "64px" }}
          aria-label="Next step"
        >
          Next
        </button>
      </footer>
    </div>
  );
}

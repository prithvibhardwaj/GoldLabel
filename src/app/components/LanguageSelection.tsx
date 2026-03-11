import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "zh", name: "Mandarin", nativeName: "中文" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
];

export function LanguageSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleConfirm = () => {
    navigate("/configure/1", {
      state: { ...formData, language: selectedLanguage },
    });
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
          <h1 className="serif text-3xl font-bold text-[#1B3022] leading-tight">
            Select Language
          </h1>
        </div>
        <p className="text-[15px] text-[#1B3022]/55 tracking-wide ml-[60px]">
          Choose the language for your label
        </p>
      </header>

      {/* Language list */}
      <main className="flex-1 px-6 py-4 pb-36 space-y-3">
        {LANGUAGES.map((lang) => {
          const selected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full rounded-[18px] px-5 text-left transition-all glass-shadow ${selected
                  ? "bg-white border-[3px] border-[#1B3022]"
                  : "bg-white/70 border-[3px] border-transparent hover:border-[#1B3022]/20"
                }`}
              style={{ minHeight: "72px" }}
              aria-label={`Select ${lang.name}`}
              aria-pressed={selected}
            >
              <div className="flex items-center justify-between h-full py-4">
                <div>
                  <p className="serif text-xl font-bold text-[#1B3022]">{lang.name}</p>
                  <p className="text-[15px] text-[#1B3022]/60 mt-0.5">{lang.nativeName}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${selected
                      ? "bg-[#1B3022]"
                      : "border-[2px] border-[#1B3022]/30 bg-white"
                    }`}
                >
                  {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
              </div>
            </button>
          );
        })}
      </main>

      {/* Sticky CTA */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-6 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/95 to-transparent z-30"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))", maxWidth: "430px", marginLeft: "auto", marginRight: "auto" }}
      >
        <button
          onClick={handleConfirm}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[999px] py-5 serif text-2xl font-bold transition-all glass-shadow-lg transform active:scale-[0.98]"
          style={{ minHeight: "64px" }}
          aria-label="Confirm language selection"
        >
          Confirm Language
        </button>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

type EmojiRating = "bad" | "neutral" | "good" | null;
type PictoAnswer = "yes" | "no" | "some" | null;

const EMOJI_OPTIONS: { id: EmojiRating; emoji: string; label: string }[] = [
  { id: "bad", emoji: "😞", label: "Not helpful" },
  { id: "neutral", emoji: "😐", label: "Okay" },
  { id: "good", emoji: "😊", label: "Helpful!" },
];

const PICTO_OPTIONS: { id: PictoAnswer; label: string }[] = [
  { id: "yes", label: "Yes" },
  { id: "some", label: "Some of them" },
  { id: "no", label: "No" },
];

export function FeedbackPage() {
  const navigate = useNavigate();

  const [emojiRating, setEmojiRating] = useState<EmojiRating>(null);
  const [pictoAnswer, setPictoAnswer] = useState<PictoAnswer>(null);
  const [pictoComment, setPictoComment] = useState("");
  const [generalComment, setGeneralComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // In production: send feedback to backend
    setSubmitted(true);
    setTimeout(() => navigate("/"), 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-dvh bg-[#F5F2ED] flex flex-col items-center justify-center px-6 gap-4">
        <span className="text-6xl">🙏</span>
        <h2 className="serif text-3xl font-bold text-[#1B3022] text-center">Thank you!</h2>
        <p className="text-lg text-[#1B3022]/55 text-center">Your feedback helps us improve labels for everyone.</p>
      </div>
    );
  }

  const showPictoText = pictoAnswer === "no" || pictoAnswer === "some";

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
            Was this helpful?
          </h1>
        </div>
        <p className="text-[15px] text-[#1B3022]/55 ml-[60px]">
          Your feedback improves labels for all users
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-4 pb-40 overflow-y-auto space-y-5">

        {/* Section 1 — Overall rating */}
        <div className="bg-white/70 backdrop-blur-sm rounded-[18px] px-5 py-5 glass-shadow">
          <p className="serif text-lg font-bold text-[#1B3022] mb-1">Label satisfaction</p>
          <p className="text-[13px] text-[#1B3022]/50 mb-4">How useful was the printed label?</p>
          <div className="flex gap-3 justify-center">
            {EMOJI_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEmojiRating(opt.id)}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-[16px] flex-1 transition-all ${
                  emojiRating === opt.id
                    ? "bg-[#1B3022] shadow-md scale-105"
                    : "bg-[#F5F2ED] hover:bg-[#1B3022]/8"
                }`}
                aria-pressed={emojiRating === opt.id}
                aria-label={opt.label}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span className={`text-[11px] font-semibold text-center leading-tight ${
                  emojiRating === opt.id ? "text-white" : "text-[#1B3022]/55"
                }`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2 — Pictogram feedback */}
        <div className="bg-white/70 backdrop-blur-sm rounded-[18px] px-5 py-5 glass-shadow">
          <p className="serif text-lg font-bold text-[#1B3022] mb-1">Pictogram feedback</p>
          <p className="text-[13px] text-[#1B3022]/50 mb-4">Were the pictograms appropriate?</p>
          <div className="flex gap-2">
            {PICTO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPictoAnswer(opt.id)}
                className={`flex-1 py-3 rounded-[12px] text-[14px] font-semibold transition-all ${
                  pictoAnswer === opt.id
                    ? "bg-[#1B3022] text-white shadow-md"
                    : "bg-[#F5F2ED] text-[#1B3022]/70 hover:bg-[#1B3022]/8"
                }`}
                aria-pressed={pictoAnswer === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {showPictoText && (
            <div className="mt-3">
              <textarea
                value={pictoComment}
                onChange={(e) => setPictoComment(e.target.value)}
                placeholder="Which pictograms were off? (optional)"
                rows={3}
                className="w-full bg-[#F5F2ED] border-[2px] border-[#1B3022]/15 focus:border-[#1B3022] focus:outline-none rounded-[12px] px-4 py-3 text-[15px] text-[#1B3022] resize-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Section 3 — General comments */}
        <div className="bg-white/70 backdrop-blur-sm rounded-[18px] px-5 py-5 glass-shadow">
          <p className="serif text-lg font-bold text-[#1B3022] mb-1">General comments</p>
          <p className="text-[13px] text-[#1B3022]/50 mb-3">Anything else you'd like us to know? (optional)</p>
          <textarea
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
            placeholder="Your thoughts…"
            rows={4}
            className="w-full bg-[#F5F2ED] border-[2px] border-[#1B3022]/15 focus:border-[#1B3022] focus:outline-none rounded-[12px] px-4 py-3 text-[15px] text-[#1B3022] resize-none transition-all"
          />
        </div>
      </main>

      {/* Footer CTA */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-6 pt-3 pb-6 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/95 to-transparent z-30 space-y-3"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))", maxWidth: "430px", marginLeft: "auto", marginRight: "auto" }}
      >
        <button
          onClick={handleSubmit}
          className="w-full bg-[#1B3022] hover:bg-[#152619] active:bg-[#0f1a13] text-white rounded-[999px] py-5 serif text-2xl font-bold transition-all glass-shadow-lg transform active:scale-[0.98]"
          style={{ minHeight: "64px" }}
        >
          Submit Feedback
        </button>
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-[15px] text-[#1B3022]/50 hover:text-[#1B3022]/80 font-medium py-1 transition-colors"
          >
            Skip
          </button>
        </div>
      </footer>
    </div>
  );
}

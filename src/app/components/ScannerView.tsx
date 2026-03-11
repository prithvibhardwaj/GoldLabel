import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, ZapOff, X } from "lucide-react";

export function ScannerView() {
  const navigate = useNavigate();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleCapture = () => {
    setScanning(true);
    setTimeout(() => navigate("/processing"), 800);
  };

  return (
    <div className="h-dvh bg-[#111] flex flex-col relative overflow-hidden">
      {/* Simulated camera background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #1a2d1a 0%, #0a0f0a 100%)",
        }}
      />

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-14 px-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 bg-white/15 hover:bg-white/25 active:bg-white/35 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
          aria-label="Close scanner"
        >
          <X className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setFlashEnabled(!flashEnabled)}
          className="w-12 h-12 bg-white/15 hover:bg-white/25 active:bg-white/35 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
          aria-label={flashEnabled ? "Turn flash off" : "Turn flash on"}
        >
          {flashEnabled ? (
            <Zap className="w-6 h-6 text-[#D37B5C] fill-[#D37B5C]" strokeWidth={2} />
          ) : (
            <ZapOff className="w-6 h-6 text-white/80" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Camera Viewfinder — fills most of screen */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Rectangular overlay guide — landscape proportion for medicine label */}
        <div className="relative" style={{ width: "320px", height: "180px" }}>
          {/* Dimmed overlay — top */}
          <div
            className="absolute bg-black/50"
            style={{ left: "-200vw", right: "-200vw", top: "-200vh", bottom: "100%" }}
          />
          {/* Dimmed overlay — bottom */}
          <div
            className="absolute bg-black/50"
            style={{ left: "-200vw", right: "-200vw", top: "100%", bottom: "-200vh" }}
          />
          {/* Dimmed overlay — left */}
          <div
            className="absolute bg-black/50"
            style={{ right: "100%", left: "-200vw", top: 0, bottom: 0 }}
          />
          {/* Dimmed overlay — right */}
          <div
            className="absolute bg-black/50"
            style={{ left: "100%", right: "-200vw", top: 0, bottom: 0 }}
          />

          {/* Guide frame border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/70">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-[#D37B5C] rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-[4px] border-r-[4px] border-[#D37B5C] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[4px] border-l-[4px] border-[#D37B5C] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-[#D37B5C] rounded-br-2xl" />
          </div>

          {/* Scanning pulse line */}
          {scanning && (
            <div
              className="absolute left-2 right-2 h-0.5 bg-[#D37B5C]/80 rounded-full"
              style={{ animation: "scanLine 0.8s ease-in-out", top: "50%" }}
            />
          )}
        </div>

        {/* Instruction text below frame */}
        <p
          className="absolute text-white/80 text-lg tracking-wide text-center"
          style={{ top: "calc(50% + 110px)" }}
        >
          Align medicine label within frame
        </p>
      </div>

      {/* Bottom — Shutter button */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-10"
        style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handleCapture}
          disabled={scanning}
          className="w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 disabled:opacity-60"
          style={{
            background: "white",
            border: "5px solid rgba(255,255,255,0.5)",
            boxShadow: "0 0 0 3px #D37B5C",
          }}
          aria-label="Capture medicine label photo"
        >
          <div
            className="w-14 h-14 rounded-full"
            style={{ background: scanning ? "#D37B5C" : "#1B3022" }}
          />
        </button>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(-80px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function ProcessingState() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate OCR processing time (3 seconds for a calmer experience)
    const timer = setTimeout(() => {
      // Navigate to confirm information screen to review extracted data
      navigate("/confirm-information");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Gentle Pulse Animation */}
        <motion.div
          className="w-40 h-40 mx-auto mb-12 bg-[#1B3022]/10 rounded-full flex items-center justify-center grain-texture"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-32 h-32 bg-[#1B3022] rounded-full flex items-center justify-center glass-shadow-lg"
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-16 h-16 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Calming Text */}
        <motion.h1
          className="serif text-5xl font-bold text-[#1B3022] mb-6"
          animate={{
            opacity: [1, 0.75, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Scanning…
        </motion.h1>

        <p className="text-2xl text-[#1B3022]/70 mb-4 tracking-wide">Reading your medicine label</p>
        <p className="text-xl text-[#1B3022]/50 tracking-wide leading-relaxed">
          Take a moment to relax
        </p>

        {/* Subtle Progress Dots */}
        <div className="flex items-center justify-center gap-4 mt-12">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-[#1B3022] rounded-full"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
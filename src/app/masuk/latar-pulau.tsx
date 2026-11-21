"use client";

/** Latar layar masuk: langit, matahari, awan, dan laut dengan pulau di bawah. Tengah layar dibiarkan lapang. */
export function LatarPulau() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#9fdcff 0%,#cdeeff 45%,#eaf8ff 72%)" }} />
      <div className="absolute -top-16 -left-16 size-56 rounded-full" style={{ background: "#ffd23f", boxShadow: "0 0 0 34px rgba(255,210,63,.28), 0 0 0 80px rgba(255,210,63,.12)" }} />
      <Awan className="top-[9%] right-[8%] w-[180px]" />
      <Awan className="top-[24%] left-[6%] w-[120px] opacity-80" />
      <Awan className="top-[15%] right-[38%] hidden w-[110px] opacity-70 md:block" />
      {/* laut */}
      <div className="absolute inset-x-0 bottom-0 h-[17%]" style={{ background: "linear-gradient(180deg,#4cc3e9 0%,#1f8fd0 55%,#1468a8 100%)" }} />
      <div className="absolute inset-x-0 h-4" style={{ bottom: "calc(17% - 8px)", background: "radial-gradient(circle at 24px 16px,#4cc3e9 15px,transparent 16px) 0 0/48px 16px repeat-x" }} />
      {/* pulau kiri & kanan */}
      <Pulau className="bottom-[11%] -left-16 w-[220px] sm:-left-10 sm:w-[380px]" pohon="🌴" />
      <Pulau className="right-[-70px] bottom-[9%] w-[200px] sm:right-[-60px] sm:w-[340px]" pohon="🏡" />
      <span className="absolute bottom-[4%] left-[42%] text-[34px]">⛵</span>
    </div>
  );
}

function Awan({ className }: { className: string }) {
  return (
    <div className={`absolute aspect-[2.4] ${className}`}>
      <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-full bg-white" />
      <div className="absolute bottom-[20%] left-[16%] aspect-square w-[42%] rounded-full bg-white" />
      <div className="absolute bottom-[22%] left-[44%] aspect-square w-[34%] rounded-full bg-white" />
    </div>
  );
}

function Pulau({ className, pohon }: { className: string; pohon: string }) {
  return (
    <div className={`absolute aspect-[3.2] ${className}`}>
      <div className="absolute inset-x-0 bottom-0 h-[70%] rounded-[50%_50%_0_0/100%_100%_0_0]" style={{ background: "#f3d98f" }} />
      <div className="absolute inset-x-[8%] bottom-[18%] h-[66%] rounded-[50%_50%_0_0/100%_100%_0_0]" style={{ background: "linear-gradient(180deg,#7fd36b,#4fae4a)" }} />
      <span className="absolute bottom-[52%] left-[38%] text-[44px] leading-none">{pohon}</span>
    </div>
  );
}

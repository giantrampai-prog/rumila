"use client";

// Latar layar masuk: Kampus Rinoya. Langit di atas (area isi tetap lapang), gedung kampus dengan menara jam,
// papan nama, tiang bendera, pepohonan, dan halaman rumput di bawah.

const BADAN = "#fff4dc";
const GENTENG = "#e0734f";
const GENTENG_GELAP = "#b9553a";
const JENDELA = "#8fd0f5";

const jendela = (atas: string) =>
  `linear-gradient(90deg, transparent 14px, ${JENDELA} 14px 38px, transparent 38px) 0 ${atas}/54px 26% repeat-x`;

export function LatarKampus() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#9fd8ff 0%,#cdeeff 50%,#eef9ff 75%)" }} />
      <div className="absolute top-[6%] right-[7%] size-20 rounded-full" style={{ background: "#ffd23f", boxShadow: "0 0 0 22px rgba(255,210,63,.25)" }} />
      <Awan className="top-[10%] left-[5%] w-[150px]" />
      <Awan className="top-[22%] right-[16%] hidden w-[120px] opacity-80 md:block" />
      <Awan className="top-[30%] left-[22%] hidden w-[90px] opacity-70 lg:block" />

      {/* kampus: sepertiga bawah layar */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] min-h-[210px] max-h-[330px]">
        {/* bukit jauh */}
        <div className="absolute -inset-x-[10%] bottom-[14%] h-[40%] rounded-[50%_50%_0_0/100%_100%_0_0]" style={{ background: "#bfe6a6" }} />
        {/* sayap gedung */}
        <div className="absolute right-[3%] bottom-[16%] left-[3%] h-[44%] rounded-t-[6px]" style={{ background: `${jendela("30%")}, ${jendela("82%")}, ${BADAN}`, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.06)" }} />
        <div className="absolute right-[1.5%] left-[1.5%] h-[9%] rounded-[8px]" style={{ bottom: "58%", background: GENTENG, boxShadow: `0 4px 0 ${GENTENG_GELAP}` }} />
        {/* menara jam + pintu utama */}
        <div className="absolute bottom-[16%] left-[74%] sm:left-[82%] flex h-[96%] w-[16%] min-w-[128px] max-w-[200px] -translate-x-1/2 flex-col items-center">
          <div className="h-[16%] w-[112%]" style={{ background: GENTENG, clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
          <div className="relative flex w-full flex-1 flex-col items-center rounded-b-[4px] pt-[8%]" style={{ background: BADAN, boxShadow: `inset 0 6px 0 ${GENTENG_GELAP}` }}>
            <Jam />
            <span className="mt-[6%] rounded-[6px] px-2 py-0.5 text-[11px] font-black tracking-[.14em] text-white sm:text-[13px]" style={{ background: "#0567c2", fontFamily: "var(--ff-baloo), system-ui, sans-serif" }}>
              KAMPUS RINOYA
            </span>
            <div className="absolute bottom-0 h-[34%] w-[42%] rounded-t-full" style={{ background: "#3a6fb5", boxShadow: "inset 0 0 0 5px #2b5590" }} />
          </div>
        </div>
        {/* tiang bendera */}
        <div className="absolute bottom-[16%] left-[16%] h-[90%] w-[5px] rounded-full bg-[#9aa6b8]">
          <div className="absolute top-[4%] left-[5px] h-[22px] w-[36px] overflow-hidden rounded-r-[3px]">
            <div className="h-1/2 bg-[#e8312f]" />
            <div className="h-1/2 bg-white" />
          </div>
        </div>
        {/* halaman */}
        <div className="absolute inset-x-0 bottom-0 h-[17%]" style={{ background: "linear-gradient(180deg,#8fd06a,#6db54d)" }} />
        <div className="absolute bottom-0 left-[74%] sm:left-[82%] h-[17%] w-[22%] min-w-[120px] -translate-x-1/2" style={{ background: "#ecd9ae", clipPath: "polygon(36% 0,64% 0,100% 100%,0 100%)" }} />
        <span className="absolute bottom-[9%] left-[1%] text-[64px] leading-none sm:text-[84px]">🌳</span>
        <span className="absolute right-[1%] bottom-[9%] hidden text-[60px] sm:block leading-none sm:text-[80px]">🌳</span>
        <span className="absolute bottom-[3%] left-[34%] hidden text-[44px] leading-none sm:block">🚌</span>
        <span className="absolute bottom-[4%] left-[12%] text-[26px] leading-none">🌷</span>
        <span className="absolute left-[60%] bottom-[4%] text-[26px] leading-none">🌼</span>
      </div>
    </div>
  );
}

function Jam() {
  return (
    <div className="relative aspect-square w-[44%] rounded-full bg-white" style={{ boxShadow: `0 0 0 5px ${GENTENG_GELAP}` }}>
      <span className="absolute bottom-1/2 left-1/2 h-[32%] w-[4px] -translate-x-1/2 rounded-full bg-[#0b2545]" />
      <span className="absolute bottom-1/2 left-1/2 h-[4px] w-[26%] -translate-y-[-2px] rounded-full bg-[#0b2545]" />
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

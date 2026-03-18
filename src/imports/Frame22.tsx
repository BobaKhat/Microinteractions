import svgPaths from "./svg-mf43amhcvk";

function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute border-2 border-[#282828] border-solid h-[373px] left-1/2 overflow-clip rounded-[20px] top-[calc(50%+0.5px)] w-[324px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[110px] top-[calc(50%+0.5px)]">
        <div className="absolute inset-[-0.91%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <circle cx="56" cy="56" fill="var(--fill-0, #66E154)" id="Ellipse 55" r="55.5" stroke="var(--stroke-0, #66E154)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(50%-41px)] not-italic text-[16px] text-black top-[calc(50%-9.5px)] whitespace-nowrap">Confirmed</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <Frame1 />
      <div className="absolute h-[17px] left-[204px] top-[232px] w-[22px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 17">
          <path d={svgPaths.p2bab4980} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}
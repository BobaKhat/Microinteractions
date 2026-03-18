function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-end left-[47px] top-[94px]">
      <div className="bg-[#262626] h-[47px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[46px]">
        <div aria-hidden="true" className="absolute border border-[#4a5e2f] border-solid inset-[-1px] pointer-events-none rounded-tl-[11px] rounded-tr-[11px]" />
      </div>
      <div className="bg-[#262626] h-[59px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[46px]">
        <div aria-hidden="true" className="absolute border border-[#4a5e2f] border-solid inset-[-1px] pointer-events-none rounded-tl-[11px] rounded-tr-[11px]" />
      </div>
      <div className="bg-[#262626] h-[75px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[46px]">
        <div aria-hidden="true" className="absolute border border-[#4a5e2f] border-solid inset-[-1px] pointer-events-none rounded-tl-[11px] rounded-tr-[11px]" />
      </div>
      <div className="bg-[#262626] h-[142px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[46px]">
        <div aria-hidden="true" className="absolute border border-[#4a5e2f] border-solid inset-[-1px] pointer-events-none rounded-tl-[11px] rounded-tr-[11px]" />
      </div>
      <div className="bg-[#262626] h-[195px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[46px]">
        <div aria-hidden="true" className="absolute border border-[#4a5e2f] border-solid inset-[-1px] pointer-events-none rounded-tl-[11px] rounded-tr-[11px]" />
      </div>
      <div className="bg-[#262626] h-[262px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[46px]">
        <div aria-hidden="true" className="absolute border border-[#4a5e2f] border-solid inset-[-1px] pointer-events-none rounded-tl-[11px] rounded-tr-[11px]" />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <div className="absolute h-0 left-[47px] top-[357px] w-[321px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 321 1">
            <line id="Line 6" stroke="var(--stroke-0, #4A5E2F)" x2="321" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame1 />
      <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] left-[47px] text-[20px] text-white top-[69px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Estimated Networth
      </p>
    </div>
  );
}
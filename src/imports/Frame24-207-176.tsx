function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#480404] content-stretch flex items-center justify-center left-1/2 px-[35px] py-[15px] rounded-[10px] top-[263px]">
      <div aria-hidden="true" className="absolute border border-[#7e0000] border-solid inset-[-1px] pointer-events-none rounded-[11px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Try Again</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[64px] left-[46px] top-[151px] w-[337px]">
      <div className="absolute inset-[-3.13%_-0.59%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 341 68">
          <g id="Frame 1171276072">
            <rect fill="var(--fill-0, #480404)" height="66" rx="16" width="339" x="1" y="1" />
            <rect height="66" rx="16" stroke="var(--stroke-0, #7E0000)" strokeWidth="2" width="339" x="1" y="1" />
            <circle cx="27" cy="34" fill="var(--fill-0, white)" id="Ellipse 58" r="5" />
            <circle cx="57" cy="34" fill="var(--fill-0, white)" id="Ellipse 59" r="5" />
            <circle cx="87" cy="34" fill="var(--fill-0, white)" id="Ellipse 60" r="5" />
            <circle cx="117" cy="34" fill="var(--fill-0, white)" id="Ellipse 61" r="5" />
            <circle cx="147" cy="34" fill="var(--fill-0, white)" id="Ellipse 62" r="5" />
            <circle cx="177" cy="34" fill="var(--fill-0, white)" id="Ellipse 63" r="5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <Frame1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[46px] not-italic text-[#7e0000] text-[11px] top-[230px] whitespace-nowrap">Incorrect password please try again</p>
      <Frame2 />
    </div>
  );
}
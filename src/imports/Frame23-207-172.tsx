function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#181818] content-stretch flex items-center justify-center left-1/2 px-[35px] py-[15px] rounded-[10px] top-[263px] w-[144px]">
      <div aria-hidden="true" className="absolute border border-[#3f3f3f] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Enter Pin</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[10px] left-[66px] top-[178px] w-[160px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 160 10">
        <g id="Frame 1171276071">
          <circle cx="5" cy="5" fill="var(--fill-0, white)" id="Ellipse 58" r="5" />
          <circle cx="35" cy="5" fill="var(--fill-0, white)" id="Ellipse 59" r="5" />
          <circle cx="65" cy="5" fill="var(--fill-0, white)" id="Ellipse 60" r="5" />
          <circle cx="95" cy="5" fill="var(--fill-0, white)" id="Ellipse 61" r="5" />
          <circle cx="125" cy="5" fill="var(--fill-0, white)" id="Ellipse 62" r="5" />
          <circle cx="155" cy="5" fill="var(--fill-0, white)" id="Ellipse 63" r="5" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#181818] border border-[#3f3f3f] border-solid h-[64px] left-[calc(50%-0.5px)] rounded-[15px] top-[calc(50%-32px)] w-[337px]" />
      <Frame1 />
      <Frame2 />
    </div>
  );
}
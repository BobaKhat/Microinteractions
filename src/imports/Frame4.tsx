import svgPaths from "./svg-12ww8qi4kn";

function Frame5() {
  return (
    <div className="bg-[#a6136e] content-stretch flex flex-col items-center justify-center px-[30px] py-[15px] relative rounded-[300px] shrink-0 w-[98px]">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[60px] text-center text-white w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        B
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d9d9d9] text-[36px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Did you read my slack message?
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[75px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 75">
        <g id="Frame 1171276053">
          <rect fill="var(--fill-0, #00D54B)" height="75" rx="37.5" width="75" />
          <path d={svgPaths.p74d4980} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-[#1e1b1b] content-stretch flex gap-[45px] items-center left-[164px] p-[45px] rounded-[90px] top-[237px]">
      <div aria-hidden="true" className="absolute border-[#a6136e] border-[0.9px] border-solid inset-0 pointer-events-none rounded-[90px] shadow-[0px_0px_60px_0px_rgba(166,19,110,0.4)]" />
      <Frame5 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#a6136e] content-stretch flex flex-col h-[102px] items-center justify-center px-[30px] py-[45px] relative rounded-[300px] shadow-[0px_12px_15px_0px_rgba(0,0,0,0.3)] shrink-0 w-[98px]">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[60px] text-center text-white w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        B
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#1e1b1b] content-stretch flex items-center left-[178px] p-[30px] rounded-[300px] shadow-[0px_12px_24px_0px_black] top-[525px]">
      <Frame1 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <Frame6 />
      <Frame2 />
    </div>
  );
}
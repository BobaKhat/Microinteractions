import svgPaths from "./svg-dwrnwqtxbx";

function Frame2() {
  return (
    <div className="bg-[#a6136e] content-stretch flex flex-col items-center justify-center px-[30px] py-[15px] relative rounded-[300px] shrink-0 w-[98px]">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[60px] text-center text-white w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        B
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#d9d9d9] text-[36px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Did you read my slack message?
      </p>
    </div>
  );
}

function Frame1() {
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

export default function Frame3() {
  return (
    <div className="bg-[#1e1b1b] content-stretch flex gap-[45px] items-center p-[45px] relative rounded-[90px] size-full">
      <div aria-hidden="true" className="absolute border-[#a6136e] border-[0.9px] border-solid inset-0 pointer-events-none rounded-[90px] shadow-[0px_0px_60px_0px_rgba(166,19,110,0.4)]" />
      <Frame2 />
      <Frame />
      <Frame1 />
    </div>
  );
}
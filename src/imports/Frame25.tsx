import svgPaths from "./svg-fcz7tka2ul";

function Group() {
  return (
    <div className="h-[30px] relative shrink-0 w-[25.714px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.7143 29.9998">
        <g id="Group 1171275886">
          <path d={svgPaths.pfe4dc80} fill="var(--fill-0, #4B4949)" id="Vector" />
          <path d={svgPaths.p33080880} fill="var(--fill-0, #00D54B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center p-[10px] relative rounded-[5px] shrink-0">
      <Group />
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#00d54b] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Copy
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center p-[10px] relative shrink-0">
      <div className="h-[30px] relative shrink-0 w-[26px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 30">
          <path clipRule="evenodd" d={svgPaths.p1516e680} fill="var(--fill-0, #0C8CF3)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#535257] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Paste
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center p-[10px] relative shrink-0">
      <div className="h-[30px] relative shrink-0 w-[24px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 30">
          <path d={svgPaths.p2f677280} fill="var(--fill-0, #CA0000)" id="Vector" />
        </svg>
      </div>
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ca0000] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Delete
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#1e1b1b] left-[calc(50%-0.14px)] rounded-[5px] top-[159px]">
      <div className="content-stretch flex gap-[25px] items-center overflow-clip px-[20px] py-[15px] relative rounded-[inherit]">
        <Frame3 />
        <Frame2 />
        <Frame4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#303030] border-solid inset-0 pointer-events-none rounded-[5px]" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <Frame1 />
    </div>
  );
}
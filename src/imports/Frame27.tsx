import svgPaths from "./svg-ddkn9xdq6h";

function Frame3() {
  return (
    <div className="h-[50px] relative shrink-0 w-[76.714px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.7142 49.9998">
        <g id="Frame 1171275961">
          <rect fill="var(--fill-0, #2C2C2E)" height="49.9998" rx="5" width="76.7142" />
          <g id="Group 1171275886">
            <path d={svgPaths.p1c315940} fill="var(--fill-0, #4B4949)" id="Vector" />
            <path d={svgPaths.p25d89500} fill="var(--fill-0, #00D54B)" id="Vector_2" />
          </g>
          <path d={svgPaths.pe8c7500} fill="var(--fill-0, #00D54B)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[50px] relative shrink-0 w-[77px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 77 50">
        <g id="Frame 1171275960">
          <path clipRule="evenodd" d={svgPaths.p18ef7440} fill="var(--fill-0, #0C8CF3)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p385d5b80} id="Vector_2" stroke="var(--stroke-0, #0C8CF3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[50px] relative shrink-0 w-[77px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 77 50">
        <g id="Frame 1171275962">
          <path d={svgPaths.p3095380} fill="var(--fill-0, #CA0000)" id="Vector" />
          <path d={svgPaths.p4ba1300} fill="var(--fill-0, #CA0000)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#1e1b1b] content-stretch flex gap-[25px] items-center left-[calc(50%-0.14px)] overflow-clip px-[20px] py-[15px] rounded-[5px] top-[175px]">
      <Frame3 />
      <Frame2 />
      <Frame4 />
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
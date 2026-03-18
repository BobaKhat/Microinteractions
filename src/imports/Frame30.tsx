import svgPaths from "./svg-izgw12ysvg";

function Frame3() {
  return (
    <div className="content-stretch flex gap-[15px] items-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none">
          <div className="relative size-[12px]" data-name="icon-search">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <path clipRule="evenodd" d={svgPaths.p34b348c0} fill="var(--fill-0, #435B5B)" fillRule="evenodd" id="icon-search" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#484848] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Search for something</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex items-center justify-between left-[15px] px-[16px] py-[8px] rounded-[100px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[30px] w-[304px]">
      <Frame3 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#484848] text-[8px] whitespace-nowrap">
        <p className="leading-[20px]">0/30</p>
      </div>
    </div>
  );
}

function Frame4() {
  return <div className="absolute bg-[#f0f0f0] h-[259px] left-[15px] rounded-[20px] top-[75px] w-[304px]" />;
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white h-[353px] left-1/2 overflow-clip rounded-[30px] top-[calc(50%+0.5px)] w-[334px]">
      <Frame1 />
      <Frame4 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <Frame2 />
    </div>
  );
}
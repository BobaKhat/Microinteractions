import svgPaths from "./svg-modctz86bp";

function Frame1() {
  return (
    <div className="absolute bg-[rgba(180,232,90,0.15)] h-[190px] left-[99px] overflow-clip rounded-[100px] top-[251px] w-[727px]">
      <div className="absolute left-[15px] size-[160px] top-[15px]">
        <div className="absolute inset-[-11.88%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 198 198">
            <g filter="url(#filter0_d_137_30)" id="Ellipse 3">
              <circle cx="99" cy="99" fill="var(--fill-0, black)" r="80" />
              <circle cx="99" cy="99" r="82" stroke="var(--stroke-0, #B4E85A)" strokeWidth="4" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="198" id="filter0_d_137_30" width="198" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="effect1_dropShadow_137_30" />
                <feOffset />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_137_30" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_137_30" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] left-[calc(50%-137.5px)] text-[#c7ff67] text-[48px] text-shadow-[0px_0px_10px_black] top-[calc(50%-28px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Swipe to lock
      </p>
      <div className="-translate-y-1/2 absolute aspect-[49/85] left-[9.9%] right-[83.77%] top-1/2" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 80">
          <path clipRule="evenodd" d={svgPaths.p24257280} fill="var(--fill-0, #B4E85A)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[rgba(180,232,90,0.05)] h-[190px] left-[99px] overflow-clip rounded-[100px] top-[482px] w-[727px]">
      <div className="absolute left-[552px] size-[160px] top-[15px]">
        <div className="absolute inset-[-0.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 162 162">
            <circle cx="81" cy="81" fill="var(--fill-0, #C7FF67)" fillOpacity="0.2" id="Ellipse 3" r="80.5" stroke="var(--stroke-0, #B4E85A)" />
          </svg>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute aspect-[64/80] left-[83.08%] right-[9.22%] top-1/2" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 70">
          <path d={svgPaths.p3ea21c00} fill="var(--fill-0, #C7FF67)" id="Vector" />
        </svg>
      </div>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] left-[calc(50%-75.5px)] text-[#c7ff67] text-[48px] text-shadow-[0px_0px_10px_black] top-[calc(50%-29px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Locked
      </p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[37px] not-italic text-[48px] text-white top-[56px] whitespace-nowrap">Design 3</p>
      <Frame1 />
      <Frame2 />
    </div>
  );
}
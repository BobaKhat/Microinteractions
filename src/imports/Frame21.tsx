function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute border-2 border-[#282828] border-solid h-[373px] left-1/2 overflow-clip rounded-[20px] top-[calc(50%+0.5px)] w-[324px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[315px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 315 315">
          <g id="Ellipse 54">
            <g filter="url(#filter0_i_201_1168)">
              <circle cx="157.5" cy="157.5" fill="var(--fill-0, black)" r="157.5" />
            </g>
            <circle cx="157.5" cy="157.5" r="157.25" stroke="var(--stroke-0, #414141)" strokeWidth="0.5" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="315" id="filter0_i_201_1168" width="315" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="54.9" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.333333 0 0 0 0 0.843137 0 0 0 0 0.243137 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_201_1168" />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[110px] top-[calc(50%+0.5px)]">
        <div className="absolute inset-[-0.91%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <circle cx="56" cy="56" fill="var(--fill-0, #101010)" id="Ellipse 55" r="55.5" stroke="var(--stroke-0, #66E154)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(50%-37px)] not-italic text-[#66e154] text-[16px] top-[calc(50%-9.5px)] whitespace-nowrap">CONFIRM</p>
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
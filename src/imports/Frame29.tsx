import imgImage28 from "figma:asset/24b2559ac9eea98d87d7e4f52d179f2914f2e401.png";

function Frame2() {
  return (
    <div className="absolute bg-white left-[12px] overflow-clip rounded-[10px] size-[40px] top-[12px]">
      <div className="absolute h-[38px] left-[3px] top-0 w-[37px]" data-name="image 28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[136.11%] left-[-22.86%] max-w-none top-[-16.67%] w-[140%]" src={imgImage28} />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex items-center justify-between leading-[normal] left-[64px] top-[14px] w-[298px] whitespace-nowrap">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold relative shrink-0 text-[13px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        Earthquake Notification
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal relative shrink-0 text-[10px] text-[rgba(0,0,0,0.8)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        8min ago
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.8)] h-[64px] left-[calc(50%-149px)] overflow-clip rounded-[20px] top-[194px] w-[374px]">
      <Frame2 />
      <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] left-[64px] text-[13px] text-black top-[35px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        An 7.1 Earthquake was recorded off Russia
      </p>
      <Frame5 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[64px] overflow-clip relative rounded-[20px] shrink-0 w-[80px]">
      <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] left-[24px] text-[13px] text-black top-[24px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Mute
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[64px] overflow-clip relative rounded-[20px] shrink-0 w-[80px]">
      <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] left-[20px] text-[13px] text-black top-[24px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Delete
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex gap-[5px] items-center left-[258px] top-[194px]">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <Frame1 />
      <Frame6 />
    </div>
  );
}
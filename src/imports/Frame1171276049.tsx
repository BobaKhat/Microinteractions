function Frame() {
  return (
    <div className="bg-[#a6136e] content-stretch flex flex-col h-[102px] items-center justify-center px-[30px] py-[45px] relative rounded-[300px] shadow-[0px_12px_15px_0px_rgba(0,0,0,0.3)] shrink-0 w-[98px]">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[60px] text-center text-white w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        B
      </p>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-[#1e1b1b] content-stretch flex items-center p-[30px] relative rounded-[300px] shadow-[0px_12px_24px_0px_black] size-full">
      <Frame />
    </div>
  );
}
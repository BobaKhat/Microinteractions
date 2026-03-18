function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#db284c] content-stretch flex items-center justify-center left-1/2 px-[35px] py-[15px] rounded-[100px] top-1/2">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">Complete Booking</p>
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
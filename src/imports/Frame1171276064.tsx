import imgRectangle10 from "figma:asset/0794d5602914bfd59dcbd6f00460104b3fa38ae8.png";
import imgRectangle13 from "figma:asset/430fad33956f69f9e618610c724f86bc968db5d0.png";
import imgRectangle12 from "figma:asset/73d6004f1781089fa72bc21ff51349707d6e56f6.png";
import imgRectangle15 from "figma:asset/af755da27f101cfedd13463d030ae9b08404b46a.png";
import imgRectangle16 from "figma:asset/00e85cfa4897cd5ab0543cc6ad48ee6c7d5ea1c7.png";
import imgRectangle17 from "figma:asset/92cacf313bd37f358c3db5a725e5c38d366ac1fc.png";

export default function Frame() {
  return (
    <div className="bg-[#0e0e0e] content-stretch flex gap-[15px] items-center p-[15px] relative rounded-[20px] size-full">
      <div aria-hidden="true" className="absolute border-[#313131] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[20.5px]" />
      <div className="relative rounded-[10px] shrink-0 size-[45px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle10} />
      </div>
      <div className="pointer-events-none relative rounded-[10px] shrink-0 size-[45px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[10px] size-full" src={imgRectangle13} />
        <div aria-hidden="true" className="absolute border-[#313131] border-[0.5px] border-solid inset-[-0.5px] rounded-[10.5px]" />
      </div>
      <div className="relative rounded-[10px] shrink-0 size-[45px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle12} />
      </div>
      <div className="relative rounded-[10px] shrink-0 size-[45px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle15} />
      </div>
      <div className="relative rounded-[10px] shrink-0 size-[45px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle16} />
      </div>
      <div className="relative rounded-[10px] shrink-0 size-[45px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle17} />
      </div>
    </div>
  );
}
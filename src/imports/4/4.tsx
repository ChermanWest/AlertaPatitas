import imgPlaceYourDesign1 from "./20e5f0cc6fc1d6b00e2ace55aba33e598b4e254a.png";
import imgPlaceYourDesign3 from "./1b8387590a594f9dfaef1c8d67696e270295b277.png";
import { imgPlaceYourDesign, imgPlaceYourDesign2 } from "./svg-10xyq";

function DropDesign() {
  return (
    <div className="absolute contents left-[976px] top-[294px]" data-name="Drop Design">
      <div className="absolute h-[864px] left-[976px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[649px_864px] rounded-tl-[40px] rounded-tr-[40px] top-[294px] w-[649px]" data-name="Place your Design" style={{ maskImage: `url('${imgPlaceYourDesign}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-tl-[40px] rounded-tr-[40px]">
          <img alt="" className="absolute h-[125.2%] left-0 max-w-none top-[0.01%] w-full" src={imgPlaceYourDesign1} />
        </div>
      </div>
    </div>
  );
}

function Component2ndPage() {
  return (
    <div className="absolute contents left-[976px] top-[294px]" data-name="2nd Page">
      <DropDesign />
    </div>
  );
}

function Component1StPage() {
  return (
    <div className="absolute contents left-[316px] top-[138px]" data-name="1 st Page">
      <div className="absolute h-[1020px] left-[316px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[757px_1020px] rounded-tl-[40px] rounded-tr-[40px] top-[138px] w-[757px]" data-name="Place your Design" style={{ maskImage: `url('${imgPlaceYourDesign2}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-tl-[40px] rounded-tr-[40px]">
          <img alt="" className="absolute h-[160.67%] left-[-0.01%] max-w-none top-[0.04%] w-full" src={imgPlaceYourDesign3} />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[1197px] not-italic text-[#003459] top-[138px] whitespace-nowrap">
      <p className="font-['SVN-Gilroy:Medium',sans-serif] leading-[38px] relative shrink-0 text-[28px]">Monito Pest Store</p>
      <p className="font-['SVN-Gilroy:Bold',sans-serif] leading-[60px] relative shrink-0 text-[46px]">Desktop Design</p>
    </div>
  );
}

function HerroBanner() {
  return (
    <div className="absolute h-[1158px] left-0 overflow-clip top-0 w-[1920px]" data-name="Herro Banner" style={{ backgroundImage: "linear-gradient(110.743deg, rgba(252, 238, 213, 0.6) 6.431%, rgba(252, 238, 213, 0.6) 78.328%, rgba(255, 231, 186, 0.6) 104.24%)" }}>
      <div className="absolute flex h-[1695.499px] items-center justify-center left-[-917px] top-[-696px] w-[1834.254px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[11.53deg]">
          <div className="bg-[#fceed5] h-[1407.125px] rounded-[313px] w-[1585.019px]" />
        </div>
      </div>
      <div className="absolute flex h-[1695.499px] items-center justify-center left-[819px] top-[579px] w-[1834.254px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[11.53deg]">
          <div className="bg-[#fceed5] h-[1407.125px] rounded-[313px] w-[1585.019px]" />
        </div>
      </div>
      <Component2ndPage />
      <div className="absolute bg-[rgba(0,0,0,0.1)] blur-[50px] h-[1020px] left-[440px] top-[138px] w-[757px]" data-name="Shadow" />
      <Component1StPage />
      <Frame />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="4">
      <HerroBanner />
    </div>
  );
}
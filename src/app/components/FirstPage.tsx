import imgPlaceYourDesign from "../../imports/4/1b8387590a594f9dfaef1c8d67696e270295b277.png";
import { imgPlaceYourDesign2 } from "../../imports/4/svg-10xyq";

export function FirstPage() {
  return (
    <div className="absolute contents left-[316px] top-[138px]" data-name="1st Page">
      <div
        className="absolute h-[1020px] left-[316px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[757px_1020px] rounded-tl-[40px] rounded-tr-[40px] top-[138px] w-[757px]"
        data-name="Place your Design"
        style={{ maskImage: `url('${imgPlaceYourDesign2}')` }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-tl-[40px] rounded-tr-[40px]">
          <img
            alt="First page design"
            className="absolute h-[160.67%] left-[-0.01%] max-w-none top-[0.04%] w-full"
            src={imgPlaceYourDesign}
          />
        </div>
      </div>
    </div>
  );
}

import imgDropDesign from "../../imports/4/20e5f0cc6fc1d6b00e2ace55aba33e598b4e254a.png";
import { imgPlaceYourDesign } from "../../imports/4/svg-10xyq";

export function SecondPage() {
  return (
    <div className="absolute contents left-[976px] top-[294px]" data-name="2nd Page">
      <div
        className="absolute h-[864px] left-[976px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[649px_864px] rounded-tl-[40px] rounded-tr-[40px] top-[294px] w-[649px]"
        data-name="Drop Design"
        style={{ maskImage: `url('${imgPlaceYourDesign}')` }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-tl-[40px] rounded-tr-[40px]">
          <img
            alt="Second page design"
            className="absolute h-[125.2%] left-0 max-w-none top-[0.01%] w-full"
            src={imgDropDesign}
          />
        </div>
      </div>
    </div>
  );
}

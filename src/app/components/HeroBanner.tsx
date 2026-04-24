import { FirstPage } from "./FirstPage";
import { SecondPage } from "./SecondPage";
import { DesignHeader } from "./DesignHeader";

export function HeroBanner() {
  return (
    <div
      className="absolute h-[1158px] left-0 overflow-clip top-0 w-[1920px]"
      data-name="Hero Banner"
      style={{
        backgroundImage: "linear-gradient(110.743deg, rgba(252, 238, 213, 0.6) 6.431%, rgba(252, 238, 213, 0.6) 78.328%, rgba(255, 231, 186, 0.6) 104.24%)"
      }}
    >
      {/* Background decorative ellipses */}
      <div
        className="absolute flex h-[1695.499px] items-center justify-center left-[-917px] top-[-696px] w-[1834.254px]"
        style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}
      >
        <div className="flex-none rotate-[11.53deg]">
          <div className="bg-[#fceed5] h-[1407.125px] rounded-[313px] w-[1585.019px]" />
        </div>
      </div>

      <div
        className="absolute flex h-[1695.499px] items-center justify-center left-[819px] top-[579px] w-[1834.254px]"
        style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}
      >
        <div className="flex-none rotate-[11.53deg]">
          <div className="bg-[#fceed5] h-[1407.125px] rounded-[313px] w-[1585.019px]" />
        </div>
      </div>

      {/* Pages */}
      <SecondPage />

      {/* Shadow effect */}
      <div
        className="absolute bg-[rgba(0,0,0,0.1)] blur-[50px] h-[1020px] left-[440px] top-[138px] w-[757px]"
        data-name="Shadow"
      />

      <FirstPage />
      <DesignHeader />
    </div>
  );
}

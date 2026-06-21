import { useState } from "react";
import svgPaths from "../imports/Home1/svg-gn59nokr5t";
import imgHome3SubImg from "../imports/Home1/fb024990cd170881f4958ec81ddc1cc469eba112.png";
import imgProduct11294X312Png from "../imports/Home1/14f763db85712b6e2331d2472eff92d1e817e33f.png";
import img91 from "../imports/Home1/490cd4501ce2268834a85bde8de3ca0113f4cd49.png";
import imgImagen2 from "../imports/Home1/5419caa6a67b3853a32b97797cd2f649071c39f5.png";
import imgImage from "../imports/Home1/5ef431957b7983e2c67887f3a1ef316e79a0c5ce.png";
import imgImg from "../imports/Home1/d56bc6d438af5561c84c6221acd5dea1b9f1effd.png";
import imgImg1 from "../imports/Home1/7b49d1ac5d3fa12455f8f682bcb55da8b8616d9d.png";
import imgImg2 from "../imports/Home1/ce91c574011a6d9da387c4a65239938ce1ed5b63.png";
import imgShape from "../imports/Home1/e179b1d3858dbd840ebed0563222a13e6d521f50.png";
import imgShape1 from "../imports/Home1/ef8ebd4816afcc1748a68610377d6f40ddacf4fd.png";
import imgShape2 from "../imports/Home1/721779f43498601f61bfd29d12610c90bd5a4255.png";
import imgShape1Png from "../imports/Home1/17707357768687360d80feab20e15a6ffad0bade.png";
import imgShape2Png from "../imports/Home1/1106149f2ef82567836869a3657990554ff90b5d.png";
import imgShape3Png from "../imports/Home1/14037bb9f803512199dbb0013053da56cd2370be.png";
import imgImg3 from "../imports/Home1/72124d5112e7fdb51c5bd7406b852b8d8bd9daa4.png";
import imgImg4 from "../imports/Home1/af549bd9768baa95ca9465d7f4473dc97f56f65f.png";
import {
  imgGroup,
  imgGradient,
} from "../imports/Home1/svg-mbhux";

// ─── Pet data ────────────────────────────────────────────────────────────────

interface Pet {
  id: number;
  nombre: string;
  mascota: string;
  genero: string;
  tamano: string;
  edad: string;
  estado: string;
  raza: string;
}

const PETS: Pet[] = [
  {
    id: 1,
    nombre: "Blacky - German Castro",
    mascota: "Perro",
    genero: "Macho",
    tamano: "Mediano",
    edad: "Adulto",
    estado: "Buscando",
    raza: "Sin Raza",
  },
];

const PETS_PER_PAGE = 6;

// ─── Shared radio dot ────────────────────────────────────────────────────────

function FilledDot() {
  return (
    <div className="absolute left-[6px] size-[8px] top-[6px]">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <circle cx="4" cy="4" fill="white" r="4" />
      </svg>
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className={`relative rounded-[100px] shrink-0 size-[20px] ${selected ? "bg-[#fa8232]" : "bg-white"}`}
      data-name="From Elements"
    >
      {selected ? (
        <FilledDot />
      ) : (
        <div
          aria-hidden
          className="absolute border border-[#c9cfd2] border-solid inset-0 pointer-events-none rounded-[100px]"
        />
      )}
    </div>
  );
}

// ─── Static header ────────────────────────────────────────────────────────────

function Background() {
  return (
    <div className="absolute bg-[#372121] h-[40px] left-0 right-0 top-0" />
  );
}

function Group() {
  return (
    <div
      className="absolute inset-[12.38%_53.89%_-0.43%_-4.42%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[7.433px_-6.807px] mask-size-[68px_55px]"
      style={{ maskImage: `url("${imgGroup}")` }}
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 84.8943 48.4272"
      >
        <g>
          <path d={svgPaths.p1e7a3fc0} fill="white" />
          <path d={svgPaths.p3d15f180} fill="white" />
          <path d={svgPaths.p98b2100} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function Logo3Svg() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[55px] left-1/2 overflow-clip top-1/2 w-[168px]">
      <div className="absolute inset-[85.95%_29.67%_12.72%_69.45%]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 32 32"
        >
          <g />
        </svg>
      </div>
      <div
        className="absolute flex inset-[21.82%_0_54.55%_92.26%] items-center justify-center"
        style={{ containerType: "size" }}
      >
        <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
          <div className="relative size-full">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 13 13"
            >
              <path d={svgPaths.p1d1a6c00} fill="#372121" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-[0_59.52%_0_0]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 68 55"
        >
          <path d={svgPaths.p9d800} fill="#372121" />
        </svg>
      </div>
      <div className="absolute contents inset-[0_59.52%_0_0]">
        <Group />
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-['Oleo_Script:Regular',sans-serif] inset-[41.82%_-4.17%_41.82%_34.52%] justify-center leading-[0] not-italic text-[#372121] text-[15px] text-center">
        <p className="leading-[16px]">Alerta Patitas</p>
      </div>
    </div>
  );
}

function HeaderHeader() {
  return (
    <div className="absolute h-[133px] left-0 right-0 top-0">
      <Background />
      {/* Logo */}
      <div className="absolute h-[21px] left-[85px] top-[74.72px] w-[168px]">
        <div className="absolute h-[64px] left-[-36px] overflow-clip top-[-26.72px] w-[168px]">
          <div className="absolute h-[55px] left-0 overflow-clip top-0 w-[168px]">
            <Logo3Svg />
          </div>
        </div>
      </div>
      {/* Nav items */}
      <div className="absolute h-[93px] left-[345.39px] top-[40px] w-[554.83px]">
        <div className="absolute h-[93px] left-[435.61px] top-0 w-[59.23px]">
          <div className="[word-break:break-word] absolute h-[93px] leading-[0] left-0 text-[#02000f] top-0 w-[59.23px]">
            <div className="-translate-y-1/2 absolute flex flex-col font-['Onest:Regular',sans-serif] font-normal h-[21px] justify-center left-0 text-[16px] top-[46px] w-[43.773px]">
              <p className="leading-[26px]">Inicio</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-['Font_Awesome_5_Pro:Solid',sans-serif] h-[26px] justify-center left-[48.44px] not-italic text-[14.4px] top-[46.5px] w-[11.123px]">
              <p className="leading-[26px]">{``}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] left-[calc(50%+188.5px)] text-[#02000f] text-[16px] text-center top-[86px] w-[99px]">
        <p className="leading-[14px]">Acerca de nosotros</p>
      </div>
      {/* Páginas */}
      <div className="[word-break:break-word] absolute h-[93px] leading-[0] left-[975px] text-[#02000f] top-[38px] w-[61.42px]">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Onest:Regular',sans-serif] font-normal h-[21px] justify-center left-[-10px] text-[16px] top-[46.5px] w-[68px]">
          <p className="leading-[26px]">Paginas</p>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Font_Awesome_5_Pro:Solid',sans-serif] h-[26px] justify-center left-[50.62px] not-italic text-[14.4px] top-[46.5px] w-[11.123px]">
          <p className="leading-[26px]">{``}</p>
        </div>
      </div>
      {/* Favorites button */}
      <div className="-translate-y-1/2 absolute bg-[#faf0dd] left-[1059.61px] rounded-[26px] size-[52px] top-[calc(50%+20px)]">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#faf0dd] h-[52px] left-1/2 rounded-[23px] top-1/2 w-[40px]">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Font_Awesome_5_Pro:Solid',sans-serif] h-[21px] justify-center leading-[0] left-[calc(50%+0.1px)] not-italic text-[#02000f] text-[19.7px] text-center top-[25.5px] w-[20.2px]">
            <p className="leading-[20px]">{``}</p>
          </div>
          <div className="absolute bg-[#f4e11b] h-[20px] right-0 rounded-[10.19px] top-0 w-[20.77px]">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#02000f] text-[12px] text-center top-[10px] w-[8.354px]">
              <p className="leading-[12px]">0</p>
            </div>
          </div>
        </div>
      </div>
      {/* Login button */}
      <div className="-translate-y-1/2 absolute bg-[#f4e11b] border-2 border-[#02000f] border-solid h-[52px] left-[1126.61px] overflow-clip rounded-[50px] top-[calc(50%+20px)] w-[231.38px] cursor-pointer">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#02000f] text-[16px] text-center top-[calc(50%-0.5px)] w-[179.719px]">
          <p className="leading-[16px]">Iniciar Sesión</p>
        </div>
      </div>
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div className="absolute h-[729px] left-0 overflow-clip right-0 top-[133px]">
      <div className="absolute h-[729px] left-0 overflow-clip right-0 top-0">
        {/* Hero slide */}
        <div className="absolute h-[729.48px] left-0 top-0 w-[1440px]">
          <div className="absolute inset-[0_30px] rounded-[100px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[100px]">
              <img
                alt=""
                className="absolute h-full left-[-10.79%] max-w-none top-0 w-[121.58%]"
                src={imgImage}
              />
            </div>
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:Bold',sans-serif] font-bold h-[25px] justify-center leading-[0] left-[66px] text-[#02000f] text-[20px] top-[calc(50%-141.24px)] w-[533px]">
            <p className="leading-[24px]">
              La comunidad que ayuda a reencontrar mascotas con
              sus familias.
            </p>
          </div>
          <div
            className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Fredoka:SemiBold',sans-serif] font-semibold h-[164.94px] justify-center leading-[0] left-[60px] text-[#02000f] text-[70px] top-[145.47px] w-[562.73px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            <p className="leading-[79px]">Alerta Patitas</p>
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:Regular',sans-serif] font-normal h-[95px] justify-center leading-[0] left-[65px] text-[#4e4e4e] text-[20px] top-[344.5px] w-[607px]">
            <p className="leading-[35px] mb-0">
              Si tu mascota se perdió, no estás solo. Publica la
              información y recibe ayuda de personas cercanas
              que puedan colaborar en su búsqueda.
            </p>
            <p className="leading-[35px]">
              Cada dato puede ser importante para volver a
              encontrar a tu compañero.
            </p>
          </div>
          {/* CTA button */}
          <div className="absolute bg-[#f4e11b] border-2 border-[#02000f] border-solid h-[64px] left-[60px] overflow-clip rounded-[50px] top-[510.48px] w-[203.61px] cursor-pointer">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:Regular',sans-serif] font-normal h-[21px] justify-center leading-[0] left-[calc(50%+0.2px)] text-[#02000f] text-[20px] text-center top-[calc(50%-0.5px)] w-[128.008px]">
              <p className="leading-[21px]">
                Crea una publicacion!
              </p>
            </div>
          </div>
          <div className="absolute bg-[#e6d445] inset-[10.09%_2.83%_10.23%_47.22%] rounded-[100px]" />
          {/* Hero image */}
          <div className="absolute h-[458px] right-[107px] top-[157px] w-[653px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute h-[116.48%] left-[14.93%] max-w-none top-[-8.24%] w-[81.7%]"
                src={imgImg2}
              />
            </div>
          </div>
        </div>
        {/* Slide indicators */}
        <div className="absolute bg-[#02000f] h-[10px] left-[75px] rounded-[20px] top-[636px] w-[80px]" />
        <div className="absolute bg-[#999] h-[10px] left-[167px] rounded-[20px] top-[636px] w-[45px]" />
        <div className="absolute bg-[#999] h-[10px] left-[224px] rounded-[20px] top-[636px] w-[45px]" />
      </div>
      {/* Decorative shapes */}
      <div className="absolute h-[87px] left-[777.59px] top-[102.05px] w-[105px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute left-0 max-w-none size-full top-0"
            src={imgShape}
          />
        </div>
      </div>
      <div className="absolute h-[71.72px] left-[1365.61px] top-[284.3px] w-[60px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute h-[100.01%] left-0 max-w-none top-0 w-full"
            src={imgShape1}
          />
        </div>
      </div>
      <div className="absolute h-[100.44px] left-[561px] top-[439px] w-[180px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute h-[100.01%] left-0 max-w-none top-0 w-full"
            src={imgShape2}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Pet card ─────────────────────────────────────────────────────────────────

function PetCard({ pet }: { pet: Pet }) {
  const description = `${pet.mascota} • ${pet.genero} • ${pet.tamano} • ${pet.edad} • ${pet.estado} • ${pet.raza}`;
  return (
    <div className="border border-[rgba(56,61,70,0.1)] border-solid h-[480.06px] w-[332px] rounded-[24px] relative">
      {/* Pet image */}
      <div className="absolute bg-[#f6f2ed] h-[286.52px] left-0 overflow-clip right-0 rounded-[24px] top-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute left-0 max-w-none size-full top-0"
            src={imgProduct11294X312Png}
          />
        </div>
        <div className="absolute backdrop-blur-[0px] inset-0 opacity-0 rounded-[24px]" />
      </div>
      {/* Pet name */}
      <div
        className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Fredoka:Medium',sans-serif] font-medium h-[24px] justify-center leading-[0] left-[calc(50%-8.49px)] text-[#02000f] text-[20px] text-center top-[310.13px] w-[227.016px]"
        style={{ fontVariationSettings: '"wdth" 100' }}
      >
        <p className="leading-[25.56px]">{pet.nombre}</p>
      </div>
      {/* Pet description */}
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Onest:SemiBold',sans-serif] font-semibold h-[18px] justify-center leading-[0] left-[calc(50%-8px)] text-[#6c6d71] text-[14px] text-center top-[339.13px] w-[212px]">
        <p className="leading-[13px]">{description}</p>
      </div>
    </div>
  );
}

// ─── Pets section with filters ────────────────────────────────────────────────

interface Filters {
  mascota: string | null;
  genero: string | null;
  edad: string | null;
  tamano: string | null;
  estado: string | null;
}

function PetsSection() {
  const [filters, setFilters] = useState<Filters>({
    mascota: null,
    genero: null,
    edad: null,
    tamano: null,
    estado: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  function toggle(group: keyof Filters, value: string) {
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group] === value ? null : value,
    }));
    setCurrentPage(1);
  }

  const filtered = PETS.filter((p) => {
    if (filters.mascota && p.mascota !== filters.mascota)
      return false;
    if (filters.genero && p.genero !== filters.genero)
      return false;
    if (filters.estado && p.estado !== filters.estado)
      return false;
    // Tamaño: visual label "Macho" maps to Mediano, "Hembra" maps to other sizes
    if (filters.tamano === "Macho" && p.tamano !== "Mediano")
      return false;
    if (filters.tamano === "Hembra" && p.tamano === "Mediano")
      return false;
    // Edad: visual label "De corta edad" = young, "Hembra" (mislabeled) = Adulto
    if (
      filters.edad === "De corta edad" &&
      p.edad !== "De corta edad"
    )
      return false;
    if (filters.edad === "Hembra" && p.edad !== "Adulto")
      return false;
    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PETS_PER_PAGE),
  );
  const pagePets = filtered.slice(
    (currentPage - 1) * PETS_PER_PAGE,
    currentPage * PETS_PER_PAGE,
  );

  return (
    <div className="absolute h-[1219px] left-[18px] right-[-12px] top-[976px]">
      {/* Decorative header image */}
      <div className="absolute h-[58.27px] left-[12px] top-[-14.39px] w-[527.16px]">
        <div className="absolute h-[108px] left-[-26px] top-[-21px] w-[109px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute left-0 max-w-none size-full top-0"
              src={imgHome3SubImg}
            />
          </div>
        </div>
      </div>

      {/* Section heading */}
      <div
        className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Fredoka:SemiBold',sans-serif] font-semibold h-[58px] justify-center leading-[0] left-[293px] text-[#02000f] text-[48px] top-[11px] w-[938px]"
        style={{ fontVariationSettings: '"wdth" 100' }}
      >
        <p className="leading-[58.27px]">
          Ayuda a la Comunidad con estos Casos
        </p>
      </div>

      {/* Sidebar image */}
      <div className="absolute inset-[8.2%_81.73%_29.29%_0.84%]">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          height="762"
          src={img91}
          width="250"
        />
      </div>

      {/* ── Filter sidebar ── */}
      <div className="absolute content-stretch flex flex-col gap-[16px] h-[730px] items-start left-[20px] top-[112px]">
        <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#191c1f] text-[16px] uppercase w-[312px]">
          Filtros
        </p>

        {/* Mascota */}
        <div className="content-stretch flex flex-col gap-[12px] h-[128px] items-start relative shrink-0 w-[312px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#191c1f] text-[14px] w-[284px]">
              Mascota
            </p>
          </div>
          {(["Perro", "Gato", "Otros"] as const).map((opt) => (
            <div
              key={opt}
              className="content-stretch flex gap-[8px] items-start relative shrink-0 cursor-pointer select-none"
              onClick={() => toggle("mascota", opt)}
            >
              <RadioDot selected={filters.mascota === opt} />
              <p className="[word-break:break-word] font-['Public_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[284px]">
                {opt}
              </p>
            </div>
          ))}
        </div>

        {/* Genero */}
        <div className="content-stretch flex flex-col gap-[12px] h-[90px] items-start relative shrink-0 w-[312px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#191c1f] text-[14px] w-[284px]">
              Genero
            </p>
          </div>
          {(["Macho", "Hembra"] as const).map((opt) => (
            <div
              key={opt}
              className="content-stretch flex gap-[8px] items-start relative shrink-0 cursor-pointer select-none"
              onClick={() => toggle("genero", opt)}
            >
              <RadioDot selected={filters.genero === opt} />
              <p className="[word-break:break-word] font-['Public_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[284px]">
                {opt}
              </p>
            </div>
          ))}
        </div>

        {/* Edad */}
        <div className="content-stretch flex flex-col gap-[12px] h-[108px] items-start relative shrink-0 w-[312px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#191c1f] text-[14px] w-[284px]">
              Edad
            </p>
          </div>
          {(["De corta edad", "Hembra"] as const).map((opt) => (
            <div
              key={opt}
              className="content-stretch flex gap-[8px] items-start relative shrink-0 cursor-pointer select-none"
              onClick={() => toggle("edad", opt)}
            >
              <RadioDot selected={filters.edad === opt} />
              <p className="[word-break:break-word] font-['Public_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[284px]">
                {opt}
              </p>
            </div>
          ))}
        </div>

        {/* Tamaño */}
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[312px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#191c1f] text-[14px] w-[284px]">
              Tamaño
            </p>
          </div>
          {(["Macho", "Hembra"] as const).map((opt) => (
            <div
              key={opt}
              className="content-stretch flex gap-[8px] items-start relative shrink-0 cursor-pointer select-none"
              onClick={() => toggle("tamano", opt)}
            >
              <RadioDot selected={filters.tamano === opt} />
              <p className="[word-break:break-word] font-['Public_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[284px]">
                {opt}
              </p>
            </div>
          ))}
        </div>

        {/* Estado */}
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[312px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#191c1f] text-[14px] w-[284px]">{`Estado `}</p>
          </div>
          {(["Perdido", "Buscando"] as const).map((opt) => (
            <div
              key={opt}
              className="content-stretch flex gap-[8px] items-start relative shrink-0 cursor-pointer select-none"
              onClick={() => toggle("estado", opt)}
            >
              <RadioDot selected={filters.estado === opt} />
              <p className="[word-break:break-word] font-['Public_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[284px]">
                {opt}
              </p>
            </div>
          ))}
        </div>

        {/* Area de busqueda */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[312px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <p className="[word-break:break-word] font-['Public_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#191c1f] text-[14px] w-[284px]">
              Area de busqueda
            </p>
          </div>
        </div>

        {/* Small logo image */}
        <div className="h-[15px] relative shrink-0 w-[48px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgImagen2}
          />
        </div>
      </div>

      {/* ── Pet cards grid ── */}
      <div className="absolute left-[298px] right-[0px] top-[98.87px] min-h-[480px]">
        {pagePets.length > 0 ? (
          <div className="flex flex-wrap gap-6 pt-4 pl-4">
            {pagePets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[480px]">
            <p className="font-['Onest:Regular',sans-serif] text-[#6c6d71] text-[18px]">
              No se encontraron mascotas con los filtros
              seleccionados.
            </p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <div className="absolute flex h-[52px] items-center left-[31px] right-[89px] top-[620px]">
        <div className="flex gap-[12px] items-center">
          {/* Page 1 */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`rounded-[24px] size-[48px] border border-[rgba(78,78,78,0.2)] border-solid flex items-center justify-center cursor-pointer transition-colors ${currentPage === 1 ? "bg-[#f8721f] text-white" : "bg-white text-[#02000f]"}`}
          >
            <span className="font-['Onest:Regular',sans-serif] font-normal text-[18px] leading-[26px]">
              1
            </span>
          </button>
          {/* Page 2 */}
          <button
            onClick={() => setCurrentPage(2)}
            className={`rounded-[24px] size-[48px] border border-[rgba(78,78,78,0.2)] border-solid flex items-center justify-center cursor-pointer transition-colors ${currentPage === 2 ? "bg-[#f8721f] text-white" : "bg-white text-[#02000f]"}`}
          >
            <span className="font-['Onest:Regular',sans-serif] font-normal text-[18px] leading-[26px]">
              2
            </span>
          </button>
          {/* Next arrow */}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage >= totalPages}
            className="rounded-[24px] size-[48px] border border-[rgba(78,78,78,0.2)] border-solid flex items-center justify-center cursor-pointer bg-white disabled:opacity-40"
          >
            <span className="font-['Font_Awesome_5_Pro:Solid',sans-serif] not-italic text-[#02000f] text-[18px] leading-[18px]">{``}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <div className="absolute h-[353px] left-[18px] right-[-18px] top-[2216px]">
      <div className="absolute h-[78px] left-[1306.41px] top-[603.92px] w-[76px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute left-0 max-w-none size-full top-0"
            src={imgShape1Png}
          />
        </div>
      </div>
      <div className="absolute h-[69px] left-[1287.61px] top-[412.8px] w-[66px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute left-0 max-w-none size-full top-0"
            src={imgShape2Png}
          />
        </div>
      </div>
      <div className="absolute h-[75px] left-[1292.81px] top-[259.41px] w-[104px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute left-0 max-w-none size-full top-0"
            src={imgShape3Png}
          />
        </div>
      </div>
      <div className="absolute bg-[#1f1f1f] inset-[0_0_-0.2px_0]" />
      <div className="absolute bg-white h-[183px] left-0 right-[-7px] rounded-bl-[24px] rounded-br-[24px] top-0">
        <div className="absolute h-[198px] left-[619.5px] top-[30px] w-[154px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute left-0 max-w-none size-full top-0"
              src={imgImg3}
            />
          </div>
        </div>
        <div className="absolute h-[163px] left-[781.5px] top-[20px] w-[107px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute left-0 max-w-none size-full top-0"
              src={imgImg4}
            />
          </div>
        </div>
        <div className="absolute h-[96px] left-[150px] right-[1046px] top-[43.5px]" />
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="bg-white relative size-full"
      data-name="Home-1"
    >
      <HeaderHeader />
      <HeroSection />
      <PetsSection />
      <Footer />
    </div>
  );
}
import svgPaths from "./svg-ztzbgidcuv";

function Group1() {
  return (
    <div className="absolute inset-[0.21%_0_0_47.28%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 238.95 194.48">
        <g id="Group">
          <path d={svgPaths.pe05f00} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p16a24200} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[0_57.01%_0_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 194.875 194.873">
        <g id="Group">
          <path d={svgPaths.p1b463100} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p2e0bc100} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <Group1 />
      <Group2 />
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute contents inset-0" data-name="Layer 1">
      <Group />
    </div>
  );
}

export default function Asset() {
  return (
    <div className="relative size-full" data-name="Asset 2 1">
      <Layer />
    </div>
  );
}
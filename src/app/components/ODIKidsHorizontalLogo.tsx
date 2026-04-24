import svgPaths from "../../imports/svg-bm3b1udxor";

type Size = 'small' | 'medium' | 'large' | 'xlarge';

interface ODIKidsHorizontalLogoProps {
  size?: Size;
  odiColor?: string;
  className?: string;
}

// Size configurations maintaining exact aspect ratio from Figma: 462.333 x 127.799
const sizeConfig = {
  small: {
    width: 231,
    height: 64,
  },
  medium: {
    width: 462,
    height: 128,
  },
  large: {
    width: 693,
    height: 192,
  },
  xlarge: {
    width: 924,
    height: 256,
  },
};

export function ODIKidsHorizontalLogo({ 
  size = 'medium', 
  odiColor = '#06B6D4',
  className = '' 
}: ODIKidsHorizontalLogoProps) {
  const config = sizeConfig[size];

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: config.width,
        height: config.height,
      }}
    >
      {/* O shape - left arc */}
      <div className="absolute inset-[0_72.41%_0.42%_0]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 127.54 127.269">
          <g>
            <path d={svgPaths.p1ce1a600} fill={odiColor} />
            <path d={svgPaths.p3e879680} fill={odiColor} />
          </g>
        </svg>
      </div>

      {/* D, I shapes and Kids SVG text */}
      <div className="absolute h-[99.77%] left-[29.26%] top-[0.2%] w-[70.74%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 327.073 127.539">
          <g>
            {/* D shape */}
            <path d={svgPaths.p22d08760} fill={odiColor} />
            {/* I shape */}
            <path d={svgPaths.p18a9c180} fill={odiColor} />
            {/* Kids text as SVG paths */}
            <g>
              {/* s - Light Green */}
              <path d={svgPaths.p17e47700} fill="#8BC34A" />
              {/* d - Cyan */}
              <path d={svgPaths.p38801500} fill="#00BCD4" />
              {/* i - Deep Orange */}
              <path d={svgPaths.p32989700} fill="#FF5722" />
              {/* K - Purple */}
              <path d={svgPaths.p22790dc0} fill="#9C27B0" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

// Centered variant with tagline
export function ODIKidsHorizontalLogoCentered({ 
  size = 'large',
  odiColor = '#06B6D4',
  showTagline = true,
  tagline = 'Educational Entertainment for Young Minds',
  className = ''
}: ODIKidsHorizontalLogoProps & { showTagline?: boolean; tagline?: string }) {
  return (
    <div className={`flex flex-col items-center gap-6 text-center ${className}`}>
      <ODIKidsHorizontalLogo size={size} odiColor={odiColor} />
      {showTagline && (
        <p className="text-sm md:text-base lg:text-lg text-white font-medium tracking-wide max-w-2xl">
          {tagline}
        </p>
      )}
    </div>
  );
}

// Showcase component
export function ODIKidsHorizontalLogoShowcase() {
  return (
    <div className="w-full space-y-12">
      {/* White Background */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-8 text-center">On White Background</h3>
        
        <div className="space-y-12">
          {/* X-Large */}
          <div className="flex flex-col items-center gap-4 pb-8 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">X-Large (924 × 256px)</p>
            <ODIKidsHorizontalLogo size="xlarge" />
          </div>

          {/* Large */}
          <div className="flex flex-col items-center gap-4 pb-8 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Large (693 × 192px)</p>
            <ODIKidsHorizontalLogo size="large" />
          </div>

          {/* Medium */}
          <div className="flex flex-col items-center gap-4 pb-8 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Medium (462 × 128px)</p>
            <ODIKidsHorizontalLogo size="medium" />
          </div>

          {/* Small */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Small (231 × 64px)</p>
            <ODIKidsHorizontalLogo size="small" />
          </div>
        </div>
      </div>

      {/* Dark Background */}
      <div className="bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-8 text-center">On Dark Background</h3>
        
        <div className="space-y-12">
          {/* Large with tagline */}
          <div className="flex flex-col items-center gap-4">
            <ODIKidsHorizontalLogoCentered size="large" />
          </div>
        </div>
      </div>

      {/* Gradient Background */}
      <div className="bg-gradient-to-br from-[#FFF5F7] via-[#FFF9E6] to-[#F0F9FF] rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-8 text-center">On Gradient Background</h3>
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-6">
            <ODIKidsHorizontalLogo size="large" />
            <p className="text-sm md:text-base lg:text-lg text-gray-600 font-medium tracking-wide max-w-2xl text-center">
              Educational Entertainment for Young Minds
            </p>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">Usage Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Correct Usage */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">✓</div>
              <h4 className="font-bold text-gray-900">Correct Usage</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Use on clean backgrounds with sufficient contrast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Maintain aspect ratio when resizing (3.62:1)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Ensure Kids colors remain vibrant and distinct</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Use approved ODI color variations only</span>
              </li>
            </ul>
          </div>

          {/* Incorrect Usage */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">✗</div>
              <h4 className="font-bold text-gray-900">Incorrect Usage</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Don't place on busy or patterned backgrounds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Don't distort or stretch disproportionately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Don't change the Kids letter colors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Don't use ODI brand colors from main brand</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
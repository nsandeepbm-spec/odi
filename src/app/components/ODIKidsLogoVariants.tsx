import { ODILogo } from './ODILogo';

type ColorVariant = 'rainbow';

interface ColorScheme {
 k: string;
 i: string;
 d: string;
 s: string;
 name: string;
 description: string;
}

const colorSchemes: Record<ColorVariant, ColorScheme> = {
 rainbow: {
 k: '#9C27B0',
 i: '#FF5722',
 d: '#00BCD4',
 s: '#8BC34A',
 name: 'Rainbow Pop',
 description: 'Vibrant rainbow with consistent luminance'
 }
};

export function ODIKidsLogoVariant({ 
 variant = 'rainbow', 
 size = 'medium',
 showName = false 
}: { 
 variant?: ColorVariant; 
 size?: 'small' | 'medium' | 'large';
 showName?: boolean;
}) {
 const colors = colorSchemes[variant];
 
 const sizeClasses = {
 small: 'text-3xl md:text-4xl',
 medium: 'text-5xl md:text-6xl',
 large: 'text-6xl md:text-7xl lg:text-8xl'
 };

 return (
 <div className="flex flex-col items-center gap-4">
 {/* KIds Text */}
 <div 
 className={`tracking-wide leading-none flex items-center ${sizeClasses[size]}`}
 style={{ letterSpacing: '-4px', fontFamily: 'Kodchasan, sans-serif', fontWeight: 800 }}
 >
 <span style={{ color: colors.k }}>K</span>
 <span style={{ color: colors.i }}>i</span>
 <span style={{ color: colors.d }}>d</span>
 <span style={{ color: colors.s }}>s</span>
 </div>
 
 {/* Optional name and description */}
 {showName && (
 <div className="text-center">
 <div className="text-sm font-bold text-gray-700 mb-1">{colors.name}</div>
 <div className="text-xs text-gray-500">{colors.description}</div>
 </div>
 )}
 </div>
 );
}

export function ODIKidsLogoFull({ 
 variant = 'rainbow',
 logoColor = '#7C3AED'
}: { 
 variant?: ColorVariant;
 logoColor?: string;
}) {
 const colors = colorSchemes[variant];

 return (
 <div className="flex flex-col items-start gap-3 md:gap-4">
 {/* ODI Full Logo */}
 <div className="relative"style={{ width: 'clamp(280px, 50vw, 480px)' }}>
 <ODILogo color={logoColor} />
 </div>

 {/* KIDS Badge - Professional design */}
 <div className="relative flex items-center gap-2 md:gap-3 ml-0 md:ml-2">
 {/* Decorative accent bar with variant colors */}
 <div 
 className="w-1 md:w-1.5 h-8 md:h-10 rounded-full"
 style={{
 background: `linear-gradient(to bottom, ${colors.k}, ${colors.i}, ${colors.d}, ${colors.s})`
 }}
 ></div>
 
 {/* KIds text with individual letter colors */}
 <div className="relative">
 <div 
 className="tracking-wide leading-none flex items-center"
 style={{ fontSize: 'clamp(2rem, 8vw, 3.25rem)', letterSpacing: '-4px', fontFamily: 'Kodchasan, sans-serif', fontWeight: 800 }}
 >
 <span style={{ color: colors.k }}>K</span>
 <span style={{ color: colors.i }}>i</span>
 <span style={{ color: colors.d }}>d</span>
 <span style={{ color: colors.s }}>s</span>
 </div>
 {/* Subtle tagline */}
 <div className="text-xs md:text-sm text-gray-500 font-medium mt-0.5 md:mt-1 tracking-wide">
 Educational Entertainment
 </div>
 </div>

 {/* Playful accent dot */}
 <div 
 className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full animate-pulse ml-1"
 style={{ 
 background: `linear-gradient(135deg, ${colors.i} 0%, ${colors.k} 100%)`,
 animationDuration: '2s'
 }} 
 />
 </div>
 </div>
 );
}

// Showcase component to display all variants
export function ODIKidsLogoShowcase() {
 const variant: ColorVariant = 'rainbow';
 const colors = colorSchemes[variant];

 return (
 <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 md:px-8">
 <div className="max-w-5xl mx-auto">
 <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
 ODI KIds Official Color Scheme
 </h2>
 <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
 Rainbow Pop - A vibrant, balanced palette designed for perfect visibility on any background.
 </p>

 {/* Single variant showcase */}
 <div className="max-w-3xl mx-auto">
 <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200 mb-8">
 <div className="flex items-center justify-center mb-8">
 <div className="flex items-center gap-3">
 <div>
 <h3 className="text-2xl font-bold text-gray-800 text-center">{colors.name}</h3>
 <p className="text-sm text-gray-500 text-center">{colors.description}</p>
 </div>
 </div>
 </div>

 {/* Logo preview on WHITE background */}
 <div className="mb-6">
 <p className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wide">On White Background</p>
 <div className="flex items-center justify-center py-10 bg-white rounded-2xl border-2 border-gray-200">
 <ODIKidsLogoVariant variant={variant} size="large"/>
 </div>
 </div>

 {/* Logo preview on BLACK background */}
 <div className="mb-8">
 <p className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wide">On Black Background</p>
 <div className="flex items-center justify-center py-10 bg-gray-900 rounded-2xl">
 <ODIKidsLogoVariant variant={variant} size="large"/>
 </div>
 </div>

 {/* Color swatches */}
 <div className="grid grid-cols-4 gap-4">
 {Object.entries(colors).slice(0, 4).map(([letter, color]) => (
 <div key={letter} className="flex flex-col items-center gap-2">
 <div 
 className="w-full aspect-square rounded-xl shadow-md border-2 border-white"
 style={{ backgroundColor: color }}
 />
 <span className="text-sm font-bold text-gray-700 uppercase">{letter}</span>
 <span className="text-xs text-gray-400 font-mono">{color}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Full logo lockup */}
 <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
 <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
 Full Logo Lockup
 </h3>
 <div className="flex items-center justify-center">
 <ODIKidsLogoFull variant={variant} logoColor="#7C3AED"/>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
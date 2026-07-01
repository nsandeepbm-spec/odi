import { ODILogo } from './ODILogo';

export function ODIKidsLogo({ color = '#7C3AED', variant = 'icon' }: { color?: string; variant?: 'icon' | 'full' }) {
 if (variant === 'full') {
 // Full logo version with ODI full logo + KIDS badge
 return (
 <div className="flex flex-col items-start gap-3 md:gap-4">
 {/* ODI Full Logo */}
 <div className="relative"style={{ width: 'clamp(280px, 50vw, 480px)' }}>
 <ODILogo color={color} />
 </div>

 {/* KIDS Badge - Professional design */}
 <div className="relative flex items-center gap-2 md:gap-3 ml-0 md:ml-2">
 {/* Decorative accent bar */}
 <div className="w-1 md:w-1.5 h-8 md:h-10 bg-gradient-to-b from-[#FF6B9D] via-[#FFB800] to-[#06B6D4] rounded-full"></div>
 
 {/* KIDS text with individual letter colors */}
 <div className="relative">
 <div 
 className="font-black tracking-wide leading-none flex items-center"
 style={{ fontSize: 'clamp(2rem, 8vw, 3.25rem)', letterSpacing: '0.05em' }}
 >
 <span style={{ color: '#FF5757' }}>K</span>
 <span style={{ color: '#FFA500' }}>I</span>
 <span style={{ color: '#4CAF50' }}>D</span>
 <span style={{ color: '#9C27B0' }}>S</span>
 </div>
 {/* Subtle tagline */}
 <div className="text-xs md:text-sm text-gray-500 font-medium mt-0.5 md:mt-1 tracking-wide">
 Educational Entertainment
 </div>
 </div>

 {/* Playful accent dot - single refined element */}
 <div 
 className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-br from-[#FFB800] to-[#FF6B9D] rounded-full animate-pulse ml-1"
 style={{ animationDuration: '2s' }} 
 />
 </div>
 </div>
 );
 }

 // Icon only version - refined vertical lockup
 return (
 <div className="flex flex-col items-center gap-5 md:gap-6">
 {/* ODI Icon */}
 <div className="relative w-full">
 <svg viewBox="0 0 194.875 194.873"className="w-full h-auto">
 <path 
 d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z"
 fill={color}
 />
 <path 
 d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z"
 fill="#FFB800"
 />
 </svg>
 </div>
 
 {/* Divider line */}
 <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
 
 {/* KIDS badge - vertical version */}
 <div className="relative flex flex-col items-center">
 <div 
 className="font-black tracking-wide leading-none flex items-center mb-2"
 style={{ fontSize: 'clamp(2.25rem, 10vw, 3.5rem)', letterSpacing: '0.05em' }}
 >
 <span style={{ color: '#FF5757' }}>K</span>
 <span style={{ color: '#FFA500' }}>I</span>
 <span style={{ color: '#4CAF50' }}>D</span>
 <span style={{ color: '#9C27B0' }}>S</span>
 </div>
 <div className="text-xs md:text-sm text-gray-500 font-medium tracking-wide">
 Educational Entertainment
 </div>
 </div>
 </div>
 );
}
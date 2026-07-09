import { HeroIntro } from '../components/HeroIntro';
import { HomeFeatures } from '../components/HomeFeatures';

export default function MainPage() {
  return (
    <div className="w-full min-h-screen bg-[#080808]">
      <HeroIntro />
      <HomeFeatures />
    </div>
  );
}

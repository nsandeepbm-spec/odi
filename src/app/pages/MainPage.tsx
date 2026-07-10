import { HeroIntro } from '../components/HeroIntro';
import { HomeProductSections } from '../components/HomeProductSections';

export default function MainPage() {
  return (
    <div className="w-full">
      <HeroIntro />
      <HomeProductSections />
    </div>
  );
}

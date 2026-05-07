import React from 'react';
import { Film } from 'lucide-react';
import { IndustryBasePage } from '../components/IndustryBasePage';

export default function IndustryFilmStudios() {
  return (
    <IndustryBasePage
      title="FILM"
      subtitle="STUDIOS"
      icon={Film}
      description="Feature films, theatrical releases, and premium content for major studios and independent filmmakers seeking unparalleled cinematic depth."
      features={['Feature Films', 'Theatrical Distribution', 'Archive Projects', 'Stereoscopic Mastering']}
      image="https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&q=80&w=1200"
    />
  );
}

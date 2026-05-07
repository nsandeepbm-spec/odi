import React from 'react';
import { Music } from 'lucide-react';
import { IndustryBasePage } from '../components/IndustryBasePage';

export default function IndustryMusicLabels() {
  return (
    <IndustryBasePage
      title="MUSIC"
      subtitle="LABELS"
      icon={Music}
      description="Transform music videos into immersive experiences for artists, labels, and streaming platforms to connect with fans on a deeper level."
      features={['Music Videos', 'Concert Films', 'Visual Albums', 'VR Experiences']}
      image="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"
    />
  );
}

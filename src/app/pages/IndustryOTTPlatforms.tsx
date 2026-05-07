import React from 'react';
import { Tv } from 'lucide-react';
import { IndustryBasePage } from '../components/IndustryBasePage';

export default function IndustryOTTPlatforms() {
  return (
    <IndustryBasePage
      title="OTT"
      subtitle="PLATFORMS"
      icon={Tv}
      description="Streaming content optimization for Netflix, Apple TV+, Disney+, and emerging immersive platforms looking to lead the market with high-fidelity depth."
      features={['Series & Originals', 'Catalog Enhancement', 'Premium Tiers', 'Platform Optimization']}
      image="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=1200"
    />
  );
}

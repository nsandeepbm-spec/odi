import React from 'react';
import { Sparkles } from 'lucide-react';
import { IndustryBasePage } from '../components/IndustryBasePage';

export default function IndustryAdvertisingAgencies() {
  return (
    <IndustryBasePage
      title="ADVERTISING"
      subtitle="AGENCIES"
      icon={Sparkles}
      description="High-impact brand campaigns, commercials, and experiential content that drives engagement through premium spatial storytelling."
      features={['TV Commercials', 'Brand Films', 'Product Launches', 'Social Campaigns']}
      image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    />
  );
}

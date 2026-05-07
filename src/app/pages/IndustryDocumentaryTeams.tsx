import React from 'react';
import { FileText } from 'lucide-react';
import { IndustryBasePage } from '../components/IndustryBasePage';

export default function IndustryDocumentaryTeams() {
  return (
    <IndustryBasePage
      title="DOCUMENTARY"
      subtitle="TEAMS"
      icon={FileText}
      description="Bring educational and documentary content to life with depth that enhances storytelling and audience immersion."
      features={['Nature Docs', 'Educational Content', 'Cultural Films', 'Historical Archive']}
      image="https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&q=80&w=1200"
    />
  );
}

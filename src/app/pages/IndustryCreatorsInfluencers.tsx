import React from 'react';
import { Users } from 'lucide-react';
import { IndustryBasePage } from '../components/IndustryBasePage';

export default function IndustryCreatorsInfluencers() {
 return (
 <IndustryBasePage
 title="CREATORS &"
 subtitle="INFLUENCERS"
 icon={Users}
 description="Stand out on social media with immersive reels, shorts, and modern vertical content designed for the next generation of mobile viewing."
 features={['Instagram Reels', 'YouTube Shorts', 'TikTok Content', 'Personal Branding']}
 image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200"
 />
 );
}

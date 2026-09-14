import React from 'react';
import { getActiveGiveaways } from '../../data/giveawayData.js';
import GiveawayHero from '../../components/giveaways/GiveawayHero/GiveawayHero.jsx';
import GiveawayStats from '../../components/giveaways/GiveawayStats/GiveawayStats.jsx';
import GiveawayCard from '../../components/giveaways/GiveawayCard/GiveawayCard.jsx';
import HowItWorks from '../../components/giveaways/HowItWorks/HowItWorks.jsx';
import Winners from '../../components/giveaways/Winners/Winners.jsx';
import TrustSection from '../../components/giveaways/TrustSection/TrustSection.jsx';
import Rules from '../../components/giveaways/Rules/Rules.jsx';
import FAQ from '../../components/giveaways/FAQ/FAQ.jsx';
import FinalCTA from '../../components/giveaways/FinalCTA/FinalCTA.jsx';
import styles from './GiveawaysPage.module.css';

export default function GiveawaysPage() {
  const giveaways = getActiveGiveaways();

  return (
    <main className={styles.page}>
      <GiveawayHero />
      <GiveawayStats />

      <section className={styles.grid}>
        {giveaways.map((giveaway) => (
          <GiveawayCard key={giveaway.id} giveaway={giveaway} />
        ))}
      </section>

      <HowItWorks />
      <Winners />
      <TrustSection />
      <Rules />
      <FAQ />
      <FinalCTA />
    </main>
  );
}

import { Suspense } from "react";
import TrackingConsent from "./_components/TrackingConsent";
import styles from './campaign.module.css';
export const metadata = { referrer: "no-referrer" };
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.campaign} data-blacknovember-campaign>{children}<Suspense fallback={null}><TrackingConsent /></Suspense></div>;
}

import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { fetchLandingPage, fetchSpaces, trackEvent, type LeasingSpace } from "../../lib/leasing";
import { useSeo } from "../../lib/useSeo";
import { LeasingNav, LeasingFooter } from "./LeasingChrome";
import "./leasing.css";

type LandingContent = { slug: string; title: string; hero_headline: string | null; hero_subcopy: string | null; target_audience: string | null };

export default function LandingPage() {
  const { slug } = useParams();
  const [content, setContent] = useState<LandingContent | null | undefined>(undefined);
  const [spaces, setSpaces] = useState<LeasingSpace[]>([]);

  useEffect(() => {
    if (!slug) return;
    fetchLandingPage(slug).then((c) => {
      setContent(c as LandingContent | null);
      trackEvent("page_view", { path: `/leasing/for/${slug}` });
    });
    fetchSpaces().then(setSpaces);
  }, [slug]);

  if (content === undefined) return null;

  const c = content ?? { slug: "warehouse-for-rent", title: "Warehouse for Rent in Titusville, FL", hero_headline: "Warehouse Space for Rent in Titusville, FL", hero_subcopy: "Two flexible ~1,000 SF warehouse spaces available now.", target_audience: null };

  useSeo({
    title: `${c.title} | Titusville Flex Space`,
    description: c.hero_subcopy ?? c.title,
    path: `/leasing/for/${c.slug}`,
  });

  return (
    <div className="leasing-root">
      <LeasingNav />
      <section className="lc-shell lc-hero">
        <div>
          <div className="lc-hero-kicker">Titusville, FL</div>
          <h1>{c.hero_headline}</h1>
          <p>{c.hero_subcopy}</p>
          <div className="lc-hero-ctas">
            <Link href="/leasing/space-finder" className="lc-btn lc-btn-amber">Check availability <ArrowRight size={16} /></Link>
            <a href="#spaces" className="lc-btn lc-btn-outline">View spaces</a>
          </div>
        </div>
        <div className="lc-hero-visual"><span className="lc-hero-visual-tag">Available now</span></div>
      </section>

      <section id="spaces" className="lc-shell lc-section">
        <div className="lc-grid">
          {spaces.map((space) => (
            <div className="lc-card" key={space.id}>
              <div className="lc-card-photo"><span className={`lc-card-status status-${space.status}`}>{space.status}</span><strong>{space.name}</strong></div>
              <div className="lc-card-body">
                <div className="lc-card-specs">
                  <div><strong className="lc-spec">{space.square_footage.toLocaleString()}</strong><span>Square feet</span></div>
                  <div><strong className="lc-spec">${space.monthly_rent.toLocaleString()}</strong><span>Per month</span></div>
                </div>
                <Link href={`/leasing/spaces/${space.slug}`} className="lc-btn lc-btn-dark">View details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <LeasingFooter />
    </div>
  );
}

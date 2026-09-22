import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, ShieldCheck, Zap } from "lucide-react";
import { fetchSpaces, trackEvent, type LeasingSpace } from "../../lib/leasing";
import { useSeo } from "../../lib/useSeo";
import { LeasingNav, LeasingFooter } from "./LeasingChrome";
import { RequestInfoForm, TourRequestForm, ReferralForm } from "./forms";
import "./leasing.css";

export default function LeasingHome() {
  const [spaces, setSpaces] = useState<LeasingSpace[] | null>(null);
  const [modal, setModal] = useState<{ type: "info" | "tour"; space: LeasingSpace } | null>(null);
  const [referralOpen, setReferralOpen] = useState(false);

  useEffect(() => {
    trackEvent("page_view", { path: "/leasing" });
    fetchSpaces().then(setSpaces);
  }, []);

  useSeo({
    title: "Warehouse & Commercial Space for Rent in Titusville, FL | Titusville Flex Space",
    description: "Flexible ~1,000\u20132,000 SF warehouse and commercial space for rent in Titusville, FL. Available now for contractors, e-commerce, and small business use.",
    path: "/leasing",
  });

  const availableCount = spaces?.filter((s) => s.status === "available" && !s.is_combined).length ?? 0;

  return (
    <div className="leasing-root">
      <LeasingNav />

      <section className="lc-shell lc-hero">
        <div>
          <div className="lc-hero-kicker">Titusville, FL</div>
          <h1>Flexible commercial &amp; warehouse space.</h1>
          <p>Two ~1,000 SF warehouse units available now{" \u2014 "}lease separately or combine into 2,000 SF. Built for contractors, e-commerce, and growing small businesses.</p>
          <div className="lc-hero-ctas">
            <Link href="/leasing/space-finder" className="lc-btn lc-btn-amber">What space do I need? <ArrowRight size={16} /></Link>
            <a href="#spaces" className="lc-btn lc-btn-outline">View available spaces</a>
          </div>
          <div className="lc-hero-facts">
            <div><strong>{availableCount}</strong><span>Units available now</span></div>
            <div><strong className="lc-spec">{"1,000\u20132,000"}</strong><span>Square feet</span></div>
            <div><strong>12 mo</strong><span>Minimum term</span></div>
          </div>
        </div>
        <div className="lc-hero-visual"><span className="lc-hero-visual-tag">Available now</span></div>
      </section>

      <section className="lc-shell" style={{ display: "flex", gap: 32, paddingBottom: 8, flexWrap: "wrap", color: "var(--lc-muted)", fontSize: 13.5 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={15} /> 905 Main Street, Titusville, FL</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><ShieldCheck size={15} /> Gated, keycard access</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Zap size={15} /> 3-phase power available</span>
      </section>

      <section id="spaces" className="lc-shell lc-section">
        <div className="lc-section-head">
          <div>
            <h2>Available spaces</h2>
            <p>Every unit is priced and described in full{" \u2014 "}no need to call just to find out the basics.</p>
          </div>
        </div>
        {!spaces ? (
          <div style={{ color: "var(--lc-muted)" }}>Loading available spaces…</div>
        ) : (
          <div className="lc-grid">
            {spaces.map((space) => (
              <div className="lc-card" key={space.id}>
                <div className="lc-card-photo">
                  <span className={`lc-card-status status-${space.status}`}>{space.status}</span>
                  <strong>{space.name}</strong>
                </div>
                <div className="lc-card-body">
                  <div className="lc-card-specs">
                    <div><strong className="lc-spec">{space.square_footage.toLocaleString()}</strong><span>Square feet</span></div>
                    <div><strong className="lc-spec">${space.monthly_rent.toLocaleString()}</strong><span>Per month</span></div>
                  </div>
                  <p>{space.description}</p>
                  <div className="lc-card-tags">
                    {space.suitable_uses.slice(0, 3).map((u) => <span className="lc-tag" key={u}>{u}</span>)}
                  </div>
                  <div className="lc-card-foot">
                    <Link href={`/leasing/spaces/${space.slug}`} className="lc-btn lc-btn-outline">View details</Link>
                    <button className="lc-btn lc-btn-dark" onClick={() => setModal({ type: "tour", space })}>Schedule tour</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="lc-shell lc-section" style={{ background: "var(--lc-surface)", border: "1px solid var(--lc-border)", borderRadius: 8, padding: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22 }}>Know a business that needs warehouse space?</h2>
          <p style={{ color: "var(--lc-muted)", marginTop: 6 }}>Send us a referral{" \u2014 "}we'll take it from there.</p>
        </div>
        <button className="lc-btn lc-btn-dark" onClick={() => setReferralOpen(true)}>Refer a business</button>
      </section>

      <LeasingFooter />

      {modal?.type === "info" && <RequestInfoForm spaceId={modal.space.id} spaceName={modal.space.name} onClose={() => setModal(null)} />}
      {modal?.type === "tour" && <TourRequestForm spaceId={modal.space.id} spaceName={modal.space.name} onClose={() => setModal(null)} />}
      {referralOpen && <ReferralForm onClose={() => setReferralOpen(false)} />}
    </div>
  );
}

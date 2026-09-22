import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Phone, MapPin, Info } from "lucide-react";
import { fetchSpaceBySlug, trackEvent, type LeasingSpace } from "../../lib/leasing";
import { useSeo } from "../../lib/useSeo";
import { LeasingNav, LeasingFooter } from "./LeasingChrome";
import { RequestInfoForm, TourRequestForm, ApplicationForm } from "./forms";
import "./leasing.css";

export default function SpaceDetail() {
  const { slug } = useParams();
  const [space, setSpace] = useState<LeasingSpace | null | undefined>(undefined);
  const [modal, setModal] = useState<"info" | "tour" | "apply" | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchSpaceBySlug(slug).then((s) => {
      setSpace(s);
      if (s) trackEvent("listing_view", { space_id: s.id, path: `/leasing/spaces/${slug}` });
    });
  }, [slug]);

  if (space === undefined) return <div className="leasing-root"><LeasingNav /><div className="lc-shell" style={{ padding: 60 }}>Loading…</div></div>;
  if (space === null) return (
    <div className="leasing-root"><LeasingNav />
      <div className="lc-shell" style={{ padding: 60, textAlign: "center" }}>
        <h2>Space not found</h2>
        <p style={{ color: "var(--lc-muted)", marginTop: 10 }}>This listing may no longer be available.</p>
        <Link href="/leasing" className="lc-btn lc-btn-dark" style={{ marginTop: 20, display: "inline-flex" }}>View available spaces</Link>
      </div>
      <LeasingFooter />
    </div>
  );

  const property = space.leasing_properties;

  useSeo({
    title: `${space.name} \u2014 ${space.square_footage.toLocaleString()} SF Warehouse for Rent in Titusville, FL`,
    description: `${space.name}: ${space.square_footage.toLocaleString()} SF commercial/warehouse space for rent in Titusville, FL at $${space.monthly_rent.toLocaleString()}/month. ${space.description ?? ""}`.slice(0, 300),
    path: `/leasing/spaces/${space.slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: space.name,
      description: space.description,
      offers: {
        "@type": "Offer",
        price: space.monthly_rent,
        priceCurrency: "USD",
        availability: space.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
      ...(property ? { address: { "@type": "PostalAddress", streetAddress: property.address } } : {}),
    },
  });

  return (
    <div className="leasing-root">
      <LeasingNav />
      <div className="lc-shell lc-detail-head">
        <div>
          <div className="lc-gallery">
            <div className="lc-gallery-main" />
            <div className="lc-gallery-side"><div /><div /></div>
          </div>
          <div className="lc-detail-body">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
              <span className={`lc-card-status status-${space.status}`} style={{ position: "static" }}>{space.status}</span>
              {property && <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--lc-muted)" }}><MapPin size={14} /> {property.address}</span>}
            </div>
            <h1 style={{ fontSize: 34, marginTop: 10 }}>{space.name}</h1>
            <p style={{ marginTop: 14 }}>{space.description}</p>

            <h3>Suitable for</h3>
            <ul>{space.suitable_uses.map((u) => <li key={u}>{u}</li>)}</ul>

            <h3>Features &amp; amenities</h3>
            <ul>{space.amenities.map((a) => <li key={a}>{a}</li>)}</ul>

            <h3>Access &amp; parking</h3>
            <p>{space.access_info}{space.parking_info ? ` ${space.parking_info}.` : ""}</p>

            <h3>Lease terms</h3>
            <p>{space.lease_terms}</p>

            <div className="lc-disclaimer">
              <Info size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
              Suitable-use suggestions are provided for guidance only. All uses are subject to property rules, local zoning, insurance requirements, and owner approval.
              {space.restrictions ? ` ${space.restrictions}` : ""}
            </div>
          </div>
        </div>

        <aside className="lc-detail-panel">
          <div className="lc-detail-price"><span className="lc-spec">${space.monthly_rent.toLocaleString()}</span><span>/month</span></div>
          <div className="lc-detail-specrow"><span>Square footage</span><strong className="lc-spec">{space.square_footage.toLocaleString()} SF</strong></div>
          {space.security_deposit != null && <div className="lc-detail-specrow"><span>Security deposit</span><strong className="lc-spec">${space.security_deposit.toLocaleString()}</strong></div>}
          <div className="lc-detail-specrow"><span>Availability</span><strong style={{ textTransform: "capitalize" }}>{space.status}</strong></div>
          <div className="lc-detail-panel-ctas">
            <button className="lc-btn lc-btn-amber" onClick={() => setModal("apply")}>Apply / request this space</button>
            <button className="lc-btn lc-btn-dark" onClick={() => setModal("tour")}>Schedule a tour</button>
            <button className="lc-btn lc-btn-outline" onClick={() => setModal("info")}>Request information</button>
            <a className="lc-btn lc-btn-outline" href="tel:13212223538"><Phone size={15} /> Call 321-222-3538</a>
          </div>
        </aside>
      </div>

      <LeasingFooter />

      {modal === "info" && <RequestInfoForm spaceId={space.id} spaceName={space.name} onClose={() => setModal(null)} />}
      {modal === "tour" && <TourRequestForm spaceId={space.id} spaceName={space.name} onClose={() => setModal(null)} />}
      {modal === "apply" && <ApplicationForm spaceId={space.id} spaceName={space.name} onClose={() => setModal(null)} />}
    </div>
  );
}

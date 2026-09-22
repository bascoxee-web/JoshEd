import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Loader2, Info } from "lucide-react";
import { fetchSpaces, submitLead, trackEvent, type LeasingSpace } from "../../lib/leasing";
import { useSeo } from "../../lib/useSeo";
import { LeasingNav, LeasingFooter } from "./LeasingChrome";
import "./leasing.css";

const USE_CASES = ["Contractor", "E-commerce inventory", "Business inventory", "Equipment storage", "Distribution", "Moving / storage", "Small business", "Other"];

type Form = {
  use_case: string;
  sqft_needed: string;
  budget: string;
  move_in_date: string;
  lease_duration: string;
  need_parking: boolean;
  business_name: string;
  name: string;
  phone: string;
  email: string;
  additional_requirements: string;
};

const EMPTY: Form = { use_case: "", sqft_needed: "", budget: "", move_in_date: "", lease_duration: "", need_parking: false, business_name: "", name: "", phone: "", email: "", additional_requirements: "" };

export default function SpaceFinder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [recommended, setRecommended] = useState<LeasingSpace[]>([]);

  useEffect(() => { trackEvent("page_view", { path: "/leasing/space-finder" }); }, []);

  useSeo({
    title: "What Warehouse Space Do You Need? | Titusville Flex Space",
    description: "Answer a few quick questions and get matched to available warehouse and commercial space in Titusville, FL.",
    path: "/leasing/space-finder",
  });

  async function submit() {
    setStatus("sending");
    try {
      const spaces = await fetchSpaces();
      const needed = form.sqft_needed ? Number(form.sqft_needed) : null;
      const matches = spaces
        .filter((s) => s.status === "available")
        .filter((s) => (needed ? s.square_footage >= needed * 0.8 : true))
        .sort((a, b) => a.square_footage - b.square_footage)
        .slice(0, 3);
      setRecommended(matches);

      await submitLead({
        name: form.name,
        business_name: form.business_name || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        intended_use: form.use_case,
        sqft_needed: needed ?? undefined,
        budget: form.budget ? Number(form.budget) : undefined,
        move_in_date: form.move_in_date || undefined,
        lease_duration: form.lease_duration || undefined,
        need_parking: form.need_parking,
        additional_requirements: form.additional_requirements || undefined,
      });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="leasing-root">
        <LeasingNav />
        <div className="lc-shell lc-section" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <CheckCircle2 size={44} style={{ color: "var(--lc-green)" }} />
          <h2 style={{ marginTop: 14 }}>Thanks, {form.name.split(" ")[0] || "there"}{" \u2014 "}we've got your requirements.</h2>
          <p style={{ color: "var(--lc-muted)", marginTop: 8 }}>Our team will follow up shortly. Based on what you told us, here's what's currently available:</p>
          <div className="lc-grid" style={{ marginTop: 28, textAlign: "left" }}>
            {recommended.length === 0 && <p style={{ color: "var(--lc-muted)" }}>Nothing matches exactly right now, but we'll reach out when something opens up.</p>}
            {recommended.map((space) => (
              <div className="lc-card" key={space.id}>
                <div className="lc-card-photo"><strong>{space.name}</strong></div>
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
        </div>
        <LeasingFooter />
      </div>
    );
  }

  return (
    <div className="leasing-root">
      <LeasingNav />
      <div className="lc-shell lc-section" style={{ maxWidth: 620, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32 }}>What space do you need?</h1>
        <p style={{ color: "var(--lc-muted)", marginTop: 10 }}>Answer a few quick questions and we'll match you to available space{" \u2014 "}or reach out personally if nothing's a perfect fit yet.</p>

        {step === 1 && (
          <div className="lc-form" style={{ marginTop: 28 }}>
            <label>What will you use the space for?</label>
            <div className="lc-choice-grid">
              {USE_CASES.map((uc) => (
                <button key={uc} type="button" className={`lc-choice ${form.use_case === uc ? "selected" : ""}`} onClick={() => setForm({ ...form, use_case: uc })}>{uc}</button>
              ))}
            </div>
            <button className="lc-btn lc-btn-amber" disabled={!form.use_case} onClick={() => setStep(2)} style={{ marginTop: 10 }}>Continue <ArrowRight size={16} /></button>
          </div>
        )}

        {step === 2 && (
          <div className="lc-form" style={{ marginTop: 28 }}>
            <div className="lc-form-row">
              <label>Approx. square footage needed<input type="number" value={form.sqft_needed} onChange={(e) => setForm({ ...form, sqft_needed: e.target.value })} placeholder="e.g. 1000" /></label>
              <label>Monthly budget<input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 1000" /></label>
            </div>
            <div className="lc-form-row">
              <label>Desired move-in date<input type="date" value={form.move_in_date} onChange={(e) => setForm({ ...form, move_in_date: e.target.value })} /></label>
              <label>Desired lease duration<input value={form.lease_duration} onChange={(e) => setForm({ ...form, lease_duration: e.target.value })} placeholder="e.g. 12 months" /></label>
            </div>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <input type="checkbox" style={{ width: "auto" }} checked={form.need_parking} onChange={(e) => setForm({ ...form, need_parking: e.target.checked })} /> I need dedicated parking
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="lc-btn lc-btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="lc-btn lc-btn-amber" onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="lc-form" style={{ marginTop: 28 }}>
            <div className="lc-form-row">
              <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Business name<input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></label>
            </div>
            <div className="lc-form-row">
              <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            </div>
            <label>Additional requirements<textarea rows={3} value={form.additional_requirements} onChange={(e) => setForm({ ...form, additional_requirements: e.target.value })} /></label>
            <div className="lc-disclaimer"><Info size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />Described uses are subject to property rules, local zoning, insurance requirements, and owner approval.</div>
            {status === "error" && <div className="lc-form-error">Something went wrong. Please try again.</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="lc-btn lc-btn-outline" onClick={() => setStep(2)}>Back</button>
              <button className="lc-btn lc-btn-amber" disabled={!form.name || status === "sending"} onClick={submit}>
                {status === "sending" ? <Loader2 size={16} className="hub-spin" /> : "See matching spaces"}
              </button>
            </div>
          </div>
        )}
      </div>
      <LeasingFooter />
    </div>
  );
}

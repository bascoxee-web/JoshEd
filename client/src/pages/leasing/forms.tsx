import { useState, type ReactNode, type FormEvent } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { submitLead, submitTourRequest, submitApplication, submitReferral } from "../../lib/leasing";

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="lc-modal-backdrop" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lc-modal">
        <button className="lc-modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3 style={{ fontSize: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function SuccessState({ message }: { message: string }) {
  return (
    <div className="lc-form-success">
      <CheckCircle2 size={40} />
      <p style={{ marginTop: 10, fontWeight: 600 }}>{message}</p>
    </div>
  );
}

// ---------- Request Info ----------
export function RequestInfoForm({ spaceId, spaceName, onClose }: { spaceId?: string; spaceName?: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitLead({ name: form.name, email: form.email, phone: form.phone, additional_requirements: form.message, space_id: spaceId, intended_use: undefined });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") return <Modal title="Request sent" onClose={onClose}><SuccessState message="Thanks! We'll be in touch shortly with more information." /></Modal>;

  return (
    <Modal title={spaceName ? `Request info \u2014 ${spaceName}` : "Request information"} onClose={onClose}>
      <form className="lc-form" onSubmit={submit}>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <div className="lc-form-row">
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        </div>
        <label>What would you like to know?<textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
        {status === "error" && <div className="lc-form-error">Something went wrong. Please try again.</div>}
        <button className="lc-btn lc-btn-amber" disabled={status === "sending"}>{status === "sending" ? <Loader2 size={16} className="hub-spin" /> : "Send request"}</button>
      </form>
    </Modal>
  );
}

// ---------- Schedule Tour ----------
export function TourRequestForm({ spaceId, spaceName, onClose }: { spaceId?: string; spaceName?: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", business_name: "", preferred_date: "", preferred_time: "", intended_use: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitTourRequest({ ...form, space_id: spaceId });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") return <Modal title="Tour requested" onClose={onClose}><SuccessState message="Thanks! We'll confirm your tour time shortly." /></Modal>;

  return (
    <Modal title={spaceName ? `Schedule a tour \u2014 ${spaceName}` : "Schedule a tour"} onClose={onClose}>
      <form className="lc-form" onSubmit={submit}>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <div className="lc-form-row">
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        </div>
        <label>Business name<input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></label>
        <div className="lc-form-row">
          <label>Preferred date<input type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} /></label>
          <label>Preferred time<input type="time" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} /></label>
        </div>
        <label>Intended use<input value={form.intended_use} onChange={(e) => setForm({ ...form, intended_use: e.target.value })} placeholder="e.g. contractor storage" /></label>
        <label>Notes<textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        {status === "error" && <div className="lc-form-error">Something went wrong. Please try again.</div>}
        <button className="lc-btn lc-btn-amber" disabled={status === "sending"}>{status === "sending" ? <Loader2 size={16} className="hub-spin" /> : "Request tour"}</button>
      </form>
    </Modal>
  );
}

// ---------- Application ----------
export function ApplicationForm({ spaceId, spaceName, onClose }: { spaceId?: string; spaceName?: string; onClose: () => void }) {
  const [form, setForm] = useState({
    applicant_name: "", business_name: "", email: "", phone: "", current_business_address: "",
    business_type: "", intended_use: "", move_in_date: "", lease_duration: "", employee_count: "", parking_needs: "", additional_comments: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitApplication({ ...form, employee_count: form.employee_count ? Number(form.employee_count) : undefined, space_id: spaceId });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") return <Modal title="Application received" onClose={onClose}><SuccessState message="Thanks! This is a request, not a lease \u2014 our team will follow up to discuss next steps." /></Modal>;

  return (
    <Modal title={spaceName ? `Apply for ${spaceName}` : "Request this space"} onClose={onClose}>
      <p style={{ fontSize: 12.5, color: "var(--lc-muted)", marginTop: -4 }}>This is an initial inquiry, not a binding lease agreement.</p>
      <form className="lc-form" onSubmit={submit}>
        <div className="lc-form-row">
          <label>Your name<input required value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })} /></label>
          <label>Business name<input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></label>
        </div>
        <div className="lc-form-row">
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        </div>
        <label>Current business address<input value={form.current_business_address} onChange={(e) => setForm({ ...form, current_business_address: e.target.value })} /></label>
        <div className="lc-form-row">
          <label>Type of business<input value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })} /></label>
          <label>Intended use<input value={form.intended_use} onChange={(e) => setForm({ ...form, intended_use: e.target.value })} /></label>
        </div>
        <div className="lc-form-row">
          <label>Desired move-in date<input type="date" value={form.move_in_date} onChange={(e) => setForm({ ...form, move_in_date: e.target.value })} /></label>
          <label>Lease duration<input value={form.lease_duration} onChange={(e) => setForm({ ...form, lease_duration: e.target.value })} placeholder="e.g. 12 months" /></label>
        </div>
        <div className="lc-form-row">
          <label>Employees at this location<input type="number" min={0} value={form.employee_count} onChange={(e) => setForm({ ...form, employee_count: e.target.value })} /></label>
          <label>Vehicle / parking needs<input value={form.parking_needs} onChange={(e) => setForm({ ...form, parking_needs: e.target.value })} /></label>
        </div>
        <label>Additional comments<textarea rows={3} value={form.additional_comments} onChange={(e) => setForm({ ...form, additional_comments: e.target.value })} /></label>
        {status === "error" && <div className="lc-form-error">Something went wrong. Please try again.</div>}
        <button className="lc-btn lc-btn-amber" disabled={status === "sending"}>{status === "sending" ? <Loader2 size={16} className="hub-spin" /> : "Submit request"}</button>
      </form>
    </Modal>
  );
}

// ---------- Referral ----------
export function ReferralForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ referrer_name: "", referrer_contact: "", referred_name: "", referred_contact: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitReferral(form);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") return <Modal title="Referral sent" onClose={onClose}><SuccessState message="Thanks for the referral! We'll reach out to them directly." /></Modal>;

  return (
    <Modal title="Know a business that needs space?" onClose={onClose}>
      <form className="lc-form" onSubmit={submit}>
        <label>Your name<input required value={form.referrer_name} onChange={(e) => setForm({ ...form, referrer_name: e.target.value })} /></label>
        <label>Your contact info<input required value={form.referrer_contact} onChange={(e) => setForm({ ...form, referrer_contact: e.target.value })} placeholder="Phone or email" /></label>
        <label>Who are you referring?<input required value={form.referred_name} onChange={(e) => setForm({ ...form, referred_name: e.target.value })} placeholder="Name or business name" /></label>
        <label>Their phone or email (if known)<input value={form.referred_contact} onChange={(e) => setForm({ ...form, referred_contact: e.target.value })} /></label>
        {status === "error" && <div className="lc-form-error">Something went wrong. Please try again.</div>}
        <button className="lc-btn lc-btn-amber" disabled={status === "sending"}>{status === "sending" ? <Loader2 size={16} className="hub-spin" /> : "Send referral"}</button>
      </form>
    </Modal>
  );
}

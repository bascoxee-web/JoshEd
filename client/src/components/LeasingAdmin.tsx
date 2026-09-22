import { useEffect, useMemo, useState, type CSSProperties, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  AlertCircle, Building2, CalendarClock, CheckCircle2, ClipboardList, ImagePlus, Loader2,
  Plus, RefreshCw, ScrollText, Trash2, TrendingUp, Users, X,
} from "lucide-react";
import {
  fetchLeadsForStaff, updateLead, fetchLeadNotes, addLeadNote,
  fetchTourRequestsForStaff, fetchApplicationsForStaff, fetchSpacesForStaff, updateSpace,
  createSpace, deleteSpace, uploadSpaceImage, deleteSpaceImage, fetchAnalyticsEvents,
  fetchAuditLog, LEAD_STATUSES, LEAD_SOURCES,
  type LeasingLead, type LeasingSpace,
} from "../lib/leasing";
import type { AccessProfile } from "../lib/auth";

const LOST_REASONS = ["price_too_high", "location", "space_too_small", "space_too_large", "missing_feature", "lease_terms", "found_other_property", "use_not_permitted", "no_response", "not_qualified", "other"];
const inputStyle: CSSProperties = { padding: 8, borderRadius: 6, border: "1px solid #e1e0d9", fontSize: 13, width: "100%" };
const cardStyle: CSSProperties = { background: "#fff", border: "1px solid #e1e0d9", borderRadius: 10, padding: 16 };

function StatusBadge({ status }: { status: string }) {
  const tone = status === "leased" ? "#2f8f5b" : status === "lost" || status === "not_qualified" ? "#c14a3a" : "#3d5a73";
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: tone, color: "#fff", textTransform: "capitalize" }}>{status.replace(/_/g, " ")}</span>;
}

// ============================================================
// Lead drawer
// ============================================================
function LeadDrawer({ lead, canManage, onClose, onUpdated }: { lead: LeasingLead; canManage: boolean; onClose: () => void; onUpdated: () => void }) {
  const [notes, setNotes] = useState<{ id: string; note: string; created_at: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [followUp, setFollowUp] = useState(lead.follow_up_date ?? "");
  const [lostReason, setLostReason] = useState(lead.lost_reason ?? "");
  const [source, setSource] = useState(lead.source);

  useEffect(() => { fetchLeadNotes(lead.id).then((n) => setNotes(n as { id: string; note: string; created_at: string }[])); }, [lead.id]);

  async function setStatus(status: string) {
    if (status === "lost" && !lostReason) { toast("Pick a lost reason first"); return; }
    try {
      await updateLead(lead.id, { status: status as LeasingLead["status"], lost_reason: status === "lost" ? (lostReason as LeasingLead["lost_reason"]) : null });
      toast.success("Lead updated");
      onUpdated();
    } catch { toast.error("Couldn't update lead"); }
  }

  async function saveFollowUp() {
    try { await updateLead(lead.id, { follow_up_date: followUp || null }); toast.success("Follow-up date saved"); onUpdated(); } catch { toast.error("Couldn't save"); }
  }

  async function saveSource() {
    try { await updateLead(lead.id, { source }); toast.success("Lead source updated"); onUpdated(); } catch { toast.error("Couldn't save"); }
  }

  async function submitNote() {
    if (!newNote.trim()) return;
    try { await addLeadNote(lead.id, newNote.trim()); setNewNote(""); fetchLeadNotes(lead.id).then((n) => setNotes(n as { id: string; note: string; created_at: string }[])); }
    catch { toast.error("Couldn't add note"); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,24,31,.4)", zIndex: 900, display: "flex", justifyContent: "flex-end" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: 420, maxWidth: "100vw", background: "#fff", height: "100%", overflowY: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><h3 style={{ margin: 0 }}>{lead.name}</h3><small style={{ color: "#898781" }}>{lead.business_name}</small></div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ marginTop: 12 }}><StatusBadge status={lead.status} /></div>
        <div style={{ marginTop: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 6, color: "#52514e" }}>
          {lead.email && <div>{lead.email}</div>}
          {lead.phone && <div>{lead.phone}</div>}
          {lead.intended_use && <div>Use: {lead.intended_use}</div>}
          {lead.sqft_needed && <div>Needs: {lead.sqft_needed} SF</div>}
          {lead.budget && <div>Budget: ${lead.budget}/mo</div>}
          {lead.leasing_spaces?.name && <div>Interested in: {lead.leasing_spaces.name}</div>}
          {lead.referred_by_name && <div>Referred by: {lead.referred_by_name} ({lead.referred_by_contact})</div>}
          {lead.utm_campaign && <div>Campaign: {lead.utm_campaign}</div>}
        </div>

        {canManage && (
          <>
            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Lead source</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <select style={{ ...inputStyle }} value={source} onChange={(e) => setSource(e.target.value)}>
                  {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
                <button onClick={saveSource} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e1e0d9", background: "none", cursor: "pointer" }}>Save</button>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Move to stage</label>
              <select style={{ ...inputStyle, marginTop: 6 }} value={lead.status} onChange={(e) => setStatus(e.target.value)}>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
              {lead.status !== "lost" && lead.status !== "not_qualified" && (
                <div style={{ marginTop: 8 }}>
                  <select style={inputStyle} value={lostReason ?? ""} onChange={(e) => setLostReason(e.target.value)}>
                    <option value="">Lost reason (if marking lost)</option>
                    {LOST_REASONS.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Follow-up date</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} style={inputStyle} />
                <button onClick={saveFollowUp} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e1e0d9", background: "none", cursor: "pointer" }}>Save</button>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Notes &amp; communication history</label>
          {canManage && (
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." style={inputStyle} onKeyDown={(e) => { if (e.key === "Enter") submitNote(); }} />
              <button onClick={submitNote} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e1e0d9", background: "none", cursor: "pointer" }}>Add</button>
            </div>
          )}
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {notes.map((n) => <div key={n.id} style={{ fontSize: 12.5, background: "#f4f3ee", borderRadius: 6, padding: "8px 10px" }}>{n.note}<div style={{ color: "#898781", fontSize: 11, marginTop: 4 }}>{new Date(n.created_at).toLocaleString()}</div></div>)}
            {notes.length === 0 && <div style={{ fontSize: 12, color: "#898781" }}>No notes yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Leads pipeline
// ============================================================
function LeadsPipeline({ canManage }: { canManage: boolean }) {
  const [leads, setLeads] = useState<LeasingLead[] | null>(null);
  const [selected, setSelected] = useState<LeasingLead | null>(null);

  const load = () => fetchLeadsForStaff().then(setLeads);
  useEffect(() => { load(); }, []);

  if (!leads) return <div>Loading leads…</div>;

  const stages = LEAD_STATUSES.filter((s) => s !== "lost" && s !== "not_qualified");
  const lost = leads.filter((l) => l.status === "lost" || l.status === "not_qualified");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "#898781" }}>{leads.length} total leads</div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #e1e0d9", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12.5 }}><RefreshCw size={13} /> Refresh</button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10 }}>
        {stages.map((stage) => (
          <div key={stage} style={{ minWidth: 220, flex: "0 0 220px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "capitalize", marginBottom: 8, color: "#52514e" }}>{stage.replace(/_/g, " ")} <span style={{ color: "#898781" }}>({leads.filter((l) => l.status === stage).length})</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {leads.filter((l) => l.status === stage).map((lead) => (
                <button key={lead.id} onClick={() => setSelected(lead)} style={{ textAlign: "left", background: "#fff", border: "1px solid #e1e0d9", borderRadius: 8, padding: 10, cursor: "pointer" }}>
                  <strong style={{ fontSize: 13 }}>{lead.name}</strong>
                  <div style={{ fontSize: 11.5, color: "#898781", marginTop: 2 }}>{lead.business_name || lead.intended_use || "\u2014"}</div>
                  {lead.follow_up_date && new Date(lead.follow_up_date) < new Date() && stage !== "leased" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "#c14a3a", marginTop: 4, fontWeight: 700 }}><AlertCircle size={11} /> Follow-up overdue</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {lost.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#898781", marginBottom: 8 }}>Lost / not qualified ({lost.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {lost.map((l) => (
              <button key={l.id} onClick={() => setSelected(l)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 6, border: "1px solid #e1e0d9", background: "#f9f9f7", cursor: "pointer" }}>
                {l.name}{l.lost_reason ? ` \u2014 ${l.lost_reason.replace(/_/g, " ")}` : ""}
              </button>
            ))}
          </div>
        </div>
      )}
      {selected && <LeadDrawer lead={selected} canManage={canManage} onClose={() => setSelected(null)} onUpdated={() => { load(); setSelected(null); }} />}
    </div>
  );
}

// ============================================================
// Follow-up dashboard
// ============================================================
function FollowUpDashboard() {
  const [leads, setLeads] = useState<LeasingLead[] | null>(null);
  const [tours, setTours] = useState<Record<string, unknown>[] | null>(null);
  const [apps, setApps] = useState<Record<string, unknown>[] | null>(null);
  useEffect(() => {
    fetchLeadsForStaff().then(setLeads);
    fetchTourRequestsForStaff().then((t) => setTours(t as Record<string, unknown>[]));
    fetchApplicationsForStaff().then((a) => setApps(a as Record<string, unknown>[]));
  }, []);
  if (!leads) return <div>Loading…</div>;
  const today = new Date().toISOString().slice(0, 10);
  const overdue = leads.filter((l) => l.follow_up_date && l.follow_up_date < today && !["leased", "lost", "not_qualified"].includes(l.status));
  const dueToday = leads.filter((l) => l.follow_up_date === today);
  const newLeads = leads.filter((l) => l.status === "new");
  const upcomingTours = (tours ?? []).filter((t) => (t.preferred_date as string) >= today).length;
  const appsAwaiting = (apps ?? []).filter((a) => a.status === "submitted").length;

  const tiles = [
    { label: "Overdue follow-ups", count: overdue.length, tone: "#c14a3a", icon: AlertCircle },
    { label: "Due today", count: dueToday.length, tone: "#e8a33d", icon: CalendarClock },
    { label: "New leads", count: newLeads.length, tone: "#3d5a73", icon: Users },
    { label: "Upcoming tours", count: upcomingTours, tone: "#2f8f5b", icon: CalendarClock },
    { label: "Applications awaiting review", count: appsAwaiting, tone: "#3d5a73", icon: ClipboardList },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
      {tiles.map(({ label, count, tone, icon: Icon }) => (
        <div key={label} style={cardStyle}>
          <Icon size={18} color={tone} />
          <div style={{ fontSize: 28, fontFamily: "IBM Plex Mono, monospace", marginTop: 8 }}>{count}</div>
          <div style={{ fontSize: 12.5, color: "#898781" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Properties manager: add / edit / archive / delete / photos
// ============================================================
function AddSpaceForm({ propertyId, onClose, onCreated }: { propertyId: string; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", slug: "", square_footage: "", monthly_rent: "", security_deposit: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!form.name || !form.slug || !form.square_footage || !form.monthly_rent) { toast("Name, slug, square footage, and rent are required"); return; }
    setSaving(true);
    try {
      await createSpace(propertyId, {
        name: form.name, slug: form.slug,
        square_footage: Number(form.square_footage), monthly_rent: Number(form.monthly_rent),
        security_deposit: form.security_deposit ? Number(form.security_deposit) : undefined,
        description: form.description || undefined,
      });
      toast.success("Space added");
      onCreated();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't add space \u2014 check the slug is unique");
    } finally { setSaving(false); }
  }

  return (
    <div style={{ ...cardStyle, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: 14 }}>Add a new space</strong>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        <input placeholder="Name (e.g. Warehouse C)" style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="URL slug (e.g. warehouse-c)" style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input placeholder="Square footage" type="number" style={inputStyle} value={form.square_footage} onChange={(e) => setForm({ ...form, square_footage: e.target.value })} />
        <input placeholder="Monthly rent" type="number" style={inputStyle} value={form.monthly_rent} onChange={(e) => setForm({ ...form, monthly_rent: e.target.value })} />
        <input placeholder="Security deposit" type="number" style={inputStyle} value={form.security_deposit} onChange={(e) => setForm({ ...form, security_deposit: e.target.value })} />
      </div>
      <textarea placeholder="Description" style={{ ...inputStyle, marginTop: 10, minHeight: 60 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button className="ops-primary-button" onClick={submit} disabled={saving} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 6, border: "none", background: "#14181f", color: "#fff", cursor: "pointer" }}>
        {saving ? <Loader2 size={14} className="hub-spin" /> : "Add space"}
      </button>
    </div>
  );
}

function SpaceEditor({ space, canManage, onChanged }: { space: LeasingSpace; canManage: boolean; onChanged: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [rent, setRent] = useState(String(space.monthly_rent));
  const [description, setDescription] = useState(space.description ?? "");
  const [uploading, setUploading] = useState(false);

  async function saveDetails() {
    try {
      await updateSpace(space.id, { monthly_rent: Number(rent), description });
      toast.success("Saved");
      onChanged();
    } catch { toast.error("Couldn't save"); }
  }

  async function changeStatus(status: LeasingSpace["status"]) {
    try { await updateSpace(space.id, { status }); toast.success(`${space.name} marked ${status}`); onChanged(); } catch { toast.error("Couldn't update"); }
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await uploadSpaceImage(space.id, file); toast.success("Photo uploaded"); onChanged(); }
    catch (err) { console.error(err); toast.error("Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  }

  async function removeImage(id: string, url: string) {
    try { await deleteSpaceImage(id, url); toast.success("Photo removed"); onChanged(); } catch { toast.error("Couldn't remove photo"); }
  }

  async function archiveOrDelete(hardDelete: boolean) {
    if (hardDelete) {
      if (!confirm(`Permanently delete ${space.name}? This can't be undone.`)) return;
      try { await deleteSpace(space.id); toast.success("Space deleted"); onChanged(); } catch { toast.error("Couldn't delete"); }
    } else {
      await changeStatus("unavailable");
    }
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <strong>{space.name}</strong>
          <div style={{ fontSize: 12.5, color: "#898781" }}>{space.square_footage.toLocaleString()} SF · ${space.monthly_rent.toLocaleString()}/mo · {space.leasing_space_images?.length ?? 0} photo(s)</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusBadge status={space.status} />
          {canManage && (
            <select value={space.status} onChange={(e) => changeStatus(e.target.value as LeasingSpace["status"])} style={{ padding: 6, borderRadius: 6, border: "1px solid #e1e0d9", fontSize: 12.5 }}>
              {["available", "pending", "reserved", "leased", "unavailable"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <button onClick={() => setExpanded((v) => !v)} style={{ fontSize: 12, background: "none", border: "1px solid #e1e0d9", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>{expanded ? "Close" : "Manage"}</button>
        </div>
      </div>

      {expanded && canManage && (
        <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <label style={{ fontSize: 12, flex: 1 }}>Monthly rent<input type="number" style={inputStyle} value={rent} onChange={(e) => setRent(e.target.value)} /></label>
          </div>
          <label style={{ fontSize: 12 }}>Description<textarea style={{ ...inputStyle, minHeight: 60 }} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <button onClick={saveDetails} style={{ alignSelf: "flex-start", padding: "6px 12px", borderRadius: 6, border: "1px solid #e1e0d9", background: "none", cursor: "pointer", fontSize: 12.5 }}>Save details</button>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Photos</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {space.leasing_space_images?.map((img) => (
                <div key={img.id} style={{ position: "relative", width: 72, height: 72, borderRadius: 6, overflow: "hidden", border: "1px solid #e1e0d9" }}>
                  <img src={img.url} alt={img.alt_text ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => removeImage(img.id, img.url)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.6)", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer" }}><Trash2 size={11} /></button>
                </div>
              ))}
              <label style={{ width: 72, height: 72, border: "1.5px dashed #ccc", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {uploading ? <Loader2 size={16} className="hub-spin" /> : <ImagePlus size={18} color="#898781" />}
                <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={() => archiveOrDelete(false)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #e1e0d9", background: "none", cursor: "pointer" }}>Archive (mark unavailable)</button>
            <button onClick={() => archiveOrDelete(true)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #c14a3a", color: "#c14a3a", background: "none", cursor: "pointer" }}>Delete permanently</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertiesManager({ canManage }: { canManage: boolean }) {
  const [spaces, setSpaces] = useState<LeasingSpace[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const load = () => fetchSpacesForStaff().then(setSpaces);
  useEffect(() => { load(); }, []);
  if (!spaces) return <div>Loading properties…</div>;
  const propertyId = spaces[0]?.property_id;

  return (
    <div>
      {canManage && (
        <div style={{ marginBottom: 14 }}>
          {showAdd && propertyId ? (
            <AddSpaceForm propertyId={propertyId} onClose={() => setShowAdd(false)} onCreated={() => { load(); setShowAdd(false); }} />
          ) : (
            <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid #e1e0d9", background: "none", cursor: "pointer", fontSize: 13 }}><Plus size={14} /> Add space</button>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {spaces.map((space) => <SpaceEditor key={space.id} space={space} canManage={canManage} onChanged={load} />)}
      </div>
    </div>
  );
}

// ============================================================
// Tours & Applications
// ============================================================
function ToursAndApplications() {
  const [tours, setTours] = useState<Record<string, unknown>[] | null>(null);
  const [apps, setApps] = useState<Record<string, unknown>[] | null>(null);
  useEffect(() => { fetchTourRequestsForStaff().then((t) => setTours(t as Record<string, unknown>[])); fetchApplicationsForStaff().then((a) => setApps(a as Record<string, unknown>[])); }, []);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <h4 style={{ marginBottom: 10 }}>Tour requests</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tours?.map((t) => (
            <div key={t.id as string} style={{ background: "#fff", border: "1px solid #e1e0d9", borderRadius: 8, padding: 12, fontSize: 13 }}>
              <strong>{t.name as string}</strong>{" \u2014 "}{(t.leasing_spaces as { name?: string } | null)?.name ?? "General inquiry"}
              <div style={{ color: "#898781", fontSize: 12, marginTop: 2 }}>{t.preferred_date as string} {t.preferred_time as string} · {(t.phone as string) || (t.email as string)}</div>
            </div>
          ))}
          {tours && tours.length === 0 && <div style={{ color: "#898781", fontSize: 13 }}>No tour requests yet.</div>}
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: 10 }}>Applications</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {apps?.map((a) => (
            <div key={a.id as string} style={{ background: "#fff", border: "1px solid #e1e0d9", borderRadius: 8, padding: 12, fontSize: 13 }}>
              <strong>{a.applicant_name as string}</strong>{" \u2014 "}{(a.leasing_spaces as { name?: string } | null)?.name ?? "\u2014"}
              <div style={{ color: "#898781", fontSize: 12, marginTop: 2 }}>{a.business_type as string} · {(a.phone as string) || (a.email as string)}</div>
            </div>
          ))}
          {apps && apps.length === 0 && <div style={{ color: "#898781", fontSize: 13 }}>No applications yet.</div>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Analytics
// ============================================================
function AnalyticsDashboard() {
  const [events, setEvents] = useState<Record<string, unknown>[] | null>(null);
  const [leads, setLeads] = useState<LeasingLead[] | null>(null);
  const [tours, setTours] = useState<Record<string, unknown>[] | null>(null);
  const [apps, setApps] = useState<Record<string, unknown>[] | null>(null);

  useEffect(() => {
    fetchAnalyticsEvents().then((e) => setEvents(e as Record<string, unknown>[]));
    fetchLeadsForStaff().then(setLeads);
    fetchTourRequestsForStaff().then((t) => setTours(t as Record<string, unknown>[]));
    fetchApplicationsForStaff().then((a) => setApps(a as Record<string, unknown>[]));
  }, []);

  const stats = useMemo(() => {
    if (!events || !leads || !tours || !apps) return null;
    const visitors = new Set(events.filter((e) => e.event_type === "page_view").map((e) => e.session_id)).size;
    const listingViews = events.filter((e) => e.event_type === "listing_view").length;
    const leased = leads.filter((l) => l.status === "leased").length;
    const lost = leads.filter((l) => l.status === "lost" || l.status === "not_qualified");

    const bySource: Record<string, number> = {};
    leads.forEach((l) => { bySource[l.source] = (bySource[l.source] ?? 0) + 1; });

    const byUse: Record<string, number> = {};
    leads.forEach((l) => { const u = l.intended_use || "Not specified"; byUse[u] = (byUse[u] ?? 0) + 1; });

    const byLostReason: Record<string, number> = {};
    lost.forEach((l) => { const r = l.lost_reason || "unspecified"; byLostReason[r] = (byLostReason[r] ?? 0) + 1; });

    const bySpace: Record<string, number> = {};
    leads.forEach((l) => { const n = l.leasing_spaces?.name || "General inquiry"; bySpace[n] = (bySpace[n] ?? 0) + 1; });

    const conversion = visitors > 0 ? ((leads.length / visitors) * 100).toFixed(1) : "0.0";

    return {
      visitors, listingViews, leadsCount: leads.length, tours: tours.length, apps: apps.length, leased,
      bySource, byUse, byLostReason, bySpace, conversion,
    };
  }, [events, leads, tours, apps]);

  if (!stats) return <div>Loading analytics…</div>;

  const funnel = [
    { label: "Visitors", value: stats.visitors },
    { label: "Listing views", value: stats.listingViews },
    { label: "Leads", value: stats.leadsCount },
    { label: "Tours", value: stats.tours },
    { label: "Applications", value: stats.apps },
    { label: "Leased", value: stats.leased },
  ];
  const maxFunnel = Math.max(1, ...funnel.map((f) => f.value));

  const Breakdown = ({ title, data }: { title: string; data: Record<string, number> }) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...entries.map(([, v]) => v));
    return (
      <div style={cardStyle}>
        <strong style={{ fontSize: 13 }}>{title}</strong>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {entries.length === 0 && <div style={{ fontSize: 12, color: "#898781" }}>No data yet.</div>}
          {entries.map(([key, value]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <div style={{ width: 110, textTransform: "capitalize", flexShrink: 0 }}>{key.replace(/_/g, " ")}</div>
              <div style={{ flex: 1, background: "#f1f0ea", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(value / max) * 100}%`, background: "#3d5a73", height: "100%" }} />
              </div>
              <div style={{ width: 24, textAlign: "right", fontFamily: "IBM Plex Mono, monospace" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <TrendingUp size={16} />
        <strong style={{ fontSize: 14 }}>Conversion rate: {stats.conversion}%</strong>
        <span style={{ fontSize: 12, color: "#898781" }}>(leads / visitors)</span>
      </div>
      <div style={cardStyle} className="lc-analytics-funnel" >
        <strong style={{ fontSize: 13 }}>Funnel: visitors → listing views → leads → tours → applications → leased</strong>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: 16, height: 140 }}>
          {funnel.map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, marginBottom: 6 }}>{f.value}</div>
              <div style={{ width: "70%", background: "#3d5a73", height: `${Math.max(4, (f.value / maxFunnel) * 100)}px`, borderRadius: "3px 3px 0 0" }} />
              <div style={{ fontSize: 11, color: "#898781", marginTop: 6, textAlign: "center" }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 14 }}>
        <Breakdown title="Leads by source" data={stats.bySource} />
        <Breakdown title="Leads by property" data={stats.bySpace} />
        <Breakdown title="Leads by intended use" data={stats.byUse} />
        <Breakdown title="Lost lead reasons" data={stats.byLostReason} />
      </div>
    </div>
  );
}

// ============================================================
// Audit log
// ============================================================
function AuditLogTab() {
  const [entries, setEntries] = useState<Record<string, unknown>[] | null>(null);
  useEffect(() => { fetchAuditLog().then((e) => setEntries(e as Record<string, unknown>[])); }, []);
  if (!entries) return <div>Loading…</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {entries.map((e) => (
        <div key={e.id as string} style={{ background: "#fff", border: "1px solid #e1e0d9", borderRadius: 8, padding: 12, fontSize: 12.5 }}>
          <strong style={{ textTransform: "capitalize" }}>{e.action as string} {(e.entity_type as string).replace(/_/g, " ")}</strong>
          <div style={{ color: "#898781", marginTop: 2 }}>{(e.profiles as { name?: string } | null)?.name ?? "Unknown"} · {new Date(e.created_at as string).toLocaleString()}</div>
        </div>
      ))}
      {entries.length === 0 && <div style={{ color: "#898781", fontSize: 13 }}>No admin actions logged yet.</div>}
    </div>
  );
}

// ============================================================
// Root
// ============================================================
const TABS = [
  { id: "followups", label: "Follow-ups", icon: CalendarClock },
  { id: "leads", label: "Leads pipeline", icon: Users },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "tours", label: "Tours & applications", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "audit", label: "Audit log", icon: ScrollText },
];

export default function LeasingAdmin({ profile }: { profile: AccessProfile }) {
  const [tab, setTab] = useState("followups");
  const canManage = profile.leasingRole === "admin" || profile.leasingRole === "super_admin";

  if (profile.leasingRole === "none") {
    return <div style={{ padding: 40, textAlign: "center", color: "#898781" }}>You don't have access to the commercial leasing module.</div>;
  }

  const visibleTabs = TABS.filter((t) => t.id !== "audit" || canManage);

  return (
    <div style={{ padding: "4px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "#898781", fontFamily: "IBM Plex Mono, monospace" }}>Commercial Leasing</div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Warehouse leasing CRM</h2>
        </div>
        {profile.leasingRole === "viewer" && <span style={{ fontSize: 12, color: "#898781", display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={14} /> View-only access</span>}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid #e1e0d9", overflowX: "auto" }}>
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "none", border: "none", borderBottom: tab === id ? "2px solid #2a78d6" : "2px solid transparent", color: tab === id ? "#184f95" : "#52514e", fontWeight: tab === id ? 600 : 400, cursor: "pointer", fontSize: 13.5, whiteSpace: "nowrap" }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>
      {tab === "followups" && <FollowUpDashboard />}
      {tab === "leads" && <LeadsPipeline canManage={canManage} />}
      {tab === "properties" && <PropertiesManager canManage={canManage} />}
      {tab === "tours" && <ToursAndApplications />}
      {tab === "analytics" && <AnalyticsDashboard />}
      {tab === "audit" && canManage && <AuditLogTab />}
    </div>
  );
}

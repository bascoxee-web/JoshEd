import { useState, useEffect } from "react";
import { toast } from "sonner";
import IntegrationArchitecture from "../components/IntegrationArchitecture";
import OperationsDashboard from "../components/OperationsDashboard";
import { X as CloseIcon, LockKeyhole, Loader2, AlertCircle } from "lucide-react";
import { type AccessProfile, signInWithPassword, signOut as authSignOut, restoreSession, fetchAllProfiles } from "../lib/auth";
import ChatWidget from "../components/ChatWidget";
import LeasingAdmin from "../components/LeasingAdmin";
import "../ess-integration.css";
import "../operations.css";
import {
  ArrowRight,
  Activity,
  Bell,
  BellRing,
  BriefcaseBusiness,
  Building2,
  Database,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  CircleAlert,
  ClipboardList,
  Clock3,
  BookOpen,
  KeyRound,
  Rocket,
  RotateCcw,
  ServerCog,
  DoorOpen,
  FileText,
  Home as HomeIcon,
  LifeBuoy,
  Link2,
  Menu,
  MessageCircle,
  Mail,
  Pencil,
  Trash2,
  Send,
  Search,
  Star,
  RefreshCw,
  MessageSquareText,
  NotebookPen,
  Phone,
  Plus,
  Receipt,
  FileBarChart,
  ShieldCheck,
  Sparkles,
  Tag,
  TicketCheck,
  UserRound,
  Users,
  Settings2,
  Video,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Executive Hub", icon: Database },
  { label: "Executive View", icon: BriefcaseBusiness },
  { label: "Operations", icon: Activity },
  { label: "SMS Reminders", icon: BellRing },
  { label: "Late Payments", icon: CircleAlert },
  { label: "Support Requests", icon: TicketCheck },
  { label: "Gate Access", icon: DoorOpen },
  { label: "Staff Notes", icon: NotebookPen },
  { label: "Reports", icon: FileBarChart },
  { label: "ESS Integration", icon: Link2 },
  { label: "Google Reviews", icon: Star },
];

const units = [
  { label: "Unit 204", size: "10 × 20 climate controlled", status: "Active", value: "$135.00/mo", tone: "orange" },
  { label: "Parking P-12", size: "Outdoor RV parking", status: "Active", value: "$75.00/mo", tone: "blue" },
];

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="brand-mark-wrap">
      <div className={`brand-mark ${light ? "brand-mark-light" : ""}`}>
        <span className="brand-mark-square" />
        <span className="brand-mark-square brand-mark-square-bottom" />
      </div>
      <div className={`brand-wordmark ${light ? "text-white" : ""}`}>
        <strong>Titusville</strong>
        <span>SELF-STORAGE</span>
      </div>
    </div>
  );
}

function PortfolioMark({ light = false }: { light?: boolean }) {
  return <div className="portfolio-brand"><div className="portfolio-brand-symbol"><span /><span /><span /></div><div className={`portfolio-brand-wordmark ${light ? "text-white" : ""}`}><strong>JOSH AND ED</strong><span>OPERATIONS HUB</span></div></div>;
}

function AppButton({ children, variant = "primary", onClick, className = "" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "dark"; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`app-button app-button-${variant} ${className}`}>{children}</button>;
}

function SignInPanel({ onSelect, onClose }: { onSelect: (profile: AccessProfile) => void; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) { setError("Enter your email and password."); return; }
    setLoading(true);
    setError(null);
    const { profile, error: signInError } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (signInError || !profile) { setError(signInError || "Sign in failed."); return; }
    onSelect(profile);
  };

  return <div className="signin-backdrop" role="dialog" aria-modal="true"><div className="signin-panel"><button className="signin-close" onClick={onClose} aria-label="Close sign in"><CloseIcon size={17} /></button><div className="signin-kicker"><LockKeyhole size={15} /> Secure staff access</div><h2>Sign in to <em>JOSH AND ED.</em></h2><p>Enter your email and password to open your workspace.</p>
    <form className="signin-form" onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, textAlign: "left" }}>
        Email
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" disabled={loading}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border, #e1e0d9)", fontSize: 14 }} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, textAlign: "left" }}>
        Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border, #e1e0d9)", fontSize: 14 }} />
      </label>
      {error && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#d03b3b", fontSize: 13 }}><AlertCircle size={14} /> {error}</div>}
      <button type="submit" disabled={loading} className="app-button app-button-primary signin-submit" style={{ justifyContent: "center" }}>
        {loading ? <><Loader2 size={16} className="hub-spin" /> Signing in…</> : <>Sign in <ArrowRight size={16} /></>}
      </button>
    </form>
    <div className="signin-note"><ShieldCheck size={15} /><span><strong>Individual accounts only</strong><small>Never share a login. Approvals, role changes, and executive actions are visible to authorized admins.</small></span></div></div></div>;
}

function PublicHome({ onEnter }: { onEnter: (profile?: AccessProfile) => void }) {
  return (
    <div className="public-shell">
      <header className="public-nav">
        <PortfolioMark />
        <div className="public-nav-links">
          <a href="#features">Why it works</a>
          <a href="#spaces">Business portfolio</a>
          <a href="#support">Support</a>
        </div>
        <div className="public-actions">
          <button className="login-link" onClick={() => onEnter()}>Staff sign in</button>
          <AppButton onClick={() => onEnter()}>Open operations hub <ArrowRight size={16} /></AppButton>
        </div>
        <button className="mobile-menu-button" onClick={() => onEnter()} aria-label="Open operations hub"><Menu size={21} /></button>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> One view. Every business.</div>
            <h1>Make every decision <em>move faster.</em></h1>
            <p>A professional operations hub for the businesses you manage—connecting priorities, people, performance, and the next best action.</p>
            <div className="hero-ctas">
              <AppButton onClick={onEnter}>Open executive hub <ArrowRight size={17} /></AppButton>
              <a href="#spaces" className="text-link">Explore the portfolio <ChevronRight size={16} /></a>
            </div>
            <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>E</span><span>Y</span></div><span><strong>4 businesses</strong> · one accountable operating layer</span></div>
          </div>
          <div className="hero-visual portfolio-hero-visual" aria-label="Executive portfolio dashboard illustration">
            <div className="sun-glow" /><div className="hero-lines" />
            <div className="portfolio-preview-card"><div className="portfolio-preview-top"><span><i /> JOSH AND ED Operations Hub</span><small>Live portfolio view</small></div><div className="portfolio-preview-heading"><div><small>Portfolio health</small><strong>94%</strong></div><span className="preview-trend">+8.4% <ArrowRight size={12} /></span></div><div className="portfolio-preview-chart"><i /><i /><i /><i /><i /><i /><i /><b /></div><div className="portfolio-preview-businesses"><span><b className="business-dot blue" />Titusville</span><span><b className="business-dot orange" />Pizza</span><span><b className="business-dot purple" />Quartz Blanc</span><span><b className="business-dot green" />Skinny Cookies</span></div></div>
            <div className="floating-stat stat-one"><span className="stat-icon orange-icon"><BriefcaseBusiness size={16} /></span><div><strong>12</strong><small>Executive tasks</small></div></div><div className="floating-stat stat-two"><span className="stat-icon blue-icon"><Activity size={16} /></span><div><strong>4</strong><small>Business workspaces</small></div></div>
          </div>
        </section>

        <section id="features" className="feature-strip">
          <div><ShieldCheck size={20} /><span><strong>Clear accountability</strong><small>Role-based access and approvals</small></span></div>
          <div><WalletCards size={20} /><span><strong>Connected visibility</strong><small>See the signal across every business</small></span></div>
          <div><LifeBuoy size={20} /><span><strong>Decisions, faster</strong><small>Turn exceptions into next actions</small></span></div>
        </section>

        <section id="spaces" className="public-section spaces-section">
          <div className="section-heading"><div><div className="eyebrow">Built for the portfolio</div><h2>Every business, <em>in rhythm.</em></h2></div><p>From storage operations to restaurant sales and partnership visibility, one professional layer keeps work moving without replacing the systems that already run the business.</p></div>
          <div className="space-cards"><div className="space-card space-card-blue"><span className="space-number">01</span><ShieldCheck size={28} /><h3>Titusville Self-Storage</h3><p>Occupancy, late-payment exceptions, gate activity, and ESS handoffs.</p><span className="space-price">Operations <strong>+ visibility</strong></span></div><div className="space-card space-card-orange"><span className="space-number">02</span><Tag size={28} /><h3>Pizza Restaurant</h3><p>Daily sales, staffing priorities, vendor tasks, and manager accountability.</p><span className="space-price">Performance <strong>+ action</strong></span></div><div className="space-card space-card-cream"><span className="space-number">03</span><HomeIcon size={28} /><h3>Quartz Blanc + Skinny Cookies</h3><p>Partner-aware reporting and a clear path to add the next business.</p><span className="space-price">Portfolio <strong>+ scale</strong></span></div></div>
        </section>

        <section className="login-cta"><div><div className="eyebrow eyebrow-light">For owners & managers</div><h2>One professional operating layer.</h2><p>Coordinate priorities, staff, support, reporting, and approvals across every business while each source system keeps its own truth.</p></div><AppButton variant="secondary" onClick={onEnter}>Open executive hub <ArrowRight size={17} /></AppButton></section>
      </main>
      <footer className="public-footer"><PortfolioMark light /><span>© 2025 JOSH AND ED Operations Hub · Professional portfolio operations</span><span className="footer-phone"><Phone size={14} /> Executive operations</span><span style={{ fontSize: 12, opacity: 0.75 }}>Built by <a href="mailto:retchvisionai@outlook.com" style={{ color: "inherit", textDecoration: "underline" }}>Retch VisionAI Solutions</a></span></footer>
    </div>
  );
}

function Sidebar({ active, setActive, profile }: { active: string; setActive: (item: string) => void; profile: AccessProfile }) {
  const leasingItem = profile.leasingRole !== "none" ? [{ label: "Commercial Leasing", icon: Building2 }] : [];
  const visibleNavItems = profile.settingsAdmin ? [{ label: "Setup Center", icon: Rocket }, { label: "Access Settings", icon: Settings2 }, { label: "Audit Log", icon: ClipboardList }, ...leasingItem] : profile.owner ? [...navItems, { label: "Calendar & Reminders", icon: CalendarDays }, ...leasingItem, { label: "Setup Center", icon: Rocket }, { label: "Access Settings", icon: Settings2 }, { label: "Audit Log", icon: ClipboardList }, { label: "Call Conferencing", icon: Video }] : [...navItems.filter((item) => !["Executive Hub", "Executive View", "Reports"].includes(item.label)), { label: "Calendar & Reminders", icon: CalendarDays }, ...leasingItem, { label: "Call Conferencing", icon: Video }];
  return <aside className="sidebar"><BrandMark /><div className="sidebar-label">Executive Hub</div><nav>{visibleNavItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)}><Icon size={18} /><span>{label}</span>{label === "Late Payments" && <b>18</b>}{label === "Support Requests" && <b>7</b>}</button>)}</nav><div className="sidebar-help"><div className="help-orb"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><p>Operations support is here.</p><button onClick={() => toast.success("Support center opened", { description: "A member of our team will be with you shortly." })}>Visit support <ArrowRight size={14} /></button></div><div className="sidebar-profile"><div className={`profile-avatar ${profile.id}`}>{profile.initials}</div><div><strong>{profile.name}</strong><small>{profile.role}</small></div><ChevronRight size={15} /></div></aside>;
}

function Topbar({ active, onHome, profile }: { active: string; onHome: () => void; profile: AccessProfile }) {
  return <header className="dash-topbar"><div className="mobile-brand"><BrandMark /></div><div className="crumbs"><button onClick={onHome}>JOSH AND ED Operations Hub</button><ChevronRight size={14} /><strong>{active}</strong></div><div className="topbar-actions"><button className="icon-button notification-button" onClick={() => toast("You’re all caught up", { description: "No new notifications right now." })}><Bell size={19} /><span /></button><button className="topbar-user"><span className={`profile-avatar small-avatar ${profile.id}`}>{profile.initials}</span><span className="topbar-user-name">{profile.name}</span><small className="topbar-role-chip">{profile.owner ? "Owner" : profile.settingsAdmin ? "Settings only" : profile.id === "marisa" ? "Schedule manager" : "View only"}</small><ChevronRight size={15} /></button></div></header>;
}

function DashboardContent({ setActive }: { setActive: (item: string) => void }) {
  const [paid, setPaid] = useState(false);
  return <div className="dashboard-content"><div className="welcome-row"><div><div className="eyebrow">Saturday, September 20, 2025</div><h1>Good morning, Jordan <span>✦</span></h1><p>Here’s the latest on your storage spaces.</p></div><button className="contact-button" onClick={() => setActive("Support")}><MessageCircle size={17} /> Chat with support</button></div>
    <div className="alert-banner"><div className="alert-icon"><Receipt size={19} /></div><div><strong>Your next payment is due in 5 days</strong><span>Unit 204 + Parking P-12 · October 1, 2025</span></div><AppButton onClick={() => { setPaid(true); toast.success("Payment flow ready", { description: "Your secure payment window is ready to review." }); }}>{paid ? <><Check size={16} /> Ready to pay</> : <>Pay $210.00 <ArrowRight size={16} /></>}</AppButton></div>
    <div className="dashboard-grid"><div className="dashboard-main"><div className="section-title-row"><div><h2>Your account</h2><p>Simple overview, at a glance.</p></div><button onClick={() => setActive("Payments")} className="view-link">View payment history <ArrowRight size={15} /></button></div><div className="summary-cards"><div className="summary-card summary-card-dark"><div className="summary-card-label"><span className="summary-icon"><WalletCards size={16} /></span>Monthly total</div><strong>$210<span>.00</span></strong><small>Next charge Oct 1</small><div className="card-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="summary-card"><div className="summary-card-label"><span className="summary-icon light-blue"><ShieldCheck size={16} /></span>Active spaces</div><strong>2</strong><small>Both in good standing</small><div className="mini-bar"><span style={{ width: "100%" }} /></div></div><div className="summary-card"><div className="summary-card-label"><span className="summary-icon light-orange"><Sparkles size={16} /></span>Member since</div><strong>2022</strong><small>3 years with us</small><div className="member-stars">✦ ✦ ✦ ✦ ✦</div></div></div>
      <div className="section-title-row units-heading"><div><h2>Active storage units</h2><p>Manage access, details, and billing.</p></div><button onClick={() => toast("Unit finder coming soon", { description: "We’re preparing your next space." })} className="add-button"><Plus size={15} /> Add a unit</button></div>
      <div className="units-list">{units.map((unit) => <div className="unit-row-card" key={unit.label}><div className={`unit-art unit-art-${unit.tone}`}><div className="unit-art-door" /><div className="unit-art-door" /><div className="unit-art-door active-door" /></div><div className="unit-info"><div className="unit-name-row"><strong>{unit.label}</strong><span className="status-pill"><span />{unit.status}</span></div><p>{unit.size}</p><span className="unit-location"><HomeIcon size={13} /> 905 Main Street · Titusville, FL</span></div><div className="unit-price"><strong>{unit.value}</strong><button onClick={() => setActive("My Units")}>View details <ChevronRight size={14} /></button></div></div>)}</div>
      <div className="bottom-cards"><div className="referral-card"><div className="referral-icon"><Tag size={19} /></div><div><span className="eyebrow">Share the space</span><h3>Give $50, get $50.</h3><p>Refer a friend and you both save on storage.</p><button onClick={() => toast.success("Referral link copied", { description: "Share it with your favorite neighbor." })}>Get your referral link <ArrowRight size={14} /></button></div><div className="referral-blob" /></div><div className="message-card"><div className="card-heading"><span><MessageSquareText size={16} /> Recent messages</span><button onClick={() => setActive("Messages")}>See all <ArrowRight size={14} /></button></div><div className="message-item"><div className="message-avatar">TS</div><div><strong>Titusville Self-Storage</strong><p>Your October statement is ready to view.</p><small>2 hours ago</small></div><span className="unread-dot" /></div><div className="message-item"><div className="message-avatar orange-avatar">JD</div><div><strong>You</strong><p>Thanks! I’ve got it.</p><small>Yesterday</small></div></div></div></div>
    </div><aside className="dashboard-side"><div className="side-card side-card-blue"><div className="side-card-top"><span className="side-label">Documents vault</span><FileText size={18} /></div><h3>Everything important,<br /><em>in one safe place.</em></h3><p>Leases, receipts, and statements — always ready when you are.</p><button onClick={() => setActive("Documents")}>Open document vault <ArrowRight size={15} /></button><div className="paper-shape"><FileText size={38} /></div></div><div className="side-card support-card"><div className="side-card-top"><span className="side-label">Support center</span><LifeBuoy size={18} /></div><h3>How can we help?</h3><p>Find an answer or start a conversation with our team.</p><div className="support-links"><button onClick={() => setActive("Support")}><CircleHelp size={16} /> Browse help center <ChevronRight size={14} /></button><button onClick={() => setActive("Messages")}><MessageCircle size={16} /> Message the team <ChevronRight size={14} /></button><button onClick={() => toast("Call us at 321-222-3538") }><Phone size={16} /> Call 321-222-3538 <ChevronRight size={14} /></button></div></div><div className="side-note"><CalendarDays size={17} /><span><strong>Gate access</strong><br />Open daily 7:00 AM – 8:00 PM</span></div></aside></div>
    <button className="sms-button" onClick={() => toast.success("SMS support ready", { description: "Text us at 321-222-3538." })}><MessageCircle size={19} /><span>Text support</span></button>
    <ChatWidget tenantContext="Tenant: Jordan. Unit 204 (10x20 climate controlled, $135.00/mo, Active), Parking P-12 (Outdoor RV parking, $75.00/mo, Active). Next payment due October 1, 2025, $210.00." />
  </div>;
}

const businessOptions = ["Titusville Self-Storage", "Pizza Restaurant", "Quartz Blanc", "Skinny Cookies"];

function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) { return <span className={`hub-status ${tone}`}>{children}</span>; }

const setupConnectors = [
  { id: "ess", name: "Easy Storage Solutions", category: "Storage and billing", icon: Database, scope: "customers · payments · occupancy · gate logs", owner: "Titusville owner" },
  { id: "pos", name: "Pizza POS", category: "Restaurant operations", icon: WalletCards, scope: "daily sales · orders · inventory · staff", owner: "Pizza owner / manager" },
  { id: "shop", name: "Skinny Cookies commerce", category: "E-commerce", icon: Tag, scope: "customers · orders · products · inventory", owner: "Store owner" },
  { id: "sms", name: "SMS and VoIP", category: "Notifications and calls", icon: MessageCircle, scope: "reminders · support · call routing", owner: "Operations owner" },
  { id: "db", name: "Central database", category: "PostgreSQL or MySQL", icon: ServerCog, scope: "customers · payments · orders · inventory · gate_logs", owner: "Technical owner" },
  { id: "hosting", name: "Hosting and security", category: "GoDaddy and Cloudflare", icon: ShieldCheck, scope: "domain · DNS · HTTPS · access policy", owner: "Technical owner" },
  { id: "google-reviews", name: "Google Business Profile reviews", category: "Google Reviews", icon: Star, scope: "ratings · reviews · reply status · locations", owner: "Business owners" },
];

const reminderTemplates = [
  { id: "meeting", label: "Schedule meeting", subject: "Meeting reminder: {{title}}", message: "Hi {{name}}, this is a reminder for {{title}} on {{date}} at {{time}}." },
  { id: "followup", label: "Follow-up task", subject: "Follow-up reminder: {{title}}", message: "Hi {{name}}, this is a reminder to follow up on {{title}} by {{date}}." },
  { id: "owner-review", label: "Owner review", subject: "Owner review needed: {{title}}", message: "Josh and Ed, please review {{title}} on {{date}} at {{time}}." },
];

type CalendarItem = { id: number; title: string; business: string; date: string; time: string; contact: string; template: string; sms: boolean; email: boolean; status: string };

function CalendarReminders({ profile }: { profile: AccessProfile }) {
  const [items, setItems] = useState<CalendarItem[]>([
    { id: 1, title: "Weekly Titusville operations review", business: "Titusville Self-Storage", date: "2025-09-24", time: "09:00", contact: "Josh, Ed, Marisa", template: "owner-review", sms: true, email: true, status: "Scheduled" },
    { id: 2, title: "Pizza vendor follow-up", business: "Pizza Restaurant", date: "2025-09-25", time: "14:30", contact: "Josh", template: "followup", sms: true, email: false, status: "Scheduled" },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Omit<CalendarItem, "id" | "status">>({ title: "", business: "Titusville Self-Storage", date: "2025-09-26", time: "10:00", contact: "Josh, Ed, Marisa", template: "meeting", sms: true, email: true });
  const canManage = profile.owner || profile.id === "marisa";
  const openNew = () => { setEditingId(null); setDraft({ title: "", business: "Titusville Self-Storage", date: "2025-09-26", time: "10:00", contact: "Josh, Ed, Marisa", template: "meeting", sms: true, email: true }); setShowForm(true); };
  const edit = (item: CalendarItem) => { const { id: _id, status: _status, ...rest } = item; setEditingId(item.id); setDraft(rest); setShowForm(true); };
  const save = () => { if (!draft.title.trim()) { toast.error("Add a meeting title first"); return; } if (editingId) setItems((all) => all.map((item) => item.id === editingId ? { ...item, ...draft } : item)); else setItems((all) => [...all, { ...draft, id: Date.now(), status: "Scheduled" }]); setShowForm(false); toast.success(editingId ? "Calendar item updated" : "Calendar item added", { description: "Owners can see the change in the shared activity log." }); };
  const remove = (id: number) => { setItems((all) => all.filter((item) => item.id !== id)); toast("Calendar item removed", { description: "The reminder was canceled from this preview." }); };
  const sendReminder = (item: CalendarItem) => toast.success("Reminder ready to send", { description: `${item.sms ? "SMS" : ""}${item.sms && item.email ? " + " : ""}${item.email ? "email" : ""} template prepared for ${item.contact}.` });
  return <div className="calendar-page"><div className="settings-hero calendar-hero"><div><span className="ops-kicker">Shared calendar operations</span><h2>Meetings, follow-ups, and reminders in rhythm.</h2><p>Marisa can create and maintain calendar items for Josh and Ed. Owners can review the schedule and every change is visible in the shared activity log.</p></div><div className="settings-owner-badge"><CalendarDays size={18} /><strong>{items.length} scheduled</strong><small>{profile.id === "marisa" ? "Assistant scheduling enabled" : "Owner visibility enabled"}</small></div></div><div className="calendar-toolbar"><div><span className="ops-kicker">Upcoming schedule</span><h3>Calendar & reminders</h3><p>Use a ready template, choose SMS or email, then send when the owner approves.</p></div>{canManage && <button className="ops-primary-button" onClick={openNew}><Plus size={14} /> Add calendar item</button>}</div><div className="calendar-layout"><div className="ops-panel calendar-list">{items.map((item) => <div className="calendar-item" key={item.id}><div className="calendar-date"><strong>{new Date(item.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}</strong><b>{new Date(item.date + "T00:00:00").getDate()}</b><small>{item.time}</small></div><div className="calendar-item-main"><div className="calendar-item-title"><strong>{item.title}</strong><span>{item.status}</span></div><small>{item.business} · {item.contact}</small><div className="calendar-channel-row">{item.sms && <span><MessageCircle size={12} /> SMS</span>}{item.email && <span><Mail size={12} /> Email</span>}<span><BellRing size={12} /> {reminderTemplates.find((template) => template.id === item.template)?.label}</span></div></div>{canManage && <div className="calendar-item-actions"><button aria-label="Send reminder" onClick={() => sendReminder(item)}><Send size={14} /></button><button aria-label="Edit calendar item" onClick={() => edit(item)}><Pencil size={14} /></button><button aria-label="Delete calendar item" onClick={() => remove(item.id)}><Trash2 size={14} /></button></div>}</div>)}{items.length === 0 && <div className="calendar-empty"><CalendarDays size={28} /><strong>No scheduled items</strong><p>Add the next owner meeting or follow-up.</p></div>}</div><div className="calendar-side"><div className="ops-panel"><div className="ops-panel-title"><BellRing size={16} /> Ready-to-send templates</div>{reminderTemplates.map((template) => <div className="template-row" key={template.id}><span className="template-icon"><Mail size={14} /></span><div><strong>{template.label}</strong><small>{template.subject}</small></div><ChevronRight size={14} /></div>)}</div><div className="ops-panel calendar-permission"><ShieldCheck size={17} /><div><strong>Marisa’s approved scope</strong><p>Create, edit, reschedule, cancel, and prepare SMS/email reminders. Josh and Ed retain owner visibility and can review changes in the audit log.</p></div></div></div></div>{showForm && <div className="calendar-form-panel ops-panel"><div className="settings-section-title"><div><span className="ops-kicker">{editingId ? "Edit schedule" : "New schedule"}</span><h3>{editingId ? "Modify calendar item" : "Add a meeting or reminder"}</h3></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form"><X size={17} /></button></div><div className="calendar-form-grid"><label>Title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Weekly owner review" /></label><label>Business<select value={draft.business} onChange={(event) => setDraft({ ...draft, business: event.target.value })}>{businessOptions.map((business) => <option key={business}>{business}</option>)}</select></label><label>Date<input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label><label>Time<input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} /></label><label>Recipients<input value={draft.contact} onChange={(event) => setDraft({ ...draft, contact: event.target.value })} placeholder="Josh, Ed, Marisa" /></label><label>Template<select value={draft.template} onChange={(event) => setDraft({ ...draft, template: event.target.value })}>{reminderTemplates.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}</select></label></div><div className="calendar-form-channels"><span>Send reminder through</span><label><input type="checkbox" checked={draft.sms} onChange={(event) => setDraft({ ...draft, sms: event.target.checked })} /> SMS</label><label><input type="checkbox" checked={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.checked })} /> Email</label></div><div className="calendar-form-actions"><button className="ops-outline-button" onClick={() => setShowForm(false)}>Cancel</button><button className="ops-primary-button" onClick={save}>{editingId ? "Save changes" : "Add to calendar"} <ArrowRight size={14} /></button></div></div>}</div>;
}

function GoogleReviews({ profile }: { profile: AccessProfile }) {
  const businesses = profile.businesses;
  const reviews = [
    { id: 1, business: "Titusville Self-Storage", author: "Samantha R.", rating: 5, date: "Today · 9:22 AM", text: "Clean facility, easy gate access, and the team made move-in simple.", status: "Needs reply", tone: "blue" },
    { id: 2, business: "Pizza Restaurant", author: "Michael T.", rating: 4, date: "Yesterday · 6:18 PM", text: "Great pizza and friendly service. The new specials are worth trying.", status: "Replied", tone: "orange" },
    { id: 3, business: "Skinny Cookies", author: "Lauren K.", rating: 5, date: "Sep 18 · 2:40 PM", text: "The cookies arrived fresh and beautifully packaged. Will order again.", status: "Needs reply", tone: "green" },
    { id: 4, business: "Quartz Blanc", author: "Daniel P.", rating: 5, date: "Sep 17 · 10:05 AM", text: "Professional partnership experience and excellent attention to detail.", status: "Replied", tone: "purple" },
  ].filter((review) => businesses.includes(review.business));
  const [businessFilter, setBusinessFilter] = useState("All businesses");
  const [query, setQuery] = useState("");
  const [synced, setSynced] = useState(false);
  const visibleReviews = reviews.filter((review) => {
    const matchesBusiness = businessFilter === "All businesses" || review.business === businessFilter;
    const matchesQuery = !query.trim() || `${review.author} ${review.text} ${review.business}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesBusiness && matchesQuery;
  });
  const average = reviews.length ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1) : "—";
  return <div className="reviews-page"><div className="settings-hero reviews-hero"><div><span className="ops-kicker">Customer reputation</span><h2>Every review, in one operating picture.</h2><p>Owners can scan Google reviews across the portfolio, spot feedback that needs a reply, and keep each business’s reputation visible without switching tabs.</p></div><div className="settings-owner-badge"><Star size={18} /><strong>{average} average rating</strong><small>{reviews.length} reviews in preview</small></div></div><div className="reviews-connector-banner"><div className="reviews-connector-icon"><Star size={16} /></div><div><strong>Google Reviews connector {synced ? "ready to configure" : "not connected"}</strong><p>This preview shows the review workflow. Connect each verified Google Business Profile in Setup Center to pull live reviews and reply status.</p></div><button className="ops-outline-button" onClick={() => { setSynced(true); toast.success("Review sync check ready", { description: "Connect Google Business Profile credentials in Setup Center to enable live data." }); }}><RefreshCw size={14} /> Check connection</button></div><div className="reviews-toolbar"><div><span className="ops-kicker">Portfolio reputation</span><h3>Google Reviews</h3><p>Review sentiment and reply workload across your authorized businesses.</p></div><div className="reviews-filters"><label className="reviews-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reviews" /></label><select value={businessFilter} onChange={(event) => setBusinessFilter(event.target.value)}><option>All businesses</option>{businesses.map((business) => <option key={business}>{business}</option>)}</select></div></div><div className="reviews-metrics"><div className="ops-panel reviews-metric"><span><Star size={14} /> Average rating</span><strong>{average}</strong><small>Across authorized locations</small></div><div className="ops-panel reviews-metric"><span><MessageCircle size={14} /> Needs reply</span><strong>{reviews.filter((review) => review.status === "Needs reply").length}</strong><small>Owner attention recommended</small></div><div className="ops-panel reviews-metric"><span><Check size={14} /> Replied</span><strong>{reviews.filter((review) => review.status === "Replied").length}</strong><small>Responses completed</small></div><div className="ops-panel reviews-metric"><span><BriefcaseBusiness size={14} /> Businesses</span><strong>{businesses.length}</strong><small>Authorized review locations</small></div></div><div className="reviews-layout"><div className="ops-panel reviews-list"><div className="ops-panel-title"><MessageSquareText size={16} /> Recent reviews <span>{visibleReviews.length} shown</span></div>{visibleReviews.map((review) => <div className="review-row" key={review.id}><span className={`review-avatar ${review.tone}`}>{review.author[0]}</span><div className="review-body"><div className="review-title"><strong>{review.author}</strong><span>{review.business}</span><small>{review.date}</small></div><div className="review-stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={12} fill={index < review.rating ? "currentColor" : "none"} />)}</div><p>{review.text}</p></div><div className="review-actions"><span className={`review-status ${review.status === "Replied" ? "replied" : "pending"}`}>{review.status}</span><button onClick={() => toast(review.status === "Replied" ? "Reply history opened" : "Reply workspace opened", { description: `${review.business} · ${review.author}` })}>{review.status === "Replied" ? "View reply" : "Prepare reply"} <ArrowRight size={13} /></button></div></div>)}{visibleReviews.length === 0 && <div className="audit-empty"><Search size={24} /><strong>No matching reviews</strong><p>Try another business or search term.</p></div>}</div><div className="reviews-side"><div className="ops-panel"><div className="ops-panel-title"><BriefcaseBusiness size={16} /> Business reputation</div>{businesses.map((business) => { const businessReviews = reviews.filter((review) => review.business === business); const score = businessReviews.length ? (businessReviews.reduce((sum, review) => sum + review.rating, 0) / businessReviews.length).toFixed(1) : "—"; return <button className="review-business-row" key={business} onClick={() => setBusinessFilter(business)}><span className="review-business-dot" /><span><strong>{business}</strong><small>{businessReviews.length} review{businessReviews.length === 1 ? "" : "s"}</small></span><b>{score}</b><ChevronRight size={14} /></button>; })}</div><div className="ops-panel reviews-permission"><ShieldCheck size={17} /><div><strong>Owner review access</strong><p>Josh sees Titusville, Pizza, and Skinny Cookies. Ed sees all four including Quartz Blanc. Marisa can view authorized reviews but cannot change connector credentials.</p></div></div></div></div></div>;
}

function SetupCenter() {
  const [ready, setReady] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const toggleReady = (id: string) => setReady((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <div className="setup-page"><div className="settings-hero setup-hero"><div><span className="ops-kicker">Owner setup center</span><h2>Finish the connections when you are ready.</h2><p>The hub is designed to be presented now and connected manually by the owner. No vendor secrets are stored in this preview until a secure backend vault is enabled.</p></div><div className="settings-owner-badge"><Rocket size={18} /><strong>{ready.length} of {setupConnectors.length} ready</strong><small>Owner checklist progress</small></div></div><div className="setup-banner"><KeyRound size={17} /><div><strong>Safe setup boundary</strong><p>Enter credentials only in the secure production setup flow. This screen tracks readiness and required ownership; it does not transmit or persist secrets.</p></div><button onClick={() => toast("Setup checklist copied", { description: "The owner checklist is ready to share." })}>Copy checklist <BookOpen size={14} /></button></div><div className="setup-section-title"><div><span className="ops-kicker">Integration checklist</span><h3>Connect the systems that already run the businesses</h3><p>Each connector can be enabled independently. The hub remains useful while setup is in progress.</p></div><button className="ops-primary-button" onClick={() => { setSaved(true); toast.success("Setup progress saved", { description: `${ready.length} connector tasks marked ready.` }); }}>{saved ? <><Check size={14} /> Progress saved</> : <>Save progress <ArrowRight size={14} /></>}</button></div><div className="setup-grid">{setupConnectors.map((connector) => { const Icon = connector.icon; const isReady = ready.includes(connector.id); return <div className={`ops-panel setup-card ${isReady ? "ready" : ""}`} key={connector.id}><div className="setup-card-top"><span className="setup-icon"><Icon size={16} /></span><span className={`setup-state ${isReady ? "ready" : "pending"}`}>{isReady ? "Ready for credentials" : "Owner setup required"}</span></div><h3>{connector.name}</h3><small>{connector.category}</small><p>{connector.scope}</p><div className="setup-owner"><Users size={13} /> {connector.owner}</div><button className={`setup-ready-button ${isReady ? "ready" : ""}`} onClick={() => toggleReady(connector.id)}>{isReady ? <><Check size={14} /> Mark as needing setup</> : <><Check size={14} /> Mark ready for owner setup</>}</button></div>; })}</div><div className="setup-bottom-grid"><div className="ops-panel"><div className="ops-panel-title"><Clock3 size={16} /> Recommended automation <span>After connectors are approved</span></div><div className="setup-rule"><Check size={14} /><span><strong>Every 10 minutes</strong><small>Read only changed records using updated timestamps or version markers.</small></span></div><div className="setup-rule"><Check size={14} /><span><strong>Change-only notifications</strong><small>Send SMS, VoIP, or staff alerts only when normalized data changes.</small></span></div><div className="setup-rule"><Check size={14} /><span><strong>Audit every action</strong><small>Keep connector health, sync time, user, and business in one trace.</small></span></div></div><div className="ops-panel"><div className="ops-panel-title"><BookOpen size={16} /> Owner handoff <span>Presentation ready</span></div><h3 className="setup-handoff-title">What this hub replaces</h3><p className="setup-handoff-copy">It replaces scattered status checks and manual follow-up with one operating view. It does not replace ESS, the POS, or the commerce platform; it coordinates them.</p><button className="hub-link-button" onClick={() => toast("Owner brief opened", { description: "Use the handoff guide to present the value, setup, and next decisions." })}>Open owner brief <ArrowRight size={13} /></button></div></div></div>;
}

function AccessSettings({ profiles, setProfiles, onOpenAudit, onUndo, canEdit, isOwner }: { profiles: AccessProfile[]; setProfiles: React.Dispatch<React.SetStateAction<AccessProfile[]>>; onOpenAudit: () => void; onUndo: () => void; canEdit: boolean; isOwner: boolean }) {
  const [selectedId, setSelectedId] = useState<AccessProfile["id"]>("marisa");
  const [saved, setSaved] = useState(false);
  const selected = profiles.find((item) => item.id === selectedId) || profiles[0];
  const updateProfile = (id: AccessProfile["id"], updates: Partial<AccessProfile>) => setProfiles((items) => items.map((item) => item.id === id ? { ...item, ...updates } : item));
  const toggleBusiness = (business: string) => { if (!selected) return; const businesses = selected.businesses.includes(business) ? selected.businesses.filter((item) => item !== business) : [...selected.businesses, business]; updateProfile(selected.id, { businesses, quartz: businesses.includes("Quartz Blanc") }); setSaved(false); };
  return <div className="access-settings-page"><div className="settings-hero"><div><span className="ops-kicker">Owner permission center</span><h2>Control what the assistant can see.</h2><p>Josh and Ed own the business decisions. Use this panel to decide which workspaces Marisa can view. The separate settings administrator can maintain configuration without seeing sales or core records.</p></div><div className="settings-owner-badge"><ShieldCheck size={18} /><strong>{isOwner ? "Owner controls" : canEdit ? "Settings administration" : "View-only permissions"}</strong><small>{isOwner ? "Josh + Ed" : canEdit ? "No sales or core data access" : "Marisa · Executive Assistant"}</small></div></div><div className="settings-layout"><div className="settings-profile-list"><div className="settings-section-title"><div><span className="ops-kicker">Staff profiles</span><h3>Who can access the hub</h3></div><button className="ops-outline-button" onClick={onOpenAudit}><ClipboardList size={14} /> View audit log</button></div>{profiles.map((item) => <button key={item.id} className={`settings-profile-card ${item.id === selected.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}><span className={`signin-avatar ${item.id}`}>{item.initials}</span><span><strong>{item.name}</strong><small>{item.role}</small><small>{item.businesses.length} business workspaces</small></span><ChevronRight size={14} /></button>)}</div><div className="settings-editor ops-panel"><div className="settings-editor-header"><div><span className="ops-kicker">Edit profile</span><h3>{selected.name} access</h3><p>Changes apply to the next session and are included in the audit trail.</p></div><StatusPill tone={selected.admin ? "green" : "blue"}>{selected.admin ? "Admin" : "Executive"}</StatusPill></div><label className="settings-field-label">Role scope<select value={selected.admin ? "admin" : "executive"} disabled={!canEdit} onChange={(event) => { if (canEdit) { updateProfile(selected.id, { admin: event.target.value === "admin" }); setSaved(false); } }}><option value="admin">Owner / Executive Admin</option><option value="executive">Executive</option></select></label><div className="settings-field-label">Business visibility<div className="settings-business-toggles">{businessOptions.map((business) => <button key={business} className={`settings-business-toggle ${selected.businesses.includes(business) ? "on" : ""}`} disabled={!canEdit} onClick={() => { if (canEdit) toggleBusiness(business); }}><span className="settings-toggle"><i /></span><span><strong>{business}</strong><small>{business === "Quartz Blanc" ? "Partnership workspace" : "Operating workspace"}</small></span><Check size={14} /></button>)}</div></div><div className="settings-shared-note"><LockKeyhole size={15} /><span><strong>Shared executive logs are always on.</strong><small>Josh and Ed can see Marisa’s admin actions, approvals, exports, and permission changes.</small></span></div><div className="settings-actions"><button className="ops-outline-button" onClick={onUndo}><RotateCcw size={14} /> Undo last change</button><button disabled={!canEdit} className="ops-primary-button settings-save" onClick={() => { setSaved(true); toast.success("Permissions saved", { description: `${selected.name} access settings updated and added to the audit log.` }); }}>{saved ? <><Check size={14} /> Saved</> : <>Save permission changes <ArrowRight size={14} /></>}</button></div></div></div></div>;
}

function AuditLog({ profiles }: { profiles: AccessProfile[] }) {
  const events = [
    { actor: "Marisa", action: "Updated Josh business visibility", business: "Portfolio access", time: "Today · 2:14 PM", date: "2025-09-20", tone: "purple" },
    { actor: "Ed", action: "Opened Quartz Blanc workspace", business: "Quartz Blanc", time: "Today · 11:42 AM", date: "2025-09-20", tone: "blue" },
    { actor: "Josh", action: "Completed late-payment review", business: "Titusville Self-Storage", time: "Yesterday · 4:08 PM", date: "2025-09-19", tone: "orange" },
    { actor: "Marisa", action: "Exported portfolio report", business: "All authorized businesses", time: "Yesterday · 9:18 AM", date: "2025-09-19", tone: "purple" },
  ];
  const [query, setQuery] = useState("");
  const [actorFilter, setActorFilter] = useState("All profiles");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const filteredEvents = events.filter((event) => {
    const haystack = `${event.actor} ${event.action} ${event.business}`.toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesActor = actorFilter === "All profiles" || event.actor === actorFilter;
    const matchesFrom = !fromDate || event.date >= fromDate;
    const matchesTo = !toDate || event.date <= toDate;
    return matchesQuery && matchesActor && matchesFrom && matchesTo;
  });
  const clearFilters = () => { setQuery(""); setActorFilter("All profiles"); setFromDate(""); setToDate(""); };
  return <div className="audit-page"><div className="settings-hero audit-hero"><div><span className="ops-kicker">Shared accountability</span><h2>Executive audit log.</h2><p>One timeline for permission changes, approvals, exports, and business-level actions across Josh, Ed, and Marisa.</p></div><div className="settings-owner-badge"><ClipboardList size={18} /><strong>{filteredEvents.length} of {events.length} events</strong><small>Shared with authorized executives</small></div></div><div className="ops-panel audit-panel"><div className="settings-section-title"><div><span className="ops-kicker">Activity history</span><h3>Recent executive actions</h3></div><button className="ops-outline-button audit-clear-button" onClick={clearFilters}>Clear filters</button></div><div className="audit-filters"><label className="audit-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actions, people, or businesses" /></label><label><span>Profile</span><select value={actorFilter} onChange={(event) => setActorFilter(event.target.value)}><option>All profiles</option>{profiles.map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label><span>From</span><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label><label><span>To</span><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></label></div><div className="audit-filter-summary"><span><strong>{filteredEvents.length}</strong> matching events</span>{(query || actorFilter !== "All profiles" || fromDate || toDate) && <button onClick={clearFilters}>Reset search and dates <X size={13} /></button>}</div>{filteredEvents.map((event) => <div className="audit-row" key={`${event.actor}-${event.action}`}><span className={`audit-avatar ${event.tone}`}>{event.actor[0]}</span><div><strong>{event.action}</strong><small>{event.actor} · {event.business}</small></div><time>{event.time}<br /><small>{event.date}</small></time><Check size={15} /></div>)}{filteredEvents.length === 0 && <div className="audit-empty"><Search size={24} /><strong>No matching audit events</strong><p>Try a different keyword, profile, or date range.</p><button className="ops-outline-button" onClick={clearFilters}>Clear filters</button></div>}</div><div className="audit-info-grid"><div className="ops-panel"><ShieldCheck size={18} /><strong>Audit retention</strong><p>Keep permission and executive activity records for your chosen retention window.</p></div><div className="ops-panel"><LockKeyhole size={18} /><strong>Admin visibility</strong><p>Marisa’s owner actions are shared with Josh and Ed through this timeline.</p></div></div></div>;
}
function CallConferencing() {
  const [started, setStarted] = useState(false);
  return <div className="call-page"><div className="settings-hero"><div><span className="ops-kicker">Executive collaboration</span><h2>Call conferencing for the portfolio.</h2><p>Start a focused call with owners, managers, and partners without losing the business context.</p></div><div className="settings-owner-badge"><Video size={18} /><strong>Secure room</strong><small>Provider connection pending</small></div></div><div className="call-grid"><div className="ops-panel call-room"><div className="ops-panel-title"><Video size={16} /> Executive room <span>Ready when you are</span></div><div className="call-screen"><div className="call-screen-orb"><Video size={26} /></div><strong>{started ? "Room is ready" : "No call in progress"}</strong><small>{started ? "Invite Josh, Ed, or a partner to join." : "Create a room for a portfolio decision."}</small></div><button className="ops-primary-button" onClick={() => { setStarted(true); toast.success("Conference room created", { description: "Connect a video provider to enable live calling." }); }}>{started ? "Copy meeting invite" : "Start conference room"} <ArrowRight size={14} /></button></div><div className="ops-panel"><div className="ops-panel-title"><Users size={16} /> Suggested participants</div>{["Josh · Pizza + Titusville", "Ed · Quartz Blanc partnership", "Marisa · Owner / Executive Admin"].map((person) => <div className="call-person" key={person}><span>{person[0]}</span><strong>{person}</strong><Check size={14} /></div>)}<div className="hub-security-strip"><LockKeyhole size={15} /><div><strong>Provider-ready</strong><p>Connect Zoom, Google Meet, or Twilio Video server-side when credentials are available.</p></div></div></div></div></div>;
}

function PlaceholderPage({ title, setActive }: { title: string; setActive: (item: string) => void }) {
  const data: Record<string, { icon: React.ElementType; copy: string }> = { Payments: { icon: WalletCards, copy: "Review statements, update payment methods, and make a one-time payment." }, "My Units": { icon: ShieldCheck, copy: "View access details, unit information, and add another space." }, Messages: { icon: MessageSquareText, copy: "Keep the conversation going with the Titusville team." }, Documents: { icon: FileText, copy: "Your leases, receipts, and statements live here." }, Support: { icon: LifeBuoy, copy: "Browse answers or connect with our 24/7 support team." }, Profile: { icon: UserRound, copy: "Update your contact details and account preferences." } };
  const { icon: Icon, copy } = data[title] || data.Support;
  return <div className="placeholder-page"><div className="placeholder-icon"><Icon size={28} /></div><div className="eyebrow">Customer hub</div><h1>{title}</h1><p>{copy}</p><AppButton onClick={() => { setActive("Dashboard"); toast("Back to your dashboard"); }}>Back to dashboard <ArrowRight size={16} /></AppButton><div className="placeholder-preview"><span>Preview module</span><div /><div /><div /></div></div>;
}

function Dashboard({ onHome, profile }: { onHome: () => void; profile: AccessProfile }) {
  const [active, setActive] = useState(profile.settingsAdmin ? "Access Settings" : profile.owner ? "Executive Hub" : "Support Requests");
  const [profiles, setProfiles] = useState<AccessProfile[]>([profile]);
  const [profileHistory, setProfileHistory] = useState<AccessProfile[][]>([]);
  useEffect(() => { fetchAllProfiles().then((rows) => { if (rows.length) setProfiles(rows); }); }, []);
  const setProfilesWithHistory: React.Dispatch<React.SetStateAction<AccessProfile[]>> = (next) => { setProfiles((previous) => { const updated = typeof next === "function" ? next(previous) : next; if (updated !== previous) setProfileHistory((history) => [...history, previous].slice(-10)); return updated; }); };
  const undoProfileChange = () => setProfileHistory((history) => { const previous = history.at(-1); if (previous) { setProfiles(previous); toast.success("Change undone", { description: "The previous permission state has been restored." }); return history.slice(0, -1); } toast("Nothing to undo"); return history; });
  const activeProfile = profiles.find((item) => item.id === profile.id) || profile;
  const opsLabels = ["Executive Hub", "Executive View", "Operations", "SMS Reminders", "Late Payments", "Support Requests", "Gate Access", "Staff Notes", "Reports"];
  const opsTabMap: Record<string, string> = { "Executive Hub": "hub", "Executive View": "executive", Operations: "overview", "SMS Reminders": "reminders", "Late Payments": "late", "Support Requests": "support", "Gate Access": "gate", "Staff Notes": "notes", Reports: "reports" };
  return <div className="dashboard-shell"><Sidebar active={active} setActive={setActive} profile={activeProfile} /><div className="dashboard-app"><Topbar active={active} onHome={onHome} profile={activeProfile} />{opsLabels.includes(active) ? <OperationsDashboard initialTab={opsTabMap[active]} profile={activeProfile} /> : active === "ESS Integration" ? <IntegrationArchitecture /> : active === "Google Reviews" ? <GoogleReviews profile={activeProfile} /> : active === "Calendar & Reminders" ? <CalendarReminders profile={activeProfile} /> : active === "Setup Center" && (activeProfile.owner || activeProfile.settingsAdmin) ? <SetupCenter /> : active === "Access Settings" && (activeProfile.owner || activeProfile.settingsAdmin) ? <AccessSettings profiles={profiles} setProfiles={setProfilesWithHistory} onUndo={undoProfileChange} canEdit={activeProfile.canManageSettings} isOwner={activeProfile.owner} onOpenAudit={() => setActive("Audit Log")} /> : active === "Audit Log" && (activeProfile.owner || activeProfile.settingsAdmin) ? <AuditLog profiles={profiles} /> : active === "Call Conferencing" ? <CallConferencing /> : active === "Commercial Leasing" ? <LeasingAdmin profile={activeProfile} /> : <PlaceholderPage title={active} setActive={setActive} />}</div></div>;
}

export default function Home() {
  const [view, setView] = useState<"home" | "dashboard">("home");
  const [signinOpen, setSigninOpen] = useState(false);
  const [profile, setProfile] = useState<AccessProfile | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    restoreSession().then((restored) => {
      if (restored) { setProfile(restored); setView("dashboard"); }
      setCheckingSession(false);
    });
  }, []);

  const enter = (selected?: AccessProfile) => { if (selected) setProfile(selected); setSigninOpen(false); setView("dashboard"); };
  const goHome = () => { authSignOut(); setProfile(null); setView("home"); };

  if (checkingSession) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={28} className="hub-spin" /></div>;
  }

  return view === "home" || !profile
    ? <><PublicHome onEnter={() => setSigninOpen(true)} />{signinOpen && <SignInPanel onSelect={enter} onClose={() => setSigninOpen(false)} />}</>
    : <Dashboard profile={profile} onHome={goHome} />;
}

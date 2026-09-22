import { supabase } from "./supabaseClient";

export type SpaceStatus = "available" | "pending" | "reserved" | "leased" | "unavailable";

export type LeasingSpace = {
  id: string;
  property_id: string;
  slug: string;
  name: string;
  square_footage: number;
  monthly_rent: number;
  security_deposit: number | null;
  status: SpaceStatus;
  description: string | null;
  amenities: string[];
  parking_info: string | null;
  access_info: string | null;
  lease_terms: string | null;
  suitable_uses: string[];
  restrictions: string | null;
  is_combined: boolean;
  combined_of: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  leasing_properties?: { name: string; address: string; map_lat: number | null; map_lng: number | null };
  leasing_space_images?: { id: string; url: string; alt_text: string | null; sort_order: number }[];
};

export type LeasingLead = {
  id: string;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  space_id: string | null;
  intended_use: string | null;
  sqft_needed: number | null;
  budget: number | null;
  move_in_date: string | null;
  lease_duration: string | null;
  need_parking: boolean | null;
  additional_requirements: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  status: string;
  lost_reason: string | null;
  assigned_to: string | null;
  follow_up_date: string | null;
  referred_by_name: string | null;
  referred_by_contact: string | null;
  created_at: string;
  updated_at: string;
  leasing_spaces?: { name: string } | null;
};

const LEAD_STATUSES = ["new", "contacted", "tour_scheduled", "application_received", "negotiating", "approved", "leased", "lost", "not_qualified"] as const;
export { LEAD_STATUSES };

export const LEAD_SOURCES = ["google", "facebook", "facebook_marketplace", "craigslist", "existing_tenant", "signage", "referral", "direct_website", "other"] as const;

function inferSourceFromUtm(utm: Record<string, string | null>): typeof LEAD_SOURCES[number] {
  const src = (utm.utm_source || "").toLowerCase();
  if (src.includes("google")) return "google";
  if (src.includes("facebook") && (utm.utm_medium || "").toLowerCase().includes("marketplace")) return "facebook_marketplace";
  if (src.includes("facebook") || src.includes("fb")) return "facebook";
  if (src.includes("craigslist")) return "craigslist";
  return "direct_website";
}

// ---------- UTM capture ----------
export function captureUtmFromUrl(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
  };
}

function sessionId(): string {
  const key = "leasing_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackEvent(eventType: string, extra: { space_id?: string; lead_id?: string; path?: string } = {}) {
  const utm = captureUtmFromUrl();
  try {
    await supabase.from("leasing_analytics_events").insert({
      event_type: eventType,
      session_id: sessionId(),
      path: extra.path ?? window.location.pathname,
      space_id: extra.space_id ?? null,
      lead_id: extra.lead_id ?? null,
      ...utm,
    });
  } catch (err) {
    console.error("trackEvent failed", err);
  }
}

// ---------- Public reads ----------
export async function fetchSpaces(): Promise<LeasingSpace[]> {
  const { data, error } = await supabase
    .from("leasing_spaces")
    .select("*, leasing_properties(name, address, map_lat, map_lng), leasing_space_images(id, url, alt_text, sort_order)")
    .order("sort_order");
  if (error) { console.error(error); return []; }
  return data as unknown as LeasingSpace[];
}

export async function fetchSpaceBySlug(slug: string): Promise<LeasingSpace | null> {
  const { data, error } = await supabase
    .from("leasing_spaces")
    .select("*, leasing_properties(name, address, map_lat, map_lng), leasing_space_images(id, url, alt_text, sort_order)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) { console.error(error); return null; }
  return data as unknown as LeasingSpace | null;
}

export async function fetchLandingPage(slug: string) {
  const { data, error } = await supabase.from("leasing_landing_pages").select("*").eq("slug", slug).maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}

// ---------- Public form submissions ----------
export type SpaceFinderInput = {
  use_case: string;
  sqft_needed?: number;
  budget?: number;
  move_in_date?: string;
  lease_duration?: string;
  need_parking?: boolean;
  business_name?: string;
  name: string;
  phone?: string;
  email?: string;
  additional_requirements?: string;
};

export async function submitLead(input: Partial<LeasingLead> & { name: string }) {
  const utm = captureUtmFromUrl();
  const { data, error } = await supabase
    .from("leasing_leads")
    .insert({ ...input, ...utm, source: input.source ?? inferSourceFromUtm(utm) })
    .select()
    .single();
  if (error) throw error;
  await trackEvent("lead", { lead_id: data.id, space_id: input.space_id ?? undefined });
  return data as LeasingLead;
}

export async function submitReferral(input: { referrer_name: string; referrer_contact: string; referred_name: string; referred_contact?: string; space_id?: string }) {
  return submitLead({
    name: input.referred_name,
    phone: input.referred_contact,
    referred_by_name: input.referrer_name,
    referred_by_contact: input.referrer_contact,
    space_id: input.space_id,
    source: "referral",
  } as Partial<LeasingLead> & { name: string });
}

export async function submitTourRequest(input: {
  lead_id?: string; name: string; email?: string; phone?: string; business_name?: string;
  space_id?: string; preferred_date?: string; preferred_time?: string; intended_use?: string; notes?: string;
}) {
  const { data, error } = await supabase.from("leasing_tour_requests").insert(input).select().single();
  if (error) throw error;
  await trackEvent("tour_request", { lead_id: input.lead_id, space_id: input.space_id });
  return data;
}

export async function submitApplication(input: {
  lead_id?: string; applicant_name: string; business_name?: string; email?: string; phone?: string;
  current_business_address?: string; business_type?: string; intended_use?: string; move_in_date?: string;
  lease_duration?: string; space_id?: string; employee_count?: number; parking_needs?: string; additional_comments?: string;
}) {
  const { data, error } = await supabase.from("leasing_applications").insert(input).select().single();
  if (error) throw error;
  await trackEvent("application", { lead_id: input.lead_id, space_id: input.space_id });
  return data;
}

// ---------- Staff / CRM ----------
export async function fetchLeadsForStaff(): Promise<LeasingLead[]> {
  const { data, error } = await supabase.from("leasing_leads").select("*, leasing_spaces(name)").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data as unknown as LeasingLead[];
}

export async function updateLead(id: string, updates: Partial<LeasingLead>) {
  const { data: before } = await supabase.from("leasing_leads").select("status, lost_reason, follow_up_date").eq("id", id).single();
  const { data, error } = await supabase.from("leasing_leads").update(updates).eq("id", id).select().single();
  if (error) throw error;
  await writeAuditLog("update", "lead", id, before, updates);
  return data;
}

export async function addLeadNote(leadId: string, note: string) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("leasing_lead_notes").insert({ lead_id: leadId, author_id: userData.user?.id, note });
  if (error) throw error;
}

export async function fetchLeadNotes(leadId: string) {
  const { data, error } = await supabase.from("leasing_lead_notes").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function fetchTourRequestsForStaff() {
  const { data, error } = await supabase.from("leasing_tour_requests").select("*, leasing_spaces(name)").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function fetchApplicationsForStaff() {
  const { data, error } = await supabase.from("leasing_applications").select("*, leasing_spaces(name)").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function fetchSpacesForStaff(): Promise<LeasingSpace[]> {
  return fetchSpaces();
}

export async function updateSpace(id: string, updates: Partial<LeasingSpace>) {
  const { data: before } = await supabase.from("leasing_spaces").select("status, monthly_rent, description").eq("id", id).single();
  const { data, error } = await supabase.from("leasing_spaces").update(updates).eq("id", id).select().single();
  if (error) throw error;
  await writeAuditLog("update", "space", id, before, updates);
  return data;
}

export async function createSpace(propertyId: string, input: Partial<LeasingSpace> & { slug: string; name: string; square_footage: number; monthly_rent: number }) {
  const { data, error } = await supabase.from("leasing_spaces").insert({ property_id: propertyId, ...input }).select().single();
  if (error) throw error;
  return data;
}

export async function fetchAnalyticsSummary() {
  const { data, error } = await supabase.from("leasing_analytics_events").select("event_type, utm_source, space_id, created_at, session_id");
  if (error) { console.error(error); return []; }
  return data;
}

export async function fetchAnalyticsEvents() {
  return fetchAnalyticsSummary();
}

export async function uploadSpaceImage(spaceId: string, file: File): Promise<void> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${spaceId}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("leasing-space-photos").upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;
  const { data: pub } = supabase.storage.from("leasing-space-photos").getPublicUrl(path);
  const { data: existing } = await supabase.from("leasing_space_images").select("id").eq("space_id", spaceId);
  const { error: insertError } = await supabase
    .from("leasing_space_images")
    .insert({ space_id: spaceId, url: pub.publicUrl, sort_order: existing?.length ?? 0 });
  if (insertError) throw insertError;
}

export async function deleteSpaceImage(imageId: string, url: string) {
  const marker = "/leasing-space-photos/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const path = url.slice(idx + marker.length);
    await supabase.storage.from("leasing-space-photos").remove([path]);
  }
  const { error } = await supabase.from("leasing_space_images").delete().eq("id", imageId);
  if (error) throw error;
}

export async function deleteSpace(id: string) {
  const { error } = await supabase.from("leasing_spaces").delete().eq("id", id);
  if (error) throw error;
}

export async function writeAuditLog(action: string, entityType: string, entityId: string | null, before: unknown, after: unknown) {
  try {
    await supabase.rpc("write_leasing_audit", { p_action: action, p_entity_type: entityType, p_entity_id: entityId, p_before: before ?? null, p_after: after ?? null });
  } catch (err) {
    console.error("audit log write failed", err);
  }
}

export async function fetchAuditLog() {
  const { data, error } = await supabase.from("leasing_audit_log").select("*, profiles(name)").order("created_at", { ascending: false }).limit(100);
  if (error) { console.error(error); return []; }
  return data;
}

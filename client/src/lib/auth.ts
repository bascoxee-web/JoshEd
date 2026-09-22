import { supabase } from "./supabaseClient";

// Mirrors the `AccessProfile` shape already used throughout client/src/pages/Home.tsx,
// just sourced from the real `profiles` table instead of a hardcoded array.
export type AccessProfile = {
  id: string; // profiles.slug (e.g. "josh", "ed", "marisa", "settings")
  authId: string; // real auth.users id, needed for anything that calls Supabase directly
  name: string;
  initials: string;
  role: string;
  businesses: string[];
  quartz: boolean;
  admin: boolean;
  owner: boolean;
  settingsAdmin: boolean;
  canManageSettings: boolean;
  canViewImportantData: boolean;
  leasingRole: "none" | "viewer" | "admin" | "super_admin";
};

type ProfileRow = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role_label: string;
  businesses: string[];
  quartz: boolean;
  is_admin: boolean;
  is_owner: boolean;
  settings_admin: boolean;
  can_manage_settings: boolean;
  can_view_important_data: boolean;
  leasing_role: "none" | "viewer" | "admin" | "super_admin";
};

function mapProfile(row: ProfileRow): AccessProfile {
  return {
    id: row.slug,
    authId: row.id,
    name: row.name,
    initials: row.initials,
    role: row.role_label,
    businesses: row.businesses ?? [],
    quartz: row.quartz,
    admin: row.is_admin,
    owner: row.is_owner,
    settingsAdmin: row.settings_admin,
    canManageSettings: row.can_manage_settings,
    canViewImportantData: row.can_view_important_data,
    leasingRole: row.leasing_role ?? "none",
  };
}

export async function fetchOwnProfile(): Promise<AccessProfile | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error || !data) {
    console.error("Failed to load profile", error);
    return null;
  }
  return mapProfile(data as ProfileRow);
}

export async function fetchAllProfiles(): Promise<AccessProfile[]> {
  // RLS only returns every row for owners/settings admins; everyone else gets
  // just their own row back (see "owners read all profiles" policy).
  const { data, error } = await supabase.from("profiles").select("*").order("name");
  if (error || !data) {
    console.error("Failed to load profiles", error);
    return [];
  }
  return (data as ProfileRow[]).map(mapProfile);
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { profile: null, error: error.message };
  if (!data.user) return { profile: null, error: "Sign in failed. Try again." };

  const profile = await fetchOwnProfile();
  if (!profile) return { profile: null, error: "Signed in, but no profile is set up for this account yet." };
  return { profile, error: null };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function restoreSession(): Promise<AccessProfile | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  return fetchOwnProfile();
}

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        cache: "no-store",
      });
    },
  },
});

export async function createSupabaseServerClient() {
  const { getToken } = await auth();

  let clerkToken: string | null = null;
  try {
    clerkToken = (await getToken({ template: "supabase" })) ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message !== "Not Found") {
      console.error("Failed to retrieve Clerk token with supabase template:", error);
    }
  }

  if (!clerkToken) {
    clerkToken = (await getToken()) ?? null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: clerkToken
        ? { Authorization: `Bearer ${clerkToken}` }
        : undefined,
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
  });
}

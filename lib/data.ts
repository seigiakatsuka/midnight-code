// importing db data from supabase
// projectData function to fetch project data
// *TO-DO* projectImages function to fetch project images

import "server-only";

export async function projectData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const projects = await fetch(`${supabaseUrl}/rest/v1/projects`, {
    method: "GET",
    headers: {
      apikey: supabaseKey,
    },
  });

  if (!projects.ok) {
    throw new Error("Failed to fetch projects");
  }

  return projects.json();
}

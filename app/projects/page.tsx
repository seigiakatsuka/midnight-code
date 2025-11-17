import ProjectCard from "@/components/projectCard/ProjectCard";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select();

  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectCard projects={projects} />
    </Suspense>
  );
}

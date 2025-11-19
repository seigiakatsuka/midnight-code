"use client";

import ProjectCard from "@/components/projectCard/ProjectCard";
import { Suspense } from "react";
import ProjectSkeleton from "./loading";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectCard />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}

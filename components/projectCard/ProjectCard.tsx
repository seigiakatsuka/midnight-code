"use client";
import { use } from "react";
import { PROJECTS } from "@/lib/data";

export default function ProjectCard() {
  // Fetch project data using the server-side function

  const allProjects = use(PROJECTS());
  return (
    <ul>
      {allProjects.map((project) => (
        <li key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <a href={project.link}>View Project</a>
        </li>
      ))}
    </ul>
  );
}

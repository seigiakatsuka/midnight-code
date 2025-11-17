export default async function ProjectsPage({
  params,
}: {
  params: { projects: string };
}) {
  const projects = params.projects;
  return (
    <>
      <div>Projects Page for {projects}</div>
    </>
  );
}

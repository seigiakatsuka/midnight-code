import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

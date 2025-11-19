import { Metadata } from "next";
import { BlogPosts } from "@/components/blog/BlogPosts";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog - Midnight Code",
  description: "Read the latest articles and updates from Midnight Code.",
};

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select()
    .order("published_at", { ascending: false });

  return (
    <div>
      <Suspense fallback={<div>Loading blog posts...</div>}>
        <BlogPosts posts={posts} />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}

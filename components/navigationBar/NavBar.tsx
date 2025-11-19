"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.logo}>
        <Link href="/">
          <h1>Midnight Code</h1>
        </Link>
      </div>
      <NavigationMenu className={styles.navbar}>
        <ul>
          <NavigationMenuLink asChild>
            <Link className={pathname === "/" ? styles.active : ""} href="/">
              Home
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              className={pathname === "blog" ? styles.active : ""}
              href="/blog"
            >
              Blog
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              className={pathname === "/projects" ? styles.active : ""}
              href="/projects"
            >
              <div>Projects</div>
              <p>Take a look at my works</p>
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              className={pathname === "/projects" ? styles.active : ""}
              href="/contact"
            >
              <div>Contact</div>
              <p>Get in touch with me</p>
            </Link>
          </NavigationMenuLink>
        </ul>
      </NavigationMenu>
    </>
  );
}

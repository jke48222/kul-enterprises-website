"use client";

import { usePathname } from "next/navigation";

/**
 * Route-aware chrome. The main site header and footer are passed in as
 * server-rendered slots and hidden on /concept routes, which carry their own
 * navigation and footer.
 */
export default function Chrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const concept = pathname === "/concept" || pathname.startsWith("/concept/");

  if (concept) return <>{children}</>;
  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
    </>
  );
}

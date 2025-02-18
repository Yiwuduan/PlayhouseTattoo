import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/artists", label: "Artists" },
    { href: "/about", label: "About" },
    { href: "/book", label: "Book" }
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="text-2xl font-bold tracking-tight">PLAYHOUSE</a>
        </Link>
        
        <div className="flex gap-6">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

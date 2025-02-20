import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/artists", label: "Artists" },
    { href: "/about", label: "About" },
    { href: "/book", label: "Book" }
  ];

  // If user is admin, add admin link to navigation
  if (user?.isAdmin === true) {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="text-2xl font-bold tracking-tight">PLAYHOUSE</a>
        </Link>

        <div className="flex items-center gap-6">
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
          {user ? (
            <Button
              variant="ghost"
              onClick={() => logoutMutation.mutate()}
              className="text-sm font-medium"
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth">
              <a className="text-sm font-medium text-muted-foreground hover:text-primary">
                Login
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
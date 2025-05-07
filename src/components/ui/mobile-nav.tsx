import { useState } from "react";
// import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden p-4">
        <Button variant="ghost" size="lg">
          <Menu className="h-10 w-10" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8 p-4">
          <a
            href="#about"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            About Us
          </a>
          <a
            href="#mission"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Mission
          </a>
          <a
            href="#prayer"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Prayer Request
          </a>
          <a
            href="#prayer"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Join Our Group
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

import { MinimalNavbar } from "@/components/layout/minimal-navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/shared/command-palette";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommandPalette />
      <MinimalNavbar />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      <Footer />
    </>
  );
}

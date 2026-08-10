import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

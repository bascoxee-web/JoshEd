import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";

export function LeasingNav() {
  return (
    <header className="lc-shell lc-nav">
      <Link href="/leasing" className="lc-nav-brand">
        <strong>Titusville Flex Space</strong>
        <span>Commercial &amp; warehouse leasing</span>
      </Link>
      <nav className="lc-nav-links">
        <Link href="/leasing">Available spaces</Link>
        <Link href="/leasing/space-finder">Find my space</Link>
        <a href="#contact">Contact</a>
      </nav>
      <div className="lc-nav-cta">
        <a className="lc-btn lc-btn-outline" href="tel:13212223538"><Phone size={15} /> Call</a>
        <Link href="/leasing/space-finder" className="lc-btn lc-btn-amber">Find my space</Link>
      </div>
    </header>
  );
}

export function LeasingFooter() {
  return (
    <>
      <section id="contact" className="lc-contact-strip">
        <div className="lc-shell">
          <div>
            <h3>Have questions? Talk to us directly.</h3>
            <p>We usually respond within one business day.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a className="lc-btn lc-btn-amber" href="tel:13212223538"><Phone size={16} /> 321-222-3538</a>
            <a className="lc-btn lc-btn-outline" style={{ borderColor: "#fff", color: "#fff" }} href="mailto:leasing@titusvilleflexspace.example"><Mail size={16} /> Email us</a>
          </div>
        </div>
      </section>
      <footer className="lc-shell lc-footer">
        <span>© {new Date().getFullYear()} Titusville Flex Space. Commercial leasing division of Titusville Self-Storage.</span>
        <span>905 Main Street, Titusville, FL</span>
        <span>Built by <a href="mailto:retchvisionai@outlook.com" style={{ color: "inherit", textDecoration: "underline" }}>Retch VisionAI Solutions</a></span>
      </footer>
    </>
  );
}

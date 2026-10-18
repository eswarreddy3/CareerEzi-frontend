"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Twitter, Linkedin, Github } from "lucide-react"
import { Logo } from "@/components/logo"
import { LEGAL, LEGAL_LINKS } from "@/lib/legal"

const LINK = "text-sm text-muted-foreground hover:text-foreground transition-colors"

// On the landing page a section link scrolls in place; on any other page it
// navigates to the landing page's section anchor.
function SectionLink({ id, onScrollTo, children }: {
  id: string; onScrollTo?: (id: string) => void; children: React.ReactNode
}) {
  if (onScrollTo) {
    return <button onClick={() => onScrollTo(id)} className={LINK}>{children}</button>
  }
  return <Link href={`/#${id}`} className={LINK}>{children}</Link>
}

/** Site-wide public footer — shared by the landing page and /about. */
export function SiteFooter({ onScrollTo }: { onScrollTo?: (id: string) => void }) {
  return (
    <footer className="border-t border-border bg-background pt-14 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-12">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <div className="mb-4"><Logo size={32} /></div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              India's campus placement preparation platform. Structured learning, practice, and community — all in one place.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: Twitter,  href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github,   href: "#", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label} href={href} title={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="w-9 h-9 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: "Features",     id: "features" },
                { label: "For Colleges", id: "how-it-works" },
                { label: "Gamification", id: "gamification" },
                { label: "Contact",      id: "contact" },
              ].map(({ label, id }) => (
                <li key={label}>
                  <SectionLink id={id} onScrollTo={onScrollTo}>{label}</SectionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              </li>
              <li>
                <SectionLink id="faq" onScrollTo={onScrollTo}>FAQs</SectionLink>
              </li>
              <li>
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help &amp; Support</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              © 2026 CareerEzi. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Developed by{" "}
              <a
                href="https://www.fynityinnovations.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Fynity Innovations
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Student Login
            </Link>
            <span className="text-border">·</span>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              College Admin
            </Link>
            <span className="text-border">·</span>
            <p className="text-xs text-muted-foreground">Made with ❤️ in India</p>
          </div>
        </div>

      </div>
    </footer>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, LegalTable } from "@/components/legal-page"
import { CookieSettingsButton } from "@/components/cookie-consent"
import { LEGAL } from "@/lib/legal"

export const metadata: Metadata = {
  title: `Cookie Policy | ${LEGAL.product}`,
  description: `The cookies and browser storage ${LEGAL.product} uses, and how to control them.`,
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      current="/cookies"
      summary={`${LEGAL.product} uses a small number of cookies and browser-storage entries. Essential ones keep you signed in and remember your settings. Analytics cookies are used only if you allow them. This policy forms part of our Privacy Policy.`}
    >
      <h2 id="what">1. What cookies and browser storage are</h2>
      <p>
        Cookies are small text files a website saves in your browser. &quot;Local storage&quot; works in a
        similar way but stays on your device and is not sent with every request. We use both, and refer to
        them together as &quot;cookies&quot;.
      </p>

      <h2 id="essential">2. Essential (always on)</h2>
      <p>These are needed for the platform to work and cannot be switched off. They are not used for tracking or advertising.</p>
      <LegalTable>
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
          <tbody>
            <tr><td><code>careerezi_token</code></td><td>Cookie</td><td>Keeps you signed in and protects private pages</td><td>7 days</td></tr>
            <tr><td><code>careerezi-auth</code>, <code>careerezi_access_token</code></td><td>Local storage</td><td>Your sign-in session and basic profile, so pages load without signing in again</td><td>Until you log out</td></tr>
            <tr><td><code>careerezi-cookie-consent</code></td><td>Local storage</td><td>Remembers your cookie choice</td><td>12 months</td></tr>
          </tbody>
        </table>
      </LegalTable>

      <h2 id="preferences">3. Preferences (always on)</h2>
      <LegalTable>
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
          <tbody>
            <tr><td><code>careerezi-theme</code></td><td>Local storage</td><td>Light or dark mode</td><td>Until cleared</td></tr>
            <tr><td><code>careerezi-theme-*</code>, <code>careerezi-seen-themes-*</code>, <code>careerezi-mascot-seen-*</code></td><td>Local storage</td><td>Lesson-reader theme and which tips you have already seen</td><td>Until cleared</td></tr>
            <tr><td><code>careerezi-cp-hidden-banner</code></td><td>Local storage</td><td>Remembers that you dismissed the &ldquo;hidden items&rdquo; notice on your Career Profile</td><td>Until cleared</td></tr>
            <tr><td><code>careerezi-resume</code></td><td>Local storage</td><td>Offline backup of your resume draft if saving to the server fails</td><td>Until cleared or you reset the resume</td></tr>
            <tr><td>Saarthi panel settings</td><td>Local storage</td><td>Whether the AI assistant panel is open, dismissed or moved</td><td>Until cleared</td></tr>
          </tbody>
        </table>
      </LegalTable>

      <h2 id="analytics">4. Analytics (only with your consent)</h2>
      <LegalTable>
        <table>
          <thead><tr><th>Provider</th><th>Name</th><th>Purpose</th><th>Duration</th></tr></thead>
          <tbody>
            <tr><td>Google Analytics</td><td><code>_ga</code>, <code>_ga_*</code></td><td>Counts visits and shows which pages are used, so we can improve them. Google may process this data outside India.</td><td>Up to 2 years</td></tr>
          </tbody>
        </table>
      </LegalTable>
      <p>
        We also use Vercel Analytics, which measures page views and performance <strong>without cookies</strong>{" "}
        and without identifying individual visitors.
      </p>
      <p>We do not use advertising or cross-site tracking cookies, and do not use analytics to track users under 18.</p>

      <h2 id="control">5. Your choices</h2>
      <ul>
        <li>When you first visit, you can accept or reject analytics cookies. Rejecting them does not affect how the platform works.</li>
        <li>You can change your choice at any time: <CookieSettingsButton /></li>
        <li>You can also delete cookies and site data in your browser settings. Deleting essential storage will sign you out.</li>
      </ul>

      <h2 id="contact">6. Contact</h2>
      <p>
        Questions about cookies? Email <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> or see
        the <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  )
}

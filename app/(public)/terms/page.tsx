import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, ContactBlock } from "@/components/legal-page"
import { LEGAL } from "@/lib/legal"

export const metadata: Metadata = {
  title: `Terms of Service | ${LEGAL.product}`,
  description: `The terms that govern your use of ${LEGAL.product}.`,
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      current="/terms"
      summary={`These Terms are a legally binding agreement between you and ${LEGAL.entity}. By activating your account or using ${LEGAL.product}, you agree to them and to our Privacy Policy. If you do not agree, do not use the platform. This document is an electronic record under the Information Technology Act, 2000 and does not need a physical or digital signature.`}
    >
      <h2 id="service">1. The service</h2>
      <p>
        {LEGAL.product} is a placement-preparation platform offering courses, practice questions, assessments,
        coding exercises, AI-assisted mock interviews and study plans, a resume builder, job listings, a college
        feed, leaderboards and certificates. Access is normally provided through your college (the
        &quot;Institution&quot;) under a separate agreement between the Institution and us. Where that agreement
        conflicts with these Terms on matters between us and the Institution, that agreement prevails.
      </p>

      <h2 id="eligibility">2. Eligibility and accounts</h2>
      <ul>
        <li>You must be enrolled with, or employed by, an Institution that uses {LEGAL.product}, and be at least 18 years old, or have the verifiable consent of a parent or guardian as described in our <Link href="/privacy#children">Privacy Policy</Link>.</li>
        <li>Your Institution creates your account. You must provide accurate information and keep it up to date.</li>
        <li>Keep your password confidential. You are responsible for activity on your account. Tell us at once at <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> if you suspect unauthorised use.</li>
        <li>One account per person. Do not share, sell or transfer your account.</li>
      </ul>

      <h2 id="conduct">3. Acceptable use</h2>
      <p>
        As required by Rule 3(1)(b) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules,
        2021, you must not host, display, upload, modify, publish, transmit, store, update or share any
        information that:
      </p>
      <ol>
        <li>belongs to another person and to which you have no right;</li>
        <li>is obscene, pornographic, paedophilic, invasive of another&apos;s privacy (including bodily privacy), insulting or harassing on the basis of gender, racially or ethnically objectionable, relates to or encourages money laundering or gambling, or promotes enmity between groups on the grounds of religion or caste with intent to incite violence;</li>
        <li>is harmful to children;</li>
        <li>infringes any patent, trademark, copyright or other proprietary right;</li>
        <li>deceives or misleads about its origin, or knowingly and intentionally communicates misinformation or information that is patently false or untrue;</li>
        <li>impersonates another person;</li>
        <li>threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign States, or public order, or incites any cognisable offence, or prevents the investigation of any offence, or insults another nation;</li>
        <li>contains software viruses or any other computer code, file or program designed to interrupt, destroy or limit the functionality of any computer resource;</li>
        <li>is patently false and untrue, and is written or published in any form with the intent to mislead or harass a person, entity or agency for financial gain or to cause injury to any person; or</li>
        <li>violates any law for the time being in force.</li>
      </ol>
      <p>You also must not:</p>
      <ul>
        <li>cheat on assessments, including sharing questions or answers, using another person to take a test, or using unauthorised tools during a timed exam;</li>
        <li>submit code that attempts to escape the code sandbox, attack our systems, mine cryptocurrency, or access other users&apos; data;</li>
        <li>scrape, copy or bulk-download course content, questions or other users&apos; data;</li>
        <li>probe, scan or test the vulnerability of the platform without our written permission, or overload it with automated requests;</li>
        <li>falsify academic records, placement offers or certificates.</li>
      </ul>
      <p>
        If you breach this section, we or your Institution may remove the content, suspend or terminate your
        access, and cancel affected scores or certificates. Where the law requires, we will preserve information
        and report it to the authorities.
      </p>

      <h2 id="content">4. Your content</h2>
      <p>
        You keep ownership of what you create: posts, comments, code, resume content and interview answers. You
        grant us a non-exclusive, royalty-free licence to host, store, display and process that content only as
        needed to run {LEGAL.product} for you and your Institution, for example to show your post to classmates
        or grade your code. This licence ends when the content is deleted, except for copies we must keep by law.
      </p>
      <p>
        Feed posts are visible to everyone in your college. Your public portfolio, if you turn it on, is visible
        to anyone on the internet.
      </p>

      <h2 id="takedown">5. Reporting content and takedown</h2>
      <p>
        To report content that breaches these Terms or the law, email us at the address in section 15. We
        will acknowledge your complaint within 24 hours and resolve it within 15 days. Complaints about content
        that exposes a person&apos;s private parts, shows them in full or partial nudity or in a sexual act, or
        is an impersonation in electronically altered form, will be acted on within 24 hours. We will remove or
        disable access to unlawful content within 36 hours of receiving a court order or a notice from an
        authorised government agency.
      </p>

      <h2 id="ip">6. Our intellectual property</h2>
      <p>
        The platform, its software, design, logos, courses, lessons, questions, assessments and other
        materials belong to {LEGAL.entity} or its licensors and are protected by the Copyright Act, 1957 and
        other laws. You receive a limited, personal, non-transferable licence to use them for your own
        preparation while your account is active. You may not copy, republish, sell or create derivative works
        from them.
      </p>

      <h2 id="ai">7. AI features</h2>
      <ul>
        <li>AI interview feedback, scores and study plans are generated automatically, are for practice only, and can be inaccurate or incomplete. Check important information yourself.</li>
        <li>AI output is not a guarantee of any interview result, job offer or placement.</li>
        <li>Do not enter sensitive personal information (such as health, financial or government ID details) into AI features.</li>
        <li>AI features may be limited by daily usage quotas, or switched off, at any time.</li>
      </ul>

      <h2 id="certificates">8. Certificates</h2>
      <p>
        Certificates confirm that you completed a {LEGAL.product} course or programme. They are not degrees or
        government-recognised qualifications unless expressly stated. Anyone can verify a certificate using its
        ID or QR code. We may revoke a certificate obtained through cheating or misuse.
      </p>

      <h2 id="third-party">9. Jobs and third-party links</h2>
      <p>
        Some job listings are gathered from third-party job boards. We do not employ you, act as a recruitment
        agency, guarantee any job, or verify every listing. Applications are made directly with the employer or
        site, under its own terms. Never pay anyone for a job offer. Report suspicious listings to us. Links to
        other websites, including coding platforms you connect, are provided for convenience and we are not
        responsible for them.
      </p>

      <h2 id="fees">10. Fees</h2>
      <p>
        {LEGAL.product} is free for students whose Institution has subscribed. Fees, if any, are agreed between
        the Institution and us, and refunds are governed by that agreement. We will never ask a student for
        payment without first publishing the price and the applicable refund terms.
      </p>

      <h2 id="availability">11. Availability and changes</h2>
      <p>
        We work to keep {LEGAL.product} available but do not promise uninterrupted or error-free service. We may
        add, change or remove features, and carry out maintenance. We will try to give reasonable notice of
        changes that significantly reduce the service.
      </p>

      <h2 id="termination">12. Suspension and termination</h2>
      <p>
        You may stop using {LEGAL.product} at any time and ask us to close your account by emailing{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. We or your Institution may suspend or
        end your access if you breach these Terms, if you leave the Institution, or if the Institution&apos;s
        agreement with us ends. What happens to your data afterwards is set out in the Privacy Policy. Sections 4,
        6, 13, 14 and 16 survive termination.
      </p>

      <h2 id="liability">13. Disclaimers and limitation of liability</h2>
      <p>
        {LEGAL.product} is provided &quot;as is&quot; and &quot;as available&quot;. To the extent permitted by
        law, we disclaim all implied warranties, including fitness for a particular purpose. We do not guarantee
        any placement, job, salary or exam result.
      </p>
      <p>
        To the extent permitted by law, we are not liable for indirect, incidental, special or consequential
        loss, or for loss of data, opportunity or profit. Our total liability to you for any claim relating to
        {" "}{LEGAL.product} is limited to INR 1,000 or the amount you paid us in the 12 months before the claim,
        whichever is higher. Nothing in these Terms limits liability that cannot be limited by law, including
        under the Consumer Protection Act, 2019, or for fraud or gross negligence.
      </p>

      <h2 id="indemnity">14. Indemnity</h2>
      <p>
        You agree to compensate us for reasonable losses and legal costs arising from content you post or from
        your breach of these Terms or the law, except to the extent the loss was caused by us.
      </p>

      <h2 id="contact">15. Contact us</h2>
      <p>For complaints about content, these Terms or your data, contact:</p>
      <ContactBlock />

      <h2 id="law">16. Changes, governing law and disputes</h2>
      <p>
        We may update these Terms. We will post the new version here and, for material changes, tell you in the
        app or by email before they take effect. If you keep using {LEGAL.product} after that, you accept the
        updated Terms. Where required, we will ask you to accept them again.
      </p>
      <p>
        These Terms are governed by the laws of India. Please contact us first so we can try to resolve any
        dispute informally within 30 days. Failing that, the courts at {LEGAL.jurisdiction} have exclusive
        jurisdiction, without affecting any right you have to approach a consumer commission or the Data
        Protection Board of India.
      </p>
      <p>
        If any part of these Terms is found unenforceable, the rest remains in force. Our failure to enforce a
        term is not a waiver of it.
      </p>
    </LegalPage>
  )
}

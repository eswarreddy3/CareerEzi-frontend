import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, LegalTable, ContactBlock } from "@/components/legal-page"
import { LEGAL } from "@/lib/legal"

export const metadata: Metadata = {
  title: `Privacy Policy | ${LEGAL.product}`,
  description: `How ${LEGAL.product} collects, uses, shares and protects your personal data.`,
}

// Keep this page in step with what the code actually does. If you add a data
// field, a third-party processor, or a new use of data, update the tables below.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      current="/privacy"
      summary={`${LEGAL.product} is a placement-preparation platform that colleges provide to their students. This notice explains what personal data we hold, why, who we share it with, how long we keep it, and how you can access, correct or erase it, or withdraw consent. It is issued under the Digital Personal Data Protection Act, 2023 ("DPDP Act"), the Digital Personal Data Protection Rules, 2025, and the Information Technology Act, 2000 and the rules made under it.`}
    >
      <h2 id="who">1. Who we are</h2>
      <p>
        {LEGAL.product} ({LEGAL.website}) is operated by {LEGAL.entity}, {LEGAL.address} (&quot;we&quot;, &quot;us&quot;).
        For the processing described here we are the <strong>Data Fiduciary</strong> under the DPDP Act.
      </p>
      <p>
        Your college (the &quot;Institution&quot;) creates your account and decides to use {LEGAL.product} for its
        training and placement activities. The Institution is separately responsible for the data it gives us
        and for how its own staff use the reports they can see on the platform. Where we act only on the
        Institution&apos;s instructions, we do so under a written agreement with it.
      </p>

      <h2 id="data">2. Personal data we collect</h2>
      <h3>2.1 Provided by your Institution when your account is created</h3>
      <ul>
        <li>Name, college email address, college, branch, section, roll number and year of passing out.</li>
        <li>
          Academic record used for placement eligibility: 10th and 12th percentage, CGPA, active backlogs,
          backlog history, gap years, placement status, admission category, and an emergency contact.
        </li>
      </ul>
      <h3>2.2 Provided by you</h3>
      <ul>
        <li>Password (stored only as a one-way bcrypt hash; we cannot read it).</li>
        <li>Optional profile details: phone number, date of birth, gender, profile picture (an uploaded photo is cropped and stored at 400&times;400 pixels), LinkedIn and GitHub links, and a public username.</li>
        <li>
          Career Profile content: headline, about text, location, whether you are open to work, personal website,
          languages, strengths and hobbies; education (institution, board or university, course, dates and score);
          projects (description, links, skills, team size and role, dates); internships and work experience;
          skills; achievements; and certificates from other providers. Each item can be shown on or hidden from your
          public portfolio, and education scores have their own show/hide setting.
        </li>
        <li>Public portfolio design choices (layout, colour, font, section order and visibility) and, if you upload one, a cover banner image (cropped and stored at 1600&times;400 pixels; replaced or deleted when you change it).</li>
        <li>Resume Builder settings: the template, your career objective, which Career Profile items to include and in what order, any wording you change for a resume only, and items you add to a resume only. Your existing resume content is copied into your Career Profile the first time you open it, hidden from your public portfolio until you choose to show it.</li>
        <li>Usernames for coding platforms you choose to connect (GitHub, LeetCode, HackerRank).</li>
        <li>Posts, comments and likes on your college feed; feedback you send us; off-campus offers and profile-correction requests you submit to your Institution; placement-drive registrations.</li>
        <li>Messages sent through the contact form on our website (name, email, phone, message), including from people who do not have an account.</li>
      </ul>
      <h3>2.3 Created as you use the platform</h3>
      <ul>
        <li>Lesson progress, quiz (MCQ), assignment and aptitude attempts and scores, coding submissions and results, certificates earned.</li>
        <li>Points, streaks, level, leaderboard rank and active-time statistics.</li>
        <li>
          AI features (&quot;Saarthi&quot;): job descriptions you paste into the resume ATS check, mock-interview transcripts, interview reports and scores, and
          personalised study plans, together with usage records (feature used, time, token count).
        </li>
        <li>Technical data: IP address, browser and device type, log-in times and security logs.</li>
      </ul>
      <h3>2.4 What we do not collect</h3>
      <ul>
        <li>
          <strong>Camera:</strong> in the AI interview room the camera is a self-view on your own screen only.
          No video or image is sent to or stored by us.
        </li>
        <li>
          <strong>Microphone:</strong> voice answers are converted to text by your web browser&apos;s built-in
          speech-recognition feature, and only the text reaches us. Depending on your browser, the browser
          vendor (for example Google for Chrome or Microsoft for Edge) may process the audio on its own servers
          under its own privacy policy. If you prefer, type your answers instead.
        </li>
        <li>We do not collect payment card or bank details. Fees, where charged, are paid by Institutions under a separate contract.</li>
        <li>We do not sell personal data and do not use it for third-party advertising.</li>
      </ul>

      <h2 id="purposes">3. Why we use your data</h2>
      <LegalTable>
        <table>
          <thead><tr><th>Purpose</th><th>Data used</th><th>Legal basis (DPDP Act)</th></tr></thead>
          <tbody>
            <tr><td>Creating and securing your account, sign-in, password reset</td><td>Identity, email, password hash, technical data</td><td>Consent; legitimate use (s.7) for security</td></tr>
            <tr><td>Delivering courses, practice, assessments, coding and certificates</td><td>Account, learning and assessment data</td><td>Consent</td></tr>
            <tr><td>Placement drives, eligibility checks and placement reports for your Institution</td><td>Academic record, profile, drive registrations, offers</td><td>Consent; data provided voluntarily for this purpose (s.7(a))</td></tr>
            <tr><td>Leaderboards, college feed and gamification within your college</td><td>Name, avatar, points, streaks, posts</td><td>Consent</td></tr>
            <tr><td>AI mock interviews and study plans</td><td>Your answers, course and assessment progress</td><td>Consent (only when you start the feature)</td></tr>
            <tr><td>Public portfolio and certificate verification</td><td>Only the fields you choose to show</td><td>Consent (off by default)</td></tr>
            <tr><td>Service emails (activation, reset, reminders)</td><td>Name, email, notification preferences</td><td>Consent; you can turn reminders off in Profile → Settings</td></tr>
            <tr><td>Answering enquiries</td><td>Contact-form details</td><td>Consent</td></tr>
            <tr><td>Improving the service, fraud and abuse prevention, legal compliance</td><td>Usage and technical data</td><td>Legitimate uses (s.7); compliance with law</td></tr>
          </tbody>
        </table>
      </LegalTable>
      <p>We use automated scoring to grade assessments and AI to give interview feedback. These are practice aids; they are not used to make placement or hiring decisions about you without human review by your Institution.</p>

      <h2 id="sharing">4. Who we share data with</h2>
      <ul>
        <li><strong>Your Institution</strong> — its authorised administrators see your profile, academic record, progress, scores, placement activity and reports so they can run training and placements.</li>
        <li><strong>Other students in your college</strong> — see your name, avatar, leaderboard position and anything you post on the college feed.</li>
        <li><strong>The public</strong> — only if you switch on your public portfolio, and only what it displays. Certificates can be verified by anyone who has the certificate ID or QR code.</li>
        <li><strong>Recruiters</strong> — only when your Institution shares your details for a placement drive you registered for.</li>
      </ul>
      <p>We use the following service providers (Data Processors), bound by contract to use the data only to provide their service to us:</p>
      <LegalTable>
        <table>
          <thead><tr><th>Provider</th><th>Purpose</th><th>Data</th><th>Location</th></tr></thead>
          <tbody>
            <tr><td>Cloud hosting (Amazon Web Services; Vercel)</td><td>Running our servers, database and website</td><td>All platform data</td><td>India and/or outside India, depending on the hosting region</td></tr>
            <tr><td>OpenAI</td><td>AI interviews, study plans and the resume ATS check (job match and &ldquo;Improve with AI&rdquo;)</td><td>Interview answers, your first name and learning progress; for the resume tools, the job description you paste and your resume content (education, skills, projects, experience). Your name, email, phone and links are not sent with resume content</td><td>USA</td></tr>
            <tr><td>Brevo</td><td>Sending emails</td><td>Name and email address</td><td>EU</td></tr>
            <tr><td>Google Analytics; Vercel Analytics</td><td>Website usage statistics</td><td>Pages viewed, device and approximate location (see the <Link href="/cookies">Cookie Policy</Link>)</td><td>USA</td></tr>
            <tr><td>GitHub, LeetCode, HackerRank</td><td>Fetching your public coding statistics</td><td>Only the username you connect</td><td>USA / various</td></tr>
          </tbody>
        </table>
      </LegalTable>
      <p>
        We may also disclose data where required by law, court order or a lawful request from a government
        authority, or to protect the rights and safety of users. If our business is merged or transferred,
        your data may move to the successor, which will be bound by this policy.
      </p>

      <h2 id="transfers">5. Transfers outside India</h2>
      <p>
        Some of our providers store or process data outside India, as listed above. Section 16 of the DPDP Act
        permits this except to countries the Central Government restricts by notification; we will stop or
        relocate any transfer that becomes restricted. We choose providers that apply security safeguards at
        least as strong as those described in section 7.
      </p>

      <h2 id="retention">6. How long we keep data</h2>
      <ul>
        <li><strong>Account and learning data</strong> — while your account is active, and for up to 12 months after your Institution&apos;s contract ends or your account is deactivated, so that you can still obtain certificates and records. It is then erased or anonymised.</li>
        <li><strong>Certificate records</strong> — the ID, name, course and date are kept for as long as verification is offered, so third parties can confirm a genuine certificate.</li>
        <li><strong>AI interview transcripts</strong> — for as long as the account data above, or until you ask us to erase them (section 8).</li>
        <li><strong>Contact-form messages</strong> — up to 12 months after the enquiry is closed.</li>
        <li><strong>Security and access logs</strong> — at least one year, as required by the DPDP Rules, 2025, and then deleted.</li>
        <li>Data we are required to keep by law (for example, for tax or a legal dispute) is kept only for the period the law requires.</li>
      </ul>

      <h2 id="security">7. How we protect data</h2>
      <p>
        We follow reasonable security practices as required by section 8(5) of the DPDP Act and the IT
        (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011,
        including encryption in transit (HTTPS), hashed passwords, role-based access controls so that each
        Institution can see only its own students, short-lived access tokens, rate limiting and access logging.
        No system is perfectly secure. If a personal data breach occurs, we will inform affected users and the
        Data Protection Board of India without delay, as the DPDP Rules require, and report to CERT-In where
        applicable.
      </p>

      <h2 id="rights">8. Your rights</h2>
      <p>Under the DPDP Act you can:</p>
      <ul>
        <li><strong>Access</strong> a summary of the personal data we hold about you and how it is used, and the identities of those we have shared it with.</li>
        <li><strong>Correct or update</strong> inaccurate or incomplete data. You can edit most profile fields yourself; academic fields set by your Institution can be changed through a profile-correction request in the app.</li>
        <li><strong>Erase</strong> data that is no longer needed for its purpose, unless the law requires us to keep it.</li>
        <li><strong>Withdraw consent</strong> at any time, as easily as you gave it. Withdrawal does not affect processing already done. Some features, or the account itself, may stop working without the data they need.</li>
        <li><strong>Nominate</strong> another person to exercise your rights if you die or become incapable.</li>
        <li><strong>Raise a grievance</strong> with us, and then, if you are not satisfied, complain to the Data Protection Board of India.</li>
      </ul>
      <p>
        To exercise any right, email <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> from your
        registered email address. We may need to confirm your identity. We will respond within 90 days at most,
        and usually much sooner. If your Institution holds the data in its own systems, we will help you raise
        the request with it.
      </p>

      <h2 id="children">9. Children</h2>
      <p>
        {LEGAL.product} is intended for college students aged 18 and over. If you are under 18, you may use it
        only with the verifiable consent of a parent or lawful guardian, obtained through your Institution as
        section 9 of the DPDP Act requires. We do not track the behaviour of, or target advertising to, users
        under 18. If we learn that we hold a minor&apos;s data without valid consent, we will delete it.
      </p>

      <h2 id="changes">10. Changes to this policy</h2>
      <p>
        We will update this page when our practices change and revise the &quot;Last updated&quot; date. For
        material changes, we will notify you in the app or by email and, where the law requires, ask for your
        consent again before the change applies to you.
      </p>

      <h2 id="contact">11. Contact us</h2>
      <p>For questions or complaints about this policy or how we handle your data, contact:</p>
      <ContactBlock />
      <p>
        We acknowledge complaints within 24 hours and aim to resolve them within 15 days. If you are not
        satisfied with our response, you may complain to the Data Protection Board of India.
      </p>
    </LegalPage>
  )
}

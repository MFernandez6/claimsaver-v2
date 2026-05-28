import Link from "next/link";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of the ClaimSaver+ guided PIP claim platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: May 27, 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-20 prose prose-slate dark:prose-invert prose-headings:font-semibold">
        <h2>1. Acceptance</h2>
        <p>
          By accessing or using ClaimSaver+, you agree to these Terms of
          Service. If you do not agree, do not use the platform.
        </p>

        <h2>2. Description of service</h2>
        <p>
          ClaimSaver+ is a <strong>guided claim technology platform</strong> for
          Florida motor vehicle no-fault (PIP) claims. We provide software:
          digital worksheets, document storage, reminders, and educational
          content.
        </p>
        <p>
          <strong>
            We are not a law firm and do not provide legal advice, representation,
            or negotiation with insurers on your behalf.
          </strong>{" "}
          You prepare and submit your own claim materials. For legal advice about
          your specific situation, consult a licensed Florida attorney.
        </p>

        <h2>3. Unauthorized practice of law (UPL)</h2>
        <p>
          Nothing on the platform creates an attorney-client relationship.
          Checklists, field prompts, and articles are general education—not
          recommendations about what you should do in your case. You remain
          responsible for filings, deadlines, and communications with your
          insurer.
        </p>

        <h2>4. Account responsibilities</h2>
        <ul>
          <li>Provide accurate account information</li>
          <li>Keep credentials confidential; enable MFA when available</li>
          <li>
            Do not upload unlawful content or material you lack rights to share
          </li>
          <li>
            You certify that information you enter in claim forms is truthful to
            the best of your knowledge
          </li>
        </ul>

        <h2>5. Fees and payment</h2>
        <p>
          Platform access is offered for a flat fee (currently{" "}
          <strong>$500</strong> unless stated otherwise at checkout) processed
          through Stripe. Optional add-ons such as online notarization, if
          offered, are separate purchases with their own terms. Fees cover
          software access—not legal services or guaranteed claim outcomes.
        </p>

        <h2>6. Acceptable use</h2>
        <p>
          You may not attempt to breach security, scrape other users&apos; data,
          reverse engineer the service, or use the platform for fraudulent
          claims. We may suspend or terminate accounts that violate these terms
          or applicable law.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          The platform is provided &quot;as is&quot; without warranties of
          merchantability, fitness for a particular purpose, or non-infringement.
          We do not guarantee that insurers will accept submissions, pay
          benefits, or that deadlines will be met if you do not monitor them.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, ClaimSaver+ and its operators
          are not liable for indirect, incidental, special, consequential, or
          punitive damages, or for lost profits arising from use of the platform.
          Our aggregate liability for direct damages is limited to the amount you
          paid for platform access in the twelve months before the claim.
        </p>

        <h2>9. Privacy</h2>
        <p>
          Our collection and use of personal information is described in the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/data-handling">Data handling</Link> pages.
        </p>

        <h2>10. Changes and termination</h2>
        <p>
          We may update these terms by posting a revised version with a new
          &quot;Last updated&quot; date. Continued use after changes constitutes
          acceptance. You may close your account at any time; we may terminate
          access for violations.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <ObfuscatedSupportEmail className="text-teal-700 dark:text-teal-400 font-medium" />
        </p>
      </article>
    </div>
  );
}

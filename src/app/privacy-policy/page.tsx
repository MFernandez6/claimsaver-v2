import Link from "next/link";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How ClaimSaver+ collects, uses, stores, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: May 27, 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-20 prose prose-slate dark:prose-invert prose-headings:font-semibold">
        <h2>1. Information we collect</h2>
        <p>
          We collect information you provide when you create an account, complete
          guided claim forms, upload documents, pay for platform access, or
          contact support. This may include:
        </p>
        <ul>
          <li>
            Account identifiers (name, email address, phone number if provided)
          </li>
          <li>Claim worksheet answers and metadata you enter</li>
          <li>
            Documents you upload (medical records, police reports, insurance
            correspondence, photos, and similar files)
          </li>
          <li>
            Payment-related identifiers processed by Stripe (we do not store
            full card numbers on our servers)
          </li>
          <li>Support correspondence and platform usage logs</li>
        </ul>

        <h2>2. How we use your information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide, maintain, and improve the ClaimSaver+ platform</li>
          <li>
            Store and display information you enter for your own claim
            organization
          </li>
          <li>
            Process payments for platform access through Stripe&apos;s secure
            checkout
          </li>
          <li>
            Send transactional emails (account confirmation, password reset,
            billing receipts)
          </li>
          <li>Respond to support requests and comply with legal obligations</li>
        </ul>
        <p>
          ClaimSaver+ is software—not a law firm. We do not use your information
          to negotiate with insurers on your behalf or provide legal advice.
        </p>

        <h2>3. Storage and security</h2>
        <p>
          Structured account and claim data is stored in{" "}
          <strong>Supabase Postgres</strong> (hosted in the United States).
          Uploaded files are stored in a private Supabase Storage bucket with
          access controls tied to your account. Data is encrypted in transit
          (TLS) and at rest (AES-256) as described on our{" "}
          <Link href="/data-handling">Data handling</Link> page.
        </p>
        <p>
          Authentication is handled by Supabase Auth. We encourage you to enable
          multi-factor authentication in{" "}
          <Link href="/account/security">Account security</Link>.
        </p>

        <h2>4. Sharing</h2>
        <p>
          We do not sell your personal information. We share data only with
          service providers that help operate the platform (for example Supabase
          for database/storage/auth, Stripe for payments, and email delivery
          providers), when required by law, or with your direction (such as when
          you export or share documents you control).
        </p>

        <h2>5. Retention and deletion</h2>
        <p>
          We retain account and claim data while your account is active and as
          needed to provide the service, resolve disputes, and meet legal
          obligations. You may request deletion of your account and associated
          data by emailing{" "}
          <ObfuscatedSupportEmail className="text-teal-700 dark:text-teal-400 font-medium" />
          . We will verify your identity before processing deletion requests.
        </p>

        <h2>6. Your choices</h2>
        <ul>
          <li>Update account information through your dashboard</li>
          <li>Export or download documents you uploaded</li>
          <li>Opt out of non-essential marketing emails (we send few, if any)</li>
          <li>Enable MFA for stronger account protection</li>
        </ul>

        <h2>7. Contact</h2>
        <p>
          Questions about this Privacy Policy:{" "}
          <ObfuscatedSupportEmail className="text-teal-700 dark:text-teal-400 font-medium" />
        </p>
        <p className="text-sm text-gray-500 not-prose">
          This policy is for general informational purposes and does not
          constitute legal advice.
        </p>
      </article>
    </div>
  );
}

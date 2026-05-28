import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import {
  getLearningArticleParagraphs,
  type ArticleKey,
} from "@/data/learningCenter";
import { SLUG_TO_ARTICLE } from "@/data/learningCenter/slugs";
import { getPublicSiteUrl } from "@/lib/site-url";

const ARTICLE_META: Record<
  ArticleKey,
  { title: string; summary: string; faqQuestion: string }
> = {
  pipSteps: {
    title: "How to file a PIP claim in Florida (overview)",
    summary:
      "A high-level look at forms, documentation, and timelines—educational only.",
    faqQuestion: "How do I file a PIP claim in Florida?",
  },
  fourteenDay: {
    title: "The 14-day rule and PIP",
    summary:
      "Why the initial treatment window matters in many Florida PIP matters (general information).",
    faqQuestion: "What is Florida's PIP 14-day rule?",
  },
  needLawyer: {
    title: "Do you need an attorney for every PIP claim?",
    summary:
      "When guided tools may be enough—and when to call a licensed attorney.",
    faqQuestion: "Do I need an attorney for a Florida PIP claim?",
  },
  documents: {
    title: "Documents often used in no-fault claims",
    summary:
      "Checklists and organization tips—not a determination of what you must submit.",
    faqQuestion: "What documents do I need for a Florida PIP claim?",
  },
  mistakes: {
    title: "Common mistakes that complicate claims",
    summary: "Practical tips to stay organized and complete.",
    faqQuestion: "What are common PIP claim mistakes in Florida?",
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_ARTICLE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const key = SLUG_TO_ARTICLE[slug];
  if (!key) return { title: "Article" };
  const meta = ARTICLE_META[key];
  const url = `${getPublicSiteUrl()}/learning-center/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: { title: meta.title, description: meta.summary, url },
  };
}

export default async function LearningCenterArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const key = SLUG_TO_ARTICLE[slug];
  if (!key) notFound();

  const meta = ARTICLE_META[key];
  const paragraphs = getLearningArticleParagraphs("en", key);
  const faqAnswer = paragraphs.slice(0, 3).join("\n\n");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: meta.faqQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswer,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative overflow-hidden pt-28 pb-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <Link
            href="/learning-center"
            className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            ← Learning Center
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {meta.title}
          </h1>
          <p className="mt-3 text-lg text-teal-700 dark:text-teal-300 font-medium">
            {meta.summary}
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-16 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <p className="text-xs text-gray-500 dark:text-gray-400 italic pt-6 border-t border-gray-200 dark:border-gray-800">
          This content is for general educational purposes. ClaimSaver+ is a
          guided claim platform and does not provide legal advice.
        </p>
        <p className="text-sm pt-4">
          <Link
            href="/when-to-call-an-attorney"
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Wondering when to call an attorney? →
          </Link>
        </p>
      </article>
    </div>
  );
}

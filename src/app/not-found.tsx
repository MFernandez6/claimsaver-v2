"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <html lang="en">
      <head>
        <title>{t("notFound.title")}</title>
        <meta name="description" content={t("notFound.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(to bottom, #ffffff, #eff6ff);
          }
          
          @media (prefers-color-scheme: dark) {
            body {
              color: #d1d5db;
              background: linear-gradient(to bottom, #111827, #1e3a8a);
            }
          }
          
          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          
          .content {
            max-width: 28rem;
            margin: 0 auto;
            text-align: center;
          }
          
          .title {
            font-size: 6rem;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 1rem;
          }
          
          .subtitle {
            font-size: 1.5rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 1rem;
          }
          
          @media (prefers-color-scheme: dark) {
            .subtitle {
              color: #ffffff;
            }
          }
          
          .description {
            color: #6b7280;
            margin-bottom: 2rem;
          }
          
          @media (prefers-color-scheme: dark) {
            .description {
              color: #9ca3af;
            }
          }
          
          .button-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 0.375rem;
            text-decoration: none;
            transition: all 0.2s;
            border: 1px solid transparent;
          }
          
          .button-primary {
            color: white;
            background-color: #2563eb;
            border-color: transparent;
          }
          
          .button-primary:hover {
            background-color: #1d4ed8;
          }
          
          .button-secondary {
            color: #374151;
            background-color: white;
            border-color: #d1d5db;
          }
          
          .button-secondary:hover {
            background-color: #f9fafb;
          }
          
          @media (prefers-color-scheme: dark) {
            .button-secondary {
              color: #d1d5db;
              background-color: #374151;
              border-color: #4b5563;
            }
            
            .button-secondary:hover {
              background-color: #4b5563;
            }
          }
          
          .icon {
            width: 1rem;
            height: 1rem;
            margin-right: 0.5rem;
          }
          
          @media (min-width: 640px) {
            .button-group {
              flex-direction: row;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="content">
            <div className="mb-8">
              <h1 className="title">404</h1>
              <h2 className="subtitle">{t("notFound.subtitle")}</h2>
              <p className="description">{t("notFound.message")}</p>
            </div>

            <div className="button-group">
              <Link href="/" className="button button-primary">
                <Home className="icon" />
                {t("notFound.goHome")}
              </Link>

              <Link href="/who-we-are" className="button button-secondary">
                <ArrowLeft className="icon" />
                {t("notFound.learnAboutUs")}
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

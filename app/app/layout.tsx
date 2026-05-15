import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Structurly — AI Content Structurer",
  description:
    "Paste messy AI question-and-answer content. Get a clean, structured, interactive workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (t === 'dark' || (!t && sys)) document.documentElement.classList.add('dark');
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

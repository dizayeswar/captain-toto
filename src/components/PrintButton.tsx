"use client";

/**
 * Blanks document.title for print and reminds the user about dialog settings
 * that otherwise leave blank space (Custom scale / Custom margins).
 */
export default function PrintButton() {
  function handlePrint() {
    const ok = window.confirm(
      "Before the print window opens, set these in the print dialog:\n\n" +
        "1) Margins → Default or None  (NOT Custom)\n" +
        "2) Scale → Default  (NOT 98% / Custom)\n" +
        "3) Headers and footers → Off\n\n" +
        "Custom Scale is what creates the empty space at the top and bottom.\n\n" +
        "Click OK to open print."
    );
    if (!ok) return;

    const previousTitle = document.title;
    document.title = " ";

    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.setTimeout(restore, 60_000);

    window.print();
  }

  return (
    <div className="no-print flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 14h12v8H6z" />
        </svg>
        Print / Save as PDF
      </button>
      <p className="max-w-xs text-right text-[11px] leading-snug text-slate-500">
        Scale must be <span className="font-semibold">Default</span> — Custom
        98% leaves blank space above and below.
      </p>
    </div>
  );
}

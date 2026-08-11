"use client";

/**
 * Browser print headers/footers (date, title, URL, page numbers) cannot be
 * fully removed from CSS. We blank the document title so "Captain ToTo —
 * Booking System" does not appear, and remind the user to disable Headers
 * and footers in the print dialog for date / URL / page numbers.
 */
export default function PrintButton() {
  function handlePrint() {
    const previousTitle = document.title;
    document.title = " ";

    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    // Fallback if afterprint does not fire (some browsers / PDF destinations).
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
        In the print dialog → More settings → turn off{" "}
        <span className="font-semibold">Headers and footers</span> to hide
        date, page title, URL and page numbers.
      </p>
    </div>
  );
}

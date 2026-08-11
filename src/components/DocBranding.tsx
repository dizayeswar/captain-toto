import Image from "next/image";
import { COMPANY } from "@/lib/company";

/** Branded letterhead header used at the top of printed documents. */
export function DocLetterhead({
  title,
  compact = false,
}: {
  title: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b-2 border-brand ${
        compact ? "pb-3" : "pb-5"
      }`}
    >
      <div className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
        <Image
          src={COMPANY.logo}
          alt={COMPANY.name}
          width={compact ? 56 : 72}
          height={compact ? 56 : 72}
          priority
          className={compact ? "h-12 w-12 shrink-0" : "h-16 w-16 shrink-0"}
        />
        <div>
          <p
            className={`font-extrabold tracking-wide text-brand ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {COMPANY.name}
          </p>
          <p
            className={`font-medium text-accent ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {COMPANY.tagline}
          </p>
          <p
            className={`mt-0.5 leading-relaxed text-slate-500 ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            {COMPANY.phone} · {COMPANY.email}
            <br />
            {COMPANY.address}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold uppercase tracking-wide text-slate-900 ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

/** Branded footer used at the bottom of printed documents. */
export function DocFooter({
  disclaimer,
  compact = false,
}: {
  disclaimer: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`border-t-2 border-brand text-center ${
        compact ? "mt-0 pt-3" : "mt-8 pt-4"
      }`}
    >
      <p
        className={`font-semibold text-accent ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {COMPANY.slogan}
      </p>
      <p
        className={`mx-auto mt-1 max-w-2xl leading-relaxed text-slate-500 ${
          compact ? "text-[10px]" : "text-[11px]"
        }`}
      >
        {disclaimer}
      </p>
      <p
        className={`mt-1 font-medium text-brand ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        {COMPANY.website}
      </p>
    </div>
  );
}

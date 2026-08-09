import Image from "next/image";
import { COMPANY } from "@/lib/company";

/** Branded letterhead header used at the top of printed documents. */
export function DocLetterhead({ title }: { title: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-2 border-brand pb-5">
      <div className="flex items-center gap-4">
        <Image
          src={COMPANY.logo}
          alt={COMPANY.name}
          width={72}
          height={72}
          priority
          className="h-16 w-16 shrink-0"
        />
        <div>
          <p className="text-lg font-extrabold tracking-wide text-brand">
            {COMPANY.name}
          </p>
          <p className="text-sm font-medium text-accent">{COMPANY.tagline}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {COMPANY.phone} · {COMPANY.email}
            <br />
            {COMPANY.address}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold uppercase tracking-wide text-slate-900">
          {title}
        </p>
      </div>
    </div>
  );
}

/** Branded footer used at the bottom of printed documents. */
export function DocFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <div className="mt-8 border-t-2 border-brand pt-4 text-center">
      <p className="text-sm font-semibold text-accent">{COMPANY.slogan}</p>
      <p className="mx-auto mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
        {disclaimer}
      </p>
      <p className="mt-1 text-xs font-medium text-brand">{COMPANY.website}</p>
    </div>
  );
}

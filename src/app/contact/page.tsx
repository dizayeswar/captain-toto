import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Captain Toto Travel",
  description: "Get in touch with the Captain Toto travel team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900">Get in touch</h1>
      <p className="mt-2 text-slate-500">
        Have a question or want a custom itinerary? We&apos;d love to hear from
        you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          {[
            { icon: "📧", label: "Email", value: "hello@captaintoto.com" },
            { icon: "📞", label: "Phone", value: "+964 750 000 0000" },
            {
              icon: "📍",
              label: "Office",
              value: "Erbil, Kurdistan Region, Iraq",
            },
            { icon: "🕘", label: "Hours", value: "Sat–Thu, 9:00 – 18:00" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-xl">
                {c.icon}
              </span>
              <div>
                <div className="text-sm text-slate-500">{c.label}</div>
                <div className="font-semibold text-slate-900">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Send a message</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill the form and our team will reply within 24 hours.
          </p>
          <form
            action="mailto:hello@captaintoto.com"
            method="post"
            encType="text/plain"
            className="mt-5 space-y-4"
          >
            <input
              name="name"
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="How can we help?"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

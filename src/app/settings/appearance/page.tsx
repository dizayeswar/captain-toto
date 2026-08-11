import { PageHeader, Card } from "@/components/ui";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppearanceSettingsPage() {
  return (
    <>
      <PageHeader
        title="Appearance"
        subtitle="Choose light or dark mode for the booking system"
      />
      <div className="mx-auto max-w-lg px-8 py-8">
        <Card className="p-6">
          <ThemeToggle />
        </Card>
      </div>
    </>
  );
}

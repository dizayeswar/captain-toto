import { requireUser } from "@/lib/auth";
import { PageHeader, Card } from "@/components/ui";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  await requireUser();

  return (
    <>
      <PageHeader
        title="Change password"
        subtitle="Update the password for your signed-in account"
      />
      <div className="mx-auto max-w-lg px-8 py-8">
        <Card className="p-6">
          <ChangePasswordForm />
        </Card>
      </div>
    </>
  );
}

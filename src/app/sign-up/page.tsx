import { redirect } from "next/navigation";

import { signUpAction } from "@/app/actions";
import { AuthCard } from "@/components/auth-card";
import { getCurrentUser } from "@/lib/auth";

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) {
    if (user.passwordChangeRequired) {
      redirect("/reset-password");
    }
    redirect("/workspace");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#2a2d34_0%,#15181d_45%,#0f1114_100%)] p-4">
      <AuthCard
        title="Create Account"
        description="Choose Manager or Member during signup."
        submitLabel="Create Account"
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerHref="/sign-in"
        action={signUpAction}
        showNameFields
        showRoleSelect
      />
    </main>
  );
}

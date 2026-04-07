import { redirect } from "next/navigation";

import { resetPasswordAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireUserForPasswordReset } from "@/lib/auth";

export default async function ResetPasswordPage() {
  const user = await requireUserForPasswordReset();

  if (!user.passwordChangeRequired) {
    redirect("/workspace");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#2a2d34_0%,#15181d_45%,#0f1114_100%)] p-4">
      <Card className="w-full max-w-md border-border/80 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>
            Your account uses a temporary password. Set a new password before continuing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={resetPasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nextPassword">New Password</Label>
              <Input id="nextPassword" name="nextPassword" type="password" required minLength={8} autoFocus />
            </div>
            <Button className="w-full" type="submit">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

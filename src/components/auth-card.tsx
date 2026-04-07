import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthCardProps = {
  title: string;
  description: string;
  submitLabel: string;
  footerText: string;
  footerLinkText: string;
  footerHref: Route;
  action: (formData: FormData) => Promise<void>;
  showNameFields?: boolean;
  showRoleSelect?: boolean;
};

export function AuthCard({
  title,
  description,
  submitLabel,
  footerText,
  footerLinkText,
  footerHref,
  action,
  showNameFields = false,
  showRoleSelect = false,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-border/80 bg-card/95 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {showNameFields ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required placeholder="Doe" />
              </div>
            </div>
          ) : null}
          {showRoleSelect ? (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                defaultValue="MEMBER"
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="MEMBER">Member</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} placeholder="••••••••" />
          </div>
          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {footerText} <Link href={footerHref} className="text-primary hover:underline">{footerLinkText}</Link>
        </p>
      </CardContent>
    </Card>
  );
}

import "server-only";

import type { User } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

type ApiUserAuthResult =
  | { user: User; response: null }
  | { user: null; response: NextResponse<{ error: string }> };

export async function requireApiUser(): Promise<ApiUserAuthResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }

  if (user.passwordChangeRequired) {
    return { response: NextResponse.json({ error: "Password reset required" }, { status: 403 }), user: null };
  }

  return { user, response: null };
}

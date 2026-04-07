import { NextRequest, NextResponse } from "next/server";
import { TaskStatus } from "@prisma/client";

import { requireApiUser } from "@/lib/api-auth";
import { canManageProject } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await context.params;

  const { user, response } = await requireApiUser();
  if (response) {
    return response;
  }

  const body = (await request.json()) as { status?: TaskStatus; projectId?: string };
  if (!body.status || !body.projectId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const statusAllowed = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE].includes(body.status);
  if (!statusAllowed) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const canManage = await canManageProject(user.id, body.projectId);
  if (!canManage) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status: body.status },
  });

  await prisma.taskComment.create({
    data: {
      taskId: task.id,
      userId: user.id,
      type: "ACTIVITY",
      content: `Status updated to ${task.status}`,
    },
  });

  const latestActivity = await prisma.taskComment.findFirst({
    where: {
      taskId: task.id,
      userId: user.id,
      type: "ACTIVITY",
      content: `Status updated to ${task.status}`,
    },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  });

  return NextResponse.json({
    ok: true,
    activity: latestActivity
      ? {
          id: latestActivity.id,
          type: latestActivity.type,
          content: latestActivity.content,
          createdAt: latestActivity.createdAt.toISOString(),
          userEmail: latestActivity.user.email,
        }
      : null,
  });
}

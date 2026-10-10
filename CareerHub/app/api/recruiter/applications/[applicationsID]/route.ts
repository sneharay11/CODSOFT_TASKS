
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "SELECTED",
] as const;

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "RECRUITER") {
      return NextResponse.json(
        { error: "Recruiter access required." },
        { status: 403 }
      );
    }

    const recruiterId = Number(session.user.id);

    // Read the application ID from the URL.
    const url = new URL(request.url);
const match = url.pathname.match(
  /\/api\/recruiter\/applications\/(\d+)\/?$/
);

if (!match) {
  return NextResponse.json(
    { error: "Application ID missing from URL." },
    { status: 400 }
  );
}

const applicationId = Number(match[1]);
    if (
      !Number.isInteger(recruiterId) ||
      recruiterId <= 0 ||
      !Number.isInteger(applicationId) ||
      applicationId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid ID.",
          recruiterId,
          applicationId: Number.isFinite(applicationId) ? applicationId : null,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const newStatus = body.status;

    if (
      typeof newStatus !== "string" ||
      !allowedStatuses.includes(
        newStatus as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid application status." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: { recruiterId },
      },
      select: { id: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found for your jobs." },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus as (typeof allowedStatuses)[number],
      },
    });

    return NextResponse.json({
      message: "Application status updated successfully!",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Status update failed:", error);
    return NextResponse.json(
      { error: "Could not update application status." },
      { status: 500 }
    );
  }
}

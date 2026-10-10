
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to view your applications." },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user session." },
        { status: 401 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
            salary: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Fetching applications failed:", error);

    return NextResponse.json(
      { error: "Could not load applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in before applying." },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user session." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const resumeUrl = String(body.resumeUrl ?? "").trim();
    const coverLetter = String(body.coverLetter ?? "").trim();
    const jobId = Number(body.jobId);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return NextResponse.json(
        { error: "Please select a valid job." },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
      },
    });

    return NextResponse.json(
      {
        message: "Application saved successfully!",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application request failed:", error);

    return NextResponse.json(
      { error: "Could not process your application. You may have already applied for this job." },
      { status: 400 }
    );
  }
}

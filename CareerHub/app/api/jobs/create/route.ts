
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "RECRUITER") {
      return NextResponse.json(
        { error: "Only recruiters can post jobs." },
        { status: 403 }
      );
    }

    const recruiterId = Number(session.user.id);

    if (!Number.isInteger(recruiterId) || recruiterId <= 0) {
      return NextResponse.json(
        { error: "Invalid recruiter account." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const company = String(body.company ?? "").trim();
    const location = String(body.location ?? "").trim();
    const jobType = String(body.jobType ?? "").trim();
    const salary = String(body.salary ?? "").trim();
    const description = String(body.description ?? "").trim();
    const requirements = String(body.requirements ?? "").trim();

    if (
      !title ||
      !company ||
      !location ||
      !jobType ||
      !salary ||
      !description ||
      !requirements
    ) {
      return NextResponse.json(
        { error: "Please fill in all job fields." },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        jobType,
        salary,
        description,
        requirements,
        recruiterId,
      },
    });

    return NextResponse.json(
      { message: "Job posted successfully!", job },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job creation failed:", error);

    return NextResponse.json(
      { error: "Could not create job. Please try again." },
      { status: 500 }
    );
  }
}

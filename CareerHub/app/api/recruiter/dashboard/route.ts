
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "RECRUITER") {
      return NextResponse.json(
        { error: "Recruiter access required." },
        { status: 403 }
      );
    }

    const recruiterId = Number(session.user.id);

    if (!Number.isInteger(recruiterId) || recruiterId <= 0) {
      return NextResponse.json(
        { error: "Invalid recruiter session." },
        { status: 401 }
      );
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Recruiter dashboard error:", error);

    return NextResponse.json(
      { error: "Unable to load recruiter dashboard." },
      { status: 500 }
    );
  }
}

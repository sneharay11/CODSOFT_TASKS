import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const students = await prisma.student.findMany();

    return NextResponse.json(students);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Received student:", body);

    const student = await prisma.student.create({
      data: {
        name: body.name,
        usn: body.usn,
        email: body.email,
        branch: body.branch,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("STUDENT API ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const student = await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const student = await prisma.student.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        usn: body.usn,
        email: body.email,
        branch: body.branch,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return NextResponse.json(
        {
            error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
    );
}
}
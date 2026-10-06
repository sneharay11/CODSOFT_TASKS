import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menu = await prisma.menuItem.findMany({
      where: {
        available: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error("GET MENU ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const menuItem = await prisma.menuItem.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        category: body.category,
        image: body.image,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("POST MENU ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
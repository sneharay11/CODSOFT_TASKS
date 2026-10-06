import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, email, address, items, total } = body;

    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing order details" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerName: name,
        phone,
        email,
        address,
        total: Number(total),

        items: {
          create: items.map((item: any) => ({
            menuItemId: Number(item.id),
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
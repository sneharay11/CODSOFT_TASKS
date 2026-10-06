"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);
  const updateStatus = async (id: number, status: string) => {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (response.ok) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  } else {
    alert("Failed to update order");
  }
};

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          📦 Restaurant Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-5">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl shadow"
              >

                <div className="flex justify-between">

                  <div>
                    <h2 className="text-xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="mt-2">
                      👤 {order.customerName}
                    </p>

                    <p>
                      📞 {order.phone}
                    </p>

                    <p>
                      📍 {order.address}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold">
                      ₹{order.total}
                    </p>

                    <span className="inline-block mt-2 bg-yellow-100 px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-4">

  <button
    onClick={() => updateStatus(order.id, "Preparing")}
    className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
  >
    Preparing
  </button>

  <button
    onClick={() => updateStatus(order.id, "Ready")}
    className="bg-blue-500 text-white px-3 py-2 rounded-lg"
  >
    Ready
  </button>

  <button
    onClick={() => updateStatus(order.id, "Delivered")}
    className="bg-green-600 text-white px-3 py-2 rounded-lg"
  >
    Delivered
  </button>

  <button
    onClick={() => updateStatus(order.id, "Cancelled")}
    className="bg-red-500 text-white px-3 py-2 rounded-lg"
  >
    Cancelled
  </button>

</div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}
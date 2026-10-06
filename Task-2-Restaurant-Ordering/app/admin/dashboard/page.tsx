"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const totalSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total), 0);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              📊 Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Restaurant overview
            </p>
          </div>

          <a
            href="/admin/orders"
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            📦 View Orders
          </a>
        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Pending Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {pendingOrders}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Sales
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹{totalSales}
            </h2>
          </div>

        </div>

        {/* RECENT ORDERS */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Recent Orders
            </h2>
          </div>

          {orders.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No orders yet.
            </div>

          ) : (

            <div className="divide-y">

              {orders.slice(0, 10).map((order) => (

                <div
                  key={order.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >

                  <div>
                    <p className="font-bold">
                      Order #{order.id}
                    </p>

                    <p className="text-gray-600">
                      {order.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="font-bold">
                      ₹{order.total}
                    </p>
                  </div>

                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {order.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}
"use client";

import { useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">

        <div className="text-6xl mb-5">
          🎉
        </div>

        <h1 className="text-3xl font-bold">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-3">
          Thank you for ordering from Delicious Restaurant.
        </p>

        {orderId && (
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <p className="text-gray-500">
              Your Order ID
            </p>

            <p className="text-xl font-bold mt-1">
              #{orderId}
            </p>
          </div>
        )}

        <p className="text-gray-500 mt-5">
          Your order is currently being prepared.
        </p>

        <a
          href="/admin"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg mt-7"
        >
          Back to Menu
        </a>

      </div>
    </main>
  );
}

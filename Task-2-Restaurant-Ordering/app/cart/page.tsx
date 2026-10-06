
"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [address, setAddress] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");

    const updated = saved.map((item: any) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }, []);

  const updateCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increase = (id: number) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updated);
  };

  const decrease = (id: number) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updated);
  };

  const removeItem = (id: number) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const placeOrder = async () => {
  if (!name || !phone || !email || !address) {
    alert("Please fill in all customer details");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  name,
  phone,
  email,
  address,
  items: cart,
  total,
}),
})

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to place order");
    }

   localStorage.removeItem("cart");

window.location.href = `/order-success?id=${data.id}`;

  } catch (error) {
    console.error(error);
    alert("Failed to place order");
  }
};
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            🛒 Your Cart
          </h1>

          <a
            href="/"
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            ← Menu
          </a>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold">
              Your cart is empty 😔
            </h2>
          </div>
        ) : (
          <div className="space-y-6">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl shadow flex items-center gap-5"
              >

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                )}

                <div className="flex-1">
                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  <p className="font-semibold">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-4 mt-4">

                    <button
                      onClick={() => decrease(item.id)}
                      className="bg-gray-200 px-4 py-2 rounded-lg text-xl font-bold"
                    >
                      −
                    </button>

                    <span className="text-xl font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increase(item.id)}
                      className="bg-gray-200 px-4 py-2 rounded-lg text-xl font-bold"
                    >
                      +
                    </button>

                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove
                </button>

              </div>
            ))}

            <div className="bg-white p-6 rounded-xl shadow">

              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

            </div>

          </div>
        )}

      </div>
      <div className="bg-white p-6 rounded-xl shadow mt-6">
  <h2 className="text-2xl font-bold mb-4">
    Customer Details
  </h2>

  <input
    type="text"
    placeholder="Your Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full border p-3 rounded-lg mb-3"
  />

  <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full border p-3 rounded-lg mb-3"
  />

<input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border p-3 rounded-lg mb-3"
/>

  <textarea
    placeholder="Delivery Address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="w-full border p-3 rounded-lg mb-4"
    rows={3}
  />

  <button
    onClick={placeOrder}
    className="w-full bg-black text-white py-3 rounded-lg font-bold"
  >
    Place Order 🍽️
  </button>
</div>
    </main>
  );
}
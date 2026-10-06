"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  quantity?: number;
};

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    setCartCount(
      cart.reduce(
        (total: number, item: any) =>
          total + (item.quantity || 1),
        0
      )
    );
  }, []);

  const addToCart = (item: MenuItem) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(
      (cartItem: MenuItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((cartItem: MenuItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: (cartItem.quantity || 1) + 1,
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...item,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCartCount(
      updatedCart.reduce(
        (total: number, item: MenuItem) =>
          total + (item.quantity || 1),
        0
      )
    );

    alert(`${item.name} added to cart 🛒`);
  };

  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      item.category.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...Array.from(
      new Set(menu.map((item) => item.category))
    ),
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6 sm:p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">

          <h1 className="text-4xl font-bold">
            🍽️ Delicious Restaurant
          </h1>

          <a
            href="/cart"
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            🛒 Cart ({cartCount})
          </a>

        </div>

        {/* SEARCH */}

        <div className="mb-6">

          <input
            type="text"
            placeholder="🔍 Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl mx-auto block bg-white border border-gray-300 p-4 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-black"
          />

        </div>

        {/* CATEGORIES */}

        <div className="flex flex-wrap justify-center gap-3 mb-8">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full ${
                category === cat
                  ? "bg-black text-white"
                  : "bg-white text-black border"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

        {/* FOOD */}

        {filteredMenu.length === 0 ? (

          <div className="text-center py-12">

            <p className="text-2xl font-bold">
              😔 No food found
            </p>

            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredMenu.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-5">

                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mt-5">

                    <span className="text-xl font-bold">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>

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
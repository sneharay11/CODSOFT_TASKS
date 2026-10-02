"use client";
import { useState } from "react";
export default function StudentsPage() {
    const[name,setName] = useState("");
    const[usn,setUsn] = useState("");
    const[email,setEmail] = useState("");
    const[branch,setBranch] = useState("");
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Student Management
        </h1>

        <p className="text-gray-600 mb-8">
          Add, update, search and manage student information.
        </p>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Student
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <input
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="USN"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="border rounded-lg p-3"
            />

          </div>

          <button
  onClick={async () => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          usn,
          email,
          branch,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        alert("API Error: " + text);
        return;
      }

      const data = JSON.parse(text);

      alert("Student added:" + data.name);

      setName("");
      setUsn("");
      setEmail("");
      setBranch("");
    } catch (error) {
      alert("error:" + String(error));
    }
  }}
  className="mt-6 bg-blue-700 text-white px-6 py-3 rounded-lg"
>
  Add Student
</button>
        </div>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState, type FormEvent } from "react";

type Student = {
  id: number;
  name: string;
  usn: string;
  email: string;
  branch: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<any>(null);
const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadStudents = async () => {
  try {
    const response = await fetch("/api/students");

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const data = await response.json();

    setStudents(data);
  } catch (error) {
    console.error("Error loading students:", error);
  }
};
useEffect(() => {
  loadStudents();
}, []);

  const addStudent = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (
    name.trim() === "" ||
    usn.trim() === "" ||
    email.trim() === "" ||
    branch.trim() === ""
  ) {
    alert("Please fill in all the fields");
    return;
  }

  try {
    setLoading(true);

    const method = editingId ? "PUT" : "POST";

    const body = editingId
      ? {
          id: editingId,
          name: name.trim(),
          usn: usn.trim(),
          email: email.trim(),
          branch: branch.trim(),
        }
      : {
          name: name.trim(),
          usn: usn.trim(),
          email: email.trim(),
          branch: branch.trim(),
        };

    const response = await fetch("/api/students", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to save student");
    }

    setEditingId(null);
    setName("");
    setUsn("");
    setEmail("");
    setBranch("");
    setShowForm(false);

    await loadStudents();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.usn} ${student.email} ${student.branch}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Student Management System
          </h1>

          <p className="mt-2 text-gray-600">
            Manage student records easily
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {students.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Department</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              CSE DS
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">System Status</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              Active
            </p>
          </div>

        </div>

        {/* Add Student */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            Add Student
          </h2>

          <form
            onSubmit={addStudent}
            className="grid gap-4 md:grid-cols-2"
          >

            <input
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="USN"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 md:col-span-2"
            >
              {loading ? "Adding..." : "Add Student"}
            </button>

          </form>
        </div>

        {/* Student List */}
        <div className="rounded-xl bg-white p-6 shadow">

          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row">

            <h2 className="text-2xl font-bold text-gray-800">
              Student Records
            </h2>

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {filteredStudents.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
              No students found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">USN</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {student.id}
                      </td>

                      <td className="p-3 font-semibold">
                        {student.name}
                      </td>

                      <td className="p-3">
                        {student.usn}
                      </td>

                      <td className="p-3">
                        {student.email}
                      </td>

                      <td className="p-3">
  {student.branch}
</td>

<td className="p-3">
  <button
  type="button"
  onClick={() => {
  setEditingId(student.id);
  setName(student.name);
  setUsn(student.usn);
  setEmail(student.email);
  setBranch(student.branch);
  setShowEditForm(true);
}}
  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
>
  Edit
</button>
  <button
    onClick={async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
      );

      if (!confirmDelete) return;

      await fetch("/api/students", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: student.id,
        }),
      });

      loadStudents();
    }}
    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
  >
    Delete
  </button>
</td>
</tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}
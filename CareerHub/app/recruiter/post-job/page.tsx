
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PostJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
    description: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to post job.");
      }

      setSuccess("Job posted successfully!");
      setForm({
        title: "",
        company: "",
        location: "",
        jobType: "Full Time",
        salary: "",
        description: "",
        requirements: "",
      });

      setTimeout(() => router.push("/recruiter"), 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <main className="p-10 text-center">Loading...</main>;
  }

  if (!session?.user || session.user.role !== "RECRUITER") {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Recruiter access only</h1>
        <p className="mt-3 text-slate-600">
          Log in with your recruiter account to post a job.
        </p>
        <Link href="/login" className="mt-4 inline-block text-blue-600">
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/recruiter" className="text-blue-600 hover:underline">
          ← Back to Recruiter Dashboard
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold">Post a Job</h1>
          <p className="mt-2 text-slate-600">
            Enter the details to publish a new job listing.
          </p>

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block font-medium">Job Title</label>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Company Name</label>
              <input
                required
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. TechNova Solutions"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Location</label>
              <input
                required
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru or Remote"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Job Type</label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">Salary</label>
              <input
                required
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. ₹4–6 LPA or Stipend ₹10,000/month"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Job Description</label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the role and responsibilities..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Requirements</label>
              <textarea
                required
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="List required skills and qualifications..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Posting Job..." : "Publish Job"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

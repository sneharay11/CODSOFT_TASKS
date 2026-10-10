
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const jobId = Number(window.location.pathname.split("/")[2]);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          resumeUrl,
          coverLetter,
          jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Application submission failed.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-green-600">
            Application submitted!
          </h1>
          <p className="mt-3 text-slate-600">
            Thank you for applying through CareerHub.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-5 rounded-2xl bg-white p-8 shadow-md"
      >
        <h1 className="text-3xl font-bold">Apply for Job</h1>

        <div>
          <label className="mb-1 block font-medium">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Phone</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Resume URL</label>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Paste your resume link"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full rounded-lg border p-3"
            rows={4}
            placeholder="Write a short cover letter"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </main>
  );
}

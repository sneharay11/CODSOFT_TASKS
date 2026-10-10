
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements: string;
};

export default function JobDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error("Job not found");
        const data: Job = await response.json();
        setJob(data);
      } catch {
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  if (loading) return <p className="p-10 text-center">Loading job details...</p>;

  if (error || !job) {
    return <p className="p-10 text-center text-red-600">{error || "Job not found"}</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-md">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {job.jobType}
        </span>
        <h1 className="mt-5 text-4xl font-bold text-gray-900">{job.title}</h1>
        <p className="mt-3 text-xl text-blue-600">{job.company}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">📍 Location</p>
            <p className="font-semibold">{job.location}</p>
          </div>
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">💰 Salary</p>
            <p className="font-semibold">{job.salary}</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold">Job Description</h2>
        <p className="mt-3 leading-7 text-gray-600">{job.description}</p>

        <h2 className="mt-8 text-2xl font-bold">Requirements</h2>
        <p className="mt-3 leading-7 text-gray-600">{job.requirements}</p>

        <button
          onClick={() => router.push(`/jobs/${job.id}/apply`)}
          className="mt-10 w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700"
        >
          Apply Now
        </button>
      </div>
    </main>
  );
}

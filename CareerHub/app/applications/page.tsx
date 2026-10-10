
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Application = {
  id: number;
  status: string;
  createdAt: string;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    salary: string;
  };
};

export default function ApplicationsPage() {
  const { data: session, status: authStatus } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "loading") return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");

        if (!response.ok) {
          throw new Error("Unable to load applications.");
        }

        const data = await response.json();
        setApplications(data);
      } catch {
        setError("Could not load your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [session, authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-center">
        Loading your applications...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="mt-4 text-slate-600">
          Please log in to track your job applications.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          My Applications
        </h1>
        <p className="mt-2 text-slate-600">
          Track the status of your job applications.
        </p>

        {error && (
          <p className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {!error && applications.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">No applications yet</h2>
            <p className="mt-2 text-slate-600">
              Explore available jobs and submit your first application.
            </p>
            <Link
              href="/#jobs"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-5">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {application.job.title}
                  </h2>
                  <p className="mt-1 font-medium text-blue-600">
                    {application.job.company}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {application.job.location} · {application.job.jobType}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Salary: {application.job.salary}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  {application.status}
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Applied on{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>

              <Link
                href={`/jobs/${application.job.id}`}
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                View Job
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

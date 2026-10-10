
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        const data: Job[] = await response.json();
        setJobs(data);
      } catch {
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CareerHub
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <a href="#jobs">Jobs</a>
          <a href="#companies">Companies</a>

          {status === "loading" ? (
            <span className="text-slate-500">Loading...</span>
          ) : session?.user ? (
            <>
              <span className="text-slate-700">
                Hi, {session.user.name || session.user.email}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-5 py-2 text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="bg-blue-600 px-6 py-20 text-center text-white">
        <h2 className="text-4xl font-bold md:text-5xl">
          Find Your Dream Job
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-blue-100">
          Discover opportunities, apply for jobs, and build your career
          with CareerHub.
        </p>

        <div className="mx-auto mt-8 flex max-w-3xl overflow-hidden rounded-xl bg-white shadow-lg">
          <input
            type="text"
            placeholder="Search jobs, companies or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-5 py-4 text-slate-800 outline-none"
          />

          <button className="bg-slate-900 px-8 font-semibold text-white">
            Search
          </button>
        </div>
      </section>

      <section id="jobs" className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Latest Jobs</h2>
          <p className="mt-2 text-slate-500">
            Explore the latest opportunities
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-slate-500">
            Loading jobs...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-red-600">{error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="mt-2 font-medium text-blue-600">
                      {job.company}
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                    {job.jobType}
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-500">
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary}</p>
                </div>

                <Link
                  href={`/jobs/${job.id}`}
                  className="mt-6 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  View Job
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-slate-500">
              {jobs.length === 0
                ? "No jobs available yet."
                : "No jobs found."}
            </p>
          </div>
        )}
      </section>

      <section id="companies" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">
            Everything You Need to Find Your Next Opportunity
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="text-4xl">🔎</div>
              <h3 className="mt-4 text-xl font-bold">Search Jobs</h3>
              <p className="mt-2 text-slate-500">
                Find jobs based on skills, companies and locations.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="text-4xl">📄</div>
              <h3 className="mt-4 text-xl font-bold">Apply Easily</h3>
              <p className="mt-2 text-slate-500">
                Apply for suitable positions and manage your applications.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <div className="text-4xl">💼</div>
              <h3 className="mt-4 text-xl font-bold">Build Your Career</h3>
              <p className="mt-2 text-slate-500">
                Connect with companies and discover career opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 px-6 py-8 text-center text-slate-400">
        <p>© 2026 CareerHub. All rights reserved.</p>
      </footer>
    </main>
  );
}

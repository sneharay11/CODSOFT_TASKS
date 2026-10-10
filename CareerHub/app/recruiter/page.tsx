
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Applicant = {
  id: number;
  name: string;
  email: string;
};

type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "SELECTED";

type Application = {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  user: Applicant;
};

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  applications: Application[];
};

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "SELECTED",
];

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<number, ApplicationStatus>
  >({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/recruiter/dashboard");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load dashboard.");
      }

      setJobs(data.jobs);
      setSelectedStatuses((previous) => {
        const next = { ...previous };
        for (const job of data.jobs as Job[]) {
          for (const application of job.applications) {
            next[application.id] = application.status;
          }
        }
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "RECRUITER") {
      setLoading(false);
      return;
    }

    void loadDashboard();
  }, [session, status, loadDashboard]);

  async function updateStatus(applicationId: number) {
    const newStatus = selectedStatuses[applicationId];
    if (!newStatus) return;

    setSavingId(applicationId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/recruiter/applications/${applicationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update status.");
      }

      setJobs((previous) =>
        previous.map((job) => ({
          ...job,
          applications: job.applications.map((application) =>
            application.id === applicationId
              ? { ...application, status: newStatus }
              : application
          ),
        }))
      );

      setMessage(`Application status updated to ${newStatus}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update status."
      );
    } finally {
      setSavingId(null);
    }
  }

  if (status === "loading" || loading) {
    return <main className="p-10 text-center">Loading dashboard...</main>;
  }

  if (!session?.user) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <Link href="/login" className="mt-4 inline-block text-blue-600">
          Go to Login
        </Link>
      </main>
    );
  }

  if (session.user.role !== "RECRUITER") {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Recruiter access only</h1>
        <p className="mt-3 text-slate-600">
          Please log in with a recruiter account to access this dashboard.
        </p>
        <Link href="/" className="mt-5 inline-block text-blue-600">
          Back to Home
        </Link>
      </main>
    );
  }

  const totalApplications = jobs.reduce(
    (total, job) => total + job.applications.length,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to CareerHub
        </Link>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
  <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

  <Link
    href="/recruiter/post-job"
    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
  >
    + Post a Job
  </Link>
</div>
        <p className="mt-2 text-slate-600">
          Welcome, {session.user.name || session.user.email}.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">
            {message}
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-slate-500">Your Posted Jobs</p>
            <p className="mt-2 text-3xl font-bold">{jobs.length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-slate-500">Total Applications</p>
            <p className="mt-2 text-3xl font-bold">{totalApplications}</p>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold">Your Jobs & Applicants</h2>

        {!error && jobs.length === 0 && (
          <div className="mt-5 rounded-xl bg-white p-8 shadow-sm">
            <p className="font-semibold">No jobs posted yet.</p>
            <p className="mt-2 text-slate-600">
              Jobs assigned to your recruiter account will appear here.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-6">
          {jobs.map((job) => (
            <section key={job.id} className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="mt-1 text-blue-600">{job.company}</p>
              <p className="mt-2 text-sm text-slate-500">
                {job.location} · {job.jobType}
              </p>

              <h4 className="mt-6 font-semibold">
                Applicants ({job.applications.length})
              </h4>

              {job.applications.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  No applicants yet.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {job.applications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <p className="font-semibold">{application.user.name}</p>
                      <p className="text-sm text-slate-600">
                        {application.user.email}
                      </p>

                      <p className="mt-2 text-sm">
                        Current status: <strong>{application.status}</strong>
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Applied on{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <select
                          aria-label={`Status for ${application.user.name}`}
                          value={
                            selectedStatuses[application.id] ??
                            application.status
                          }
                          onChange={(event) =>
                            setSelectedStatuses((previous) => ({
                              ...previous,
                              [application.id]: event.target.value as ApplicationStatus,
                            }))
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => updateStatus(application.id)}
                          disabled={
                            savingId === application.id ||
                            (selectedStatuses[application.id] ??
                              application.status) === application.status
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingId === application.id
                            ? "Saving..."
                            : "Save Status"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

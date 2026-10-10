
import { Suspense } from "react";
import JobDetailsClient from "./JobDetailsClient";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="p-10 text-center">Loading job details...</p>
      }
    >
      <JobPageContent params={params} />
    </Suspense>
  );
}

async function JobPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetailsClient id={id} />;
}

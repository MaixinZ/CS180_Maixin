import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="label">404 / Not found</p>
      <h1>This page is not part of the project archive.</h1>
      <Link href="/">Return to all projects</Link>
    </main>
  );
}

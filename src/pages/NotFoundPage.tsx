import { Helmet } from "react-helmet";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Helmet>
        <title>Page not found | Covenant People Fellowship</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-foreground">Page not found</h1>
      <p className="max-w-xl text-muted-foreground">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Back to homepage
      </Link>
    </div>
  );
}

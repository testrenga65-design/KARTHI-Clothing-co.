import { Link } from 'react-router-dom';
import Seo from '../components/ui/Seo';

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <Seo title="Page not found" noindex />
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-6xl">Page not found</h1>
      <p className="mt-4 text-ink-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}

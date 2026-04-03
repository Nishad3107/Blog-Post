import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-xl text-center bg-white border-2 border-soft-mint rounded-2xl p-8 shadow-lg">
          <p className="text-sm uppercase tracking-[0.35em] text-light-green/80 font-body">404</p>
          <h1 className="text-3xl sm:text-4xl font-heading text-primary-dark mt-3">
            Page Not Found
          </h1>
          <p className="text-dark-green font-body mt-4">
            The page you are looking for does not exist. Try the trips page or return home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link to="/" className="btn-primary btn-ripple">
              Back Home
            </Link>
            <Link to="/trips" className="btn-secondary btn-ripple">
              View Trips
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

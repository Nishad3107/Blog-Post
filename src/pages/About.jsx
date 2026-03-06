import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <div className="relative h-64 bg-gradient-to-r from-primary-dark to-dark-green flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">About TravelBlog</h1>
          <p className="text-lg text-light-green">Discover our story and mission</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-soft-mint">
            <p className="text-lg text-dark-green mb-6">
              Welcome to TravelBlog, your companion in exploring the world's most incredible destinations. 
              We share travel stories, tips, and guides to help you plan your perfect adventure.
            </p>
            <p className="text-lg text-dark-green mb-6">
              Whether you're a seasoned traveler or planning your first trip, our blog offers 
              inspiration and practical advice for your journey.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Our Mission</h2>
            <p className="text-dark-green mb-6">
              To inspire and empower travelers to explore the world responsibly and create 
              unforgettable memories.
            </p>
            <div className="mt-8 p-6 bg-soft-mint rounded-lg">
              <p className="text-primary-dark font-medium">
                Join our community of eco-conscious travelers and discover sustainable travel options 
                that help protect our beautiful planet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

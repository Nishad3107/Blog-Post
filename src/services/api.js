const API_BASE_URL = 'https://api.example.com';

export const blogService = {
  async getPosts() {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return response.json();
  },

  async getPost(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    return response.json();
  },
};

export const destinationService = {
  async getDestinations() {
    const response = await fetch(`${API_BASE_URL}/destinations`);
    return response.json();
  },
};

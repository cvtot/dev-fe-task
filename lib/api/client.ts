const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Utility function for API calls with error handling
export async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
}


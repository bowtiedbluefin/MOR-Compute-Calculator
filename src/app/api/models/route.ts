import { NextResponse } from 'next/server';

// Function to fetch models from the HTTP endpoint
async function fetchModelsFromApi() {
  try {
    const response = await fetch('http://api.mor.org/api/v1/models/', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

// Handle GET requests to this route
export async function GET() {
  try {
    const data = await fetchModelsFromApi();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

// Function to fetch bids from the HTTP endpoint
async function fetchBidsFromApi(modelId: string) {
  try {
    const url = `http://api.mor.org/api/v1/models/ratedbids?model_id=${modelId}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching bids:`, error);
    throw error;
  }
}

// Handle GET requests to this route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get('model_id');
  
  if (!modelId) {
    return NextResponse.json(
      { error: 'Missing model_id parameter' },
      { status: 400 }
    );
  }
  
  try {
    const data = await fetchBidsFromApi(modelId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch bids' },
      { status: 500 }
    );
  }
} 
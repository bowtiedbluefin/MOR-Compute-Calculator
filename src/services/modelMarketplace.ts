// API endpoints
const MODELS_API_URL = '/api/models';
const BIDS_API_URL = '/api/bids';

// Cache expiration times (in milliseconds)
const MODELS_CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
const BIDS_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Types for API responses
export interface Model {
  id: string;
  blockchainID: string;
  created: number;
  tags: string[];
}

export interface ModelResponse {
  object: string;
  data: Model[];
}

export interface Bid {
  Id: string;
  Provider: string;
  ModelAgentId: string;
  PricePerSecond: string;
  Nonce: string;
  CreatedAt: string;
  DeletedAt: string;
}

export interface BidWithScore {
  ID: string;
  Bid: Bid;
  Score: number;
}

export interface BidsResponse {
  bids: BidWithScore[];
}

/**
 * Fetch all available models from the API with caching
 */
export async function fetchModels(): Promise<Model[]> {
  // Check cache first
  const cachedData = localStorage.getItem('modelsCache');
  if (cachedData) {
    const { timestamp, models } = JSON.parse(cachedData);
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (now - timestamp < MODELS_CACHE_EXPIRY) {
      console.log('Using cached models data');
      return models;
    }
  }
  
  // Fetch fresh data
  try {
    const response = await fetch(MODELS_API_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ModelResponse = await response.json();
    
    // Cache the result
    localStorage.setItem('modelsCache', JSON.stringify({
      timestamp: Date.now(),
      models: data.data
    }));
    
    return data.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

/**
 * Fetch bids for a specific model by its blockchainID with caching
 */
export async function fetchModelBids(modelBlockchainID: string): Promise<BidWithScore[]> {
  if (!modelBlockchainID) {
    throw new Error('Missing blockchain ID parameter');
  }
  
  // Check cache first
  const cacheKey = `bidCache_${modelBlockchainID}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const { timestamp, bids } = JSON.parse(cachedData);
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (now - timestamp < BIDS_CACHE_EXPIRY) {
      console.log(`Using cached bids data for model ${modelBlockchainID}`);
      return bids;
    }
  }
  
  // Fetch fresh data
  try {
    const url = `${BIDS_API_URL}?model_id=${modelBlockchainID}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: BidsResponse = await response.json();
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      bids: data.bids
    }));
    
    return data.bids;
  } catch (error) {
    console.error(`Error fetching bids for model ${modelBlockchainID}:`, error);
    throw error;
  }
}

/**
 * Force refresh of the models cache
 */
export function invalidateModelsCache(): void {
  localStorage.removeItem('modelsCache');
}

/**
 * Force refresh of a specific model's bids cache
 */
export function invalidateBidsCache(modelBlockchainID: string): void {
  const cacheKey = `bidCache_${modelBlockchainID}`;
  localStorage.removeItem(cacheKey);
}

/**
 * Format the bid price from wei to a more readable format
 */
export function formatBidPrice(priceInWei: string): string {
  // Convert to a number for easier formatting
  const price = BigInt(priceInWei);
  
  return price.toString();
} 
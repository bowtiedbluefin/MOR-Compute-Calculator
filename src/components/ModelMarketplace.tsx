'use client';

import { useState } from 'react';
import { fetchModels, fetchModelBids, Model, BidWithScore } from '../services/modelMarketplace';
import { ethers } from 'ethers';

export default function ModelMarketplace() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [topBid, setTopBid] = useState<BidWithScore | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [isLoadingBids, setIsLoadingBids] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Function to query the marketplace for available models
  const handleQueryMarketplace = async () => {
    setIsLoadingModels(true);
    setError('');
    setTopBid(null);
    
    try {
      const data = await fetchModels();
      setModels(data);
      
      // Reset selected model if it's no longer in the list
      if (selectedModel && !data.some(model => model.id === selectedModel.id)) {
        setSelectedModel(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch models. Please try again.');
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Function to get bids for the selected model
  const handleGetBid = async () => {
    if (!selectedModel) {
      setError('Please select a model first');
      return;
    }
    
    setIsLoadingBids(true);
    setError('');
    setTopBid(null);
    
    try {
      const bids = await fetchModelBids(selectedModel.blockchainID);
      
      if (bids && bids.length > 0) {
        // Sort by score (highest first) and take the top one
        const sortedBids = [...bids].sort((a, b) => b.Score - a.Score);
        setTopBid(sortedBids[0]);
      } else {
        setError('No bids found for this model');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bids. Please try again.');
    } finally {
      setIsLoadingBids(false);
    }
  };

  // Function to format the price in a readable way
  const formatPrice = (priceInWei: string) => {
    try {
      // Display both wei and formatted
      const weiBN = ethers.BigNumber.from(priceInWei);
      const morFormatted = ethers.utils.formatEther(weiBN);
      
      // Format to a reasonable number of decimals
      return {
        wei: priceInWei,
        mor: parseFloat(morFormatted).toFixed(10)
      };
    } catch (err) {
      console.error('Error formatting price:', err);
      return { wei: priceInWei, mor: 'Error' };
    }
  };

  return (
    <div className="card" style={{ width: '100%', margin: '0 auto', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#3b82f6' }}>
        Find Model Bids
      </h2>
      
      <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Query Button */}
        <button
          onClick={handleQueryMarketplace}
          disabled={isLoadingModels}
          className="button"
          style={{ width: '100%' }}
        >
          {isLoadingModels ? 'Querying...' : 'Query Marketplace'}
        </button>
        
        {/* Model Dropdown - only show if models are loaded */}
        {models.length > 0 && (
          <div>
            <label htmlFor="modelSelect" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
              Select Model
            </label>
            <select
              id="modelSelect"
              className="input-field"
              value={selectedModel?.id || ''}
              onChange={(e) => {
                const selected = models.find(model => model.id === e.target.value);
                setSelectedModel(selected || null);
                // Clear previous bid when model changes
                setTopBid(null);
              }}
              style={{ width: '100%' }}
            >
              <option value="">-- Select a model --</option>
              {models.map((model, index) => (
                <option key={`${model.id}-${index}`} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Get Bid Button - only show if a model is selected */}
        {selectedModel && (
          <button
            onClick={handleGetBid}
            disabled={isLoadingBids}
            className="button"
            style={{ width: '100%' }}
          >
            {isLoadingBids ? 'Getting Bid...' : 'Get Bid'}
          </button>
        )}
        
        {/* Error Message */}
        {error && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
        
        {/* Bid Result */}
        {topBid && (
          <div className="result-box" style={{ color: 'black' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 500, color: 'black' }}>Top Bid Price Per Second:</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>MOR:</span> 
                  <span style={{ color: 'black' }}>{formatPrice(topBid.Bid.PricePerSecond).mor}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>Wei:</span> 
                  <span style={{ color: 'black' }}>{formatPrice(topBid.Bid.PricePerSecond).wei}</span>
                </div>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>Score:</span> 
              <span style={{ color: 'black' }}>{topBid.Score.toFixed(2)}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>Provider:</span> 
              <span style={{ color: 'black' }}>{topBid.Bid.Provider}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
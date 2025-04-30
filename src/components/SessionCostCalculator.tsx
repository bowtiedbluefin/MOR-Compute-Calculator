'use client';

import { useState } from 'react';
import { calculateDirectPayCost, stipendToStake } from '../services/blockchain';
import { formatWei } from '../utils/format';
import { ethers } from 'ethers';

export default function SessionCostCalculator() {
  const [sessionLength, setSessionLength] = useState<string>('');
  const [bidPrice, setBidPrice] = useState<string>('');
  const [directPayCost, setDirectPayCost] = useState<string>('');
  const [requiredStake, setRequiredStake] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [unit, setUnit] = useState<'MOR' | 'wei'>('wei');

  const handleCalculate = async () => {
    if (!sessionLength || !bidPrice) {
      setError('Please enter both session length and bid price');
      return;
    }

    setIsLoading(true);
    setError('');
    setDirectPayCost('');
    setRequiredStake('');

    try {
      // Note: bid price is always in wei
      const bidPriceInWei = bidPrice;

      // Calculate Direct Pay Cost
      const cost = calculateDirectPayCost(sessionLength, bidPriceInWei);
      setDirectPayCost(cost);

      // Calculate Required MOR Stake from blockchain
      const stake = await stipendToStake(cost);
      setRequiredStake(stake);
    } catch (err) {
      setError('Error retrieving data from the blockchain. No approximate calculations will be shown.');
      console.error(err);
      // Clear any partial results
      setDirectPayCost('');
      setRequiredStake('');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to display formatted values
  const displayFormattedValues = () => {
    if (!directPayCost || !requiredStake) return null;
    
    // Format for display
    const costWei = directPayCost;
    const stakeWei = requiredStake;
    
    let costMOR = '0';
    let stakeMOR = '0';
    
    try {
      // Format to 2 decimal places
      costMOR = parseFloat(ethers.utils.formatEther(costWei)).toFixed(2);
      stakeMOR = parseFloat(ethers.utils.formatEther(stakeWei)).toFixed(2);
    } catch (err) {
      console.error('Error formatting to MOR:', err);
    }
    
    return (
      <div className="result-box" style={{ color: 'black' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 500, color: 'black' }}>Direct Pay Cost:</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div><span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>MOR:</span> <span style={{ color: 'black' }}>{costMOR}</span></div>
            <div><span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>Wei:</span> <span style={{ color: 'black' }}>{costWei}</span></div>
          </div>
        </div>
        <div>
          <span style={{ fontWeight: 500, color: 'black' }}>Required MOR Stake:</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div><span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>MOR:</span> <span style={{ color: 'black' }}>{stakeMOR}</span></div>
            <div><span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>Wei:</span> <span style={{ color: 'black' }}>{stakeWei}</span></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#3b82f6' }}>
        Required Stake for Session
      </h2>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Session Length Input */}
        <div>
          <label htmlFor="sessionLength" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
            Session Length (seconds)
          </label>
          <input
            type="number"
            id="sessionLength"
            className="input-field"
            value={sessionLength}
            onChange={(e) => setSessionLength(e.target.value)}
            placeholder="Enter session length in seconds"
            min="0"
          />
        </div>

        {/* Bid Price Input - no dropdown, always in wei */}
        <div>
          <label htmlFor="bidPrice" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
            Bid Price per Second
          </label>
          <input
            type="number"
            id="bidPrice"
            className="input-field"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            placeholder="Enter bid price in wei"
            min="0"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="button"
        >
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>

        {/* Error Message */}
        {error && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}

        {/* Results - Only show if both values are available */}
        {directPayCost && requiredStake && displayFormattedValues()}
      </div>
    </div>
  );
} 
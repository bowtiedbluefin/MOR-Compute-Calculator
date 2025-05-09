'use client';

import { useState } from 'react';
import { stakeToStipend } from '../services/blockchain';
import { formatTime } from '../utils/format';
import { ethers } from 'ethers';

export default function MaxSessionCalculator() {
  const [morStake, setMorStake] = useState<string>('');
  const [bidPrice, setBidPrice] = useState<string>('');
  const [maxSessionLength, setMaxSessionLength] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [unit, setUnit] = useState<'MOR' | 'wei'>('wei');
  
  const handleCalculate = async () => {
    if (!morStake || !bidPrice) {
      setError('Please enter both staked MOR amount and bid price');
      return;
    }

    setIsLoading(true);
    setError('');
    setMaxSessionLength('');

    try {
      // Handle conversion if user entered MOR
      const stakeInWei = unit === 'MOR' 
        ? ethers.utils.parseEther(morStake).toString()
        : morStake;
      
      // Bid Price is always in wei
      const bidPriceInWei = bidPrice;

      // Get maximum stipend from blockchain
      const maxStipend = await stakeToStipend(stakeInWei);
      
      // Calculate maximum session length (stipend / bidPrice)
      const maxLength = ethers.BigNumber.from(maxStipend)
        .div(ethers.BigNumber.from(bidPriceInWei))
        .toString();
      
      setMaxSessionLength(maxLength);
    } catch (err) {
      setError('Error retrieving data from the blockchain. Please check your input and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Display formatted value
  const displayFormattedValues = () => {
    if (!maxSessionLength) return null;
    
    // Format time for display
    const formattedTime = formatTime(maxSessionLength);
    
    return (
      <div className="result-box" style={{ color: 'black' }}>
        <div>
          <span style={{ fontWeight: 500, color: 'black' }}>Maximum Session Length:</span>
          <div style={{ marginTop: '0.25rem' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 500, color: 'black' }}>{formattedTime}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'black' }}>Raw: {maxSessionLength} seconds</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ width: '100%', margin: '0 auto', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#3b82f6' }}>
        Maximum Session for Stake
      </h2>
      
      <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Staked MOR Input with Unit Selection */}
        <div>
          <label htmlFor="morStake" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
            Staked MOR Amount
          </label>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              id="morStake"
              className="input-field"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, flexGrow: 1 }}
              value={morStake}
              onChange={(e) => setMorStake(e.target.value)}
              placeholder={`Enter staked amount in ${unit}`}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'MOR' | 'wei')}
              style={{ 
                padding: '0.5rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderLeft: 'none',
                borderTopRightRadius: '0.375rem', 
                borderBottomRightRadius: '0.375rem',
                backgroundColor: '#f9fafb',
                color: '#6b7280',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                minWidth: '120px'
              }}
            >
              <option value="wei">MOR (wei)</option>
              <option value="MOR">MOR</option>
            </select>
          </div>
        </div>

        {/* Bid Price Input - always in wei */}
        <div>
          <label htmlFor="bidPrice" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
            Bid Price per Second
          </label>
          <input
            type="text"
            id="bidPrice"
            className="input-field"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            placeholder="Enter bid price in wei"
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

        {/* Results */}
        {maxSessionLength && displayFormattedValues()}
      </div>
    </div>
  );
} 
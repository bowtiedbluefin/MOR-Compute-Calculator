'use client';

import { useState } from 'react';
import { stipendToStake, stakeToStipend } from '../services/blockchain';
import { ethers } from 'ethers';

export default function ContractFunctionTester() {
  const [stipendInput, setStipendInput] = useState<string>('');
  const [stakeInput, setStakeInput] = useState<string>('');
  const [stipendResult, setStipendResult] = useState<string>('');
  const [stakeResult, setStakeResult] = useState<string>('');
  const [isLoadingStipend, setIsLoadingStipend] = useState<boolean>(false);
  const [isLoadingStake, setIsLoadingStake] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [stipendUnit, setStipendUnit] = useState<'MOR' | 'wei'>('wei');
  const [stakeUnit, setStakeUnit] = useState<'MOR' | 'wei'>('wei');

  const handleTestStipendToStake = async () => {
    if (!stipendInput) {
      setError('Please enter a stipend value');
      return;
    }

    setIsLoadingStipend(true);
    setError('');
    setStipendResult('');

    try {
      // Convert if user entered MOR
      const stipendInWei = stipendUnit === 'MOR' 
        ? ethers.utils.parseEther(stipendInput).toString()
        : stipendInput;
        
      // Direct blockchain call
      const result = await stipendToStake(stipendInWei);
      setStipendResult(result);
    } catch (err) {
      setError('Error retrieving data from the blockchain. Please check your input and try again.');
      console.error(err);
    } finally {
      setIsLoadingStipend(false);
    }
  };

  const handleTestStakeToStipend = async () => {
    if (!stakeInput) {
      setError('Please enter a stake value');
      return;
    }

    setIsLoadingStake(true);
    setError('');
    setStakeResult('');

    try {
      // Convert if user entered MOR
      const stakeInWei = stakeUnit === 'MOR' 
        ? ethers.utils.parseEther(stakeInput).toString()
        : stakeInput;
        
      // Direct blockchain call
      const result = await stakeToStipend(stakeInWei);
      setStakeResult(result);
    } catch (err) {
      setError('Error retrieving data from the blockchain. Please check your input and try again.');
      console.error(err);
    } finally {
      setIsLoadingStake(false);
    }
  };

  // Display values in both MOR and wei
  const displayFormattedResult = (weiValue: string) => {
    if (!weiValue) return null;
    
    let morValue = '0';
    try {
      // Format to 2 decimal places
      morValue = parseFloat(ethers.utils.formatEther(weiValue)).toFixed(2);
    } catch (err) {
      console.error('Error formatting to MOR:', err);
    }
    
    return (
      <div className="result-box" style={{ marginTop: '0.5rem', color: 'black' }}>
        <div style={{ fontSize: '0.875rem' }}>
          <div style={{ marginBottom: '0.25rem' }}><span style={{ fontWeight: 500, color: 'black' }}>MOR:</span> <span style={{ color: 'black' }}>{morValue}</span></div>
          <div><span style={{ fontWeight: 500, color: 'black' }}>Wei:</span> <span style={{ color: 'black' }}>{weiValue}</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ width: '100%', margin: '0 auto' }}>      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '0 auto' }}>
        {/* stipendToStake Tester */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#3b82f6' }}>stipendToStake</h3>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem' }}>(Stipend → Required MOR Stake)</p>
          
          <div>
            <label htmlFor="stipendInput" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
              Stipend
            </label>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                id="stipendInput"
                className="input-field"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, flexGrow: 1 }}
                value={stipendInput}
                onChange={(e) => setStipendInput(e.target.value)}
                placeholder={`Enter stipend in ${stipendUnit}`}
              />
              <select
                value={stipendUnit}
                onChange={(e) => setStipendUnit(e.target.value as 'MOR' | 'wei')}
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
          
          <button
            onClick={handleTestStipendToStake}
            disabled={isLoadingStipend}
            className="button"
          >
            {isLoadingStipend ? 'Testing...' : 'Test'}
          </button>
          
          {stipendResult && displayFormattedResult(stipendResult)}
        </div>
        
        {/* stakeToStipend Tester */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#3b82f6' }}>stakeToStipend</h3>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem' }}>(Staked MOR → Stipend)</p>
          
          <div>
            <label htmlFor="stakeInput" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
              Staked MOR
            </label>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                id="stakeInput"
                className="input-field"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, flexGrow: 1 }}
                value={stakeInput}
                onChange={(e) => setStakeInput(e.target.value)}
                placeholder={`Enter staked amount in ${stakeUnit}`}
              />
              <select
                value={stakeUnit}
                onChange={(e) => setStakeUnit(e.target.value as 'MOR' | 'wei')}
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
          
          <button
            onClick={handleTestStakeToStipend}
            disabled={isLoadingStake}
            className="button"
          >
            {isLoadingStake ? 'Testing...' : 'Test'}
          </button>
          
          {stakeResult && displayFormattedResult(stakeResult)}
        </div>
      </div>
      
      {/* Error Message */}
      {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
    </div>
  );
} 
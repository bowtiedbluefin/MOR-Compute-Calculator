'use client';

import { useEffect } from 'react';
import SessionCostCalculator from '../components/SessionCostCalculator';
import MaxSessionCalculator from '../components/MaxSessionCalculator';
import ContractFunctionTester from '../components/ContractFunctionTester';
import ModelMarketplace from '../components/ModelMarketplace';
import { initializeBlockchain } from '../services/blockchain';

export default function Home() {
  useEffect(() => {
    // Initialize blockchain connection when the app loads
    initializeBlockchain();
  }, []);

  return (
    <main style={{ minHeight: '100vh', padding: '1rem', backgroundColor: 'rgb(248, 250, 252)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem', color: '#3b82f6' }}>
          Morpheus Compute Node Staking Calculator
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
          Use this calculator to help identify the required MOR to create a session, or the longest session you can create 
          with a given amount of MOR. For more information on the Morpheus Compute Node, visit{' '}
          <a href="https://github.com/MorpheusAIs/Docs/tree/main/!KEYDOCS%20README%20FIRST!/Compute%20Providers" 
             style={{ color: '#3b82f6', textDecoration: 'none' }}
             target="_blank" rel="noopener noreferrer">
            Morpheus Documentation
          </a>
        </p>
        
        <div style={{ 
          backgroundColor: '#eff6ff', 
          borderLeft: '4px solid #3b82f6',
          color: '#1e40af',
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '0.25rem'
        }}>
          <p style={{ fontSize: '0.875rem' }}>
            <strong>Note:</strong> This application makes direct calls to the Arbitrum blockchain. 
            If calculations fail, no results will be shown. All data is retrieved directly from the smart contract 
            at address 0xde819aaee474626e3f34ef0263373357e5a6c71b.
          </p>
        </div>
        
        <ModelMarketplace />
        <SessionCostCalculator />
        <MaxSessionCalculator />
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3b82f6', textAlign: 'left' }}>
          Direct Calculations
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Use this section to verify direct conversions.
        </p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <ContractFunctionTester />
        </div>
        
        <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          <p>Connecting to Arbitrum Blockchain - Contract: 0xde819aaee474626e3f34ef0263373357e5a6c71b</p>
        </footer>
      </div>
    </main>
  );
}

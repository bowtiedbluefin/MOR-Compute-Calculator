import { ethers } from 'ethers';

// ABI for the specific functions we need
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp_",
        "type": "uint256"
      }
    ],
    "name": "stakeToStipend",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "stipend_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp_",
        "type": "uint256"
      }
    ],
    "name": "stipendToStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Adding additional function identifiers that might be needed
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "facetAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "facetAddress_",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address and RPC URL
const CONTRACT_ADDRESS = '0xde819aaee474626e3f34ef0263373357e5a6c71b';
const RPC_URL = 'https://arb-mainnet.g.alchemy.com/v2/VvwAemhJicjBK5Y9nGNaxagPzQxklScj';

// Function selectors from the instructions
const STAKE_TO_STIPEND_SELECTOR = '0xb3cb0d0f'; // stakeToStipend (amount_, timestamp_)
const STIPEND_TO_STAKE_SELECTOR = '0xca40d45f'; // stipendToStake (stipend_, timestamp_)

// Initialize provider
let provider: ethers.providers.JsonRpcProvider;

/**
 * Initialize the blockchain connection
 */
export const initializeBlockchain = () => {
  try {
    provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    return true;
  } catch (error) {
    console.error('Failed to initialize blockchain connection:', error);
    return false;
  }
};

/**
 * Convert stipend to stake (Session Cost -> Required MOR Stake)
 * @param stipend_ The stipend amount in wei
 * @returns The required stake amount in wei
 * @throws Error if blockchain call fails
 */
export const stipendToStake = async (stipend_: string): Promise<string> => {
  if (!provider) {
    initializeBlockchain();
  }
  
  try {
    // Current timestamp in seconds
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Encode parameters for the function call
    // stipendToStake(uint256 stipend_, uint256 timestamp_)
    const data = ethers.utils.hexConcat([
      STIPEND_TO_STAKE_SELECTOR,
      ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], [stipend_, timestamp])
    ]);
    
    // Make a direct call using the provider
    const result = await provider.call({
      to: CONTRACT_ADDRESS,
      data
    });
    
    // Decode the result (it's a uint256)
    const decodedResult = ethers.utils.defaultAbiCoder.decode(['uint256'], result);
    return decodedResult[0].toString();
  } catch (error) {
    console.error('Error calling stipendToStake:', error);
    throw error;
  }
};

/**
 * Convert stake to stipend (Staked MOR -> Max Session)
 * @param amount_ The staked amount in wei
 * @returns The stipend amount in wei
 * @throws Error if blockchain call fails
 */
export const stakeToStipend = async (amount_: string): Promise<string> => {
  if (!provider) {
    initializeBlockchain();
  }
  
  try {
    // Current timestamp in seconds
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Encode parameters for the function call
    // stakeToStipend(uint256 amount_, uint256 timestamp_)
    const data = ethers.utils.hexConcat([
      STAKE_TO_STIPEND_SELECTOR,
      ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], [amount_, timestamp])
    ]);
    
    // Make a direct call using the provider
    const result = await provider.call({
      to: CONTRACT_ADDRESS,
      data
    });
    
    // Decode the result (it's a uint256)
    const decodedResult = ethers.utils.defaultAbiCoder.decode(['uint256'], result);
    return decodedResult[0].toString();
  } catch (error) {
    console.error('Error calling stakeToStipend:', error);
    throw error;
  }
};

/**
 * Calculate direct pay cost
 * @param sessionLength Session length in seconds
 * @param bidPrice Bid price per second in wei
 * @returns The direct pay cost in wei
 */
export const calculateDirectPayCost = (sessionLength: string, bidPrice: string): string => {
  try {
    const sessionLengthBN = ethers.BigNumber.from(sessionLength);
    const bidPriceBN = ethers.BigNumber.from(bidPrice);
    const result = sessionLengthBN.mul(bidPriceBN);
    return result.toString();
  } catch (error) {
    console.error('Error calculating direct pay cost:', error);
    throw error;
  }
};

/**
 * Calculate session length from stipend and bid price
 * @param stipend Stipend amount in wei
 * @param bidPrice Bid price per second in wei
 * @returns The session length in seconds
 */
export const calculateSessionLength = (stipend: string, bidPrice: string): string => {
  try {
    const stipendBN = ethers.BigNumber.from(stipend);
    const bidPriceBN = ethers.BigNumber.from(bidPrice);
    
    // Avoid division by zero
    if (bidPriceBN.isZero()) {
      return '0';
    }
    
    const result = stipendBN.div(bidPriceBN);
    return result.toString();
  } catch (error) {
    console.error('Error calculating session length:', error);
    throw error;
  }
}; 
import { ethers } from 'ethers';

/**
 * Format a wei value to a more readable format
 * @param weiValue The value in wei as a string
 * @returns Formatted string with units
 */
export const formatWei = (weiValue: string): string => {
  try {
    const wei = ethers.BigNumber.from(weiValue);
    
    // Format based on size
    if (wei.gte(ethers.utils.parseEther('1'))) {
      // Convert to MOR if >= 1 MOR
      return `${ethers.utils.formatEther(wei)} MOR`;
    } else if (wei.gte(ethers.utils.parseUnits('1', 'gwei'))) {
      // Convert to GWEI if >= 1 GWEI
      return `${ethers.utils.formatUnits(wei, 'gwei')} GWEI`;
    } else {
      // Keep as WEI
      return `${wei.toString()} WEI`;
    }
  } catch (error) {
    console.error('Error formatting wei value:', error);
    return weiValue;
  }
};

/**
 * Format a time value in seconds to a readable format
 * @param seconds Time in seconds as a string
 * @returns Formatted time string
 */
export const formatTime = (seconds: string): string => {
  try {
    const secs = parseInt(seconds, 10);
    
    if (isNaN(secs)) {
      return '0 seconds';
    }
    
    if (secs < 60) {
      return `${secs} second${secs === 1 ? '' : 's'}`;
    } else if (secs < 3600) {
      const mins = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      return `${mins} minute${mins === 1 ? '' : 's'}${remainingSecs > 0 ? ` ${remainingSecs} second${remainingSecs === 1 ? '' : 's'}` : ''}`;
    } else {
      const hours = Math.floor(secs / 3600);
      const mins = Math.floor((secs % 3600) / 60);
      return `${hours} hour${hours === 1 ? '' : 's'}${mins > 0 ? ` ${mins} minute${mins === 1 ? '' : 's'}` : ''}`;
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return seconds;
  }
}; 
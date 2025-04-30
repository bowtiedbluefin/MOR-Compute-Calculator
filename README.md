# Compute Calculator

A simple web application for calculating session costs and maximum session lengths based on MOR staking on the Arbitrum blockchain.

## Features

- **Session Cost Calculator**: Calculate direct pay cost and required MOR stake based on session length and bid price
- **Max Session Calculator**: Calculate maximum session length based on staked MOR amount and bid price
- Real-time interaction with the Arbitrum blockchain
- Clean and responsive UI

## Smart Contract Integration

This application interacts with a smart contract on the Arbitrum blockchain:
- Contract Address: `0xde819aaee474626e3f34ef0263373357e5a6c71b`
- Functions Used:
  - `stakeToStipend(amount_, timestamp_)`: Converts staked MOR to stipend
  - `stipendToStake(stipend_, timestamp_)`: Converts stipend to required MOR stake

## Technical Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ethers.js](https://docs.ethers.org/v5/) - Blockchain interaction

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/compute-calculator.git
   cd compute-calculator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically deploy your application

## License

MIT

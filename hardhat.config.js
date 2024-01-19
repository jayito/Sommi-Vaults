require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
        ],
    },
    networks: {
        hardhat: {
            forking: {
                url: "https://eth-goerli.alchemyapi.io/v2/"  + process.env.ALCHEMY_KEY, // Goerli
            }
        },
        localhost: {
            allowUnlimitedContractSize: true,
            blockGasLimit: 87500000000,
            url: 'http://127.0.0.1:8545/',
            // accounts: [process.env.OWNER_PKEY, process.env.BORROWER_PKEY],
        },
        goerli: {
            url: "https://eth-goerli.alchemyapi.io/v2/" + process.env.ALCHEMY_KEY,
            gas: 10000000,
            accounts: [process.env.OWNER_PKEY, process.env.BORROWER_PKEY]
        },
        mainnet: {
            url: "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_KEY,
            gas: 10000000,
            accounts: [process.env.OWNER_PKEY],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY, 
    },
    mocha: {
        timeout: 100000000
    }
};

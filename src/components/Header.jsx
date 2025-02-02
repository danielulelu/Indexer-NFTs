import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Input,
    SimpleGrid,
    Text,
    Container
  } from '@chakra-ui/react';
  import { Alchemy, Network } from 'alchemy-sdk';
  import { useState, useCallback } from 'react';
  import TokenCard from './TokenCard.jsx';
  import Loader from './Loader.jsx';
  import { ethers } from 'ethers';

  const Header = () => {
    const [inputValue, setInputValue] = useState(''); // Track input value
    const [resolvedAddress, setResolvedAddress] = useState(''); // Track resolved Ethereum address
    const [userAddress, setUserAddress] = useState('');
    const [results, setResults] = useState([]);
    const [hasQueried, setHasQueried] = useState(false);
    const [tokenDataObjects, setTokenDataObjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);

    const debounce = (func, delay) => {
      let timer;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          func.apply(this, args);
        }, delay);
      };
    };

    const handleInputChange = useCallback(
      debounce((value) => setUserAddress(value), 500),
      []
    );

    async function connectWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          setWalletConnected(true);
          console.log('connected to wallet:', address);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      }
    }


    // resolving ENS address
    async function resolveENSaddress(input) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        if (ethers.utils.isAddress(input)) {
          return input;
        }

        // otherwise try to resolve ENS
        const address = await provider.resolveName(input);
        if (!address) {
          throw new Error("Unable to resolve ENS address");
        }
        return address;
      } catch (error) {
        console.error("Error resolving ENS or address:", error);
        return null;
      }
    }
      
      async function getTokenBalance() {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const config = {
          apiKey: 'GAEQaGaMDEe2maX6xFAT_FhSAvndMG8B',
          network: Network.ETH_MAINNET,
        };
  
        const alchemy = new Alchemy(config);
        const data = await alchemy.core.getTokenBalances(userAddress);
  
        setResults(data);
  
        const tokenDataPromises = data.tokenBalances.map((balance) =>
          alchemy.core.getTokenMetadata(balance.contractAddress)
        );
  
        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      } finally {
        setLoading(false); 
      }
    }


    return (  
      <Container maxW="2xl" mx="auto">
        <Box w="100vw">

      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => handleInputChange(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} marginBottom={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>

        {loading ? ( // Display the Loader if data is being fetched
          <Loader />
        ) : hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => (
              <TokenCard
                key={i}
                tokenData={tokenDataObjects[i]}
                tokenBalance={e.tokenBalance}
              />
            ))}
          </SimpleGrid>
        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
    </Container>
  );
  }
  export default Header;
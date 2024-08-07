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
  import { Alchemy, Network, Utils } from 'alchemy-sdk';
  import { useState } from 'react';
  import TokenCard from './TokenCard.jsx';

  const Header = () => {
    const [userAddress, setUserAddress] = useState('');
    const [results, setResults] = useState([]);
    const [hasQueried, setHasQueried] = useState(false);
    const [tokenDataObjects, setTokenDataObjects] = useState([]);

    async function getTokenBalance() {
        const config = {
          apiKey: 'GAEQaGaMDEe2maX6xFAT_FhSAvndMG8B',
          network: Network.ETH_MAINNET,
        };
    
        const alchemy = new Alchemy(config);
        const data = await alchemy.core.getTokenBalances(userAddress);
    
        setResults(data);
    
        const tokenDataPromises = [];
    
        for (let i = 0; i < data.tokenBalances.length; i++) {
          const tokenData = alchemy.core.getTokenMetadata(
            data.tokenBalances[i].contractAddress
          );
          tokenDataPromises.push(tokenData);
        }
    
        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
      }

    return (  
      <Container maxW="2xl" mx="auto" centerContent>
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
          onChange={(e) => setUserAddress(e.target.value)}
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

        {hasQueried ? (
          <SimpleGrid w={'120vh'} marginLeft={20} columns={[ 2, null, 3]} spacing='20px'>
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
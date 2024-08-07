import { Box, Card, Stack, CardBody, Heading, Image } from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';

const TokenCard = ({ tokenData, tokenBalance }) => {
    // the balance is formatted to three decimal places using the Alchemy SDK's formatUnits function.
    const formattedBalance = parseFloat(Utils.formatUnits(tokenBalance, tokenData.decimals)).toFixed(3);

    return ( 
        <Card direction={{ base: 'column', sm: 'row' }}
         overflow='hidden' variant='outline' bg='teal' color='white' 
         borderRadius='lg' padding={4} margin={4} w={{ base: '90vw', md: '45vw', lg: '30vw' }}>
            <Stack>
                <CardBody>
                    <Box fontSize={12}>
                        <b>Symbol:</b> ${tokenData.symbol}&nbsp;
                    </Box>
                    <Box fontSize={12}>
                    <b>Balance:</b>&nbsp;
                    {
                      formattedBalance
                    }
                  </Box>
                </CardBody>
                <Image objectFit='cover' borderRadius='8px' maxW={{ base: '100%', sm: "200px" }} src={tokenData.logo} alt={`${tokenData.symbol} logo`} />
            </Stack>
            
        </Card>
     );
}
 
export default TokenCard;
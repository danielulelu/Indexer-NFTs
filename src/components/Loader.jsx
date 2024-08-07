import { Spinner, Flex } from "@chakra-ui/react";

const Loader = () => {
    return ( 
        <Flex w="100%" justifyContent="center" alignItems="center" height='100vh'>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="teal" />
        </Flex>
     );
}
 
export default Loader;
import {
	Box,
	Flex,
	Button,
	useColorModeValue,
	Stack,
	useColorMode,
	ChakraProvider, CSSReset
} from '@chakra-ui/react';
import {MoonIcon, SunIcon} from '@chakra-ui/icons';

export default function NavBar () {
	const {colorMode, toggleColorMode} = useColorMode ();
	return (
		<ChakraProvider resetCSS>
			<CSSReset/>
			<Box bg={useColorModeValue ('gray.100', 'gray.900')} px={4}>
				<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
					<Box style={{'color': 'rgba(243,37,37,0.88)', 'fontSize': '25px'}}>Auto QA</Box>
					
					<Flex alignItems={'center'}>
						<Stack direction={'row'} spacing={7}>
							<Button onClick={toggleColorMode}>
								{colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
							</Button>
						</Stack>
					</Flex>
				</Flex>
			</Box>
		</ChakraProvider>
	)
}
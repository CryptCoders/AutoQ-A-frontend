import {
	AspectRatio,
	Box,
	Container,
	forwardRef,
	Heading,
	Input,
	Stack,
	Text,
	ChakraProvider,
	Button
} from "@chakra-ui/react";
import {motion, useAnimation} from "framer-motion";
import {useState} from "react";
import axios from "axios";

const first = {
	rest: {
		rotate: "-15deg",
		scale: 0.95,
		x: "-50%",
		// filter: "grayscale(80%)",
		transition: {
			duration: 0.5,
			type: "tween",
			ease: "easeIn"
		}
	},
	hover: {
		x: "-70%",
		scale: 1.1,
		rotate: "-20deg",
		filter: "grayscale(0%)",
		transition: {
			duration: 0.4,
			type: "tween",
			ease: "easeOut"
		}
	}
};

const second = {
	rest: {
		rotate: "15deg",
		scale: 0.95,
		x: "50%",
		// filter: "grayscale(80%)",
		transition: {
			duration: 0.5,
			type: "tween",
			ease: "easeIn"
		}
	},
	hover: {
		x: "70%",
		scale: 1.1,
		rotate: "20deg",
		filter: "grayscale(0%)",
		transition: {
			duration: 0.4,
			type: "tween",
			ease: "easeOut"
		}
	}
};

const third = {
	rest: {
		scale: 1.1,
		// filter: "grayscale(80%)",
		transition: {
			duration: 0.5,
			type: "tween",
			ease: "easeIn"
		}
	},
	hover: {
		scale: 1.3,
		filter: "grayscale(0%)",
		transition: {
			duration: 0.4,
			type: "tween",
			ease: "easeOut"
		}
	}
};


const PreviewImage = forwardRef ((props, ref) => {
	
	return (
		<Box
			bg="white"
			top="0"
			height="100%"
			width="100%"
			position="absolute"
			// borderWidth="1px"
			borderStyle="solid"
			rounded="sm"
			// borderColor="gray.400"
			as={motion.div}
			backgroundSize="cover"
			backgroundRepeat="no-repeat"
			backgroundPosition="center"
			backgroundImage={`url("https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg")`}
			{...props}
			ref={ref}
		/>
	);
});


export default function FileUpload () {
	const controls = useAnimation ();
	const startAnimation = () => controls.start ("hover");
	const stopAnimation = () => controls.stop ();
	
	const [file, setFile] = useState (null);
	
	const selectFile = (e) => {
		setFile (e.target.files[0]);
		console.log (e.target.files[0]);
	}
	
	const getData = async () => {
		const url = 'http://127.0.0.1:5000/generate-question-answer/10'
		const formData = new FormData ();
		formData.append ('file', file);
		const response = await axios.post(url, formData, {headers: { 'Content-Type': 'multipart/form-data' }});
		console.log(response);
	}
	
	return (
		<ChakraProvider resetCSS>
			<Container style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}} my="12">
				<AspectRatio width="64" ratio={1}>
					<Box
						borderColor="gray.300"
						borderStyle="dashed"
						borderWidth="2px"
						rounded="md"
						shadow="sm"
						role="group"
						transition="all 150ms ease-in-out"
						_hover={{
							shadow: "md"
						}}
						as={motion.div}
						initial="rest"
						animate="rest"
						whileHover="hover"
					>
						<Box position="relative" height="100%" width="100%">
							<Box
								position="absolute"
								top="0"
								left="0"
								height="100%"
								width="100%"
								display="flex"
								flexDirection="column"
							>
								<Stack
									height="100%"
									width="100%"
									display="flex"
									alignItems="center"
									justify="center"
									spacing="4"
								>
									<Box height="16" width="12" position="relative">
										<PreviewImage
											variants={first}
											backgroundImage="url('https://icons.veryicon.com/png/o/file-type/system-icon/pdf-45.png')"
										/>
										<PreviewImage
											variants={second}
											backgroundImage="url('https://icons.veryicon.com/png/o/file-type/file-type-icon/pdf-icon-1.png')"
										/>
										<PreviewImage
											variants={third}
											backgroundImage={`url("https://icons.veryicon.com/png/o/file-type/common-file-types/pdf-99.png")`}
										/>
									
									</Box>
									<Stack p="8" textAlign="center" spacing="1">
										<Heading fontSize="lg" color="gray.700" fontWeight="bold">
											Drop file here
										</Heading>
										<Text fontWeight="light">or click to upload</Text>
									</Stack>
								</Stack>
							</Box>
							
							<Input
								type="file"
								height="100%"
								width="100%"
								position="absolute"
								top="0"
								left="0"
								opacity="0"
								aria-hidden="true"
								accept="pdf/*"
								onChange={selectFile}
								onDragEnter={startAnimation}
								onDragLeave={stopAnimation}
							/>
						</Box>
					</Box>
				</AspectRatio>
			
			</Container>
			<Button type='submit' onClick={getData} style={{
				'backgroundColor': 'rgba(243,37,37,0.88)',
				'color': 'white',
				'margin': '1rem'
			}}>Upload</Button>
		</ChakraProvider>
	);
}

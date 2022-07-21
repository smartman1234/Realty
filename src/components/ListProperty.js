import React, {useState} from 'react'
import {Box, Button, Flex, Image, Heading, Text, useDisclosure, useToast} from '@chakra-ui/react'
import {ethers} from 'ethers'
import contractAddress from "../contracts/contract_address.json"
import tokenAddress from "../contracts/token_address.json"
import abi from "../contracts/abi.json";
import tokenAbi from "../contracts/token_abi.json"
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import Input, { Select, TextArea } from './Input';
import { BsHouseDoor } from "react-icons/bs";
import { GoLocation } from "react-icons/go"
import { GiToken } from "react-icons/gi"
import SellImg from "../assets/svg/sell-house.svg"
import { ImageUpload } from "react-ipfs-uploader"
import ApproveModal from "./ApproveModal"
import MintModal from "./MintModal"
import Logo from "../assets/svg/1.svg";
import { useNavigate } from "react-router-dom";

const ListProperty = () => {
  const navigate = useNavigate()

    //validation schema for input fields
    const validationSchema = yup.object().shape({
        name: yup
          .string()
          .min(3, "Must be at least 3 characters")
          .required("Property name is required"),
        description: yup
          .string()
          .min(3, "Must be at least 3 characters")
          .max(150, "Must be at less than 150 characters")
          .required("Description is required"),
        location: yup
          .string()
          .min(3, "Must be at least 3 characters")
          .required("Location is required"),
        amount: yup
          .number()
          .min(0, "Price must be more than 0")
          .required("Price is required"),
        symbol: yup
          .string()
          .min(3, "Must be at least 3 characters")
          .required("Token type is required"),
    });
    const toast = useToast()
    const [imageUrl, setImageUrl] = useState("");
    const [ isApproved, setIsApproved] = useState(false)
    const [ loading, setLoading] = useState(false)
    const [isMintLoading, setIsMintLoading] = useState(false)

    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
      } = useDisclosure();
    const {
        isOpen: isMintOpen,
        onOpen: onMintOpen,
        onClose: onMintClose,
      } = useDisclosure();

    const approve = async () => {
        setLoading(true)
        let amount = document.getElementById("amount").value
        amount =  ethers.utils.parseEther(amount)

        try {
          const { ethereum } = window;
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const TokenContract = new ethers.Contract(
              tokenAddress.contractAddress,
              tokenAbi.abi,
              signer
            );
            let approval = await TokenContract.approve(contractAddress.contractAddress, amount );
                
            await approval.wait();
            setIsApproved(true)
            toast({
              title:"Great!",
              description:"You can go ahead to list your property",
              status:"success",
              duration:1500,
              variant:"subtle",
              isClosable:true,
            })
            setLoading(false)
            onCloseModal()
          } else {
            console.log("ethereum object does not exist!");
            setLoading(false)
            onCloseModal()
            toast({
              title:"Oppps!",
              description:"You need to connect your metamask wallet",
              status:"info",
              duration:3000,
              variant:"subtle",
              isClosable:true,
            })
          }
        } catch (error) {
          console.log(error);
          setLoading(false)
          onCloseModal()
          toast({
              title:"Oppps!",
              description:error.data.message,
              status:"error",
              duration:3000,
              variant:"subtle",
              isClosable:true,
            })
        }
    };

    const mint = async() => {
        setIsMintLoading(true)
        let name = document.getElementById("name").value
        console.log(name)
        try {
          const { ethereum } = window;
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const PropertyNftContract = new ethers.Contract(
              contractAddress.contractAddress,
              abi.abi,
              signer
            );
            let nft = await PropertyNftContract.mintNFT(name);
                                
            await nft.wait();
            toast({
              title:"Great!",
              description:"Your property is now an NFT",
              status:"success",
              duration:1500,
              variant:"subtle",
              isClosable:true,
            })
            setIsMintLoading(false)
            onMintClose()
            setImageUrl("")
            navigate("/properties")
          } else {
            console.log("ethereum object does not exist!");
            setIsMintLoading(false)
            onMintClose()
            setImageUrl("")
            toast({
              title:"Oppps!",
              description:"You need to connect your metamask wallet",
              status:"info",
              duration:3000,
              variant:"subtle",
              isClosable:true,
            })
          }
        } catch (error) {
          console.log(error);
          setIsMintLoading(false)
            onMintClose()
            setImageUrl("")
            toast({
              title:"Oppps!",
              description:error.data.message,
              status:"error",
              duration:3000,
              variant:"subtle",
              isClosable:true,
            })
        }
    }

    return (
        <>
        <Flex
            w={{ base: '100%', md: '90%', lg: '80%' }}
            mx="auto"
            mt={{ base: '80px', md: '100px' }}
            fontSize="14px"
            mb={{ base: 0, md: 10 }}
            boxShadow={{ base: 'none', md: '0px 1px 14px rgba(0, 0, 0, 0.1)' }}
            borderRadius="10px"
            direction={{ base: 'column', md: 'row' }}
        >
            <Box
                w={{ base: '100%', md: '50%' }}
                bg="#edf2f7"
                borderTopLeftRadius={{ base: '0px', md: '10px' }}
                borderBottomLeftRadius={{ base: '0px', md: '10px' }}
            >
                <Image w={{ base: '100%', md: '100%' }} h="100%" src={SellImg} />
            </Box>
            <Box
                w={{ base: '100%', md: '50%' }}
                bg="white"
                p={5}
                borderTopRightRadius={{ base: '0px', md: '10px' }}
                borderBottomRightRadius={{ base: '0px', md: '10px' }}
            >
                {!imageUrl ? <Box minH="50vh">
                    <Heading fontWeight="700" fontSize={{base:"20px", md:"25px"}} mb={10} color="blue.400" display="flex">
                        Become a <Image src={Logo} alt="logo" h="40px" w="auto" mx={2} mt="-2px"/>  agent
                    </Heading>
                    <Text mb={5} fontWeight="700">Upload property picture</Text>
                    <ImageUpload setUrl={setImageUrl}/>
                </Box> :

                <Formik
                    initialValues={{
                        name:'',
                        description:'',
                        location:'',
                        amount:0,
                        symbol:'',
                        imageUrl: imageUrl
                    }}
                    validationSchema={validationSchema}
                    onSubmit={ async (values, { setSubmitting, resetForm }) => {  
                        console.log(values)
                        try {
                          const { ethereum } = window;
                          if (ethereum) {
                            const provider = new ethers.providers.Web3Provider(ethereum);
                            const signer = provider.getSigner();
                            const PropertyNftContract = new ethers.Contract(
                              contractAddress.contractAddress,
                              abi.abi,
                              signer
                            );
                            let list = await PropertyNftContract.listProperty(values.name, values.amount, values.location, values.symbol, values.description, values.imageUrl );
                                
                            await list.wait();
                            toast({
                              title:"Great!",
                              description:"Your property has been listed successfully",
                              status:"success",
                              duration:1500,
                              variant:"subtle",
                              isClosable:true,
                            })
                            onMintOpen()
                            
                          } else {
                            console.log("ethereum object does not exist!");
                            resetForm()
                            setImageUrl("")
                            toast({
                              title:"Oppps!",
                              description:"You need to connect your metamask wallet",
                              status:"info",
                              duration:3000,
                              variant:"subtle",
                              isClosable:true,
                            })
                          }
                        } catch (error) {
                          console.log(error);
                          resetForm()
                          setImageUrl("")
                          toast({
                              title:"Oppps!",
                              description:error.data.message,
                              status:"error",
                              duration:3000,
                              variant:"subtle",
                              isClosable:true,
                            })
                        }
                    }}
                >
                    {({ errors, isSubmitting, setFieldValue }) => (
                        <Form>
                            <Heading fontWeight="700" fontSize={{base:"20px", md:"25px"}} mb={5} color="blue.400" display="flex">
                                Become a <Image src={Logo} alt="logo" h="40px" w="auto" mx={2} mt="-2px"/>  agent
                            </Heading>
                            <Box textAlign="left">
                                <Input
                                  label="Property name"
                                  name="name"
                                  id="name"
                                  type="text"
                                  placeholder="Property name"
                                  children={<BsHouseDoor color="gray.300" />}
                                />

                                <TextArea
                                  label="Description"
                                  name="description"
                                  id="description"
                                  type="text"
                                  placeholder="Description (150 character allowed)"
                                />

                                <Input
                                  label="Location"
                                  name="location"
                                  id="location"
                                  type="text"
                                  placeholder="Location"
                                  children={<GoLocation color="gray.300" />}
                                />

                                <Input
                                  label="Price"
                                  name="amount"
                                  id="amount"
                                  type="number"
                                  placeholder="Price"
                                  children={<GiToken color="gray.300" />}
                                />

                                <Select label="Token type" name="symbol" id="symbol">
                                    <option value="">Select stable coin</option>
                                    <option value="TUSDT">TUSDT</option>
                                    <option value="USDT" disabled>USDT</option>
                                    <option value="DAI" disabled>DAI</option>
                                </Select>

                                <Flex mb={3} mt={5} justify="space-around">
                                    <Button 
                                        colorScheme="blue.400" 
                                        isDisabled={Object.keys(errors).length > 0 || imageUrl=== "" || isApproved ? true : false}
                                        variant="outline"
                                        onClick={onOpenModal}
                                        w="45%"
                                    >
                                        {' '}
                                        Approve
                                    </Button>
                                    <Button 
                                        bg="blue.400" 
                                        color="white"
                                        isLoading={isSubmitting}
                                        isDisabled={Object.keys(errors).length > 0 || imageUrl === ""  || !isApproved ? true : false}
                                        type="submit" 
                                        w="45%"
                                    >
                                        {' '}
                                        List 
                                    </Button>
                                </Flex>

                            </Box>
                        </Form>
                    )}
                </Formik>
                }
            </Box>
        </Flex>
        <ApproveModal isOpen={isOpenModal} onClose={onCloseModal} approve={approve} loading={loading}/>
        <MintModal isOpen={isMintOpen} onClose={onMintClose} mint={mint} loading={isMintLoading} />
        </>
    )
}

export default ListProperty
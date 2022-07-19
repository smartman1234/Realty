import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Image,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import Logo from "../assets/svg/1.svg"

export default function Navbar() {
  const toast = useToast()
  const { isOpen, onToggle } = useDisclosure();
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title:"Opps!",
          description:"You need to install metamask",
          status:"error",
          duration:1500,
          variant:"subtle",
          isClosable:true,
        })
        console.log("you need to install metamask");
      } else {
        console.log("found one", ethereum);
      }
      /*
       * Check if we're authorized to access the user's wallet
       */

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        toast({
          title:"Successful!",
          description:"Connected to " + account,
          status:"success",
          duration:1500,
          variant:"subtle",
          isClosable:true,
        })
        console.log("account ", account);
        setCurrentAccount(account);
      } else {
        toast({
          title:"Oppps!",
          description:"You need to connect your metamask wallet",
          status:"info",
          duration:1500,
          variant:"subtle",
          isClosable:true,
        })
        console.log("no authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //connect wallet with button click
  const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          toast({
            title:"Opps!",
            description:"You need to install metamask",
            status:"error",
            duration:1500,
            variant:"subtle",
            isClosable:true,
          })
          console.log("you need to install metamask");
          return;
        }
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Connected", accounts[0]);
        toast({
            title:"Successful!",
            description:"Connected to " + accounts[0],
            status:"success",
            duration:1500,
            variant:"subtle",
            isClosable:true,
          })
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
  };

  //diconnect wallet with button click
   const disconnectWallet = () => {
     setCurrentAccount("");
      toast({
        title:"Disconnected",
        description:"You need to connect to your metamask wallet",
        status:"info",
        duration:1500,
        variant:"subtle",
        isClosable:true,
      })
   }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  //truncate wallet address
  function truncate(input) {
    return input.substring(0, 5) + "..." + input.substring(38);
  }

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems="center"
        >
          <Link href='/' _hover={{textDecoration: 'none'}}>
          <Image src={Logo} alt="logo" h={{base:"40px", md:"70px" }} w="auto" ml={{base:"-30px", md:"0px"}}/>
          
          </Link>
         
        </Flex>
        <Flex display={{ base: "none", md: "flex" }} mr="6">
          <DesktopNav />
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {currentAccount.length === 0 ? (
            <Button
              fontSize={"sm"}
              fontWeight={600}
              colorScheme="blue"
              href={"#"}
              onClick={() => connectWallet()}
            >
              Connect wallet
            </Button>
          ) : (
            <Button
              fontSize={"sm"}
              fontWeight={600}
              colorScheme="blue"
              cursor="auto"
              href={"#"}
              onClick={() => disconnectWallet()}
            >
              {truncate(currentAccount)}
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  // const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: "blue.400",
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Set Payment Token",
    href: "/set-payment-token",
  },
  {
    label: "Featured Properties",
    href: "/properties",
  },
  {
    label: "List Property",
    href: "/list-property",
  },
  ]
//   {
//     label: "Lease Property",
//     href: "#",
//   },
// ];

// import React from "react";
import {
  Center,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setUser(user);
      navigate("/chats");
    }
  }, []);

  return (
    <Center h="100vh" w="100vw">
      <Box maxW={"2xl"} w="600px" h="auto" p={10}>
        <Flex direction="column" alignItems="center">
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            w="100%"
            h="60px"
            bg="white"
            borderRadius="md"
            color="white"
            mb={4}
          >
            <Text
              className="gradient-text"
              textAlign={"center"}
              fontWeight={"bold "}
              fontSize={"2xl"}
              letterSpacing={"1px"}
            >
              TALK - A - TIVE
            </Text>
          </Box>
          <Box w="100%" bg="white" borderRadius="md" p={4} color="white">
            <Tabs variant="soft-rounded">
              <TabList gap={"10px"}>
                <Tab
                  width={"50%"}
                  background={"linear-gradient(#e66465,40%,#757edf)"}
                  textColor={"white"}
                  border="2px solid"
                  borderImage="linear-gradient(#e66465, #757edf) 1"
                  borderRadius={"inherit"}
                  _selected={{
                    border: "2.5px solid",
                    borderImage: "linear-gradient(#e66465, #757edf) 1",
                  }}
                >
                  Login
                </Tab>
                <Tab
                  width={"50%"}
                  background={"linear-gradient(#e66465,40%,#757edf)"}
                  textColor={"white"}
                  border="2px solid"
                  borderRadius={"inherit"}
                  borderImage="linear-gradient(#e66465, #757edf) 1"
                  _selected={{
                    border: "2.5px solid",
                    borderImage: "linear-gradient(#e66465, #757edf) 1",
                  }}
                >
                  Signup
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
};

export default Home;

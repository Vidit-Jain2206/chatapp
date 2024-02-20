import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { chatState, userState } from "../../recoil/atoms";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
// eslint-disable-next-line react/prop-types
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const [user] = useRecoilState(userState);
  const [chats, setChats] = useRecoilState(chatState);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/users/allusers?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const addUsertoGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers((prevState) => {
      return [...prevState, user];
    });
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id));
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Enter All the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/chats/group`,
        {
          chatName: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group chat created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}> {children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            fontFamily={"Work Sans"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl>
              {" "}
              <Input
                placeholder="Add users eg: Vidit, Abhi"
                mb={1}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              ></Input>
            </FormControl>
            {/* selected users */}
            <Box display="flex" flexDir="row" gap={"5px"}>
              {selectedUsers.map((item, index) => {
                return (
                  <Flex
                    cursor={"pointer"}
                    px={3}
                    py={2}
                    w={"80px"}
                    borderRadius="xl"
                    shadow="md"
                    key={index}
                    backgroundColor={"red"}
                    display={"flex"}
                    flexDir={"row"}
                    justifyItems={"space-betwen"}
                    alignItems={"center"}
                  >
                    <Text
                      flex="1"
                      // mr={"10px"}
                      color={"white"}
                      fontSize={"15px"}
                    >
                      {item.username}
                    </Text>
                    <IconButton
                      icon={<CloseIcon color={"white"} fontSize={"10px"} />}
                      size={"10px"}
                      backgroundColor={"red"}
                      p={2}
                      onClick={() => handleDelete(item)}
                      _hover={{ backgroundColor: "red" }}
                    />
                  </Flex>
                );
              })}
            </Box>

            {/* render search results */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResults?.slice(0, 4).map((item, index) => {
                return (
                  <UserListItem
                    user={item}
                    key={index}
                    handlefunction={() => addUsertoGroup(item)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

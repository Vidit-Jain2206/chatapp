import { CloseIcon, ViewIcon } from "@chakra-ui/icons";
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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { selectedChatState, userState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import UserListItem from "../userAvatar/UserListItem";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [user] = useRecoilState(userState);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRemoveUser = async (item) => {
    if (selectedChat.groupAdmin._id !== user._id && item._id !== user._id) {
      toast({
        title: "Only Admin can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.put(
        `/api/chats/groupremove`,
        { chatId: selectedChat._id, userId: item._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      item._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setLoading(false);
      fetchMessages();
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setLoading(false);
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
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        `/api/chats/grouprename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
    } catch (error) {
      setRenameLoading(false);
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }

    setGroupChatName("");
  };

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
  const addUsertoGroup = async (item) => {
    if (selectedChat.users.find((u) => u._id === item._id)) {
      toast({
        title: "User is already in group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id === item._id) {
      toast({
        title: "Only Admin can add user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/chats/groupadd`,
        { chatId: selectedChat._id, userId: item._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
    } catch (error) {
      setLoading(false);
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
    <div>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            fontFamily={"Work Sans"}
            fontSize={"35px"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              width={"100%"}
              display={"flex"}
              flexWrap={"wrap"}
              pb={3}
              gap={2}
            >
              {selectedChat.users.map((item, index) => {
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
                      onClick={() => handleRemoveUser(item)}
                      _hover={{ backgroundColor: "red" }}
                    />
                  </Flex>
                );
              })}
              <FormControl display={"flex"}>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => {
                    setGroupChatName(e.target.value);
                  }}
                ></Input>
                <Button
                  variant={"solid"}
                  // colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                  onClick={() => handleRename}
                >
                  Update
                </Button>
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
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              // colorScheme="red"
              mr={3}
              onClick={() => handleRemoveUser(user)}
            >
              Leaver Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;

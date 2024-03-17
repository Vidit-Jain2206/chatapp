import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Badge, IconButton } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";

import { useCallback, useState } from "react";
import { BiSearch, BiSolidChevronDown } from "react-icons/bi";
import { useRecoilState } from "recoil";
import {
  chatState,
  notificationState,
  selectedChatState,
  userState,
} from "../../recoil/atoms";
import ProfilePopUp from "./ProfilePopUp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const [user] = useRecoilState(userState);
  const [chats, setChats] = useRecoilState(chatState);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [notification, setNotification] = useRecoilState(notificationState);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearchUser = useCallback(async () => {
    if (!search) {
      let arr = [];
      setLoading(false);
      setSearchResult(arr);
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
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
      setSearchResult(data);
    } catch (error) {
      let arr = [];
      setLoading(false);
      setSearchResult(arr);
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  }, [search, toast, user.token]);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chats", { userId }, config);
      if (
        !chats.find((c) => {
          return c._id === data._id;
        })
      ) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the data",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={"white"}
        w="100%"
        // boxSize={"border-box"}
        p="5px 10px 5px 10px"
        // borderWidth={"5px"}
      >
        <Tooltip label="Select Users to chat" hasArrow placement="bottom-end">
          <Button
            size={"md"}
            variant={"ghost"}
            alignContent="center"
            justifyContent="space-between"
            d="flex"
            onClick={onOpen}
          >
            <BiSearch />
            <Text display={{ base: "none", md: "flex" }} px={"4px"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
          TALKS
        </Text>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Menu>
            <MenuButton p={2}>
              <IconButton
                aria-label="Notification Bell"
                icon={<BellIcon />}
                size="lg"
              >
                {notification?.length > 0 && (
                  <Badge
                    borderRadius="full"
                    px={2}
                    // colorScheme="red"
                    position="absolute"
                    top="0"
                    right="0"
                  >
                    {notification.length}
                  </Badge>
                )}
              </IconButton>
            </MenuButton>
            {/* Menu notifications */}
            <MenuList pl={2}>
              {!notification.length && "No new Messages"}
              {notification.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chatId);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chatId.isGroupChat
                      ? `New Message in ${notif.chatId.chatName}`
                      : `New Message from ${getSender(
                          user,
                          notif.chatId.users
                        )}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<BiSolidChevronDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.username}
                src={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfilePopUp user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfilePopUp>

              <MenuDivider></MenuDivider>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearchUser}>Go</Button>
            </Box>
            <Box d="flex" direction="column">
              {loading ? (
                <Stack>
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                </Stack>
              ) : (
                searchResult &&
                searchResult.length > 0 &&
                searchResult.map((item, index) => {
                  return (
                    <UserListItem
                      key={index}
                      user={item}
                      handlefunction={() => accessChat(item._id)}
                    >
                      {item.username}
                    </UserListItem>
                  );
                })
              )}
              {loadingChat && <Spinner ml="auto" d="flex" />}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

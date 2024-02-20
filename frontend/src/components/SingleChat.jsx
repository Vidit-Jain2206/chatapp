import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  notificationState,
  selectedChatState,
  userState,
} from "../recoil/atoms";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfilePopUp from "./miscellaneous/ProfilePopUp";
import { BsEyeFill } from "react-icons/bs";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./message.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import { BsCameraVideoFill } from "react-icons/bs";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [user] = useRecoilState(userState);
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useRecoilState(notificationState);
  // const [requestVideoCall, setRequestVideoCall] = useState("false");
  // const [requestVideoCallPopup, setRequestVideoCallPopup] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnection(true);
    });
    socket.on("start typing", (item) => {
      if (user._id !== item._id) {
        setIsTyping(true);
      }
    });
    socket.on("request video call", (item) => {
      if (user._id !== item._id) {
        if (confirm(`${item.username} Requests video call`)) {
          socket.emit("accept video call", { users: selectedChat.users });
        }
      }
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        duration: 3000,
        status: error,
        isClosable: true,
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/messages",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.message,
          duration: 3000,
          status: error,
          isClosable: true,
        });
      }
    }
  };
  const typingHanlder = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnection) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("start typing", { room: selectedChat._id, user });
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleVideoCall = () => {
    socket.emit("start video call", { room: selectedChat._id, user });
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (msg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== msg.chatId._id) {
        //give notification
        let filtered = notification.filter((notif) => {
          return notif._id === msg._id;
        });

        if (filtered.length === 0) {
          setNotification([msg, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, msg]);
      }
    });
  });

  return (
    <>
      {!selectedChat ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
          border={"4px"}
          borderColor={"red"}
          width={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      ) : (
        <Box height={"100%"} width={"100%"} display={"flex"} flexDir={"column"}>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!selectedChat.isGroupChat ? (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width="100%"
              >
                {getSender(user, selectedChat.users)}
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={"1rem"}
                >
                  <BsCameraVideoFill onClick={handleVideoCall} />
                  <ProfilePopUp user={getSenderFull(user, selectedChat.users)}>
                    <BsEyeFill></BsEyeFill>
                  </ProfilePopUp>
                </Box>
              </Box>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"space-between"}
            p={3}
            width={"100%"}
            height={"100%"}
            bg={"#E8E8E8"}
            borderRadius={"lg"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                width={20}
                height={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}></ScrollableChat>
              </div>
            )}

            <FormControl onKeyDown={sendMessage}>
              {isTyping ? (
                <Lottie
                  loop={true}
                  animationData={animationData}
                  style={{
                    marginBottom: "15px",
                    marginLeft: 0,
                    width: "45px",
                    height: "25px",
                  }}
                ></Lottie>
              ) : (
                <p></p>
              )}
              <Input
                variant={"filled"}
                bg="E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHanlder}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

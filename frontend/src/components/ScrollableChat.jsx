import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const [user] = useRecoilState(userState);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((item, i) => {
          return (
            <div key={item._id} style={{ display: "flex" }}>
              {(isSameSender(messages, item, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={item.sender.username}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt={7}
                    mr={1}
                    size={"sm"}
                    cursor={"pointer"}
                    name={item.sender.username}
                    src={item.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    item.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, item, i, user._id),
                  marginTop: isSameUser(messages, item, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {item.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

/* eslint-disable react/prop-types */
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { BsEyeFill } from "react-icons/bs";

const ProfilePopUp = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : <BsEyeFill />}
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work Sans"}
            display="flex"
            justifyContent={"center"}
          >
            {user.username}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent="center"
            flexDir="column"
            alignItems="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              marginBottom={"20px"}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work Sans"
            >
              Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePopUp;

import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms";

const Signup = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState("");
  const toast = useToast();
  const [user, setUser] = useRecoilState(userState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const { data } = await axios.post(
        "/api/users/signup",
        { ...formData, pic },
        config
      );
      toast({
        title: "New User Created Succesfully",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/jpg" ||
      pics.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dlpun2fmu");

      fetch("https://api.cloudinary.com/v1_1/dlpun2fmu/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image of required type",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel textColor={"black"}>Username</FormLabel>
          <Input
            _hover={{ border: "1px", borderColor: "black" }}
            textColor={"black"}
            border={"1px"}
            borderColor={"black"}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel textColor={"black"}>Email Address</FormLabel>
          <Input
            _hover={{ border: "1px", borderColor: "black" }}
            textColor={"black"}
            border={"1px"}
            borderColor={"black"}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel textColor={"black"}>Password</FormLabel>
          <InputGroup>
            <Input
              _hover={{ border: "1px", borderColor: "black" }}
              textColor={"black"}
              border={"1px"}
              borderColor={"black"}
              type={show ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputRightElement
              textColor={"black"}
              onClick={() => {
                setShow(!show);
              }}
            >
              {show ? <AiFillEye /> : <AiFillEyeInvisible />}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic" mt={4}>
          <FormLabel textColor={"black"}>Upload your Picture</FormLabel>
          <Input
            border={"1px"}
            borderColor={"black"}
            _hover={{ border: "1px", borderColor: "black" }}
            textColor={"black"}
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        <Button
          className="gradient-button-text"
          mt={4}
          textColor="white"
          background="linear-gradient(#e66465,40%,#757edf)"
          type="submit"
          width={"50%"}
          isLoading={loading}
          _hover={{
            border: "2px solid",
            borderImage: "linear-gradient(#e66465, #757edf) 1",
          }}
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Signup;

import { useCallback, useState } from "react";
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

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [user, setUser] = useRecoilState(userState);

  // const handleChange = useCallback(() => {}, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    console.log("hello");
    setLoading(true);
    if (!formData.email || !formData.password) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        { ...formData },
        config
      );
      const { data } = response;

      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
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
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl mt={4}>
          <FormLabel textColor={"black"}>Email Address</FormLabel>
          <Input
            _hover={{ border: "1px", borderColor: "black" }}
            textColor={"black"}
            border={"1px"}
            borderColor={"black"}
            type="email"
            outline={"none"}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            _selected={{
              outline: "none",
            }}
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
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;

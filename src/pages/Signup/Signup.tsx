/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Config } from "../../config/config";
const primaryGreenColor = "#144E49";

const Signup = () => {
  return (
    <>
      <Grid container spacing={0}>
        <Grid item style={{ zIndex: 1, maxHeight: "100vh" }}>
          <FormBackground></FormBackground>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ position: "absolute", zIndex: 2, height: "100vh" }}
        >
          <Grid container spacing={0}>
            <Grid item xs={5}>
              <SideImage></SideImage>
            </Grid>
            <Grid
              item
              spacing={0}
              xs={7}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                width: "100vh",
              }}
            >
              <Form></Form>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ zIndex: 3 }} spacing={0}>
          <ForeGroundImage></ForeGroundImage>
        </Grid>
      </Grid>
    </>
  );
};

const SideImage = () => {
  return (
    <Grid container spacing={0}>
      <Grid item style={{ position: "absolute", left: "" }}>
        <Box p={5}>
          <Typography
            color={"rgba(255,255,255,.8)"}
            fontFamily={"monospace"}
            fontStyle={"italic"}
            fontSize={32}
          >
            Your Data{<br></br>} Anytime, Anywhere!
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <img
          src="../../src/assets/signup_background.png"
          style={{ height: "100vh", width: "100%" }}
        ></img>
      </Grid>
    </Grid>
  );
};
const FormBackground = () => {
  return (
    <img
      style={{
        width: "100%",
        height: "100%",
      }}
      src="../../src/assets/signup_background2.png"
    ></img>
  );
};
const ForeGroundImage = () => {
  return (
    <img
      src="../../src/assets/signup_background1.png"
      style={{
        height: "50%",
        position: "absolute",
        bottom: 0,
        right: 0,
      }}
    ></img>
  );
};
const Form = () => {
  const [formData, setFormData] = useState({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
  });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor | undefined>(
    "success"
  );
  const [alertMessage, setAlertMesage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  function clearFields() {
    setFirstNameValue("");
    setLastNameValue("");
    setEmailValue("");
    setPasswordValue("");
  }
  function onCreateAccountClicked() {
    setIsLoading(true);
    axios
      .post(`${Config.baseUrl}/auth/signup`, formData)
      .then((response) => {
        if (response.status == 201) {
          handleOnSuccess("Signed up!");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response.status == 403) {
          handleOnError(error.response.data.message);
        } else {
          handleOnError("Something went wrong!");
        }
        // handleOnError(error.response.data.message);
      });
  }
  function onInputChanged(
    event: any,
    valueSetter: React.Dispatch<React.SetStateAction<string>>
  ) {
    valueSetter(event.target.value);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }
  function onClose() {
    setIsSnackbarOpen(false);
  }

  function handleOnError(message: string) {
    setIsSnackbarOpen(true);
    setAlertSeverity("error");
    setAlertMesage(message);
  }
  function handleOnSuccess(message: string) {
    setIsSnackbarOpen(true);
    setAlertSeverity("success");
    setAlertMesage(message);
    clearFields();
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  const navigate = useNavigate();

  return (
    <>
      <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={onClose}>
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>

      <Grid
        container
        height={"100vh"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item>
          <Typography fontSize={24} color={primaryGreenColor}>
            Create Account
          </Typography>
        </Grid>
        <Box height={"2%"}></Box>
        {/* <Grid container justifyContent={"center"}>
            <Grid item>
              <SocialSignupButton buttonName="Google"></SocialSignupButton>
            </Grid>
            <Grid item>
              <SocialSignupButton buttonName="Facebook"></SocialSignupButton>
            </Grid>
          </Grid> */}
        {/*  */}
        {/* <Box height={"10%"}></Box> */}
        {/*  */}
        {/* <Grid item>
            <Typography fontSize={24} color={primaryGreenColor}>- OR -</Typography>
          </Grid> */}
        {/*  */}
        <Box height={"5%"}></Box>
        {/*  */}
        <Grid container direction={"column"} alignContent={"center"}>
          <Grid item>
            <InputField
              value={firstNameValue}
              fieldName="firstname"
              label="First Name"
              onInputChanged={(e) => {
                onInputChanged(e, setFirstNameValue);
              }}
            ></InputField>
          </Grid>{" "}
          <Grid item>
            <InputField
              value={lastNameValue}
              fieldName="lastname"
              label="Last Name"
              onInputChanged={(e) => {
                onInputChanged(e, setLastNameValue);
              }}
            ></InputField>
          </Grid>
          <Grid item>
            <InputField
              value={emailValue}
              fieldName="email"
              onInputChanged={(e) => {
                onInputChanged(e, setEmailValue);
              }}
              label="Email Address"
            ></InputField>
          </Grid>
          <Grid item>
            <InputField
              value={passwordValue}
              fieldName="password"
              onInputChanged={(e) => {
                onInputChanged(e, setPasswordValue);
              }}
              label="Password"
            ></InputField>
          </Grid>
          <Grid item alignSelf={"center"}>
            <Box m={10}>
              <Button
                variant="contained"
                style={{ backgroundColor: primaryGreenColor }}
                onClick={() => {
                  onCreateAccountClicked();
                }}
              >
                {isLoading == true ? (
                  <CircularProgress sx={{ color: "white" }}></CircularProgress>
                ) : (
                  <Typography>Create Account</Typography>
                )}
              </Button>
            </Box>
          </Grid>
          {/*  */}
          <Grid item>
            <Grid container justifyContent={"center"} alignItems={"center"}>
              <Grid item>
                <Typography color={primaryGreenColor}>
                  Already have an account?
                </Typography>
              </Grid>
              <Box width={10}></Box>
              <Grid item>
                <Button
                  style={{
                    backgroundColor: primaryGreenColor,
                    color: "white",
                  }}
                  variant="outlined"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  {" "}
                  Log In
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/*  */}
        </Grid>
        {/*  */}
      </Grid>
    </>
  );
};
interface TextFieldsProps {
  value: string;
  label: string;
  fieldName: string;
  onInputChanged: (arg0: any) => void;
}
const InputField = ({
  label,
  onInputChanged,
  fieldName,
  value,
}: TextFieldsProps) => {
  return (
    <Box p={2}>
      <TextField
        InputProps={{
          style: {
            color: primaryGreenColor,
            width: "500px",
            height: "30px",
          },
        }}
        value={value}
        label={label}
        name={fieldName}
        variant="standard"
        onChange={(event) => {
          onInputChanged(event);
        }}
      ></TextField>
    </Box>
  );
};

// interface ButtonProps {
//   buttonName: string;
// }

// const SocialSignupButton = ({ buttonName }: ButtonProps) => {
//   return (
//     <Box margin={2}>
//       <Button style={{ color: "black" }} variant="outlined">
//         <img
//           src={
//             buttonName == "Google"
//               ? "src/assets/icons/google.png"
//               : "src/assets/icons/facebook.png"
//           }
//           width={20}
//         />
//         <Box width={10}></Box>
//         Sign up with {buttonName}
//       </Button>
//     </Box>
//   );
// };

export default Signup;

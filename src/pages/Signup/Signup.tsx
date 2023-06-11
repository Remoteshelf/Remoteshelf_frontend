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
const primaryGreenColor = "#144E49";

const Signup = () => {
  const containerStyle = {
    height: "100vh",
  };
  return (
    <>
      <Grid container style={containerStyle}>
        <Art></Art>
        <Form></Form>
      </Grid>
    </>
  );
};

const Art = () => {
  const boxStyle = {
    backgroundColor: primaryGreenColor,
    height: "100%",
    left: 0,
    right: "50%",
    zIndex: 1,
  };

  return (
    <Grid item xs={5} style={boxStyle}>
      <BackgroundImage></BackgroundImage>
    </Grid>
  );
};
const BackgroundImage = () => {
  return (
    <img
      src="../../src/assets/signup_background.png"
      style={{
        height: "100%",
        aspectRatio: 6 / 8,
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

  function onCreateAccountClicked() {
    setIsLoading(true);
    axios
      .post("http://192.168.1.64:3000/auth/signup", formData)
      .then((response) => {
        if (response.status == 201) {
          handleOnSuccess("Signed up!");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        handleOnError("Something went wrong!");
        // handleOnError(error.response.data.message);
      });
  }
  function onInputChanged(event: any) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }
  function onClose() {
    setIsSnackbarOpen(false);
  }

  const boxStyle = {
    backgroundColor: "white",
    height: "100%",
    zIndex: 2,
    marginLeft: "-3%",
    borderRadius: "5%",
  };
  function handleOnError(message: string) {
    setIsSnackbarOpen(true);
    setAlertSeverity("error");
    setAlertMesage(message);
  }
  function handleOnSuccess(message: string) {
    setIsSnackbarOpen(true);
    setAlertSeverity("success");
    setAlertMesage(message);
  }

  const navigate = useNavigate();

  return (
    <>
      <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={onClose}>
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>
      <Grid item xs={7} style={boxStyle}>
        <Grid
          container
          height={"100vh"}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid item>
            <Typography color={primaryGreenColor}>Create Account</Typography>
          </Grid>
          <Box height={"2%"}></Box>
          <Grid container justifyContent={"center"}>
            <Grid item>
              <SocialSignupButton buttonName="Google"></SocialSignupButton>
            </Grid>
            <Grid item>
              <SocialSignupButton buttonName="Facebook"></SocialSignupButton>
            </Grid>
          </Grid>
          {/*  */}
          <Box height={"10%"}></Box>
          {/*  */}
          <Grid item>
            <Typography color={primaryGreenColor}>- OR -</Typography>
          </Grid>
          {/*  */}
          <Box height={"5%"}></Box>
          {/*  */}
          <Grid container direction={"column"} alignContent={"center"}>
            <Grid item>
              <InputField
                fieldName="firstname"
                label="First Name"
                onInputChanged={onInputChanged}
              ></InputField>
            </Grid>{" "}
            <Grid item>
              <InputField
                fieldName="lastname"
                label="Last Name"
                onInputChanged={onInputChanged}
              ></InputField>
            </Grid>
            <Grid item>
              <InputField
                fieldName="email"
                onInputChanged={onInputChanged}
                label="Email Address"
              ></InputField>
            </Grid>
            <Grid item>
              <InputField
                fieldName="password"
                onInputChanged={onInputChanged}
                label="Password"
              ></InputField>
            </Grid>
            <Grid item>
              <Box m={10}>
                <Button
                  variant="contained"
                  onClick={() => {
                    onCreateAccountClicked();
                  }}
                >
                  {isLoading == true ? (
                    <CircularProgress
                      sx={{ color: "white" }}
                    ></CircularProgress>
                  ) : (
                    <Typography>Create Account</Typography>
                  )}
                </Button>
              </Box>
            </Grid>
            {/*  */}
            <Grid item>
              <Grid container>
                <Grid item>
                  <Typography color={primaryGreenColor}>
                    Already have an account?
                  </Typography>
                </Grid>
                <Box width={10}></Box>
                <Grid item>
                  <Button
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
      </Grid>
    </>
  );
};
interface TextFieldsProps {
  label: string;
  fieldName: string;
  onInputChanged: (arg0: any) => void;
}
const InputField = ({ label, onInputChanged, fieldName }: TextFieldsProps) => {
  return (
    <TextField
      sx={{
        width: { sm: 200, md: 300 },
        "& .MuiInputBase-root": {
          height: 50,
        },
      }}
      label={label}
      name={fieldName}
      variant="standard"
      onChange={(event) => {
        onInputChanged(event);
      }}
    ></TextField>
  );
};

interface ButtonProps {
  buttonName: string;
}

const SocialSignupButton = ({ buttonName }: ButtonProps) => {
  return (
    <Box margin={2}>
      <Button style={{ color: "black" }} variant="outlined">
        <img
          src={
            buttonName == "Google"
              ? "src/assets/icons/google.png"
              : "src/assets/icons/facebook.png"
          }
          width={20}
        />
        <Box width={10}></Box>
        Sign up with {buttonName}
      </Button>
    </Box>
  );
};

export default Signup;

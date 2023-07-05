import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Config } from "../../config/config";
import { ButtonLoading } from "../../components/ButtonLoading";
const primaryGreenColor = "#144E49";

interface AlertConfig {
  message: string;
  severity: AlertColor | undefined;
}

function LoginForm() {
  const navigate = useNavigate();
  const [loginPayload, setLoginPayload] = useState({
    email: String,
    password: String,
  });
  const [isLoading, setLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    severity: "success",
    message: "Hi there",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);
  function onFieldValueChange(event: any) {
    setLoginPayload({
      ...loginPayload,
      [event.target.name]: event.target.value,
    });
  }
  function handleOnError(message: string) {
    setLoading(false);
    setIsSnackbarOpen(true);
    setAlertConfig({ severity: "error", message: message });
  }
  function handleOnSuccess(message: string) {
    setLoading(false);
    setIsSnackbarOpen(true);
    setAlertConfig({ severity: "success", message: message });
    navigate("/home", { replace: true });
  }
  function onLoginClick() {
    setLoading(true);

    axios
      .post(`${Config.baseUrl}/auth/signin`, loginPayload)
      .then((response) => {
        localStorage.setItem("authToken", response.data.access_token);
        handleOnSuccess("Login Successful!");
      })
      .catch((error) => {
        console.log(error.response);
        if (error.respnose) {
          if (error.response.status == 403) {
            handleOnError(error.response.data.message);
          }
        } else {
          handleOnError(error.message);
        }
      });
  }
  return (
    <>
      <Grid
        container
        sx={{ height: "100vh" }}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Grid item>
          <Snackbar
            open={isSnackbarOpen}
            autoHideDuration={3000}
            onClose={() => {
              setIsSnackbarOpen(false);
            }}
          >
            <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
          </Snackbar>
        </Grid>
        <Grid item>
          <Grid
            paddingLeft={10}
            container
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography
                style={{
                  marginBottom: 60,
                  fontSize: 32,
                  color: primaryGreenColor,
                }}
              >
                Welcome to Remoteshelf, Let's begin!
              </Typography>
            </Grid>
            <Grid item>
              <FormField
                label="Email"
                name="email"
                onInput={onFieldValueChange}
              ></FormField>
            </Grid>{" "}
            <Grid item>
              <FormField
                label="Password"
                name="password"
                onInput={onFieldValueChange}
              ></FormField>
            </Grid>
            <Grid item>
              <Button
                style={{ width: 400, backgroundColor: primaryGreenColor }}
                variant="contained"
                onClick={
                  isLoading == true
                    ? () => {
                        //Do noting
                      }
                    : onLoginClick
                }
              >
                <Typography
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Login
                </Typography>
                {isLoading == true && <ButtonLoading></ButtonLoading>}
              </Button>
            </Grid>
            <Grid
              container
              paddingTop={"20px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography>Don't have an account?</Typography>
              <Link
                onClick={() => {
                  navigate("/signup");
                }}
                style={{
                  paddingLeft: 10,
                  textTransform: "none",
                  color: primaryGreenColor,
                }}
              >
                Signup
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
interface FormProps {
  name: string;
  label: string;
  onInput: (event: any) => void;
}
const FormField = (props: FormProps) => {
  return (
    <TextField
      style={{
        width: 400,
        height: 100,
      }}
      label={props.label}
      onInput={props.onInput}
      name={props.name}
      variant="standard"
    ></TextField>
  );
};
const BackgroundImage = () => {
  return (
    <img
      style={{
        position: "absolute",
        height: "100%",
      }}
      src="src/assets/login_background.jpg"
    ></img>
  );
};

const Login = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={4}>
          <LoginForm></LoginForm>
        </Grid>
        <Grid item xs={8} height={"100vh"}>
          <BackgroundImage></BackgroundImage>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;

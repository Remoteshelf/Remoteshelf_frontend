import {
  Alert,
  AlertColor,
  Button,
  Card,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AlertConfig {
  message: string;
  severity: AlertColor | undefined;
}

function Login() {
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
    navigate("/home");
  }
  function onLoginClick() {
    setLoading(true);
    axios
      .post('http://192.168.1.64:3000/auth/signin', loginPayload)
      .then((response) => {
        localStorage.setItem("authToken", response.data.access_token);
        handleOnSuccess("Login Successful!");
      })
      .catch((error) => {
        if (error.response.status == 403) {
          handleOnError(error.response.data.message);
        } else {
          handleOnError("Login Failed");
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
          {" "}
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
          <Card raised sx={{ height: 500, width: 500 }}>
            <Grid
              container
              direction={"column"}
              justifyContent={"center"}
              height={500}
              alignContent={"center"}
            >
              <Grid item>
                <TextField
                  placeholder="Email"
                  name="email"
                  variant="standard"
                  onInput={onFieldValueChange}
                ></TextField>
              </Grid>{" "}
              <Grid item>
                <TextField
                  onInput={onFieldValueChange}
                  placeholder="Password"
                  name="password"
                  variant="standard"
                ></TextField>
              </Grid>
              <Grid item>
                {isLoading == true ? (
                  <CircularProgress />
                ) : (
                  <Button variant="contained" onClick={onLoginClick}>
                    Login
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;

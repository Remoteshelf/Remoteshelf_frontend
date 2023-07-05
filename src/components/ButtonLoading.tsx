import { Box, CircularProgress } from "@mui/material";

export const ButtonLoading = () => {
  return (
    <>
    <Box width={'8px'}></Box>
     <CircularProgress
      size={"16px"}
      sx={{ color: "white", }}
    ></CircularProgress></>

  );
};

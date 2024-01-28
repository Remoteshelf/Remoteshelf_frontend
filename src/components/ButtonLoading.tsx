import { Box, CircularProgress } from "@mui/material";

interface Props {
  color?: string;
}
export const ButtonLoading = ({ color = "white" }: Props) => {
  return (
    <>
      <Box width={"8px"}></Box>
      <CircularProgress size={"16px"} sx={{ color: color }}></CircularProgress>
    </>
  );
};

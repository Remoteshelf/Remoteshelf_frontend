import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import {
  Delete,
  Download,
  FileCopy,
  MoreVert,
  Star,
  StarOutline,
} from "@mui/icons-material";
import { useState } from "react";
import { FileDto } from "../../dto/FileDto";
import axios from "axios";
import { Config } from "../../config/config";

interface FileProps {
  file: FileDto;
  refresh: () => void;
}
export const FileCard = (props: FileProps) => {
  const [favorite, setFavorite] = useState(false);

  const [showPopupMenu, setShowPopupMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleOpenMenu(event: any) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setShowPopupMenu(true);
  }

  function handleClosePopupMenu() {
    setShowPopupMenu(false);
    setAnchorEl(null);
  }
  function deleteFile() {
    axios
      .delete(`${Config.baseUrl}/file/delete/${props.file.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        handleClosePopupMenu();
        props.refresh();
      })
      .catch((error) => {
        console.log("Error deleting!");
        handleClosePopupMenu();
      });
  }
  async function downloadFile() {
    try {
      const getEndpoint = `${Config.baseUrl}/file/download/${props.file.id}`;
      const response = await axios.get(getEndpoint, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileUrl;

      link.download = props.file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading", error);
    }
    handleClosePopupMenu();
  }
  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={showPopupMenu}
        onClose={handleClosePopupMenu}
      >
        <MenuItem onClick={deleteFile}>
          <Grid container color={""}>
            <Delete style={{ width: 20, marginRight: "10px" }}></Delete>
            <Typography>Delete</Typography>
          </Grid>
        </MenuItem>
        <MenuItem onClick={downloadFile}>
          <Grid container color={""}>
            <Download style={{ width: 20, marginRight: "10px" }}></Download>
            <Typography>Download</Typography>
          </Grid>
        </MenuItem>
      </Popover>
      <Box
        sx={{
          marginRight: "10px",
          marginBottom: "10px",
          border: 1,
          width: 200,
          height: 80,
          p: "10px",
          borderColor: "lightgray",
          borderRadius: "8px",
        }}
      >
        <Grid container sx={{ direction: "column", alignItems: "start" }}>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FileCopy
              sx={{ color: "green", width: "40px", height: "40px" }}
            ></FileCopy>
            <Grid>
              <IconButton
                onClick={() => {
                  setFavorite(!favorite);
                }}
              >
                {favorite == true ? (
                  <Star sx={{ color: "#FFAC00" }}></Star>
                ) : (
                  <StarOutline></StarOutline>
                )}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  handleOpenMenu(e);
                }}
              >
                <MoreVert></MoreVert>
              </IconButton>
            </Grid>
          </Grid>
          <Grid>
            <Typography sx={{ color: "#343D47" }}>
              {" "}
              {props.file.filename}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

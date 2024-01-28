import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { FolderDto } from "../../dto/FolderDto";
import {
  Delete,
  Folder,
  MoreVert,
  Star,
  StarOutline,
} from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
import { Config } from "../../config/config";

interface FolderProps {
  folder: FolderDto;
  refresh: () => void;
  onFolderDoubleClick: () => void;
}
export const FolderCard = (props: FolderProps) => {
  const [favorite, setFavorite] = useState(false);
  const [showPopupMenu, setShowPopupMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setLoading] = useState(false);
  function deleteFolder() {
    handleClosePopupMenu();
    setLoading(true);
    axios
      .delete(`${Config.baseUrl}/folder/delete/${props.folder.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        props.refresh();
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error deleting!");
      });
  }

  function handleOpenMenu(event: any) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setShowPopupMenu(true);
  }

  function handleClosePopupMenu() {
    setShowPopupMenu(false);
    setAnchorEl(null);
  }
  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={showPopupMenu}
        onClose={handleClosePopupMenu}
      >
        <MenuItem onClick={deleteFolder}>
          <Grid container color={""}>
            <Delete
              style={{ width: 20, marginRight: "10px", color: "red" }}
            ></Delete>
            <Typography sx={{ color: "red" }}>Delete</Typography>
          </Grid>
        </MenuItem>
      </Popover>
      <Button
        sx={{
          padding: 0,
          marginRight: "10px",
          marginBottom: "10px",
        }}
        onDoubleClick={() => {
          props.onFolderDoubleClick();
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            border: 1,
            width: 200,
            height: 80,
            p: "10px",
            borderColor: "lightgray",
            borderRadius: "8px",
          }}
        >
          {isLoading == true ? (
            <CircularProgress sx={{ alignSelf: "center", color: "green" }} />
          ) : (
            <Grid container sx={{ direction: "column", alignItems: "start" }}>
              <Grid
                container
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Folder
                  sx={{ color: "#FFCF5B", width: "40px", height: "40px" }}
                ></Folder>
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
              <Grid sx={{}}>
                <Typography sx={{ color: "#343D47", textTransform: "none" }}>
                  {" "}
                  {props.folder.name}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Button>
    </>
  );
};

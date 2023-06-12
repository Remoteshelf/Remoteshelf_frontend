import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import * as icons from "@mui/icons-material";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { FolderDto } from "../../dto/FolderDto";
import { FileDto } from "../../dto/FileDto";

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [createFolderFieldText, setCreateFolderFieldText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const fetchFolders = () => {
    axios
      .get("http://192.168.1.64:3000/folder/root", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setFolders(
          response.data.folders.map((folder: FolderDto) => (
            <Grid item key={folder.id}>
              <Folder name={folder.name}></Folder>
            </Grid>
          ))
        );

        setFiles(
          response.data.files.map((file: FileDto) => (
            <Grid item key={file.id}>
              <File name={file.filename}></File>
            </Grid>
          ))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  function handleOnCancelDialog() {
    setIsDialogOpen(false);
  }
  function handleOnCreateDialog() {
    axios
      .post(
        "http://192.168.1.64:3000/folder/create",
        {
          name: createFolderFieldText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        fetchFolders();
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function onChange(event: any) {
    setCreateFolderFieldText(event.target.value);
  }

  function handleFileUpload() {
    const formData = new FormData();
    formData.append("file", selectedFile!);

    axios
      .post("http://192.168.1.64:3000/file/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        fetchFolders();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  }
  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <DialogTitle>Creat a folder of your choice</DialogTitle>
        <TextField
          name="foldername"
          variant="standard"
          label="Folder Name"
          onChange={onChange}
        ></TextField>
        <DialogActions>
          <Button onClick={handleOnCancelDialog}>Cancel</Button>
          <Button onClick={handleOnCreateDialog}>Create</Button>
        </DialogActions>
      </Dialog>
      <Grid container>
        <Grid item height={"100vh"} width={"20%"}>
          <Grid container direction={"column"}>
            <Grid item>
              <Fab
                variant="extended"
                color="primary"
                onClick={handleFileUpload}
              >
                Upload File
              </Fab>
              <input type="file" onChange={handleFileChange}></input>
            </Grid>
            <Box height={20}></Box>
            <Grid item>
              <Fab
                variant="extended"
                color="secondary"
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                Create Folder
              </Fab>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            {folders.map((folder) => folder)}
            {files.map((file) => file)}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;

interface FolderProps {
  name: string;
}

const Folder = ({ name }: FolderProps) => {
  return (
    <Grid container direction={"column"} flex={"Grid"}>
      <Grid item>
        <icons.Folder></icons.Folder>
      </Grid>
      <Grid item> {name}</Grid>
    </Grid>
  );
};
interface FileProps {
  name: string;
}
const File = ({ name }: FileProps) => {
  return (
    <Grid container direction={"column"} flex={"Grid"}>
      <Grid item>
        <icons.FileCopy></icons.FileCopy>
      </Grid>
      <Grid item> {name}</Grid>
    </Grid>
  );
};

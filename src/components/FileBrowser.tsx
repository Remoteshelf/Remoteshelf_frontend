/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  Grid,
  TextField,
} from "@mui/material";
import * as icons from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { FolderDto } from "../dto/FolderDto";
import { Config } from "../config/config";
import { FileDto } from "../dto/FileDto";

const FileBrowser = () => {
  const [page, setPage] = useState(<CircularProgress></CircularProgress>);
  const paths = ["/root"];
  useEffect(() => {
    setPage(
      <BrowsingPage
        pathRecord={paths}
        page={page}
        setPage={setPage}
        path="/root"
      ></BrowsingPage>
    );
  }, []);
  return <>{page}</>;
};

export default FileBrowser;

interface BrowsingPageProps {
  pathRecord: Array<string>;
  page: any;
  setPage: React.Dispatch<React.SetStateAction<JSX.Element>>;
  path: string;
}

const BrowsingPage = ({
  setPage,
  path,
  page,
  pathRecord,
}: BrowsingPageProps) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [createFolderFieldText, setCreateFolderFieldText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [folderId, setFolderId] = useState(0);
  const handleOnFolderClick = (folderId: number) => {
    setFolderId(folderId);
    pathRecord.push(`/all/${folderId}`);
    setPage(
      <BrowsingPage
        pathRecord={pathRecord}
        page={page}
        setPage={setPage}
        path={pathRecord[pathRecord.length - 1]}
      ></BrowsingPage>
    );
  };

  const fetchFilesAndFolders = (fetchPath: string) => {
    axios
      .get(`${Config.baseUrl}/folder${fetchPath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setFolders(
          response.data.folders.map((folder: FolderDto) => (
            <Grid item key={folder.id}>
              <Folder
                name={folder.name}
                onFolderClick={() => {
                  handleOnFolderClick(folder.id);
                }}
              ></Folder>
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
    console.log("hi there");
    fetchFilesAndFolders(path);
  }, [path]);

  function handleOnCancelDialog() {
    setIsDialogOpen(false);
  }
  function handleOnCreateDialog() {
    axios
      .post(
        `${Config.baseUrl}/folder/create`,
        path === "/root"
          ? {
              name: createFolderFieldText,
            }
          : {
              name: createFolderFieldText,
              parentId: folderId,
            },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        fetchFilesAndFolders(path);
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
    if (path !== "/root") {
      formData.append("folderId", folderId.toString());
    }

    axios
      .post(`${Config.baseUrl}/file/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        fetchFilesAndFolders(path);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  }

  function handleOnBackClicked() {
    pathRecord.pop();
    setPage(
      <BrowsingPage
        page={<></>}
        path={pathRecord[pathRecord.length - 1]}
        setPage={setPage}
        pathRecord={pathRecord}
      ></BrowsingPage>
    );
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
              {pathRecord.length > 1 && (
                <Button
                  onClick={() => {
                    handleOnBackClicked();
                  }}
                >
                  <icons.ArrowBack></icons.ArrowBack>
                </Button>
              )}
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

interface FolderProps {
  name: string;
  onFolderClick: () => void;
}

const Folder = ({ name, onFolderClick }: FolderProps) => {
  return (
    <Button onClick={onFolderClick}>
      <Grid container direction={"column"} flex={"Grid"}>
        <Grid item>
          <icons.Folder></icons.Folder>
        </Grid>
        <Grid item> {name}</Grid>
      </Grid>
    </Button>
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

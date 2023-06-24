/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Input,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import * as icons from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { FolderDto } from "../dto/FolderDto";
import { Config } from "../config/config";
import { FileDto } from "../dto/FileDto";
import { useNavigate } from "react-router-dom";
const primaryGreenColor = "#144E49";

const FileBrowser = () => {
  const [page, setPage] = useState(<CircularProgress></CircularProgress>);
  const paths = ["/root"];
  const folders = [""];
  useEffect(() => {
    setPage(
      <BrowsingPage
        folderRecord={folders}
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
  folderRecord: Array<string>;
  pathRecord: Array<string>;
  page: any;
  setPage: React.Dispatch<React.SetStateAction<JSX.Element>>;
  path: string;
}

const BrowsingPage = ({
  folderRecord,
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
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOnFolderClick = (folderId: number, folderName: string) => {
    setFolderId(folderId);
    pathRecord.push(`/all/${folderId}`);
    if (folderRecord.length > 1) {
      folderRecord.push(` → ${folderName}`);
    } else {
      folderRecord.push(`${folderName}`);
    }
    setPage(
      <BrowsingPage
        folderRecord={folderRecord}
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
                folder={folder}
                onFolderClick={() => {
                  handleOnFolderClick(folder.id, folder.name);
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

  function handleOnFolderCreate() {
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
  function onFolderTextFieldValueChange(event: any) {
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
        setIsFileDialogOpen(false);
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
    folderRecord.pop();
    pathRecord.pop();
    setPage(
      <BrowsingPage
        folderRecord={folderRecord}
        page={<></>}
        path={pathRecord[pathRecord.length - 1]}
        setPage={setPage}
        pathRecord={pathRecord}
      ></BrowsingPage>
    );
  }
  return (
    <>
      <FileUploadDialog
        onUpload={() => {
          handleFileUpload();
        }}
        onCancel={() => {
          setIsFileDialogOpen(false);
        }}
        open={isFileDialogOpen}
        onFileChange={handleFileChange}
        onClose={() => {
          setIsFileDialogOpen(false);
        }}
      ></FileUploadDialog>

      <FolderCreateDialog
        open={isDialogOpen}
        onCancel={() => {
          setIsDialogOpen(false);
        }}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onChange={onFolderTextFieldValueChange}
        onCreate={handleOnFolderCreate}
      ></FolderCreateDialog>

      <Grid container>
        <Grid
          item
          height={"100vh"}
          width={"15%"}
          sx={{
            backgroundColor: `rgba(69,161,77,0.05)`,
          }}
        >
          <Grid
            container
            sx={{ height: "100vh", paddingTop: "10px", paddingBottom: "10px" }}
            alignContent={"space-between"}
          >
            <Grid container direction={"column"}>
              <Grid item>
                <FileUploadButton
                  onClick={() => {
                    setIsFileDialogOpen(true);
                  }}
                ></FileUploadButton>
              </Grid>
              <Grid item>
                <CreateFolderButton
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                ></CreateFolderButton>
              </Grid>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <CustomListItemButton
                title="Logout"
                icon={<icons.Logout></icons.Logout>}
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              ></CustomListItemButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sx={{
            padding: "10px",
          }}
        >
          <DirectoryView
            directoryList={folderRecord}
            pathRecord={pathRecord}
            onBackClick={() => {
              handleOnBackClicked();
            }}
          ></DirectoryView>
          <Grid container spacing={2}>
            {folders.map((folder) => folder)}
            {files.map((file) => file)}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
interface FolderCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  onCancel: () => void;
  onChange: (event: any) => void;
}
const FolderCreateDialog = (props: FolderCreateDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Creat a folder of your choice</DialogTitle>
      <TextField
        sx={{
          margin: "10px",
        }}
        name="foldername"
        variant="standard"
        label="Folder Name"
        onChange={props.onChange}
      ></TextField>
      <DialogActions>
        <Button
          sx={{
            textTransform: "none",
            color: "red",
          }}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            color: primaryGreenColor,
            textTransform: "none",
          }}
          onClick={props.onCreate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface ListItemButtonProps {
  onClick: () => void;
  title: string;
  icon: any;
}

const CustomListItemButton = (props: ListItemButtonProps) => {
  return (
    <ListItemButton onClick={props.onClick}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText>{props.title}</ListItemText>
    </ListItemButton>
  );
};

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileChange: (event: any) => void;
  onUpload: () => void;
  onCancel: () => void;
}
const FileUploadDialog = (props: FileUploadDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Upload a file</DialogTitle>
      <Input
        sx={{
          margin: "10px",
        }}
        type="file"
        onChange={props.onFileChange}
      ></Input>
      <DialogActions>
        <Button
          sx={{
            textTransform: "none",
            color: "red",
          }}
          onClick={props.onCancel}
        >
          Cancel
        </Button>
        <Button
          sx={{
            color: primaryGreenColor,
            textTransform: "none",
          }}
          onClick={props.onUpload}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
interface DirectoryViewProps {
  onBackClick: () => void;
  pathRecord: Array<string>;
  directoryList: Array<string>;
}
const DirectoryView = (props: DirectoryViewProps) => {
  return (
    <>
      {props.pathRecord.length > 1 && (
        <Grid container alignItems={"center"}>
          <Grid item>
            <Button
              sx={{
                color: primaryGreenColor,
              }}
              onClick={props.onBackClick}
            >
              <icons.ArrowBack></icons.ArrowBack>
            </Button>
          </Grid>
          <Grid item>
            <Typography sx={{ color: "grey" }}>
              {props.directoryList.map((each) => each)}
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};
interface FileUploadProps {
  onClick: () => void;
}
const FileUploadButton = (props: FileUploadProps) => {
  return (
    <CustomListItemButton
      icon={<icons.Upload></icons.Upload>}
      title={"Upload File"}
      onClick={props.onClick}
    ></CustomListItemButton>
  );
};
interface CreateFolderProps {
  onClick: () => void;
}
const CreateFolderButton = (props: CreateFolderProps) => {
  return (
    <CustomListItemButton
      onClick={props.onClick}
      title="Create Folder"
      icon={<icons.Add></icons.Add>}
    ></CustomListItemButton>
  );
};

interface FolderProps {
  folder: FolderDto;
  onFolderClick: () => void;
}

const Folder = (props: FolderProps) => {
  return (
    <>
      <Button
        sx={{
          color: primaryGreenColor,
          textTransform: "none",
        }}
        onDoubleClick={props.onFolderClick}
      >
        <Grid container direction={"column"} flex={"Grid"}>
          <Grid item>
            <icons.Folder></icons.Folder>
          </Grid>
          <Grid item> {props.folder.name}</Grid>
        </Grid>
      </Button>
    </>
  );
};
interface FileProps {
  name: string;
}
const File = ({ name }: FileProps) => {
  return (
    <Button
      sx={{
        color: primaryGreenColor,
        textTransform: "none",
      }}
    >
      <Grid
        sx={{
          textTransform: "none",
        }}
        container
        direction={"column"}
        flex={"Grid"}
      >
        <Grid item>
          <icons.FileCopy></icons.FileCopy>
        </Grid>
        <Grid item> {name}</Grid>
      </Grid>
    </Button>
  );
};

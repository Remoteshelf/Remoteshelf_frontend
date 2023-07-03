/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
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
import { FolderCard } from "./folder/folder_card";
import { FileCard } from "./file/file_card";
import { Add } from "@mui/icons-material";
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
  const [loading, setLoading] = useState(true);

  const handleOnFolderDoubleClick = (folderId: number, folderName: string) => {
    pathRecord.push(`/all/${folderId}`);
    setPage(
      <BrowsingPage
        folderRecord={folderRecord}
        pathRecord={pathRecord}
        page={page}
        setPage={setPage}
        path={pathRecord[pathRecord.length - 1]}
      ></BrowsingPage>
    );
    setFolderId(folderId);
    if (folderRecord.length > 1) {
      folderRecord.push(` → ${folderName}`);
    } else {
      folderRecord.push(`${folderName}`);
    }
  };

  const fetchFilesAndFolders = (fetchPath: string) => {
    setLoading(true);
    axios
      .get(`${Config.baseUrl}/folder${fetchPath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setFolders(
          response.data.folders.map((folder: FolderDto) => (
            <Grid item key={folder.id}>
              <FolderCard
                refresh={() => {
                  fetchFilesAndFolders(pathRecord[pathRecord.length - 1]);
                }}
                folder={folder}
                onFolderDoubleClick={() => {
                  handleOnFolderDoubleClick(folder.id, folder.name);
                }}
              ></FolderCard>
            </Grid>
          ))
        );
        setFiles(
          response.data.files.map((file: FileDto) => (
            <Grid item key={file.id}>
              <FileCard
                refresh={() => {
                  fetchFilesAndFolders(pathRecord[pathRecord.length - 1]);
                }}
                file={file}
              ></FileCard>
            </Grid>
          ))
        );
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
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
          sx={{
            width: "15%",
            minWidth: "100px",
          }}
        >
          <Card
            sx={{
              borderRadius: "8px",
            }}
          >
            <Grid
              container
              sx={{
                height: "100vh",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
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
                    navigate("/login", { replace: true });
                  }}
                ></CustomListItemButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid
          container
          sx={{
            paddingLeft: "20px",
            gap: "20px",
            width: "85%",
            alignContent: "start",
          }}
        >
          <DirectoryView
            directoryList={folderRecord}
            pathRecord={pathRecord}
            onBackClick={() => {
              handleOnBackClicked();
            }}
          ></DirectoryView>
          <Grid
            container
            sx={{
              direction: "column",
            }}
          >
            <Grid container sx={{ direction: "column" }}>
              <Grid>
                <Grid container sx={{ direction: "row", alignItems: "center" }}>
                  <Typography>Folders</Typography>
                  <IconButton
                    onClick={() => {
                      setIsDialogOpen(true);
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "20px",
                        width: "20px",
                        color: "white",
                        backgroundColor: "green",
                      }}
                    >
                      <Add sx={{ width: "16px" }}></Add>
                    </Box>
                  </IconButton>
                </Grid>
                <Typography
                  sx={{
                    color: "#A1AEB8",
                  }}
                >
                  {folders.length} folders
                </Typography>
                <Box marginBottom={"10px"}></Box>
              </Grid>
            </Grid>
            {loading && <Loading></Loading>}

            {!loading && folders.map((folder) => folder)}
            <Grid container sx={{ direction: "column" }}>
              <Grid>
                {" "}
                <Box marginTop={"20px"}></Box>
                <Grid container sx={{ direction: "row", alignItems: "center" }}>
                  <Typography>Files</Typography>
                  <IconButton
                    onClick={() => {
                      setIsFileDialogOpen(true);
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "20px",
                        width: "20px",
                        color: "white",
                        backgroundColor: "green",
                      }}
                    >
                      <Add sx={{ width: "16px" }}></Add>
                    </Box>
                  </IconButton>
                </Grid>
                <Typography
                  sx={{
                    color: "#A1AEB8",
                  }}
                >
                  {files.length} files
                </Typography>
                <Box marginBottom={"10px"} />
              </Grid>
            </Grid>
            {loading && <Loading></Loading>}
            {!loading && files.map((file) => file)}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
const Loading = () => {
  return (
    <Box sx={{ width: 200, height: 80 }}>
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Skeleton
          animation="wave"
          variant="circular"
          sx={{ height: 40, width: 40 }}
        />
        <Grid>
          <Skeleton animation="wave" sx={{ width: 200, height: 70 }}></Skeleton>
        </Grid>
      </Grid>
    </Box>
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
            <IconButton
              sx={{
                backgroundColor: "green",
                color: "white",
                marginRight: "10px",
              }}
              onClick={props.onBackClick}
            >
              <icons.ArrowBack
                sx={{
                  height: "16px",
                  width: "16px",
                }}
              ></icons.ArrowBack>
            </IconButton>
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

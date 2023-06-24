import { Button } from "@mui/material";
import FileBrowser from "../../components/FileBrowser";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={()=>{
        localStorage.clear();
        navigate('/login');
      }} style={{ textTransform: "none" }} variant="contained">
        Sign out
      </Button>
      <FileBrowser></FileBrowser>
    </div>
  );
};

export default Home;

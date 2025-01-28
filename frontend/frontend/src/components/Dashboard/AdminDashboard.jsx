import AdminStudentComponent from "../AdminDashboardComponents/AdminStudentComponent";
import AdminTeacherComponent from "../AdminDashboardComponents/AdminTeacherComponent";
import {Box, Toolbar, Button, AppBar, Typography} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    
      if (!user) return;
    });  
 
    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    return (
      <div>
        <Box>
          <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        </Box>
       
        <AdminStudentComponent />

        <AdminTeacherComponent />
      </div>
    );
};

export default AdminDashboard;

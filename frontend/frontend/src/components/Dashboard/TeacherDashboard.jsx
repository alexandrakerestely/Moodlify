import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { TeacherService } from "../../api/TeacherService";
import TeacherSubjects from "../TeacherSubjects";
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
   TextField, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import CreateSubjectForm from "../CreateSubjectForm";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updatedTeacher, setUpdatedTeacher] = useState({});

  const teacherTypeArray = ["TITULAR", "ASOCIAT", "EXTERN"];
  const didacticGradeArray = ["ASIST", "SEF_LUCR", "CONF", "PROF"];

  useEffect(() => {
    if (!user) return;

    const fetchTeacherData = async () => {
      const response = await TeacherService.getTeacher();

      if (!response) {
        setLoading(false);
        console.error("Failed to fetch teacher data");
        return;
      }
      console.log(response);
      setTeacherData(response);
      setUpdatedTeacher(response.teacherDTO);
      setLoading(false);
    };

    fetchTeacherData();
  }, [user]);

  const handleOpenEdit = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const handleDropdownChange = (name, value) => {
    setUpdatedTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateTeacher = async () => {
    if (!teacherData || !teacherData.links) {
      console.error("No update link available.");
      return;
    }

    const updateLink = teacherData.links.find(link => link.rel === "update")?.href;
    if (!updateLink) {
      console.error("Update link not found.");
      return;
    }

    await TeacherService.updateTeacher(updateLink, updatedTeacher);
    setTeacherData({ ...teacherData, teacherDTO: updatedTeacher });
    handleCloseEdit();
  };

  if (loading) return <CircularProgress />;
  if (!teacherData) return <Typography color="error">Unable to load teacher data.</Typography>;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Teacher Dashboard</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box mt={4} textAlign="center">
        <Typography variant="h4">Welcome, {teacherData.teacherDTO.name} {teacherData.teacherDTO.surname} !</Typography>
        <Typography variant="h6">Email: {teacherData.teacherDTO.email}</Typography>
        <Typography variant="h6">Affiliation: {teacherData.teacherDTO.affiliation}</Typography>
        <Typography variant="h6">Didactic Grade: {teacherData.teacherDTO.didacticGrade}</Typography>
        <Typography variant="h6">Professor Type: {teacherData.teacherDTO.professorType}</Typography>
        <Typography variant="h6">Professor ID: {teacherData.teacherDTO.id}</Typography>

        <Button variant="contained" color="primary" onClick={handleOpenEdit}>Edit Profile</Button>
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>Create New Subject</Button>
      </Box>

      {teacherData.links &&
        <TeacherSubjects subjectsLink={teacherData.links.find(link => link.rel === "subjects_owned")?.href} id={teacherData.teacherDTO.id} />
      }

      <CreateSubjectForm open={isCreateOpen} onClose={handleCloseCreate} teacher={teacherData} />

      <Dialog open={isEditOpen} onClose={handleCloseEdit}>
        <DialogTitle>Edit Teacher Information</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" name="name" value={updatedTeacher.name} onChange={(e) => setUpdatedTeacher({ ...updatedTeacher, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Surname" name="surname" value={updatedTeacher.surname} onChange={(e) => setUpdatedTeacher({ ...updatedTeacher, surname: e.target.value })} />
          <TextField fullWidth margin="dense" label="Affiliation" name="affiliation" value={updatedTeacher.affiliation} onChange={(e) => setUpdatedTeacher({ ...updatedTeacher, affiliation: e.target.value })} />

          <FormControl fullWidth margin="dense">
            <InputLabel>Professor Type</InputLabel>
            <Select
              value={updatedTeacher.professorType}
              onChange={(e) => handleDropdownChange("professorType", e.target.value)}
            >
              {teacherTypeArray.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Didactic Grade</InputLabel>
            <Select
              value={updatedTeacher.didacticGrade}
              onChange={(e) => handleDropdownChange("didacticGrade", e.target.value)}
            >
              {didacticGradeArray.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateTeacher} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;

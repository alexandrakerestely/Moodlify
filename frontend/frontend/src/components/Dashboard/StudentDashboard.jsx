import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { StudentService } from "../../api/StudentService";
import { MaterialsService } from "../../api/MaterialsService";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle
} from "@mui/material";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    
    if (!user) return;

    const fetchAllData = async () => {
      try {
      
        const studentResponse = await StudentService.getStudent(user.email);
        if (!studentResponse) {
          console.error("Failed to fetch student data");
          setLoading(false);
          return;
        }
        setStudentData(studentResponse);
        console.log("Fetched student data:", studentResponse);

        setUpdatedStudent({
          //email: studentResponse.studentDTO.email, 
          name: studentResponse.studentDTO.name,
          surname: studentResponse.studentDTO.surname,
          group: studentResponse.studentDTO.group,
          studyYear: studentResponse.studentDTO.studyYear,
          //studyCycle: studentResponse.studentDTO.studyCycle,
          //joinedSubjects: studentResponse.studentDTO.joinedSubjects
        });

        const subjectsLink = studentResponse.links?.find(link => link.rel === "joined_subjects")?.href;
        if (!subjectsLink) {
          console.error("Subjects link not found in student data.");
          setLoading(false);
          return;
        }

        
        const subjectsResponse = await StudentService.getStudentSubjects(subjectsLink);

        const subjectsWithMaterials = await Promise.all(
          subjectsResponse.map(async (subject) => {
            const materialsLink = subject.links?.find(link => link.rel === "subject_materials")?.href;
            if (!materialsLink) return { ...subject, materials: [] };

            try {
             
              const materialsResponse = await MaterialsService.getMaterials(materialsLink);
              return { ...subject, materials: materialsResponse || [] };
            } catch (error) {
              console.error(`Error fetching materials for ${subject.subjectDTO.name}:`, error);
              return { ...subject, materials: [] };
            }
          })
        );

        setSubjects(subjectsWithMaterials);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchAllData:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const handleOpenEdit = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStudent = async () => {
    if (!studentData || !studentData.links) {
      console.error("No update link available.");
      return;
    }

    const updateLink = studentData.links.find(link => link.rel === "update")?.href;
    if (!updateLink) {
      console.error("Update link not found.");
      return;
    }

    const finalUpdatedStudent = {
      email: studentData.studentDTO.email,
      name: updatedStudent.name || studentData.studentDTO.name,
      surname: updatedStudent.surname || studentData.studentDTO.surname,
      group: updatedStudent.group || studentData.studentDTO.group,
      studyYear: updatedStudent.studyYear || studentData.studentDTO.studyYear,
      studyCycle : studentData.studentDTO.studyCycle,
      joinedSubjects: studentData.studentDTO.joinedSubjects
    };


    const response = await StudentService.updateStudent(updateLink, finalUpdatedStudent);
    
    setStudentData((prev) => ({
        ...prev,
        studentDTO: { ...prev.studentDTO, ...finalUpdatedStudent },
    }));

    handleCloseEdit();

  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log(studentData);
  console.log(subjects);

  if (!studentData) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5" color="error">
          Unable to load student data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box mt={4} textAlign="center">
        <Typography variant="h4">Welcome, {studentData.studentDTO.name} {studentData.studentDTO.surname}!</Typography>
        <Typography variant="h6">Email: {studentData.studentDTO.email}</Typography>
        <Typography variant="h6">Group: {studentData.studentDTO.group}</Typography>
        <Typography variant="h6">Year: {studentData.studentDTO.studyYear}</Typography>
        <Typography variant="h6">Cycle: {studentData.studentDTO.studyCycle}</Typography>
        <Typography variant="h6">ID: {studentData.studentDTO.id}</Typography>
      </Box>
      

      <Box mt={4} p={3}>
        <Typography variant="h5">Enrolled Subjects</Typography>
        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <Card key={index} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">{subject.subjectDTO.name}</Typography>
                <Typography color="textSecondary">Code: {subject.subjectDTO.cod}</Typography>
                <Typography color="textSecondary">Study Year: {subject.subjectDTO.studyYear}</Typography>
                <Typography color="textSecondary">Subject Category: {subject.subjectDTO.subjectCategory}</Typography>
                <Typography color="textSecondary">Subject Type: {subject.subjectDTO.subjectType}</Typography>
                <Typography color="textSecondary">Test Type: {subject.subjectDTO.testType}</Typography>
                <Typography color="textSecondary">Credits: {subject.subjectDTO.creditsNumber}</Typography>

                {subject.materials && subject.materials.subject ? (
                  <>

                    {subject.materials.subject.course_materials && subject.materials.subject.course_materials.length > 0 ? (
                      <>
                        <Typography color="textSecondary" mt={1}>Course Materials:</Typography>
                        <List>
                          {subject.materials.subject.course_materials.map((material, matIndex) => (
                            <ListItem  key={`course-${matIndex}`} >
                              <ListItemText primary={`Week ${material.week} - ${material.file}`} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    ) : (
                      <Typography color="textSecondary">No course materials available.</Typography>
                    )}


                    {subject.materials.subject.lab_materials && subject.materials.subject.lab_materials.length > 0 ? (
                      <>
                        <Typography color="textSecondary"  mt={1}>Lab Materials:</Typography>
                        <List>
                          {subject.materials.subject.lab_materials.map((material, matIndex) => (
                            <ListItem  key={`lab-${matIndex}`}>
                              <ListItemText primary={`Week ${material.week} - ${material.file}`} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    ) : (
                      <Typography color="textSecondary">No lab materials available.</Typography>
                    )}

                    {subject.materials.subject.evaluation_probes && subject.materials.subject.evaluation_probes.length > 0 ? (
                      <>
                        <Typography color="textSecondary"  mt={1}>Evaluation Probes:</Typography>
                        <List>
                          {subject.materials.subject.evaluation_probes.map((probe, matIndex) => (
                            <ListItem key={`evaluation-${matIndex}`}>
                              <ListItemText primary={`${probe.name} - ${probe.percentage}%`} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    ) : (
                      <Typography color="textSecondary">No lab materials available.</Typography>
                    )}
                  </>
                ) : (
                  <Typography color="textSecondary">No materials available.</Typography>
                )
                }


              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="textSecondary" mt={2}>
            No subjects enrolled.
          </Typography>
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={handleOpenEdit} sx={{ mt: 2 }}>
          Edit Information
      </Button>

      <Dialog open={isEditOpen} onClose={handleCloseEdit}>
        <DialogTitle>Edit Student Information</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="name"
            value={updatedStudent.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Surname"
            name="surname"
            value={updatedStudent.surname}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Group"
            name="group"
            value={updatedStudent.group}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Year"
            name="studyYear"
            type="number"
            value={updatedStudent.studyYear}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateStudent} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;

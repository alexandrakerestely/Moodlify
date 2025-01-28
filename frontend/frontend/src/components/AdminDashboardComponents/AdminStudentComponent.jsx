import { useState, useEffect } from "react";
import { StudentService } from "../../api/StudentService";
import { authService } from "../../api/AuthService";

import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, FormControl, Select, MenuItem, InputLabel
} from "@mui/material";

const AdminStudentComponent = () => {
  const [students, setStudents] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ 
    name: "",
    surname: "",
    email: "",
    group: "",
    studyYear: "",
    studyCycle: "",
    joinedSubjects: []
  });

  const studyCycleArray = ["LICENTA", "MASTER"];


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await StudentService.getAllStudents();
      console.log(response);
      setStudents(response || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCreateStudent = async () => {
    try {

      console.log(students[0]);
      const createLink = students[0]?.links.find(link => link.rel === "create")?.href;
      console.log(createLink);
      if(!createLink) 
      {
        console.error("Create link not found");
        return;
      }
      console.log(createLink, newStudent);
      await StudentService.createStudent(createLink, newStudent);
      
      fetchStudents();
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) return;
    
    const originalStudent = students.find((s) => s.studentDTO.id === selectedStudent.studentDTO.id)?.studentDTO;

 
  const finalStudentData = {
    surname: selectedStudent.surname || originalStudent.surname,
    name: selectedStudent.name || originalStudent.name,
    email: selectedStudent.email || originalStudent.email,
    group: selectedStudent.group || originalStudent.group,
    studyYear: selectedStudent.studyYear || originalStudent.studyYear,
    studyCycle: selectedStudent.studyCycle || originalStudent.studyCycle,
    joinedSubjects: originalStudent.joinedSubjects
  };

  console.log("Final Student Data:", finalStudentData);
   
    try {
      const updateLink = selectedStudent.links.find(link => link.rel === "update")?.href;
      if(!updateLink) {
        console.error("Update link not found.");
        return;
      }

      await StudentService.updateStudent(updateLink, finalStudentData);
      await authService.updateUser(originalStudent.email, finalStudentData.email);
      
      fetchStudents();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
     
      const student = students.find((s) => s.studentDTO.id === id);
      const deleteLink = student?.links.find(link => link.rel === "delete")?.href;
      
      if(!deleteLink) 
      {
        console.error("Delete link not found");
        return;
      }

      await authService.deleteUser(student.studentDTO.email);
      await StudentService.deleteStudent(deleteLink, id);
      
      fetchStudents();

    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  console.log(students);

  return (
    <Box mt={4} p={3}>
      <Typography variant="h4">Manage Students</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsCreateOpen(true)}
        sx={{ mt: 2 }}
      >
        Create New Student
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Study Year</TableCell>
              <TableCell>Study Cycle</TableCell>
              <TableCell>Joined Subjects</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.studentDTO.id}>
                <TableCell>{student.studentDTO.id}</TableCell>
                <TableCell>{student.studentDTO.name}</TableCell>
                <TableCell>{student.studentDTO.surname}</TableCell>
                <TableCell>{student.studentDTO.email}</TableCell>
                <TableCell>{student.studentDTO.group}</TableCell>
                <TableCell>{student.studentDTO.studyYear}</TableCell>
                <TableCell>{student.studentDTO.studyCycle}</TableCell>
                <TableCell>{student.studentDTO.joinedSubjects.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteStudent(student.studentDTO.id)}
                    sx={{ ml: 2 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Surname"
            value={newStudent.surname}
            onChange={(e) => setNewStudent({ ...newStudent, surname: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Group"
            value={newStudent.group}
            onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Study Year"
            type="number"
            value={newStudent.studyYear}
            onChange={(e) => setNewStudent({ ...newStudent, studyYear: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Study Cycle</InputLabel>
            <Select
              value={newStudent?.studyCycle || ""}
              onChange={(e) => setNewStudent({...newStudent, "studyCycle": e.target.value})}
            >
              {studyCycleArray.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          <TextField
            fullWidth
            margin="dense"
            label="Joined subjects (add subjects codes separated by comma)"
            value={newStudent.joinedSubjects}
            onChange={(e) => {
              const array = e.target.value.split(",").map((item) => item.trim());
              setNewStudent({ ...newStudent, joinedSubjects: array }); 
            }}
          />

          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateStudent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={selectedStudent?.name || ""}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Surname"
            value={selectedStudent?.surname || ""}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, surname: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            value={selectedStudent?.email || ""}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Group"
            value={selectedStudent?.group || ""}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, group: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Study Year"
            type="number"
            value={selectedStudent?.studyYear || ""}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, studyYear: e.target.value })
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Study Cycle</InputLabel>
            <Select
              value={selectedStudent?.studyCycle || ""}
              onChange={(e) => setSelectedStudent({...selectedStudent, "studyCycle": e.target.value})}
            >
              {studyCycleArray.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditStudent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudentComponent;

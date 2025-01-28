import { useState, useEffect } from "react";
import { TeacherService } from "../../api/TeacherService";
import { authService } from "../../api/AuthService";

import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, FormControl, Select, MenuItem, InputLabel
} from "@mui/material";

const AdminTeacherComponent = () => {
  const [teachers, setTeachers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    surname: "",
    email: "",
    professorType: "",
    didacticGrade: "",
    affiliation: ""
  });

  const didacticGrades = [ "ASIST", "SEF_LUCR", "CONF", "PROF" ];
  const professorTypes = [ "TITULAR", "ASOCIAT", "EXTERN" ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await TeacherService.getAllTeachers();
      console.log(response);
      setTeachers(response || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleCreateTeacher = async () => {
    try {
      const createLink = teachers[0]?.links.find((link) => link.rel === "create")?.href;
      if (!createLink) {
        console.error("Create link not found");
        return;
      }

      console.log(createLink, newTeacher);
      await TeacherService.createTeacher(createLink, newTeacher);
      fetchTeachers();
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  const handleEditTeacher = async () => {
    if (!selectedTeacher) return;

    const originalTeacher = teachers.find(
      (t) => t.teacherDTO.id === selectedTeacher.teacherDTO.id
    )?.teacherDTO;

    console.log(originalTeacher);
    const finalTeacherData = {
      surname: selectedTeacher.surname || originalTeacher.surname,
      name: selectedTeacher.name || originalTeacher.name,
      email: selectedTeacher.email || originalTeacher.email,
      affiliation: selectedTeacher.affiliation || originalTeacher.affiliation,
      professorType: selectedTeacher.professorType || originalTeacher.professorType,
      didacticGrade:  selectedTeacher.didacticGrade || originalTeacher.didacticGrade,
    };

    console.log("Final Teacher Data:", finalTeacherData);

    try {
      const updateLink = selectedTeacher.links.find((link) => link.rel === "update")?.href;
      if (!updateLink) {
        console.error("Update link not found.");
        return;
      }

      await TeacherService.updateTeacher(updateLink, finalTeacherData);
      await authService.updateUser(originalTeacher.email, finalTeacherData.email);
     
      fetchTeachers();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      const teacher = teachers.find((t) => t.teacherDTO.id === id);
      const deleteLink = teacher?.links.find((link) => link.rel === "delete")?.href;

      if (!deleteLink) {
        console.error("Delete link not found");
        return;
      }

      await authService.deleteUser(teacher.teacherDTO.email);
      await TeacherService.deleteTeacher(deleteLink, id);
      
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <Box mt={4} p={3}>
      <Typography variant="h4">Manage Teachers</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsCreateOpen(true)}
        sx={{ mt: 2 }}
      >
        Create New Teacher
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Professor Type</TableCell>
              <TableCell>Didactic Grade</TableCell>
              <TableCell>Affiliation</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.teacherDTO.id}>
                <TableCell>{teacher.teacherDTO.id}</TableCell>
                <TableCell>{teacher.teacherDTO.name}</TableCell>
                <TableCell>{teacher.teacherDTO.surname}</TableCell>
                <TableCell>{teacher.teacherDTO.email}</TableCell>
                <TableCell>{teacher.teacherDTO.professorType}</TableCell>
                <TableCell>{teacher.teacherDTO.didacticGrade}</TableCell>
                <TableCell>{teacher.teacherDTO.affiliation}</TableCell>
                <TableCell>{teacher.teacherDTO.subjectsOwned.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteTeacher(teacher.teacherDTO.id)}
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
        <DialogTitle>Create New Teacher</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Surname"
            value={newTeacher.surname}
            onChange={(e) => setNewTeacher({ ...newTeacher, surname: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            value={newTeacher.email}
            onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Affiliation"
            value={newTeacher.affiliation}
            onChange={(e) => setNewTeacher({ ...newTeacher, affiliation: e.target.value })}
          />

        <FormControl fullWidth margin="dense">
          <InputLabel>Professor Type</InputLabel>
          <Select value={newTeacher.professorType || ""} onChange={(e) =>  setNewTeacher({ ...newTeacher, professorType: e.target.value })}>
            {professorTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Didactic Grade</InputLabel>
          <Select value={newTeacher.didacticGrade || ""} onChange={(e) => setNewTeacher({ ...newTeacher, didacticGrade: e.target.value })}>
            {didacticGrades.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTeacher} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={selectedTeacher?.name || ""}
            onChange={(e) =>
              setSelectedTeacher({ ...selectedTeacher, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Surname"
            value={selectedTeacher?.surname || ""}
            onChange={(e) =>
              setSelectedTeacher({ ...selectedTeacher, surname: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Email"
            value={selectedTeacher?.email || ""}
            onChange={(e) =>
              setSelectedTeacher({ ...selectedTeacher, email: e.target.value })
            }
          />

         <TextField
            fullWidth
            margin="dense"
            label="Affiliation"
            value={selectedTeacher?.affiliation}
            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, affiliation: e.target.value })}
          />

        <FormControl fullWidth margin="dense">
          <InputLabel>Professor Type</InputLabel>
          <Select value={selectedTeacher?.professorType || ""} onChange={(e) =>  setSelectedTeacher({ ...selectedTeacher, professorType: e.target.value })}>
            {professorTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Didactic Grade</InputLabel>
          <Select value={selectedTeacher?.didacticGrade || ""} onChange={(e) => setSelectedTeacher({ ...selectedTeacher, didacticGrade: e.target.value })}>
            {didacticGrades.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

         
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditTeacher} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTeacherComponent;

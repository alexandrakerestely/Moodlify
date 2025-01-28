import { useState, useEffect } from "react";
import { SubjectService } from "../api/SubjectsService";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, DialogActions, Button } from "@mui/material";

const ViewStudentsDialog = ({ open, onClose, subject }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!subject) return;

    const fetchStudents = async () => {

      const subjectStudentsLink = subject._links?.get_subject_students?.href;
      if (!subjectStudentsLink) {
        console.error("Subjects link not found in student data.");
        setLoading(false);
        return;
      }

      const response = await SubjectService.getSubjectStudents(subjectStudentsLink);
      console.log(response);
      setStudents(response || []);
    };

    fetchStudents();
  }, [subject]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enrolled Students</DialogTitle>
      <DialogContent>
        <List>
          {students.length > 0 ? (
            students.map((student, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${student.studentDTO.name} ${student.studentDTO.surname} - ${student.studentDTO.email}`} />
              </ListItem>
            ))
          ) : (
            <ListItem>No students enrolled.</ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStudentsDialog;

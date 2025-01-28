import { useState, useEffect } from "react";
import { SubjectService } from "../api/SubjectsService";
import { Box, Card, CardContent, Typography, Button, Dialog, DialogContent, TextField, DialogTitle, DialogActions, FormControl, 
  Select, InputLabel, MenuItem, Pagination, PaginationItem} from "@mui/material";
import SubjectMaterials from "./SubjectMaterials";
import ViewStudentsDialog from "./ViewStudentsDialog";
import { MaterialsService } from "../api/MaterialsService";

const TeacherSubjects = ({ subjectsLink, id }) => {
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [updatedSubject, setUpdatedSubject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewStudentsOpen, setIsViewStudentsOpen] = useState(false);

  const [paginatedSubjects, setPaginatedSubjects] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState({});
  const [isPaginatedView, setIsPaginatedView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const subjectTypes = ["OBLIGATORIE", "OPTIONALA", "LIBER_ALEASA"];
  const subjectCategories = ["DOMENIU", "SPECIALITATE", "ADIACENTA"];
  const testTypes = ["COLOCVIU", "EXAMEN"];

  useEffect(() => {
    if (!subjectsLink) return;
    fetchSubjects();
    fetchAllSubjects();
  }, [subjectsLink]);

  const fetchSubjects = async () => {
    const response = await SubjectService.getTeacherSubjects(subjectsLink);
    console.log(response);
    setSubjects(response || []);
  };

  const fetchAllSubjects = async () => {
    const response = await SubjectService.getSubjects();
    console.log(response);
    setAllSubjects(response._embedded.subjects || []);
  }

  console.log("subjects ", subjects);

  const handleFetchPaginatedSubjects = async (page = 0, itemsPerPage = 5) => {
    const paginatedLink = `http://localhost:8080/api/academia/subjects?page=${page}&items_per_page=${itemsPerPage}`;
    console.log("lin ", paginatedLink);
    try {
      const response = await SubjectService.getPaginatedSubjects(paginatedLink);
      console.log("repsonssse  ", response);
      setPaginatedSubjects(response._embedded.subjects || []);
      setPaginationLinks(response._links || {});
      setCurrentPage(page);
      setIsPaginatedView(true);
    } catch (error) {
      console.error("Error fetching paginated subjects:", error);
    }
  };
  
  const handlePaginationChange = (_, value) => {
    const pageIndex = value - 1;
    handleFetchPaginatedSubjects(pageIndex);
  };

  const handleSeePaginatedClick = () => {
    handleFetchPaginatedSubjects();
  };

  const handleViewAllClick = () => {
    setIsPaginatedView(false);
  };

  const handleOpenEdit = (subject) => {
    setSelectedSubject(subject);
    setUpdatedSubject(subject.subjectDTO);
    setIsEditOpen(true);
  };

  const handleDropdownChange = (name, value) => {
    setUpdatedSubject((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleUpdateSubject = async () => {
    if (!selectedSubject || !selectedSubject._links) {
      console.error("No update link available.");
      return;
    }
  
    const updateLink = selectedSubject._links?.update_create?.href;
    if (!updateLink) {
      console.error("Update link not found.");
      return;
    }
  
    
    const finalUpdatedSubject = {
      cod: selectedSubject.subjectDTO.cod,
      name: updatedSubject.name || selectedSubject.subjectDTO.name,
      creditsNumber: updatedSubject.creditsNumber || selectedSubject.subjectDTO.creditsNumber,
      studyYear: updatedSubject.studyYear || selectedSubject.subjectDTO.studyYear,
      subjectType: updatedSubject.subjectType || selectedSubject.subjectDTO.subjectType,
      subjectCategory: updatedSubject.subjectCategory || selectedSubject.subjectDTO.subjectCategory,
      testType: updatedSubject.testType || selectedSubject.subjectDTO.testType,
      teacherId: selectedSubject.subjectDTO.teacherId,
    };
  
    try {
      await SubjectService.updateSubject(updateLink, finalUpdatedSubject);
  
      
      setSubjects((prevSubjects) =>
        prevSubjects.map((s) =>
          s.subjectDTO.cod === selectedSubject.subjectDTO.cod ? { ...s, subjectDTO: finalUpdatedSubject } : s
        )
      );

      setAllSubjects((prevSubjects) =>
        prevSubjects.map((s) =>
          s.subjectDTO.cod === selectedSubject.subjectDTO.cod ? { ...s, subjectDTO: finalUpdatedSubject } : s
        )
      );
  
      fetchAllSubjects();
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };
  
  
  const handleDeleteSubject = async (subject) => {
    const deleteLink = subject._links?.delete?.href;
    if (!deleteLink) {
      console.error("Delete link not found for subject:", subject.subjectDTO.name);
      return;
    }

    try {

      const materialsLink = subject._links?.subject_materials.href;
      if(!materialsLink)
      {
        console.error("Materials link not found for subject:", subject.subjectDTO.name);
        return;
      }
      const material = await MaterialsService.getMaterialsByCode(materialsLink);

      const deleteMaterialLink = material._links?.delete.href;

      console.log(deleteMaterialLink);
      await MaterialsService.deleteMaterials(deleteMaterialLink);
     
      await SubjectService.deleteSubject(deleteLink);
    
      fetchAllSubjects();
     
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const handleViewStudents = (subject) => {
    setSelectedSubject(subject);
    setIsViewStudentsOpen(true);
  };

  const handleCloseViewStudents = () => setIsViewStudentsOpen(false);


  return (
    <Box mt={4} p={3}>
      <Typography variant="h5">All Subjects</Typography>


      {!isPaginatedView && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSeePaginatedClick}
          sx={{ mt: 2 }}
        >
          See Paginated
        </Button>
      )}

      {isPaginatedView && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleViewAllClick}
          sx={{ mt: 2 }}
        >
          View All
        </Button>
      )}


{isPaginatedView ? (
  paginatedSubjects.length > 0 ? (
    paginatedSubjects.map((subject, index) => (
      <Card key={index} sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">{subject.subjectDTO.name}</Typography>
          <Typography color="textSecondary">Code: {subject.subjectDTO.cod}</Typography>
          <Typography color="textSecondary">Credits: {subject.subjectDTO.creditsNumber}</Typography>
          <Typography color="textSecondary">Study Year: {subject.subjectDTO.studyYear}</Typography>
          <Typography color="textSecondary">Subject Category: {subject.subjectDTO.subjectCategory}</Typography>
          <Typography color="textSecondary">Subject Type: {subject.subjectDTO.subjectType}</Typography>
          <Typography color="textSecondary">Test Type: {subject.subjectDTO.testType}</Typography>

          <Box mt={2}>
            {subject.subjectDTO.teacherId === id ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenEdit(subject)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteSubject(subject)}
                  sx={{ ml: 2 }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleViewStudents(subject)}
                  sx={{ ml: 2 }}
                >
                  View Students
                </Button>
              </>
            ) : (
              <Typography color="textSecondary">
                You are not the owner of this subject.
              </Typography>
            )}
          </Box>

          <SubjectMaterials
            subject={subject}
            canUpdateMaterials={subject.subjectDTO.teacherId === id}
          />
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography color="textSecondary" mt={2}>
      No subjects available in this page.
    </Typography>
  )
) : (
  allSubjects.length > 0 ? (
    allSubjects.map((subject, index) => (
      <Card key={index} sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">{subject.subjectDTO.name}</Typography>
          <Typography color="textSecondary">Code: {subject.subjectDTO.cod}</Typography>
          <Typography color="textSecondary">Credits: {subject.subjectDTO.creditsNumber}</Typography>
          <Typography color="textSecondary">Study Year: {subject.subjectDTO.studyYear}</Typography>
          <Typography color="textSecondary">Subject Category: {subject.subjectDTO.subjectCategory}</Typography>
          <Typography color="textSecondary">Subject Type: {subject.subjectDTO.subjectType}</Typography>
          <Typography color="textSecondary">Test Type: {subject.subjectDTO.testType}</Typography>

          <Box mt={2}>
            {subject.subjectDTO.teacherId === id ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenEdit(subject)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteSubject(subject)}
                  sx={{ ml: 2 }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleViewStudents(subject)}
                  sx={{ ml: 2 }}
                >
                  View Students
                </Button>
              </>
            ) : (
              <Typography color="textSecondary">
                You are not the owner of this subject.
              </Typography>
            )}
          </Box>

          <SubjectMaterials
            subject={subject}
            canUpdateMaterials={subject.subjectDTO.teacherId === id}
          />
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography color="textSecondary" mt={2}>
      No subjects available.
    </Typography>
  )
)}
      
      <Dialog open={isEditOpen} onClose={handleCloseEdit}>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" name="name" value={updatedSubject.name} 
          onChange={(e) => setUpdatedSubject({ ...updatedSubject, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Credits" name="creditsNumber" type="number" value={updatedSubject.creditsNumber} 
          onChange={(e) => setUpdatedSubject({ ...updatedSubject, creditsNumber: e.target.value })} />
          <TextField fullWidth margin="dense" label="Study Year" name="studyYear" type="number" value={updatedSubject.studyYear} 
          onChange={(e) => setUpdatedSubject({ ...updatedSubject, studyYear: e.target.value })} />
       
       <FormControl fullWidth margin="dense">
          <InputLabel>Subject Type</InputLabel>
          <Select value={updatedSubject.subjectType} onChange={(e) => handleDropdownChange("subjectType", e.target.value)}>
            {subjectTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Subject Category</InputLabel>
          <Select value={updatedSubject.subjectCategory} onChange={(e) => handleDropdownChange("subjectCategory", e.target.value)}>
            {subjectCategories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Test Type</InputLabel>
          <Select value={updatedSubject.testType} onChange={(e) => handleDropdownChange("testType", e.target.value)}>
            {testTypes.map((test) => (
              <MenuItem key={test} value={test}>{test}</MenuItem>
            ))}
          </Select>
        </FormControl>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateSubject} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
   
      {selectedSubject && (
        <ViewStudentsDialog open={isViewStudentsOpen} onClose={handleCloseViewStudents} subject={selectedSubject} />
      )}


      {isPaginatedView && (
        <Pagination
          count={paginationLinks.next ? currentPage + 2 : currentPage + 1}
          page={currentPage + 1}
          onChange={handlePaginationChange}
          sx={{ mt: 3 }}
          renderItem={(item) => (
            <PaginationItem {...item} />
          )}
        />
      )}

    </Box>
  );
};

export default TeacherSubjects;
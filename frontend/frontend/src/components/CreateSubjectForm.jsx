import { useState } from "react";
import { SubjectService } from "../api/SubjectsService";
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Box, Typography, MenuItem, Select,FormControl, InputLabel } from "@mui/material";
import { MaterialsService } from "../api/MaterialsService";

const CreateSubjectForm = ({ open, onClose, teacher }) => {
  const [newSubject, setNewSubject] = useState({
    cod: "",
    name: "",
    creditsNumber: "",
    studyYear: "",
    subjectType: "",
    subjectCategory: "",
    testType: "",
    materials: {
      course_materials: [],
      lab_materials: [],
      evaluation_probes: [],
    }
  });

  const [materialInput, setMaterialInput] = useState({
    course_materials: { week: "", file: "" },
    lab_materials: { week: "", file: "" },
    evaluation_probes: { name: "", percentage: "" },
  });

  const subjectTypes = ["OBLIGATORIE", "OPTIONALA", "LIBER_ALEASA"];
  const subjectCategories = ["DOMENIU", "SPECIALITATE", "ADIACENTA"];
  const testTypes = ["COLOCVIU", "EXAMEN"];

  console.log(teacher);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleMaterialInputChange = (type, field, value) => {
    setMaterialInput((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleDropdownChange = (name, value) => {
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMaterial = (type) => {

    const material = materialInput[type];
    if (type === "evaluation_probes" && (!material.name || !material.percentage)) {
      console.error("Both name and percentage are required for evaluation probes.");
      return;
    }

    if (materialInput[type].week && materialInput[type].file || (type === "evaluation_probes" && material.name && material.percentage)) {
      setNewSubject((prev) => ({
        ...prev,
        materials: {
          ...prev.materials,
          [type]: [...prev.materials[type], materialInput[type]]
        }
      }));
 
      setMaterialInput((prev) => ({
        ...prev,
        [type]: type === "evaluation_probes" ? { name: "", percentage: "" } : { week: "", file: "" },
      }));
    }
  };

  const handleCreateSubject = async () => {
    const createLink = teacher.links.find(link => link.rel === "update_create_subject")?.href  + newSubject.cod;
    console.log(createLink);
    const materialsCreateLink = "http://localhost:8000/subjects";

    const subjectPayload = {
      cod: newSubject.cod,
      name: newSubject.name,
      creditsNumber: newSubject.creditsNumber,
      studyYear: newSubject.studyYear,
      subjectType: newSubject.subjectType,
      subjectCategory: newSubject.subjectCategory,
      testType: newSubject.testType,
      teacherId: teacher.teacherDTO.id
    };

    const materialsPayload = {
      title : newSubject.name,
      subject_code : newSubject.cod,
      course_materials : newSubject.materials.course_materials,
      lab_materials : newSubject.materials.lab_materials,
      evaluation_probes : newSubject.materials.evaluation_probes
    };


    try {
      const responseSubject = await SubjectService.createSubject(createLink, subjectPayload);
      const responseMaterials = await MaterialsService.createMaterials(materialsCreateLink,materialsPayload);

      if (responseSubject && responseMaterials) {
        onClose();
      }
    } catch (error) 
    {
      console.error("Error creating subject:", error);
    }

    
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Subject</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Code" name="cod" value={newSubject.cod} onChange={handleInputChange} />
        <TextField fullWidth margin="dense" label="Name" name="name" value={newSubject.name} onChange={handleInputChange} />
        <TextField fullWidth margin="dense" label="Credits" name="creditsNumber" type="number" value={newSubject.creditsNumber} onChange={handleInputChange} />
        <TextField fullWidth margin="dense" label="Study Year" name="studyYear" type="number" value={newSubject.studyYear} onChange={handleInputChange} />
        
        <FormControl fullWidth margin="dense">
          <InputLabel>Subject Type</InputLabel>
          <Select value={newSubject.subjectType} onChange={(e) => handleDropdownChange("subjectType", e.target.value)}>
            {subjectTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Subject Category</InputLabel>
          <Select value={newSubject.subjectCategory} onChange={(e) => handleDropdownChange("subjectCategory", e.target.value)}>
            {subjectCategories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl fullWidth margin="dense">
          <InputLabel>Test Type</InputLabel>
          <Select value={newSubject.testType} onChange={(e) => handleDropdownChange("testType", e.target.value)}>
            {testTypes.map((test) => (
              <MenuItem key={test} value={test}>{test}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2}>
          <Typography variant="h6">Course Materials</Typography>
          <TextField fullWidth margin="dense" label="Week" type="number" value={materialInput.course_materials.week} onChange={(e) => handleMaterialInputChange("course_materials", "week", e.target.value)} />
          <TextField fullWidth margin="dense" label="File Name" value={materialInput.course_materials.file} onChange={(e) => handleMaterialInputChange("course_materials", "file", e.target.value)} />
          <Button onClick={() => handleAddMaterial("course_materials")} variant="contained" color="info" sx={{ mt: 1 }}>Add Course Material</Button>

        
          {newSubject.materials.course_materials.length > 0 && (
            <Box mt={1}>
              {newSubject.materials.course_materials.map((material, index) => (
                <Typography key={index} color="textSecondary">{`Week ${material.week}: ${material.file}`}</Typography>
              ))}
            </Box>
          )}
        </Box>

    
        <Box mt={2}>
          <Typography variant="h6">Lab Materials</Typography>
          <TextField fullWidth margin="dense" label="Week" type="number" value={materialInput.lab_materials.week} onChange={(e) => handleMaterialInputChange("lab_materials", "week", e.target.value)} />
          <TextField fullWidth margin="dense" label="File Name" value={materialInput.lab_materials.file} onChange={(e) => handleMaterialInputChange("lab_materials", "file", e.target.value)} />
          <Button onClick={() => handleAddMaterial("lab_materials")} variant="contained" color="info" sx={{ mt: 1 }}>Add Lab Material</Button>

          {newSubject.materials.lab_materials.length > 0 && (
            <Box mt={1}>
              {newSubject.materials.lab_materials.map((material, index) => (
                <Typography key={index} color="textSecondary">{`Week ${material.week}: ${material.file}`}</Typography>
              ))}
            </Box>
          )}
        </Box>

      
        <Box mt={2}>
          <Typography variant="h6">Evaluation Probes</Typography>
          <TextField fullWidth margin="dense" label="Name" value={materialInput.evaluation_probes.name} onChange={(e) => handleMaterialInputChange("evaluation_probes", "name", e.target.value)} />
          <TextField fullWidth margin="dense" label="Percentage" type="number" value={materialInput.evaluation_probes.percentage} onChange={(e) => handleMaterialInputChange("evaluation_probes", "percentage", e.target.value)} />
          <Button onClick={() => handleAddMaterial("evaluation_probes")} variant="contained" color="info" sx={{ mt: 1 }}>Add Evaluation Probe</Button>
        
          {newSubject.materials.evaluation_probes.length > 0 && (
            <Box mt={1}>
              {newSubject.materials.evaluation_probes.map((material, index) => (
                <Typography key={index} color="textSecondary">{`${material.name}: ${material.percentage}`}</Typography>
              ))}
            </Box>
          )}
        </Box>
    
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleCreateSubject} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubjectForm;

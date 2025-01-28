import { useState } from "react";
import { SubjectService } from "../api/SubjectsService";
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { MaterialsService } from "../api/MaterialsService";

const UpdateSubjectForm = ({ open, onClose, subject, teacher }) => {
  const [updatedSubject, setUpdatedSubject] = useState({
    cod: subject.cod || "",
    name: subject.name || "",
    creditsNumber: subject.creditsNumber || "",
    studyYear: subject.studyYear || "",
    subjectType: subject.subjectType || "",
    subjectCategory: subject.subjectCategory || "",
    testType: subject.testType || "",
    materials: {
      course_materials: subject.materials.course_materials || [],
      lab_materials: subject.materials.lab_materials || [],
      evaluation_probes: subject.materials.evaluation_probes || [],
    },
  });
  console.log(subject);
  const [materialInput, setMaterialInput] = useState({
    course_materials: { week: "", file: "" },
    lab_materials: { week: "", file: "" },
    evaluation_probes: { name: "", percentage: "" },
  });

  const subjectTypes = ["OBLIGATORIE", "OPTIONALA", "LIBER_ALEASA"];
  const subjectCategories = ["DOMENIU", "SPECIALITATE", "ADIACENTA"];
  const testTypes = ["COLOCVIU", "EXAMEN"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialInputChange = (type, field, value) => {
    setMaterialInput((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleDropdownChange = (name, value) => {
    setUpdatedSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMaterial = (type) => {
    const material = materialInput[type];
    if (type === "evaluation_probes" && (!material.name || !material.percentage)) {
      console.error("Both name and percentage are required for evaluation probes.");
      return;
    }

    if (material.week && material.file || (type === "evaluation_probes" && material.name && material.percentage)) {
      setUpdatedSubject((prev) => ({
        ...prev,
        materials: {
          ...prev.materials,
          [type]: [...prev.materials[type], material],
        },
      }));

      setMaterialInput((prev) => ({
        ...prev,
        [type]: type === "evaluation_probes" ? { name: "", percentage: "" } : { week: "", file: "" },
      }));
    }
  };

  const handleUpdateSubject = async () => {
    if (!subject || !subject._links) {
      console.error("No update link available.");
      return;
    }
  
    const updateLink = subject._links?.update_create?.href;
    console.log(updateLink);
    if (!updateLink) {
      console.error("Update link not found.");
      return;
    }

    const subjectPayload = {
      cod: updatedSubject.cod || subject.cod,
      name: updatedSubject.name || subject.name,
      creditsNumber: updatedSubject.creditsNumber || subject.creditsNumber,
      studyYear: updatedSubject.studyYear || subject.studyYear,
      subjectType: updatedSubject.subjectType || subject.subjectType,
      subjectCategory: updatedSubject.subjectCategory || subject.subjectCategory,
      testType: updatedSubject.testType || subject.testType,
      teacherId: teacher.teacherDTO.id,
    };

    const materialsPayload = {
      title: updatedSubject.name ,
      subject_code: updatedSubject.cod,
      course_materials: updatedSubject.materials.course_materials,
      lab_materials: updatedSubject.materials.lab_materials,
      evaluation_probes: updatedSubject.materials.evaluation_probes,
    };

    try {
      const responseSubject = await SubjectService.updateSubject(updateLink, subjectPayload);
      const responseMaterials = await MaterialsService.updateMaterials(updateLink, materialsPayload);

      if (responseSubject && responseMaterials) {
        onClose();
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Subject</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Code" name="cod" value={updatedSubject.cod} onChange={handleInputChange} disabled />
        <TextField fullWidth margin="dense" label="Name" name="name" value={updatedSubject.name} onChange={handleInputChange} />
        <TextField fullWidth margin="dense" label="Credits" name="creditsNumber" type="number" value={updatedSubject.creditsNumber} onChange={handleInputChange} />
        <TextField fullWidth margin="dense" label="Study Year" name="studyYear" type="number" value={updatedSubject.studyYear} onChange={handleInputChange} />

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

        <Box mt={2}>
          <Typography variant="h6">Course Materials</Typography>
          <TextField fullWidth margin="dense" label="Week" type="number" value={materialInput.course_materials.week} onChange={(e) => handleMaterialInputChange("course_materials", "week", e.target.value)} />
          <TextField fullWidth margin="dense" label="File Name" value={materialInput.course_materials.file} onChange={(e) => handleMaterialInputChange("course_materials", "file", e.target.value)} />
          <Button onClick={() => handleAddMaterial("course_materials")} variant="contained" color="info" sx={{ mt: 1 }}>Add Course Material</Button>

          {updatedSubject.materials.course_materials.length > 0 && (
            <Box mt={1}>
              {updatedSubject.materials.course_materials.map((material, index) => (
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

          {updatedSubject.materials.lab_materials.length > 0 && (
            <Box mt={1}>
              {updatedSubject.materials.lab_materials.map((material, index) => (
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

          {updatedSubject.materials.evaluation_probes.length > 0 && (
            <Box mt={1}>
              {updatedSubject.materials.evaluation_probes.map((probe, index) => (
                <Typography key={index} color="textSecondary">{`${probe.name}: ${probe.percentage}%`}</Typography>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleUpdateSubject} color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSubjectForm;

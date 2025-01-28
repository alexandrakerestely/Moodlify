import { useState, useEffect } from "react";
import { MaterialsService } from "../api/MaterialsService";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Dialog, DialogActions, DialogTitle, DialogContent, TextField, Button} from "@mui/material";

const SubjectMaterials = ({ subject , canUpdateMaterials}) => {
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedMaterial, setUpdatedMaterial] = useState({
    course_materials: [],
    lab_materials: [],
    evaluation_probes: [],
  });
  const [editOpen, setEditOpen] = useState(false);

  const [materialInput, setMaterialInput] = useState({
    course_materials: { week: "", file: "" },
    lab_materials: { week: "", file: "" },
    evaluation_probes: { name: "", percentage: "" },
  });

  useEffect(() => {
    if (!subject) return;
    console.log("normal ", subject);
    const materialsLink = subject._links?.subject_materials?.href;
 
    if (!materialsLink) {
      console.log(subject);
      console.log(materialsLink);
      console.error("Materials link not found for subject:", subject.subjectDTO.name);
      setLoading(false);
      return;
    }

    const fetchMaterials = async () => {
      try {
        const response = await MaterialsService.getMaterialsByCode(materialsLink);
        setMaterials(response.subject || null);
        setUpdatedMaterial(response.subject || null);
        console.log(response);
      } catch (error) {
        console.error(`Error fetching materials for ${subject.subjectDTO.name}:`, error);
      }
      setLoading(false);
    };

    fetchMaterials();
  }, [subject]);

  const handleOpenEdit = () => setEditOpen(true); 
  const handleCloseEdit = () => setEditOpen(false);
 
  const handleMaterialInputChange = (type, field, value) => {
    setMaterialInput((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleAddMaterial = (type) => {
    const material = materialInput[type];
    if (type === "evaluation_probes" && (!material.name || !material.percentage)) {
      console.error("Both name and percentage are required for evaluation probes.");
      return;
    }

    if (material.week && material.file || (type === "evaluation_probes" && material.name && material.percentage)) {
      setUpdatedMaterial((prev) => ({
        ...prev,
        [type]: [...prev[type], material],
      }));

      setMaterialInput((prev) => ({
        ...prev,
        [type]: type === "evaluation_probes" ? { name: "", percentage: "" } : { week: "", file: "" },
      }));
    }
  };

  const handleUpdateMaterial = async () => {
    if (!subject || !subject._links) {
      console.error("No update link available.");
      return;
    }
  
    const updateLink = `http://localhost:8000/subjects/${materials._id}`;
    console.log(updateLink);
    if (!updateLink) {
      console.error("Update link not found.");
      return;
    }

    const materialsPayload = {
      title: updatedMaterial.title || materials.title,
      subject_code: updatedMaterial.subject_code || materials.subject_code,
      course_materials: updatedMaterial.course_materials.map((material, index) => ({
        week: material.week || materials.course_materials[index]?.week,
        file: material.file || materials.course_materials[index]?.file,
      })),
      lab_materials: updatedMaterial.lab_materials.map((material, index) => ({
        week: material.week || materials.lab_materials[index]?.week,
        file: material.file || materials.lab_materials[index]?.file,
      })),
      evaluation_probes: updatedMaterial.evaluation_probes.map((probe, index) => ({
        name: probe.name || materials.evaluation_probes[index]?.name,
        percentage: probe.percentage || materials.evaluation_probes[index]?.percentage,
      })),
    };

    try {
   
      const response = await MaterialsService.updateMaterials(updateLink, materialsPayload);

      if (response) {
        setMaterials(updatedMaterial); 
        handleCloseEdit();
      }
    } catch (error) {
      console.error("Error updating materials:", error);
    }
  };

  const handleDeleteMaterial = (type, index) => {
    setUpdatedMaterial((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };
  

  if (loading) return <CircularProgress size={24} />;
  if (!materials) return <Typography color="textSecondary">No materials available.</Typography>;

  return (
    <Box mt={2}>
     
      {materials.course_materials?.length > 0 ? (
        <>
          <Typography variant="subtitle1">Course Materials</Typography>
          <List>
            {materials.course_materials.map((material, index) => (
              <ListItem key={`course-${index}`}>
                <ListItemText primary={`Week ${material.week}: ${material.file}`} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="textSecondary">No course materials available.</Typography>
      )}

      {materials.lab_materials?.length > 0 ? (
        <>
          <Typography variant="subtitle1" mt={2}>Lab Materials</Typography>
          <List>
            {materials.lab_materials.map((material, index) => (
              <ListItem key={`lab-${index}`}>
                <ListItemText primary={`Week ${material.week}: ${material.file}`} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="textSecondary">No lab materials available.</Typography>
      )}

      {materials.evaluation_probes?.length > 0 ? (
        <>
          <Typography variant="subtitle1" mt={2}>Evaluation Probes</Typography>
          <List>
            {materials.evaluation_probes.map((probe, index) => (
              <ListItem key={`probe-${index}`}>
                <ListItemText primary={`${probe.name}: ${probe.percentage}%`} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="textSecondary">No evaluation probes available.</Typography>
      )}

      {canUpdateMaterials &&
        <Button variant="contained" color="primary" onClick={handleOpenEdit} sx={{ mt: 2 }}>
          Edit Materials
        </Button>
      }

    <Dialog open={editOpen} onClose={handleCloseEdit}>
        <DialogTitle>Update Subject</DialogTitle>
        <DialogContent>

        <Box mt={2}>
          <Typography variant="h6">Course Materials</Typography>
          <TextField fullWidth margin="dense" label="Week" type="number" value={materialInput.course_materials.week} onChange={(e) => handleMaterialInputChange("course_materials", "week", e.target.value)} />
          <TextField fullWidth margin="dense" label="File Name" value={materialInput.course_materials.file} onChange={(e) => handleMaterialInputChange("course_materials", "file", e.target.value)} />
          <Button onClick={() => handleAddMaterial("course_materials")} variant="contained" color="info" sx={{ mt: 1 }}>Add Course Material</Button>

          {updatedMaterial.course_materials.length > 0 && (
            <Box mt={1}>
              {updatedMaterial.course_materials.map((material, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                <Typography color="textSecondary" flexGrow={1}>
                  {`Week ${material.week}: ${material.file}`}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteMaterial("course_materials", index)}
                >
                  Delete
                </Button>
              </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Lab Materials</Typography>
          <TextField fullWidth margin="dense" label="Week" type="number" value={materialInput.lab_materials.week} onChange={(e) => handleMaterialInputChange("lab_materials", "week", e.target.value)} />
          <TextField fullWidth margin="dense" label="File Name" value={materialInput.lab_materials.file} onChange={(e) => handleMaterialInputChange("lab_materials", "file", e.target.value)} />
          <Button onClick={() => handleAddMaterial("lab_materials")} variant="contained" color="info" sx={{ mt: 1 }}>Add Lab Material</Button>

          {updatedMaterial.lab_materials.length > 0 && (
            <Box mt={1}>
              {updatedMaterial.lab_materials.map((material, index) => (
                 <Box key={index} display="flex" alignItems="center" mt={1}>
                 <Typography color="textSecondary" flexGrow={1}>
                   {`Week ${material.week}: ${material.file}`}
                 </Typography>
                 <Button
                   variant="contained"
                   color="error"
                   size="small"
                   onClick={() => handleDeleteMaterial("lab_materials", index)}
                 >
                   Delete
                 </Button>
               </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Evaluation Probes</Typography>
          <TextField fullWidth margin="dense" label="Name" value={materialInput.evaluation_probes.name} onChange={(e) => handleMaterialInputChange("evaluation_probes", "name", e.target.value)} />
          <TextField fullWidth margin="dense" label="Percentage" type="number" value={materialInput.evaluation_probes.percentage} onChange={(e) => handleMaterialInputChange("evaluation_probes", "percentage", e.target.value)} />
          <Button onClick={() => handleAddMaterial("evaluation_probes")} variant="contained" color="info" sx={{ mt: 1 }}>Add Evaluation Probe</Button>

          {updatedMaterial.evaluation_probes.length > 0 && (
            <Box mt={1}>
              {updatedMaterial.evaluation_probes.map((probe, index) => (
                <>
                 <Box key={index} mt={2}>
               
                  <TextField fullWidth margin="dense" label="Name" value={probe.name} 
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setUpdatedMaterial((prev) => {
                        const updatedProbes = [...prev.evaluation_probes];
                        updatedProbes[index] = { ...updatedProbes[index], name: newValue };
                        return { ...prev, evaluation_probes: updatedProbes };
                      });
                    }} />
                  <TextField fullWidth margin="dense" label="Percentage" type="number" value={probe.percentage} 
                  onChange={(e) => { 
                    const newValue = e.target.value;
                      setUpdatedMaterial((prev) => {
                        const updatedProbes = [...prev.evaluation_probes];
                        updatedProbes[index] = { ...updatedProbes[index], percentage: newValue };
                        return { ...prev, evaluation_probes: updatedProbes };
                      });
                    }} />
                </Box>
                </>
              ))}
            </Box>
          )}
        </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateMaterial} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

    </Box>

    
  );
};

export default SubjectMaterials;

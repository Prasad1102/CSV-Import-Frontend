import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as API from "../utils/api";
import Employees from "./Employees";

const FileUploader = () => {
  const [loading, setLoading] = useState(false);
  const [uploadId, setUploadId] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await API.uploadFile(formData);
      setUploadId(response.data.id);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      event.target.value = null;
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Upload CSV
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      <Employees uploadId={uploadId} />
    </>
  );
};

export default FileUploader;

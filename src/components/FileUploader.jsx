import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as API from '../utils/api';

const FileUploader = () => {
  const [loading, setLoading] = useState(false);
  const [uploadId, setUploadId] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await API.uploadFile(formData);

      setUploadId(response.data.id); 
      console.log("Success! ID:", response.data.id);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={loading}
      >
        Upload File
        <input
          type="file"
          hidden
          onChange={handleFileChange}
      />
      </Button>
      {loading &&<Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>}
      {uploadId && !loading && (
        <Typography sx={{ mt: 2, color: 'success.main' }}>
          Successfully uploaded! ID: {uploadId}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploader;

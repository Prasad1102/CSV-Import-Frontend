import { useState, useEffect, useRef } from "react";
import * as API from "../utils/api";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import ImportErrorsModal from "./ImportErrorsModal";
import CircularProgress from "@mui/material/CircularProgress";

const POLL_INTERVAL = 2000;
const FINAL_STATUSES = ["failed", "completed", "completed_with_errors"];

const Employees = ({ uploadId }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [importStatus, setImportStatus] = useState("pending");
  const [importErrors, setImportErrors] = useState([]);
  const [openErrors, setOpenErrors] = useState(false);

  useEffect(() => {
    const fetchImports = async () => {
      try {
        const response = await API.getImports(page);

        setData(response.data.imports);
        setTotalPages(response.data.meta.total_pages);
      } catch (err) {
        console.error("Imports API error", err);
      }
    };

    fetchImports();
  }, [page]);

  /* ---------- Import Status Polling ---------- */
  useEffect(() => {
    if (!uploadId) return;

    let isMounted = true;
    let timeoutId;

    const pollStatus = async () => {
      try {
        const response = await API.checkFileStatus(uploadId);
        const status = response.data.status;

        if (!isMounted) return;

        setImportStatus(status);
        setImportErrors(response.data.import_errors || []);

        if (!FINAL_STATUSES.includes(status)) {
          timeoutId = setTimeout(pollStatus, POLL_INTERVAL);
        }
      } catch (err) {
        console.error("Import status error", err);
        timeoutId = setTimeout(pollStatus, POLL_INTERVAL);
      }
    };

    pollStatus();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [uploadId]);

  return (
    <>
      {uploadId && (
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, alignItems: "center", justifyContent: "center" }}
        >
          <Chip
            label={`Import Status: ${importStatus.replaceAll("_", " ")}`}
            color={
              importStatus === "completed"
                ? "success"
                : importStatus === "completed_with_errors"
                  ? "warning"
                  : importStatus === "failed"
                    ? "error"
                    : importStatus === "processing"
                      ? "info"
                      : "default"
            }
          />
          {importStatus === "processing" && <CircularProgress size={20} />}

          {importErrors.length > 0 && (
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => setOpenErrors(true)}
            >
              View Errors ({importErrors.length})
            </Button>
          )}
        </Stack>
      )}

      {/* EMPLOYEES TABLE */}
      <Grid container>
        <Grid
          item
          size={{ xs: 12 }}
          sx={{
            width: "80%",
            mx: "auto", // centers horizontally
          }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Failed Count</TableCell>
                  <TableCell>Total Count</TableCell>
                  <TableCell>Errors</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row) => {
                  const errors = Array.isArray(row.import_errors)
                    ? row.import_errors
                    : [];

                  const hasErrors = errors.length > 0;

                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.failed_count ?? 0}</TableCell>
                      <TableCell>{row.total_count ?? 0}</TableCell>
                      <TableCell>
                        {hasErrors ? (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => {
                              setImportErrors(errors);
                              setOpenErrors(true);
                            }}
                          >
                            View Errors ({errors.length})
                          </Button>
                        ) : (
                          "No Errors"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              variant="outlined"
              shape="rounded"
              sx={{ mt: 1 }}
            />
          </Stack>
        </Grid>
      </Grid>

      <ImportErrorsModal
        open={openErrors}
        onClose={() => setOpenErrors(false)}
        errors={importErrors}
      />
    </>
  );
};

export default Employees;

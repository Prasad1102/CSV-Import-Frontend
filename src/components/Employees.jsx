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

const POLL_INTERVAL = 2000;
const FINAL_STATUSES = ["failed", "completed", "completed_with_errors"];

const Employees = ({ uploadId }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [importStatus, setImportStatus] = useState("pending");
  const [importErrors, setImportErrors] = useState([]);
  const [openErrors, setOpenErrors] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await API.getUsers(page);
        setData(response.data.employees);
        setTotalPages(response.data.meta.total_pages);
      } catch (err) {
        console.error("Employees API error", err);
      }
    };
    fetchEmployees();
  }, [page]);

  /* ---------- Import Status Polling ---------- */
  useEffect(() => {
    if (!uploadId) return;

    const pollStatus = async () => {
      try {
        const response = await API.checkFileStatus(uploadId);
        const status = response.data.status;

        setImportStatus(status);
        setImportErrors(response.data.import_errors || []);

        if (FINAL_STATUSES.includes(status)) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } catch (err) {
        console.error("Import status error", err);
      }
    };

    pollStatus();

    intervalRef.current = setInterval(pollStatus, POLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
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
            label={`Import Status: ${importStatus}`}
            color={
              importStatus === "completed"
                ? "success"
                : importStatus === "completed_with_errors"
                  ? "warning"
                  : importStatus === "failed"
                    ? "error"
                    : "info"
            }
          />

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
                  <TableCell>Sr. No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Join Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row.first_name} {row.last_name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.joining_date}</TableCell>
                  </TableRow>
                ))}
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

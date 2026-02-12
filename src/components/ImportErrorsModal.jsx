import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const ImportErrorsModal = ({ open, onClose, errors }) => {
  const safeErrors = Array.isArray(errors) ? errors : [];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Errors</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Row No</TableCell>
              <TableCell>Error Field</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {safeErrors?.map((rowObj, index) => {
              const rowNumber = Object.keys(rowObj)[0];
              const fieldErrors = rowObj[rowNumber];

              return Object.entries(fieldErrors).map(([field, message], i) => (
                <TableRow key={`${index}-${i}`}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell>{field}</TableCell>
                  <TableCell>{message}</TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ImportErrorsModal;

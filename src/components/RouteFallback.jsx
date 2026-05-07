import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function RouteFallback() {
  return (
    <Box
      role="status"
      aria-label="Loading page"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

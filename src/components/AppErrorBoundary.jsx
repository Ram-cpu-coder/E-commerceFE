import { Component } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default class AppErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("AppErrorBoundary:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 4,
            maxWidth: 440,
            mx: "auto",
            mt: 6,
            mb: 6,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" component="h1" gutterBottom fontWeight={600}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Please reload the page. If this keeps happening, try again in a few
            minutes.
          </Typography>
          <Button variant="contained" size="medium" onClick={this.handleReload}>
            Reload page
          </Button>
        </Box>
      );
    }    return this.props.children;
  }
}

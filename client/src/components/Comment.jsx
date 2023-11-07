import React from "react";
import { Box, Typography } from "@mui/material";

const Comment = ({ username, text }) => {
  return (
    <Box p={1} borderBottom={1} borderColor="divider">
      <Typography variant="body1" fontWeight="500">
        {username}:
      </Typography>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};

export default Comment;

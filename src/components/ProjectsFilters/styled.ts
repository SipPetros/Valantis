import { Select } from "@mui/material";
import styled from "styled-components";

export const StyledSelectField = styled(Select)(() => ({
    height: 32,
    maxWidth: 150,
    fontSize: 14,
    '&.Mui-focused fieldset': {
      borderWidth: '1px !important',
    },
  }));
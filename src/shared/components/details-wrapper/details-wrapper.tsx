import {PropsWithChildren} from "react";
import {Box, Paper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export const DetailsWrapper = ({children}: PropsWithChildren): JSX.Element => (
  <Box sx={{p: 1}}>
    <Paper sx={{p: 1, paddingTop: 2}}>
      <Grid container spacing={{xs: 2, md: 3}}>
        {children}
      </Grid>
    </Paper>
  </Box>
);

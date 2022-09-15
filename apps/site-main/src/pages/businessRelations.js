import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RelationsTabs from "../components/businessRelations/RelationsTabs";

function BusinessRelations() {
    const [orgId, setOrgId] = useState()

    useEffect(() => {
      const userOrgId = JSON.parse(localStorage.getItem('user')).organisation.id
      setOrgId(userOrgId)
    }, [])

    return (
      <>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={false}>
            <Typography sx={{ m: 1 }} variant="h4">
              Business Relations
            </Typography>
            <Box sx={{ mt: 3 }}>
              <RelationsTabs orgId={orgId}/>
            </Box>
          </Container>
        </Box>
      </>
    );
}

export default BusinessRelations
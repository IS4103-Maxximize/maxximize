import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Grid, Typography } from "@mui/material"
import { ModuleCard } from "../components/module-card"
import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';

function qualityAssurance() {
  const user = JSON.stringify(localStorage.getItem('user'))
  const qualityAssuranceCards = [
    {
      title: 'Manage QA Rules',
      href: 'rules',
      description1: `Add, delete, update or view QA Rules`,
      media: '../assets/images/qualityAssurance/rules.jpg',
      access: ['manager', 'superadmin']
    },
    {
      title: 'Manage QA checklists',
      href: 'checklists',
      description1: 'Allocate QA rules to new or existing checklists',
      media: '../assets/images/qualityAssurance/checklist.jpg',
      access: ['manager', 'superadmin']
    }
  ]
  return (
    <> 
      <HelmetProvider>
        <Helmet>
          <title>{`Quality Assurance | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box sx={{marginLeft: '20px', marginBottom: '60px'}}>
        <Typography variant="h4">
          Quality Assurance
        </Typography>
      </Box>
      <Grid container spacing={3} mr={4}>
        {qualityAssuranceCards.map(card => {
          return (<Grid key={card.title} item xs={12} md={12} lg={4} mr={2} ml={2}>
            <ModuleCard module={card}/>
          </Grid>)
        })}
      </Grid>
      <Outlet/>
    </>
    
  )
}

export default qualityAssurance
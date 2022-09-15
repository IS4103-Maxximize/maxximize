import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

export const PartnersListResults = ({ partners, ...rest }) => {
  const [selectedPartnersIds, setSelectedPartnersIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedPartnersIds;

    if (event.target.checked) {
      newSelectedPartnersIds = partners.map((partner) => partner.id);
    } else {
      newSelectedPartnersIds = [];
    }

    setSelectedPartnersIds(newSelectedPartnersIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPartnersIds.indexOf(id);
    let newSelectedPartnersIds = [];

    if (selectedIndex === -1) {
      newSelectedPartnersIds = newSelectedPartnersIds.concat(newSelectedPartnersIds, id);
    } else if (selectedIndex === 0) {
      newSelectedPartnersIds = newSelectedPartnersIds.concat(selectedPartnersIds.slice(1));
    } else if (selectedIndex === selectedPartnersIds.length - 1) {
      newSelectedPartnersIds = newSelectedPartnersIds.concat(selectedPartnersIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedPartnersIds = newSelectedPartnersIds.concat(
        selectedPartnersIds.slice(0, selectedIndex),
        selectedPartnersIds.slice(selectedIndex + 1)
      );
    }

    setSelectedPartnersIds(newSelectedPartnersIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPartnersIds.length === partners.length}
                    color="primary"
                    indeterminate={
                      selectedPartnersIds.length > 0
                      && selectedPartnersIds.length < partners.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Location
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Registration date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.slice(0, limit).map((partners) => (
                <TableRow
                  hover
                  key={partners.id}
                  selected={selectedPartnersIds.indexOf(partners.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPartnersIds.indexOf(partners.id) !== -1}
                      onChange={(event) => handleSelectOne(event, partners.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {partners.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {partners.email}
                  </TableCell>
                  <TableCell>
                    {`${partners.address.city}, ${partners.address.state}, ${partners.address.country}`}
                  </TableCell>
                  <TableCell>
                    {partners.phone}
                  </TableCell>
                  <TableCell>
                    {format(partners.createdAt, 'dd/MM/yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PartnersListResults.propTypes = {
  partners: PropTypes.array.isRequired
};

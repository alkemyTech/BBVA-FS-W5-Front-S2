import React from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";

const Paginado = ({ totalPages, currentPage, onPageChange, itemsPerPageOptions, onItemsPerPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Grid item size={12} sx={{marginTop:"15px", textAlign:"center", display:"flex", justifyContent:"center"}}>
      <Stack spacing={2} direction="column" alignItems="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => onPageChange(page)}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#2b6a2f", 
            },
            "& .Mui-selected": {
              backgroundColor: "#2B6A2F !important",
              color: "#fff", 
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#6C6C6C", 
            },
          }}
        />
        {itemsPerPageOptions && (
          <select
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            defaultValue={itemsPerPageOptions[0]}
            style={{
              marginTop: "10px",
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} por página
              </option>
            ))}
          </select>
        )}
      </Stack>
    </Grid>
  );
};

Paginado.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  onItemsPerPageChange: PropTypes.func,
};

Paginado.defaultProps = {
  itemsPerPageOptions: null,
  onItemsPerPageChange: null,
};

export default Paginado;

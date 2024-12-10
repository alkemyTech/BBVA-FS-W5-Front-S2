import React from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Paginado = ({ totalPages, currentPage, onPageChange, itemsPerPageOptions, onItemsPerPageChange }) => {
  return (
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
            backgroundColor: "#2b6a2f !important",
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

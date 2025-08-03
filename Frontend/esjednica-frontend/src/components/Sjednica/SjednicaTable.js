import React from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import "../../styles/SjednicaPage.css";
import { useNavigate } from "react-router-dom";

const SjednicaTable = ({
  sjednice,
  onEdit,
  onDelete,
  onSort,
  sortKey,
  sortAsc,
}) => {
  const navigate = useNavigate();

  const handleSort = (key) => {
    onSort(key);
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return null;
    return sortAsc ? (
      <FaSortUp style={{ marginLeft: "6px" }} />
    ) : (
      <FaSortDown style={{ marginLeft: "6px" }} />
    );
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <div className="sjednica-table-wrapper">
      <table className="sjednica-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("naziv")}>
              Naziv {renderSortIcon("naziv")}
            </th>
            <th onClick={() => handleSort("datumOdrzavanja")}>
              Datum i vrijeme {renderSortIcon("datumOdrzavanja")}
            </th>
            <th onClick={() => handleSort("lokacija")}>
              Lokacija {renderSortIcon("lokacija")}
            </th>
            {isAdmin ? <th>Akcije</th> : null}
          </tr>
        </thead>
        <tbody>
          {sjednice.map((s) => (
            <tr
              key={s.id}
              onClick={() => navigate(`/sjednice/${s.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{s.naziv}</td>
              <td>{new Date(s.datumOdrzavanja).toLocaleString()}</td>
              <td>{s.lokacija}</td>
              {isAdmin ? (
                <td onClick={(e) => e.stopPropagation()}>
                  <div>
                    <button
                      type="button"
                      className="btn-table edit"
                      onClick={() => onEdit(s)}
                    >
                      Uredi
                    </button>
                    <button
                      type="button"
                      className="btn-table delete"
                      onClick={() => onDelete(s)}
                    >
                      Obriši
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SjednicaTable;

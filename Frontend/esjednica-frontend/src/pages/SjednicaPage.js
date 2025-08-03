import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { sjednicaStore } from "../stores/SjednicaStore";
import SjednicaForm from "../components/Sjednica/SjednicaForm";
import SjednicaTable from "../components/Sjednica/SjednicaTable";
import "../styles/SjednicaPage.css";

const SjednicaPage = observer(() => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("naziv");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  useEffect(() => {
    sjednicaStore.fetchAll();
  }, []);

  const filtered = sjednicaStore.sjednice.filter(
    (s) =>
      s.naziv.toLowerCase().includes(search.toLowerCase()) ||
      s.lokacija.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey]?.toLowerCase?.() || a[sortKey];
    const bVal = b[sortKey]?.toLowerCase?.() || b[sortKey];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const pageCount = Math.ceil(sorted.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = sorted.slice(offset, offset + itemsPerPage);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const goToPage = (page) => {
    if (page >= 0 && page < pageCount) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="sjednice-container">
      <h2>Popis sjednica</h2>

      <div className="sjednice-controls">
        <input
          type="text"
          placeholder="Pretraži po nazivu ili lokaciji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p></p>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(0);
          }}
        >
          <option value={10}>Prikaži po stranici</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        {isAdmin && (
          <button
            className="add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            ➕ Dodaj sjednicu
          </button>
        )}
      </div>

      <SjednicaTable
        sjednice={currentItems}
        onEdit={(sjednica) => {
          setSelected(sjednica);
          setIsEditModalOpen(true);
        }}
        onDelete={(sjednica) => {
          if (
            window.confirm(`Želite li obrisati sjednicu "${sjednica.naziv}"?`)
          ) {
            sjednicaStore.delete(sjednica.id);
          }
        }}
        onSort={toggleSort}
        sortKey={sortKey}
        sortAsc={sortAsc}
      />

      <div className="pagination-controls">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          ← Prethodna
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={i === currentPage ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
        >
          Sljedeća →
        </button>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setIsAddModalOpen(false)}
            >
              ✖
            </button>
            <SjednicaForm onSuccess={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      )}

      {isEditModalOpen && selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✖
            </button>
            <SjednicaForm
              sjednica={selected}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default SjednicaPage;

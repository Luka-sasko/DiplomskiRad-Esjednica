import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "../../stores/UserStore";

const ALLOWED_ROLES = [
  "ROLE_GLEDATELJ",
  "ROLE_KORISNIK",
  "ROLE_PREDLAGATELJ",
  "ROLE_ADMIN",
];

const UsersTable = observer(() => {
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [includeAdmins, setIncludeAdmins] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState("prezime");
  const [sortDir, setSortDir] = useState("asc");

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [modalError, setModalError] = useState("");

  const fetchList = useCallback(
    (overrides = {}) => {
      const params = {
        role: role || undefined,
        q: q || undefined,
        includeAdmins,
        page,
        size,
        sort: [`${sortField},${sortDir}`],
        ...overrides,
      };
      userStore.loadUsersForAdminFilter(params);
    },
    [role, q, includeAdmins, page, size, sortField, sortDir]
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const applyFilters = () => {
    fetchList({ page: 0 });
    setPage(0);
  };

  const onHeaderClick = (field) => {
    const allowed = new Set(["username", "ime", "prezime", "email", "roles"]);
    if (!allowed.has(field)) return;
    const nextDir = sortField === field && sortDir === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDir(nextDir);
    setPage(0);
  };

  const caret = (field) =>
    sortField === field ? (
      <span style={{ marginLeft: 6, opacity: 0.7 }}>
        {sortDir === "asc" ? "▲" : "▼"}
      </span>
    ) : null;

  const prevPage = () => {
    if (page === 0) return;
    setPage((p) => Math.max(0, p - 1));
  };

  const nextPage = () => {
    const total = userStore.totalElements || 0;
    const totalPages = Math.max(1, Math.ceil(total / size));
    if (page + 1 >= totalPages) return;
    setPage((p) => Math.min(totalPages - 1, p + 1));
  };

  const onChangeSize = (e) => {
    const newSize = Number(e.target.value) || 10;
    setSize(newSize);
    setPage(0);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    const current =
      String(user?.roles || "")
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)[0] || "";
    setSelectedRole(current);
    setModalError("");
    setEditOpen(true);
  };

  const saveRoles = async () => {
    if (!selectedUser?.id) {
      setModalError(
        "Nedostaje ID korisnika — vrati 'id' u search DTO ili implementiraj dohvat ID-a po usernameu."
      );
      return;
    }
    if (!selectedRole) {
      setModalError("Odaberi rolu.");
      return;
    }
    try {
      await userStore.updateRole(selectedUser.id, { roles: selectedRole });
      setEditOpen(false);
      fetchList();
    } catch (e) {
      const msg =
        e?.response?.data || e?.message || "Greška pri spremanju uloga.";
      setModalError(String(msg));
    }
  };

  const rows = userStore.manageableUsers || [];
  const total = userStore.totalElements || rows.length;
  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <div className="sjednice-container">
      <h2>Korisnici</h2>

      <div className="sjednice-controls">
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Sve role</option>
          <option value="KORISNIK">KORISNIK</option>
          <option value="PREDLAGATELJ">PREDLAGATELJ</option>
          <option value="GLEDATELJ">GLEDATELJ</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pretraga (ime, prezime ili email)"
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={includeAdmins}
            onChange={(e) => setIncludeAdmins(e.target.checked)}
          />
          Uključi admine
        </label>

        <button className="btn-table edit" onClick={applyFilters}>
          Primijeni
        </button>
      </div>

      <div className="sjednica-table-wrapper">
        <table className="sjednica-table">
          <thead>
            <tr>
              <th onClick={() => onHeaderClick("username")}>
                Korisničko ime {caret("username")}
              </th>
              <th onClick={() => onHeaderClick("ime")}>Ime {caret("ime")}</th>
              <th onClick={() => onHeaderClick("prezime")}>
                Prezime {caret("prezime")}
              </th>
              <th onClick={() => onHeaderClick("email")}>
                Email {caret("email")}
              </th>
              <th onClick={() => onHeaderClick("roles")}>
                Uloge {caret("roles")}
              </th>
            </tr>
          </thead>
          <tbody>
            {!userStore.loadingManageable && rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#777" }}>
                  Nema rezultata
                </td>
              </tr>
            )}

            {rows.map((u) => (
              <tr
                key={u.id ?? u.username}
                onClick={() => openEdit(u)}
                style={{ cursor: "pointer" }}
              >
                <td>{u.username}</td>
                <td>{u.ime}</td>
                <td>{u.prezime}</td>
                <td>{u.email}</td>
                <td>
                  {String(u.roles || "")
                    .split(",")
                    .map((r) => r.trim())
                    .filter(Boolean)
                    .map((r) => (
                      <span
                        key={r}
                        style={{
                          display: "inline-block",
                          marginRight: 6,
                          marginBottom: 4,
                          padding: "2px 8px",
                          borderRadius: 14,
                          border: "1px solid #ddd",
                          fontSize: 11,
                          letterSpacing: 0.3,
                          textTransform: "uppercase",
                        }}
                      >
                        {r.replace("ROLE_", "")}
                      </span>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <div>
          Redova po stranici:
          <select
            onChange={onChangeSize}
            value={size}
            style={{ marginLeft: 8 }}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          Stranica <b>{page + 1}</b> od <b>{totalPages}</b> • Ukupno{" "}
          <b>{total}</b>
        </div>

        <div>
          <button onClick={prevPage} disabled={page === 0}>
            Prethodna
          </button>
          <button onClick={nextPage} disabled={page + 1 >= totalPages}>
            Sljedeća
          </button>
        </div>
      </div>

      {editOpen && (
        <div className="modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setEditOpen(false)}
              aria-label="Zatvori"
            >
              ✕
            </button>
            <h3>Uredi uloge — {selectedUser?.username}</h3>

            {modalError && (
              <div
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #dc3545",
                  background: "#ffe6e9",
                  color: "#b02a37",
                  fontSize: 14,
                }}
              >
                {modalError}
              </div>
            )}

            <div className="sjednica-form">
              {ALLOWED_ROLES.map((r) => (
                <label
                  key={r}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={selectedRole === r}
                    onChange={() => setSelectedRole(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}

              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button
                  className="btn-table edit"
                  type="button"
                  onClick={saveRoles}
                >
                  Spremi
                </button>
                <button
                  className="btn-table delete"
                  type="button"
                  onClick={() => setEditOpen(false)}
                >
                  Odustani
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default UsersTable;

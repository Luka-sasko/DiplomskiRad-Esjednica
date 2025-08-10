import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "../../stores/UserStore";
import { toast } from "react-toastify";

export const ResetPasswordModal = observer(({ open, onClose }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmNewPassword
    ) {
      setErr("Sva polja su obavezna.");
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setErr("Nova lozinka i potvrda se ne podudaraju.");
      return;
    }

    try {
      setSaving(true);
      await userStore.updatePassword(form);
      toast.success("Lozinka je promijenjena.");
      onClose();
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      const msg =
        error?.response?.data ||
        error?.message ||
        "Greška pri promjeni lozinke.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Zatvori">
          ✕
        </button>
        <h3>Promijeni lozinku</h3>

        {err && (
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
            {err}
          </div>
        )}

        <form className="sjednica-form" onSubmit={onSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Trenutna lozinka"
            value={form.currentPassword}
            onChange={onChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Nova lozinka"
            value={form.newPassword}
            onChange={onChange}
          />
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Potvrdi novu lozinku"
            value={form.confirmNewPassword}
            onChange={onChange}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Spremanje..." : "Spremi"}
          </button>
        </form>
      </div>
    </div>
  );
});

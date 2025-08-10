import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { profileStore } from "../../stores/ProfileStore";
import "../../styles/Profile.css";

export const EditProfileModal = observer(({ open, onClose }) => {
  const { profile } = profileStore;
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    username: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open && profile) {
      setFormData({
        ime: profile.ime || "",
        prezime: profile.prezime || "",
        email: profile.email || "",
        username: profile.username || "",
      });
    }
  }, [open, profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!open) return null;

  const resetForm = () => {
    setFormData({
      ime: "",
      prezime: "",
      email: "",
      username: "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);

    try {
      if (!formData.email.includes("@")) {
        setErr("Unesite valjan email.");
        setSubmitting(false);
        return;
      }
      await profileStore.updateProfile(formData);
      resetForm();
      onClose();
    } catch (e) {
      setErr(e?.message || "Greška pri ažuriranju.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3 className="modal-title">Ažuriraj podatke</h3>
        <form onSubmit={onSubmit} className="modal-form">
          <label className="profile-label" htmlFor="ime">
            Ime
          </label>
          <input
            className="modal-input"
            value={formData.ime}
            onChange={(e) => handleChange("ime", e.target.value)}
          />

          <label className="profile-label" htmlFor="prezime">
            Prezime
          </label>
          <input
            className="modal-input"
            value={formData.prezime}
            onChange={(e) => handleChange("prezime", e.target.value)}
          />

          <label className="profile-label" htmlFor="email">
            Email
          </label>
          <input
            className="modal-input"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <label className="profile-label" htmlFor="korisnicko_ime">
            Korisničko ime
          </label>
          <input
            className="modal-input"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          {err && <div className="modal-error">{err}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="modal-button cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Odustani
            </button>
            <button
              type="submit"
              className="modal-button save"
              disabled={submitting}
            >
              {submitting ? "Spremanje…" : "Spremi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

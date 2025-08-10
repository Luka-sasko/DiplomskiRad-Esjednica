import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { profileStore } from "../stores/ProfileStore";
import { EditProfileModal } from "../components/Profile/EditProfileModal";
import { ResetPasswordModal } from "../components/Profile/ResetPasswordModal";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export const ProfilePage = observer(() => {
  const { profile, loading, error } = profileStore;
  const [open, setOpen] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) profileStore.getProfileData();
    setIsAdmin(profileStore.isAdmin());
  }, [profile]);

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Moj Profil</h2>

        <form className="profile-form">
          <label className="profile-label" htmlFor="ime">
            Ime
          </label>
          <input
            id="ime"
            type="text"
            className="profile-input"
            value={profile.ime || ""}
            disabled
            placeholder="Ime"
          />

          <label className="profile-label" htmlFor="prezime">
            Prezime
          </label>
          <input
            id="prezime"
            type="text"
            className="profile-input"
            value={profile.prezime || ""}
            disabled
            placeholder="Prezime"
          />

          <label className="profile-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="profile-input"
            value={profile.email || ""}
            disabled
            placeholder="Email"
          />

          <label className="profile-label" htmlFor="username">
            Korisničko ime
          </label>
          <input
            id="username"
            type="text"
            className="profile-input"
            value={profile.username || ""}
            disabled
            placeholder="Korisničko ime"
          />

          <label className="profile-label" htmlFor="roles">
            Uloge
          </label>
          <input
            id="roles"
            type="text"
            className="profile-input"
            value={
              Array.isArray(profile.roles)
                ? profile.roles.join(", ")
                : String(profile.roles || "")
            }
            disabled
            placeholder="Uloge"
          />
        </form>

        <div
          style={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 0 }}
        >
          <button className="profile-button" onClick={() => setOpen(true)}>
            Uredi profil
          </button>

          <button className="profile-button" onClick={() => setOpenReset(true)}>
            Promijeni lozinku
          </button>

          {isAdmin && (
            <button
              className="profile-button"
              onClick={() => navigate("/tablica-korisnika")}
              type="button"
            >
              Tablica korisnika
            </button>
          )}
        </div>

        <EditProfileModal open={open} onClose={() => setOpen(false)} />
        <ResetPasswordModal
          open={openReset}
          onClose={() => setOpenReset(false)}
        />
      </div>
    </div>
  );
});

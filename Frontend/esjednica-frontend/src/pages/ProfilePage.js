import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { profileStore } from "../stores/ProfileStore";
import { EditProfileModal } from "../components/Profile/EditProfileModal";
import "../styles/Profile.css";

export const ProfilePage = observer(() => {
  const { profile, loading, error } = profileStore;
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
          <input
            type="text"
            className="profile-input"
            value={profile.ime || ""}
            disabled
            placeholder="Ime"
          />
          <input
            type="text"
            className="profile-input"
            value={profile.prezime || ""}
            disabled
            placeholder="Prezime"
          />
          <input
            type="email"
            className="profile-input"
            value={profile.email || ""}
            disabled
            placeholder="Email"
          />
          <input
            type="text"
            className="profile-input"
            value={profile.username || ""}
            disabled
            placeholder="Korisničko ime"
          />
          <input
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

        <button className="profile-button" onClick={() => setOpen(true)}>
          Uredi profil
        </button>

        <EditProfileModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
});

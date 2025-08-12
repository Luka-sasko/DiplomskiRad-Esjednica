import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { glasanjeStore } from "../../stores/GlasanjeStore";
import GlasanjeModal from "./GlasanjeModal";
import useWebSocket from "../../api/useWebSocket";
import RezultatiChart from "./RezultatiChart";

const GlasanjeBox = observer(({ tockaId }) => {
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin =
    user?.roles?.includes("ROLE_ADMIN") ||
    user?.roles?.includes("ROLE_PREDLAGATELJ");
  const isGledatelj = user?.roles?.includes("ROLE_GLEDATELJ");
  useWebSocket((event) => {
    if (event.tockaId === tockaId) {
      glasanjeStore.ucitajStatus(tockaId);
      glasanjeStore.ucitajGlasove(tockaId);
    }
  });

  const [preostalo, setPreostalo] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        glasanjeStore.aktivno &&
        glasanjeStore.start &&
        glasanjeStore.trajanje
      ) {
        const startTime = new Date(glasanjeStore.start).getTime();
        const endTime = startTime + glasanjeStore.trajanje * 1000;
        const now = Date.now();
        const remainingSeconds = Math.max(
          0,
          Math.floor((endTime - now) / 1000)
        );
        setPreostalo(remainingSeconds);

        if (remainingSeconds === 0) {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [glasanjeStore.start, glasanjeStore.trajanje, glasanjeStore.aktivno]);

  useEffect(() => {
    glasanjeStore.ucitajStatus(tockaId);
    glasanjeStore.ucitajGlasove(tockaId);
  }, [tockaId]);

  const vrijemeZavrseno = () => {
    const end =
      new Date(glasanjeStore.start).getTime() + glasanjeStore.trajanje * 1000;
    return Date.now() > end;
  };

  return (
    <div style={{ marginTop: "5%" }}>
      <h2>Glasanje</h2>
      {isAdmin && !glasanjeStore.aktivno && (
        <button
          className="add-button"
          onClick={() => {
            const trajanje = prompt("Trajanje u sekundama:");
            if (trajanje) {
              glasanjeStore.startGlasanje(tockaId, trajanje);
            }
          }}
        >
          Pokreni glasanje
        </button>
      )}
      {!isGledatelj && (
        <>
          {glasanjeStore.aktivno && preostalo !== null && (
            <div className="glasanje-timer-box">
              <p style={{ marginTop: "2%" }} className="glasanje-timer-text">
                Preostalo vrijeme za glasanje: <strong>{preostalo}s</strong>
              </p>
            </div>
          )}

          {glasanjeStore.aktivno &&
            !vrijemeZavrseno() &&
            (glasanjeStore.jeGlasao ? (
              <p>Glasanje evidentirano za ovaj račun.</p>
            ) : (
              <button className="add-button" onClick={() => setShowModal(true)}>
                Glasaj
              </button>
            ))}
        </>
      )}
      {glasanjeStore.start &&
        Date.now() >
          new Date(glasanjeStore.start).getTime() +
            glasanjeStore.trajanje * 1000 && (
          <div>
            <h3>Rezultati:</h3>
            <ul>
              <li>
                ZA:{" "}
                {glasanjeStore.rezultati.filter((g) => g.glas === "ZA").length}
              </li>
              <li>
                PROTIV:{" "}
                {
                  glasanjeStore.rezultati.filter((g) => g.glas === "PROTIV")
                    .length
                }
              </li>
              <li>
                SUZDRŽAN:{" "}
                {
                  glasanjeStore.rezultati.filter((g) => g.glas === "SUZDRŽAN")
                    .length
                }
              </li>
            </ul>

            <RezultatiChart />
          </div>
        )}

      {showModal && (
        <GlasanjeModal tockaId={tockaId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
});

export default GlasanjeBox;

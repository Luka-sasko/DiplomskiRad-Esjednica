import { useEffect } from 'react';

const PollingUpdater = ({ intervalSec = 5, onPoll }) => {
    useEffect(() => {
        if (!onPoll) return;

        const interval = setInterval(() => {
            console.log('[PollingUpdater] Pozivam onPoll()'); // 🟡 LOG
            onPoll();
        }, intervalSec * 1000);

        return () => clearInterval(interval);
    }, [intervalSec, onPoll]);

    return null;
};

export default PollingUpdater;

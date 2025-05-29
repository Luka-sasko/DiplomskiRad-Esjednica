import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { observer } from 'mobx-react-lite';
import { glasanjeStore } from '../../stores/GlasanjeStore';

const RezultatiChart = observer(() => {
    const data = [
        { ime: 'ZA', glasova: glasanjeStore.rezultati.ZA || 0 },
        { ime: 'PROTIV', glasova: glasanjeStore.rezultati.PROTIV || 0 },
        { ime: 'SUZDRŽAN', glasova: glasanjeStore.rezultati.SUZDRŽAN || 0 }
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3>Rezultati glasanja</h3>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ime" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="glasova" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
});

export default RezultatiChart;

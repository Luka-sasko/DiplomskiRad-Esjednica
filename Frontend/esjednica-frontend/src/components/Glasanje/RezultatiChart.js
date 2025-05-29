import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { observer } from 'mobx-react-lite';
import { glasanjeStore } from '../../stores/GlasanjeStore';

const RezultatiChart = observer(() => {
  const countGlasova = (tip) =>
    glasanjeStore.rezultati.filter(g => g.glas === tip).length;

  const data = [
    { ime: 'ZA', glasova: countGlasova('ZA') },
    { ime: 'PROTIV', glasova: countGlasova('PROTIV') },
    { ime: 'SUZDRŽAN', glasova: countGlasova('SUZDRŽAN') }
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
          <Bar dataKey="glasova" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default RezultatiChart;

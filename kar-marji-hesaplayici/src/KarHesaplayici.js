import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KarHesaplayici = () => {
  const [maliyet, setMaliyet] = useState(0);
  const [satisFiyati, setSatisFiyati] = useState(0);
  const [kdvOrani, setKdvOrani] = useState(20);
  const [komisyonOrani, setKomisyonOrani] = useState(15);
  const [sonuclar, setSonuclar] = useState(null);

  const hesapla = () => {
    if (maliyet <= 0 || satisFiyati <= 0) {
      alert('Geçerli değerler girin!');
      return;
    }
    const brutKar = satisFiyati - maliyet;
    const kdvTutar = satisFiyati * (kdvOrani / 100);
    const komisyonTutar = satisFiyati * (komisyonOrani / 100);
    const netKar = brutKar - kdvTutar - komisyonTutar;
    const karMarji = (netKar / satisFiyati) * 100;
    const breakEven = maliyet / (1 - (komisyonOrani + kdvOrani) / 100);

    setSonuclar({ brutKar, kdvTutar, komisyonTutar, netKar, karMarji, breakEven });
  };

  const chartData = sonuclar ? {
    labels: ['Maliyet', 'Brüt Kâr', 'Net Kâr'],
    datasets: [{ label: 'TL', data: [maliyet, sonuclar.brutKar, sonuclar.netKar], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }]
  } : null;

  return (
    <Card className="p-4">
      <h2>Kâr Marjı Hesaplayıcısı</h2>
      <Form>
        <Row>
          <Col><Form.Label>Maliyet (TL)</Form.Label><Form.Control type="number" value={maliyet} onChange={(e) => setMaliyet(parseFloat(e.target.value))} /></Col>
          <Col><Form.Label>Satış Fiyatı (TL)</Form.Label><Form.Control type="number" value={satisFiyati} onChange={(e) => setSatisFiyati(parseFloat(e.target.value))} /></Col>
        </Row>
        <Row>
          <Col><Form.Label>KDV Oranı (%)</Form.Label><Form.Control type="number" value={kdvOrani} onChange={(e) => setKdvOrani(parseFloat(e.target.value))} /></Col>
          <Col><Form.Label>Komisyon Oranı (%)</Form.Label><Form.Control type="number" value={komisyonOrani} onChange={(e) => setKomisyonOrani(parseFloat(e.target.value))} /></Col>
        </Row>
        <Button onClick={hesapla} className="mt-3">Hesapla</Button>
      </Form>
      {sonuclar && (
        <div className="mt-4">
          <p>Net Kâr: {sonuclar.netKar.toFixed(2)} TL</p>
          <p>Kâr Marjı: {sonuclar.karMarji.toFixed(2)}%</p>
          <p>Minimum Satış Fiyatı: {sonuclar.breakEven.toFixed(2)} TL</p>
          {chartData && <Bar data={chartData} options={{ responsive: true }} />}
        </div>
      )}
    </Card>
  );
};

export default KarHesaplayici;
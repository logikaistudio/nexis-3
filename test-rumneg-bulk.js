const http = require('http');

async function run() {
  const data = JSON.stringify(Array.from({length: 350}, (_, i) => ({
    id: `temp-${i}`,
    occupant_name: `Name ${i}`,
    occupant_rank: "Rank",
    occupant_nrp: "123",
    area: "Area A",
    alamat_detail: "Alamat",
    longitude: "100",
    latitude: "-6",
    status_penghuni: "Aktif",
    no_sip: "SIP/1",
    tgl_sip: "2024-01-01",
    tipe_rumah: "Tipe A",
    golongan: "I",
    tahun_buat: "2020",
    asal_perolehan: "Beli",
    mendapat_fasdin: "Tidak",
    kondisi: "Baik",
    keterangan: "-"
  })));

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/assets/rumneg/bulk',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(data);
  req.end();
}
run();

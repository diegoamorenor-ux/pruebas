const express = require('express');
const fs = require('fs');
const path = require('path');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

const DB_PATH = path.join(__dirname, 'db.json');
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';

// Inicialización de cliente Kafka
const kafka = new Kafka({
  clientId: 'front-producer',
  brokers: [KAFKA_BROKER]
});
const producer = kafka.producer();

// Inicializar Productor
async function initProducer() {
  try {
    await producer.connect();
    console.log(' Conectado exitosamente al Broker de Kafka en: ' + KAFKA_BROKER);
  } catch (error) {
    console.error(' Fallo al conectar con Kafka:', error);
  }
}
initProducer();

// Servir la Interfaz de Usuario HTML (Frontend interactivo)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Lite Bank Transacciones</title>
      <style>
        body { background: #0f172a; color: #fff; font-family: sans-serif; text-align: center; padding: 50px; }
       .card { background: #1e293b; padding: 30px; border-radius: 12px; display: inline-block; border: 1px solid #334155; }
        input, button { padding: 10px; font-size: 16px; margin: 10px; border-radius: 6px; border: none; }
        button { background: #ffd100; color: #000; font-weight: bold; cursor: pointer; }
        #status-box { margin-top: 20px; font-size: 24px; font-weight: bold; color: #f59e0b; }
      </style>
    </head>
    <body>
      <h1>Lite Bank - Portal de Pagos</h1>
      <div class="card">
        <input type="text" id="target" placeholder="Cuenta Destino (Ej: 98765)">
        <input type="number" id="amount" placeholder="Monto ($)">
        <br>
        <button id="btn-pay" onclick="enviarPago()">Enviar Transferencia</button>
        <div id="status-box">Estado: Esperando transacción...</div>
      </div>

      <script>
        let intervalId = null;

        async function enviarPago() {
          const target = document.getElementById('target').value;
          const amount = document.getElementById('amount').value;
          const statusBox = document.getElementById('status-box');

          if(!target ||!amount) {
            alert('Por favor completa los campos');
            return;
          }

          statusBox.innerText = 'Estado: PENDIENTE';
          statusBox.style.color = '#f59e0b';

          const response = await fetch('/api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target, amount })
          });
          const data = await response.json();
          
          // Iniciar Polling (Sondeo constante del estado real en la BD)
          if(intervalId) clearInterval(intervalId);
          intervalId = setInterval(async () => {
            const resStatus = await fetch('/api/status/' + data.id);
            const statusData = await resStatus.json();
            
            if(statusData.status === 'APROBADO') {
              statusBox.innerText = 'Estado: APROBADO';
              statusBox.style.color = '#10b981';
              clearInterval(intervalId);
            }
          }, 500);
        }
      </script>
    </body>
    </html>
  `);
});

// Endpoint 1: Crear Transacción (Inyecta a Kafka)
app.post('/api/transfer', async (req, res) => {
  const { target, amount } = req.body;
  const transactionId = 'TX-' + Date.now();

  // Guardar estado inicial en la base de datos (db.json)
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  db.transactions[transactionId] = { target, amount, status: 'PENDIENTE' };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  // Enviar evento de transacción a Kafka
  try {
    await producer.send({
      topic: 'transferencias-creadas',
      messages: [
        {
          key: transactionId,
          value: JSON.stringify({ target, amount, status: 'PENDIENTE' })
        }
      ]
    });
    console.log(` Publicado en 'transferencias-creadas': ${transactionId}`);
  } catch (error) {
    console.error(' Fallo al publicar mensaje:', error);
  }

  // Devolver respuesta HTTP 202 (Accepted) para emular la asincronía real
  res.status(202).json({ id: transactionId, status: 'PENDIENTE' });
});

// Endpoint 2: Consultar estado (Sondeo por ID)
app.get('/api/status/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const tx = db.transactions[id] || { status: 'NO_ENCONTRADO' };
  res.json({ id, status: tx.status });
});

app.listen(3000, () => {
  console.log('[APP] Servidor web listo en http://localhost:3000');
});

const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';

const kafka = new Kafka({
  clientId: 'bank-worker',
  brokers: [KAFKA_BROKER]
});
const consumer = kafka.consumer({ groupId: 'bank-processing-group' });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function subscribeWhenTopicAvailable() {
  while (true) {
    try {
      await consumer.subscribe({ topic: 'transferencias-creadas', fromBeginning: false });
      return;
    } catch (error) {
      if (error && (error.type === 'UNKNOWN_TOPIC_OR_PARTITION' || error.code === 3)) {
        console.log(" Tópico aún no disponible, reintentando en 2s...");
        await delay(2000);
        continue;
      }
      throw error;
    }
  }
}

async function runWorker() {
  await consumer.connect();
  // El consumidor se suscribe al casillero específico de transferencias creadas
  await subscribeWhenTopicAvailable();
  console.log(" Escuchando eventos en el tópico 'transferencias-creadas'...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventData = JSON.parse(message.value.toString());
      const txId = message.key.toString();

      // Registro Estructurado (Structured Logging)
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "INFO",
        service: "bank-worker",
        message: "Evento recibido de Kafka",
        transactionId: txId,
        data: eventData
      }));

      // Simulación de procesamiento asíncrono complejo (Retraso de 4 segundos)
      console.log(` Procesando transacción ${txId}. Validando saldos...`);
      await delay(4000);

      // Actualizar el estado en db.json a "APROBADO"
      const db = JSON.parse(fs.readFileSync(DB_PATH));
      if (db.transactions[txId]) {
        db.transactions[txId].status = 'APROBADO';
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "INFO",
          service: "bank-worker",
          message: "Transacción procesada y aprobada con éxito",
          transactionId: txId,
          status: "APROBADO"
        }));
      }
    }
  });
}

runWorker().catch(console.error);

import { test, expect } from '@playwright/test';

const TERMINAL_STATUSES = new Set(['APROBADO', 'ERROR_TIMEOUT']);

async function createTransfer(request, { target, amount, simulationProfile = 'RANDOM', speedFactor = 1 }) {
  const response = await request.post('http://localhost:3000/api/transfer', {
    data: { target, amount, simulationProfile, speedFactor }
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function waitForTerminalStatus(request, txId, timeoutMs = 30000) {
  const startedAt = Date.now();
  let lastPayload = null;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await request.get(`http://localhost:3000/api/status/${txId}`);
    expect(response.ok()).toBeTruthy();
    lastPayload = await response.json();

    if (TERMINAL_STATUSES.has(lastPayload.status)) {
      return lastPayload;
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  throw new Error(`Timeout esperando estado terminal para ${txId}. Último estado: ${lastPayload?.status}`);
}

test.describe('Automatización de Flujos Asíncronos con Kafka', () => {
  const CHECKPOINTS_SECONDS = [1, 2, 3];

  test('TestPlan Smoke API - lectura inmediata evidencia estado no terminal', async ({ request }) => {
    const tx = await createTransfer(request, {
      target: '99999',
      amount: 150,
      simulationProfile: 'FAST_15',
      speedFactor: 0.1
    });

    const response = await request.get(`http://localhost:3000/api/status/${tx.id}`);
    const payload = await response.json();
    expect(payload.status).toBe('PENDIENTE');
  });

  test('TestPlan Polling API - checkpoints + tiempo de respuesta', async ({ request }) => {
    const tx = await createTransfer(request, {
      target: '12345',
      amount: 500,
      simulationProfile: 'FAST_10',
      speedFactor: 0.1
    });

    const startedAt = Date.now();
    const checkpoints = [];

    console.log(' Esperando procesamiento asíncrono con checkpoints controlados...');

    for (const secondMark of CHECKPOINTS_SECONDS) {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, secondMark * 1000 - elapsed);
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }

      const statusResponse = await request.get(`http://localhost:3000/api/status/${tx.id}`);
      const statusPayload = await statusResponse.json();
      const currentStatus = statusPayload.status;
      checkpoints.push({
        checkpointSeconds: secondMark,
        status: currentStatus
      });
      console.log(` Checkpoint ${secondMark}s -> ${currentStatus}`);
    }

    const terminal = await waitForTerminalStatus(request, tx.id, 30000);
    expect(terminal.status).toBe('APROBADO');

    const approvedAtMs = Date.now() - startedAt;
    const summary = {
      approvedAtMs,
      approvedAtSeconds: Number((approvedAtMs / 1000).toFixed(2)),
      checkpoints
    };

    await test.info().attach('tiempo-respuesta-kafka', {
      contentType: 'application/json',
      body: Buffer.from(JSON.stringify(summary, null, 2), 'utf-8')
    });

    console.log(` Tiempo de respuesta hasta APROBADO: ${summary.approvedAtSeconds}s`);
  });

  test('TestPlan API - mismo target en pool y casos parametrizados (5/10/15)', async ({ request }) => {
    const sameTarget = '77777';
    const cases = [
      { name: 'TC_FAST_5', simulationProfile: 'FAST_5', speedFactor: 0.1 },
      { name: 'TC_FAST_10', simulationProfile: 'FAST_10', speedFactor: 0.1 },
      { name: 'TC_FAST_15', simulationProfile: 'FAST_15', speedFactor: 0.1 },
      { name: 'TC_SLOW_TIMEOUT', simulationProfile: 'SLOW_TIMEOUT', speedFactor: 0.05 }
    ];

    const created = [];
    for (const tc of cases) {
      const tx = await createTransfer(request, {
        target: sameTarget,
        amount: 150,
        simulationProfile: tc.simulationProfile,
        speedFactor: tc.speedFactor
      });
      created.push({ ...tc, id: tx.id });
    }

    const results = await Promise.all(created.map(async tx => {
      const terminal = await waitForTerminalStatus(request, tx.id, 35000);
      return {
        testCase: tx.name,
        id: tx.id,
        status: terminal.status,
        responseTimeMs: terminal.responseTimeMs,
        workerBucket: terminal.workerBucket,
        target: terminal.target
      };
    }));

    // Mismo target, IDs distintos.
    const ids = new Set(results.map(r => r.id));
    expect(ids.size).toBe(results.length);
    expect(results.every(r => r.target === sameTarget)).toBeTruthy();

    // Validaciones de comportamiento esperado por test case.
    const byCase = Object.fromEntries(results.map(r => [r.testCase, r]));
    expect(byCase.TC_FAST_5.status).toBe('APROBADO');
    expect(byCase.TC_FAST_10.status).toBe('APROBADO');
    expect(byCase.TC_FAST_15.status).toBe('APROBADO');
    expect(byCase.TC_SLOW_TIMEOUT.status).toBe('ERROR_TIMEOUT');

    // Reporte adjunto para evidencia del impacto/tiempos.
    await test.info().attach('testplan-api-pool-resultados', {
      contentType: 'application/json',
      body: Buffer.from(JSON.stringify({ results }, null, 2), 'utf-8')
    });
  });

  test('TestPlan Distribución - 80% de casos por debajo de 20s (simulación controlada)', async ({ request }) => {
    const target = '88888';
    const batchProfiles = [
      'FAST_5', 'FAST_10', 'FAST_15', 'FAST_10', 'FAST_15',
      'FAST_5', 'FAST_10', 'FAST_15', 'SLOW_TIMEOUT', 'SLOW_TIMEOUT'
    ];

    const created = [];
    for (const profile of batchProfiles) {
      const tx = await createTransfer(request, {
        target,
        amount: 200,
        simulationProfile: profile,
        speedFactor: 0.05
      });
      created.push(tx.id);
    }

    const results = await Promise.all(
      created.map(txId => waitForTerminalStatus(request, txId, 40000))
    );

    const under20s = results.filter(r => Number(r.responseTimeMs) < 20000).length;
    const ratio = under20s / results.length;

    expect(ratio).toBeGreaterThanOrEqual(0.8);

    await test.info().attach('distribucion-80-20', {
      contentType: 'application/json',
      body: Buffer.from(
        JSON.stringify({
          total: results.length,
          under20s,
          ratio,
          responseTimesMs: results.map(r => r.responseTimeMs),
          statuses: results.map(r => r.status)
        }, null, 2),
        'utf-8'
      )
    });
  });

});

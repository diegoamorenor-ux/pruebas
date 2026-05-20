const { test, expect } = require('@playwright/test');

test.describe('Automatización de Flujos Asíncronos con Kafka', () => {

  test('Prueba Fallida por inestabilidad (Demostración de mala práctica)', async ({ page }) => {
    await page.goto('/');
    await page.fill('#target', '99999');
    await page.fill('#amount', '150');
    await page.click('#btn-pay');

    // Intentar verificar el estado de inmediato. El worker aún no ha procesado el evento.
    // Esto fallará sistemáticamente porque Kafka procesa de forma asíncrona.
    const estadoText = await page.locator('#status-box').innerText();
    console.log(` Lectura instantánea: ${estadoText}`);
    
    // Descomentar para ver el fallo real en vivo ante los alumnos:
    // expect(estadoText).toBe('Estado: APROBADO'); 
  });

  test('Prueba Exitosa usando Polling / Web-First Assertions (Buena práctica)', async ({ page }) => {
    await page.goto('/');
    await page.fill('#target', '12345');
    await page.fill('#amount', '500');
    await page.click('#btn-pay');

    // El estado inicial debe ser PENDIENTE
    const locatorStatus = page.locator('#status-box');
    await expect(locatorStatus).toHaveText('Estado: PENDIENTE');

    console.log(' Esperando que Kafka procese el mensaje de forma asíncrona...');

    // Polling inteligente: toHaveText re-evaluará el DOM automáticamente durante 10 segundos
    // hasta que el estado cambie a "APROBADO", evitando esperas fijas innecesarias.
    await expect(locatorStatus).toHaveText('Estado: APROBADO');
    
    console.log(' La transacción fue aprobada tras el retraso asíncrono del backend.');
  });

});

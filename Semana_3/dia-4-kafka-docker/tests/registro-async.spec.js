const { test, expect } = require('@playwright/test');
const { RegistroPage } = require('./RegistroPage');

test.describe('Registro de Usuario Asíncrono con Kafka', () => {

  test('Debería registrar un usuario de forma asíncrona exitosamente', async ({ page }) => {
    const registroPage = new RegistroPage(page);

    // 1. Navegar a la página
    await registroPage.navigate();

    // Generar datos únicos para evitar conflictos en ejecuciones repetidas
    const uniqueId = Date.now();
    const nombre = `Usuario Test ${uniqueId}`;
    const email = `test-${uniqueId}@litebank.com`;
    const password = 'PasswordSecure123';

    // 2. Rellenar formulario con datos de prueba
    await registroPage.fillForm(nombre, email, password);

    // 3. Hacer clic en "Registrar"
    await registroPage.submitForm();

    // Validar estado de procesamiento inmediato
    await expect(registroPage.statusBox).toHaveText('Procesando');

    // 4. Polling inteligente (Espera dinámica sin sleep hasta que cambie a éxito, max 10s)
    await expect(registroPage.statusBox).toHaveText('Usuario Creado Exitosamente', { timeout: 10000 });
  });

});

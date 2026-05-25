class RegistroPage {
  constructor(page) {
    this.page = page;
    // CSS Locators for registration fields and status
    this.nombreInput = page.locator('#nombre');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.registrarBtn = page.locator('#btn-registrar');
    this.statusBox = page.locator('#status-box');
  }

  async navigate() {
    // Navigate to local registration page
    await this.page.goto('http://127.0.0.1:3000');
  }

  async fillForm(nombre, email, password) {
    await this.nombreInput.fill(nombre);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitForm() {
    await this.registrarBtn.click();
  }

  async getStatusText() {
    return await this.statusBox.innerText();
  }
}

module.exports = { RegistroPage };

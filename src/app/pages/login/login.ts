import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      // Simuliere API-Aufruf für Authentifizierung
      await this.authenticateUser(this.email, this.password);
      
      // Erfolgreiche Anmeldung
      console.log('Login erfolgreich!');
      
      // Optional: Speichere Login-Status im localStorage
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', this.email);
      }

      this.router.navigateByUrl('dashboard');
      
      // Weiterleitung zur Hauptseite (hier simuliert)
      this.showSuccessMessage();
      
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      this.showErrorMessage();
    } finally {
      this.isLoading = false;
    }
  }

  private async authenticateUser(email: string, password: string): Promise<void> {
    // Simuliere API-Aufruf mit Verzögerung
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Einfache Demo-Validierung
        if (email === 'demo@beispiel.de' && password === 'demo123') {
          resolve();
        } else if (email && password && password.length >= 6) {
          // Für Demo-Zwecke: Akzeptiere jede gültige E-Mail und Passwort >= 6 Zeichen
          resolve();
        } else {
          reject(new Error('Ungültige Anmeldedaten'));
        }
      }, 1500); // Simuliere Netzwerk-Verzögerung
    });
  }

  private showSuccessMessage(): void {
    // In einer echten Anwendung würde hier eine Toast-Nachricht oder Weiterleitung erfolgen
    alert('Anmeldung erfolgreich! Willkommen zurück.');
    
    // Formular zurücksetzen
    this.resetForm();
  }

  private showErrorMessage(): void {
    // In einer echten Anwendung würde hier eine Toast-Nachricht angezeigt
    alert('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
  }

  private resetForm(): void {
    this.email = '';
    this.password = '';
    this.showPassword = false;
    if (!this.rememberMe) {
      this.rememberMe = false;
    }
  }

  // Hilfsmethoden für Formularvalidierung
  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid();
  }

  // Event-Handler für "Passwort vergessen"
  onForgotPassword(): void {
    const email = prompt('Bitte geben Sie Ihre E-Mail-Adresse ein:');
    if (email && this.isValidEmail(email)) {
      alert(`Ein Link zum Zurücksetzen des Passworts wurde an ${email} gesendet.`);
    } else if (email) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    }
  }

  // Event-Handler für Google-Anmeldung
  onGoogleLogin(): void {
    alert('Google-Anmeldung würde hier implementiert werden.');
    // In einer echten Anwendung würde hier die Google OAuth-Integration erfolgen
  }

  // Event-Handler für Registrierung
  onSignUp(): void {
    alert('Registrierung würde hier implementiert werden.');
    // In einer echten Anwendung würde hier zur Registrierungsseite navigiert
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Lifecycle-Hook: Komponente initialisiert
  ngOnInit(): void {
    // Prüfe, ob "Angemeldet bleiben" aktiviert war
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (rememberMe === 'true' && savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }
}


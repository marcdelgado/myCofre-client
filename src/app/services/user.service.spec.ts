import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Usa HttpClientModule para solicitudes reales
import { UserService } from './user.service';
import { MailSlurpService } from './mail-slurp.service';
import {SignupForm} from "../models/forms/signup-form";
import {timeout} from "rxjs";

const testEmail = 'user-25c43018-484b-43bf-abe8-721eb2951315@mailslurp.biz';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// Conjunto de pruebas para UserService

describe('UserService', () => {
  let service: UserService;
  let mailSlurpService: MailSlurpService;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Usa HttpClientModule para solicitudes reales
      providers: [UserService, MailSlurpService]
    });
    service = TestBed.inject(UserService);
    mailSlurpService = TestBed.inject(MailSlurpService);
  });

  it("crear cuenta",(done) => {

    const userData = new SignupForm(
      "Testname",
      "TestSurname", testEmail,
      "pass123",
      "en");
    // Paso 1: Registrar al usuario
    service.signup(userData).subscribe(response => {
      console.log('pepsicolaaa');
      expect(response).toBeUndefined(); // Se espera void
      console.log('pepsicola');
      // Paso 2: Consultar la bandeja de entrada y obtener el correo con el token
      mailSlurpService.getLastEmailAboutSubject("Activate your MyCofre account").pipe(timeout(5000)).subscribe(response => {
        expect(response.items.length).toBeGreaterThan(0);
        //expect(response.items[0].subject).toContain('Confirma tu correo electrónico');

        // Paso 3: Obtener el contenido del correo
        const emailId = response.items[0].id;
        mailSlurpService.getEmailContent(emailId).pipe(timeout(10000)).subscribe(response => {
          //expect(response.body).toContain('Activa tu cuenta');

          // Extraer el correo y el token de la URL (análisis básico)
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.body, 'text/html');
          const tokenLink = doc.querySelector('#tokenlink')?.getAttribute('href');
          if (!tokenLink) throw new Error('No se encontró el enlace de activación.');

          const url = new URL(tokenLink);
          const extractedEmail = url.searchParams.get('email') || "";
          const extractedToken = url.searchParams.get('token') || "";
          console.log(extractedEmail + " " + extractedToken);
          // Paso 4: Activar la cuenta utilizando el correo y el token extraídos
          const activationRequestBody = { email: extractedEmail, token: extractedToken };
          service.activate(extractedEmail, extractedToken).subscribe(response => {
            expect(response).toBeUndefined(); // Se espera void
            done(); // Marca la prueba como completada
          }, error => {
            fail('Fallo la activacion de la cuenta');
            done();
          });
        }, error => {
          fail('Fallo la obtencion del contenido del correo');
          done();
        });
      }, error => {
        fail('Fallo la consulta de la bandeja de entrada');
        done();
      });
    }, error => {
      fail('Fallo la registracion del usuario');
      done();
    });

  });

  it('debería crear una cuenta correctamente', (done) => {
    expect(service).toBeTruthy();
  });

  it('debería realizar otra acción (pendiente de implementación)', () => {
    expect(service).toBeTruthy();
  });

  it('debería crear una cuenta correctamente', (done) => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("eliminar cuenta" , (done) => {

    const userData = new SignupForm(
      "Testname",
      "TestSurname", testEmail,
      "pass123",
      "en");// Paso 1: Solicitar la baja del usuario
    service.requestDelete(userData.email, userData.language).pipe(timeout(5000)).subscribe(response => {
      expect(response).toBeUndefined(); // Se espera void
      console.log('pepsicoleee');
      // Paso 2: Consultar la bandeja de entrada y obtener el correo con el token
      mailSlurpService.getLastEmailAboutSubject("Delete your MyCofre account").subscribe(response => {
        console.log('pepsicole');
        console.log(response);
        expect(response.length).toBeGreaterThan(0);
        //expect(response.items[0].subject).toContain('myCofre');

        // Paso 3: Obtener el contenido del correo
        const emailId = response[0].id;
        mailSlurpService.getEmailContent(emailId).subscribe(response => {
          //expect(response.body).toContain('Activa tu cuenta');

          // Extraer el correo y el token de la URL (análisis básico)
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.body, 'text/html');
          const tokenLink = doc.querySelector('#tokenlink')?.getAttribute('href');
          if (!tokenLink) throw new Error('No se encontró el enlace de activación.');

          const url = new URL(tokenLink);
          const extractedEmail = url.searchParams.get('email') || "";
          const extractedToken = url.searchParams.get('token') || "";
          console.log(extractedEmail + " " + extractedToken);
          // Paso 4: Activar la cuenta utilizando el correo y el token extraídos
          const activationRequestBody = { email: extractedEmail, token: extractedToken };
          service.delete(extractedEmail, extractedToken).subscribe(response => {
            expect(response).toBeUndefined(); // Se espera void
            done(); // Marca la prueba como completada
          }, error => {
            fail('Fallo la eliminación de la cuenta');
            done();
          });
        }, error => {
          fail('Fallo la obtencion del contenido del correo');
          done();
        });
      }, error => {
        fail('Fallo la consulta de la bandeja de entrada');
        done();
      });
    }, error => {
      fail('Fallo la eliminación del usuario');
      done();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { MisDatosComponent } from './mis-datos.component';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { of } from 'rxjs';
import { showAlert, showToast } from 'src/app/tools/message-functions';
import { User } from 'src/app/model/user';

describe('MisDatosComponent', () => {
  let component: MisDatosComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dbServiceSpy: jasmine.SpyObj<DatabaseService>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout', 'saveAuthUser'], { authUser: of(new User()) });
    const dbServiceMock = jasmine.createSpyObj('DatabaseService', ['saveUser']);

    TestBed.configureTestingModule({
      declarations: [MisDatosComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: DatabaseService, useValue: dbServiceMock },
      ],
    });

    component = TestBed.createComponent(MisDatosComponent).componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dbServiceSpy = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
  });

  it('should validate a field correctly', () => {
    const result = component.validarCampo('testField', 'testValue');
    expect(result).toBeTrue();
  });

  it('should show an alert and return false for empty field validation', () => {
    spyOn(window, 'alert'); // Mocking the alert function
    const result = component.validarCampo('testField', '');
    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Debe ingresar un valor para el campo "testField".');
  });

  it('should call logout on cerrarSesion', () => {
    component.cerrarSesion();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should update the profile and call saveUser and saveAuthUser', async () => {
    component.user = new User();
    component.user.firstName = 'John';
    component.user.lastName = 'Doe';
    component.user.email = 'john.doe@example.com';
    component.user.secretQuestion = 'Secret';
    component.user.secretAnswer = 'Answer';
    component.user.password = 'password';
    component.repeticionPassword = 'password';

    await component.actualizarPerfil();
    expect(dbServiceSpy.saveUser).toHaveBeenCalledWith(component.user);
    expect(authServiceSpy.saveAuthUser).toHaveBeenCalledWith(component.user);
    expect(showToast).toHaveBeenCalledWith('Sus datos fueron actualizados');
  });

  it('should show an alert if passwords do not match during profile update', async () => {
    spyOn(window, 'alert');
    component.user.password = 'password1';
    component.repeticionPassword = 'password2';

    await component.actualizarPerfil();
    expect(window.alert).toHaveBeenCalledWith('Las contraseñas escritas deben ser iguales.');
  });

  it('should call logout when logout is called', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});


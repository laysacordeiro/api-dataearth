import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditarEspecieComponent } from './form-editar-especie.component';

describe('FormEditarEspecieComponent', () => {
  let component: FormEditarEspecieComponent;
  let fixture: ComponentFixture<FormEditarEspecieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEditarEspecieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEditarEspecieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

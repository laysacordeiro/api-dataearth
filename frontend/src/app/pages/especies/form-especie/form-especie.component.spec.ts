import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEspecieComponent } from './form-especie.component';

describe('FormEspecieComponent', () => {
  let component: FormEspecieComponent;
  let fixture: ComponentFixture<FormEspecieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEspecieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEspecieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

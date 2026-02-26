import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTaxonomiaComponent } from './form-taxonomia.component';

describe('FormTaxonomiaComponent', () => {
  let component: FormTaxonomiaComponent;
  let fixture: ComponentFixture<FormTaxonomiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTaxonomiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTaxonomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

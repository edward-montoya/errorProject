import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEncryptComponent } from './image-encrypt.component';

describe('ImageEncryptComponent', () => {
  let component: ImageEncryptComponent;
  let fixture: ComponentFixture<ImageEncryptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageEncryptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEncryptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

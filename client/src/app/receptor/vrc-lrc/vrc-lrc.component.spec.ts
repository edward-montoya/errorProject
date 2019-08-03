import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcLrcComponent } from './vrc-lrc.component';

describe('VrcLrcComponent', () => {
  let component: VrcLrcComponent;
  let fixture: ComponentFixture<VrcLrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VrcLrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcLrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

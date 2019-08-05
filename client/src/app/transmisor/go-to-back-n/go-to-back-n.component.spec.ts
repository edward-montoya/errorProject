import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToBackNComponent } from './go-to-back-n.component';

describe('GoToBackNComponent', () => {
  let component: GoToBackNComponent;
  let fixture: ComponentFixture<GoToBackNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoToBackNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToBackNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerEntryComponent } from './timer-entry';

describe('TimerEntry', () => {
  let component: TimerEntryComponent;
  let fixture: ComponentFixture<TimerEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

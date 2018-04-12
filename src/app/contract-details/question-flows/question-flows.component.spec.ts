import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFlowsComponent } from './question-flows.component';

describe('QuestionFlowsComponent', () => {
  let component: QuestionFlowsComponent;
  let fixture: ComponentFixture<QuestionFlowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionFlowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

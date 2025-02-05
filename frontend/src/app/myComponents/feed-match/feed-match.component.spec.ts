import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedMatchComponent } from './feed-match.component';

describe('FeedMatchComponent', () => {
  let component: FeedMatchComponent;
  let fixture: ComponentFixture<FeedMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

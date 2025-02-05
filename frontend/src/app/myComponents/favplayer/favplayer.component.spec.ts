import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavplayerComponent } from './favplayer.component';

describe('FavplayerComponent', () => {
  let component: FavplayerComponent;
  let fixture: ComponentFixture<FavplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

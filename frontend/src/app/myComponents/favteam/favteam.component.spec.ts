import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavteamComponent } from './favteam.component';

describe('FavteamComponent', () => {
  let component: FavteamComponent;
  let fixture: ComponentFixture<FavteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavteamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

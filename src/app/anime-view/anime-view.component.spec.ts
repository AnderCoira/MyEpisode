import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeViewComponent } from './anime-view.component';

describe('AnimeViewComponent', () => {
  let component: AnimeViewComponent;
  let fixture: ComponentFixture<AnimeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

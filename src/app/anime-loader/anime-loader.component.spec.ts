import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeLoaderComponent } from './anime-loader.component';

describe('AnimeLoaderComponent', () => {
  let component: AnimeLoaderComponent;
  let fixture: ComponentFixture<AnimeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

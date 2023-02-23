import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropFindComponent } from './drop-find.component';

describe('DropFindComponent', () => {
  let component: DropFindComponent;
  let fixture: ComponentFixture<DropFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropFindComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

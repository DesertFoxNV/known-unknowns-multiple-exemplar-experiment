import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockButtonDialogComponent } from './block-button-dialog.component';

describe('BlockStartDialogComponent', () => {
  let component: BlockButtonDialogComponent;
  let fixture: ComponentFixture<BlockButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockButtonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

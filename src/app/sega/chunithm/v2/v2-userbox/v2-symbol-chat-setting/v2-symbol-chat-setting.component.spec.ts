import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V2SymbolChatSettingComponent } from './v2-symbol-chat-setting.component';

describe('V2SymbolChatSettingComponent', () => {
  let component: V2SymbolChatSettingComponent;
  let fixture: ComponentFixture<V2SymbolChatSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [V2SymbolChatSettingComponent]
    });
    fixture = TestBed.createComponent(V2SymbolChatSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { ChatConfig } from '../../models/chat.model';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  templateUrl: './config-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigPanelComponent {
  config = model.required<ChatConfig>();

  updateConfig(key: keyof ChatConfig, value: any) {
    this.config.update(currentConfig => ({ ...currentConfig, [key]: value }));
  }

  onSliderChange(key: keyof ChatConfig, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateConfig(key, Number(value));
  }

  onSelectChange(key: keyof ChatConfig, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.updateConfig(key, value);
  }
  
  onInputChange(key: keyof ChatConfig, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateConfig(key, value);
  }
}

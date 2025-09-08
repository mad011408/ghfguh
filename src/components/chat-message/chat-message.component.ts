
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, MessageType, CodeFile } from '../../models/chat.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  message = input.required<ChatMessage>();
  MessageType = MessageType; // Expose enum to template

  codeFiles = computed<CodeFile[]>(() => {
    if (this.message().type === MessageType.CODE) {
      return this.parseCodeFiles(this.message().text);
    }
    return [];
  });

  private parseCodeFiles(text: string): CodeFile[] {
    const files: CodeFile[] = [];
    const fileRegex = /----- FILE: (.*?) -----\n([\s\S]*?)\n----- END FILE -----/g;
    let match;
    while ((match = fileRegex.exec(text)) !== null) {
      files.push({
        path: match[1].trim(),
        content: match[2].trim(),
      });
    }
    return files;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Maybe show a temporary "Copied!" message
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
}

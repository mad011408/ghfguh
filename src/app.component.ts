import { Component, ChangeDetectionStrategy, signal, effect, ViewChild, ElementRef, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, MessageType, ChatConfig } from './models/chat.model';
import { GeminiService } from './services/gemini.service';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ConfigPanelComponent, ChatMessageComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages = signal<ChatMessage[]>([
    {
        id: 1,
        author: 'ai',
        type: MessageType.TEXT,
        text: "Welcome to the Gemini Advanced Code Assistant. Please provide your programming task. You can adjust the generation settings on the left.",
        timestamp: new Date()
    }
  ]);
  userInput = signal('');
  isLoading = signal(false);
  
  config = signal<ChatConfig>({
    model: 'gemini-2.5-flash',
    strictness: 9,
    runtimeBudget: 120,
    testingDepth: 'unit',
    securityLevel: 'basic',
    styleGuide: 'PEP8',
    language: 'python:3.11',
    systemPrompt: 'You are a production-code generating assistant. You must never return simulated or placeholder code. Treat every output as code meant to be executed and shipped. For each response, produce only the artifacts explicitly requested (code files, tests, README), and nothing else. If the code fails to compile or tests fail, DO NOT finalize your answer — instead, iterate, fix errors, and re-run until all tests and validations pass.'
  });
  
  private messageCounter = 1;

  constructor(private geminiService: GeminiService) {
    effect(() => {
      // This effect will run whenever messages change
      const messages = this.messages();
      untracked(() => {
        // We scroll to bottom after a microtask to allow UI to render first
        setTimeout(() => this.scrollToBottom(), 0);
      });
    });
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isLoading()) {
      return;
    }

    // Add user message
    this.addMessage(text, 'user', MessageType.TEXT);
    this.userInput.set('');
    this.isLoading.set(true);
    
    // Get AI response
    this.geminiService.generate(text, this.config()).subscribe({
      next: (responsePart) => {
        this.addMessage(responsePart.text, 'ai', responsePart.type);
      },
      error: (err) => {
        console.error('An error occurred:', err);
        this.addMessage('Sorry, an unexpected error occurred.', 'ai', MessageType.ERROR);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  private addMessage(text: string, author: 'user' | 'ai', type: MessageType) {
    this.messageCounter++;
    const newMessage: ChatMessage = {
      id: this.messageCounter,
      author,
      type,
      text,
      timestamp: new Date(),
    };
    this.messages.update(currentMessages => [...currentMessages, newMessage]);
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error("Could not scroll to bottom", err);
    }
  }
}
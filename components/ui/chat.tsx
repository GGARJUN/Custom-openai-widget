import { FC, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, X } from "lucide-react";

interface ChatContainerProps {
  children: ReactNode;
  className?: string;
}

export const ChatContainer: FC<ChatContainerProps> = ({ children, className }) => (
  <div className={cn("flex flex-col h-full w-full bg-background rounded-lg", className)}>
    {children}
  </div>
);

interface ChatMessagesProps {
  children: ReactNode;
  className?: string;
}

export const ChatMessages: FC<ChatMessagesProps> = ({ children, className }) => (
  <ScrollArea className={cn("flex-1 mb-0", className)}>
    {children}
  </ScrollArea>
);

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export const MessageList: FC<MessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "p-3 rounded-lg max-w-[80%]",
            msg.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted"
          )}
        >
          {msg.content}
        </div>
      ))}
      {isTyping && (
        <div className="p-3 rounded-lg max-w-[80%] mr-auto bg-muted">
          <span className="typing-indicator">Typing</span>
          <style jsx>{`
    .typing-indicator::after {
      content: '...';
      display: inline-block;
      width: 1.5em;
      text-align: left;
      animation: ellipsis 1.5s infinite;
    }

    @keyframes ellipsis {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
    }
  `}</style>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface PromptSuggestionsProps {
  append: (message: { content: string }) => void;
  suggestions: string[];
}

export const PromptSuggestions: FC<PromptSuggestionsProps> = ({ append, suggestions }) => (
  <div className="flex flex-col items-center justify-center flex-1">
    <p className="text-muted-foreground mb-4">Try these suggestions:</p>
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, i) => (
        <Button
          key={i}
          variant="outline"
          onClick={() => append({ content: suggestion })}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  </div>
);

interface ChatFormProps {
  className?: string;
  isPending: boolean;
  handleSubmit: (e: FormEvent) => void;
  children: (props: { files: File[]; setFiles: (files: File[]) => void }) => ReactNode;
}

export const ChatForm: FC<ChatFormProps> = ({ className, isPending, handleSubmit, children }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form
      className={cn("flex items-center gap-2", className)}
      onSubmit={handleSubmit}
    >
      {children({ files, setFiles })}
    </form>
  );
};

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowAttachments?: boolean;
  files: File[];
  setFiles: (files: File[]) => void;
  stop?: () => void;
  isGenerating: boolean;
  placeholder?: string;
}

export const MessageInput: FC<MessageInputProps> = ({
  value,
  onChange,
  allowAttachments,
  files,
  setFiles,
  stop,
  isGenerating,
  placeholder,
}) => (
  <div className="flex items-center gap-2 w-full">
    {allowAttachments && (
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Paperclip className="w-5 h-5" />
      </Button>
    )}
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Type your message..."}
      className="flex-1"
      disabled={isGenerating}
    />
    {isGenerating ? (
      <Button variant="outline" onClick={stop}>
        <X className="w-5 h-5" />
      </Button>
    ) : (
      <Button type="submit">Send</Button>
    )}
    {allowAttachments && (
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
        multiple
      />
    )}
  </div>
);
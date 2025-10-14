import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const formattingCommands = [
  { label: "Bold", command: "bold", icon: "B" },
  { label: "Italic", command: "italic", icon: "I" },
  { label: "Underline", command: "underline", icon: "U" },
  { label: "List", command: "insertUnorderedList", icon: "•" },
  { label: "Quote", command: "formatBlock", value: "blockquote", icon: "❝" },
];

function sanitize(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("script, style").forEach((node) => node.remove());
  return doc.body.innerHTML;
}

export function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const cleaned = sanitize(editor.innerHTML);
    if (cleaned !== editor.innerHTML) {
      editor.innerHTML = cleaned;
    }
    onChange(cleaned);
  };

  const handleCommand = (command: string, valueArg?: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, valueArg);
    handleInput();
  };

  return (
    <div className="rounded-lg border border-muted bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-muted px-2 py-2" role="toolbar">
        {formattingCommands.map((item) => (
          <button
            key={item.command + (item.value ?? "")}
            type="button"
            onClick={() => handleCommand(item.command, item.value)}
            className="rounded-md border border-transparent px-3 py-1 text-sm font-medium text-gray-700 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={item.label}
            disabled={disabled}
          >
            {item.icon}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="min-h-[240px] resize-y overflow-auto px-4 py-3 text-base leading-relaxed focus-visible:outline-none"
        contentEditable={!disabled}
        onInput={handleInput}
        onBlur={handleInput}
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgba(107, 114, 128, 0.6);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

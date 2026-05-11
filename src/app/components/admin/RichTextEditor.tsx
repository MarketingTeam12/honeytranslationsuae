import { useEffect, useRef } from 'react';
import { Bold, Heading1, Heading2, Image, List, ListOrdered, Pilcrow } from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function command(exec: string, arg?: string) {
  document.execCommand(exec, false, arg);
}

export function RichTextEditor({ value, onChange, placeholder = 'Write your article...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || '');
  };

  const wrapLinkImage = () => {
    const imageUrl = window.prompt('Enter image URL');
    if (imageUrl) {
      command('insertImage', imageUrl);
      handleInput();
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button type="button" onClick={() => { command('bold'); handleInput(); }} className="p-2 rounded-lg hover:bg-gray-200"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => { command('formatBlock', '<p>'); handleInput(); }} className="p-2 rounded-lg hover:bg-gray-200"><Pilcrow className="w-4 h-4" /></button>
        <button type="button" onClick={() => { command('formatBlock', '<h1>'); handleInput(); }} className="p-2 rounded-lg hover:bg-gray-200"><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => { command('formatBlock', '<h2>'); handleInput(); }} className="p-2 rounded-lg hover:bg-gray-200"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => { command('insertUnorderedList'); handleInput(); }} className="p-2 rounded-lg hover:bg-gray-200"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => { command('insertOrderedList'); handleInput(); }} className="p-2 rounded-lg hover:bg-gray-200"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={wrapLinkImage} className="p-2 rounded-lg hover:bg-gray-200"><Image className="w-4 h-4" /></button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[260px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
}

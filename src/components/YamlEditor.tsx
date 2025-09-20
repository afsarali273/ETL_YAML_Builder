import Editor from "@monaco-editor/react";

export default function YamlEditor({ text, onChange }: { text: string; onChange: (s: string)=>void }) {
    return (
        <Editor
            height="60vh"
            defaultLanguage="yaml"
            language="yaml"
            value={text}
            onChange={(val) => onChange(val || "")}
            theme="vs-dark"
        />
    );
}

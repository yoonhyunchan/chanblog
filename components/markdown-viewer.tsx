"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import hljs from '@/lib/highlight';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

function CodeBlock({ children, className = '', ...props }: React.HTMLAttributes<HTMLElement>) {
    const [copied, setCopied] = useState(false);

    // Safely extract code string from children
    let code = '';
    if (Array.isArray(children)) {
        code = children.map(child => {
            if (typeof child === 'string') return child;
            if (isReactElementWithStringChildren(child)) {
                return child.props.children;
            }
            return '';
        }).join('');
    } else if (typeof children === 'string') {
        code = children;
    } else if (isReactElementWithStringChildren(children)) {
        code = children.props.children;
    }

    // Extract language from className (e.g., "language-sh")
    let lang = '';
    let highlighted = '';
    const match = /language-(\w+)/.exec(className || '');
    if (match && hljs.getLanguage(match[1])) {
        lang = match[1];
        highlighted = hljs.highlight(code, { language: lang }).value;
    } else {
        const auto = hljs.highlightAuto(code);
        lang = auto.language || '';
        highlighted = auto.value;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-[#23272e]">
            {/* MacOS/VSCode Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1d21] border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                </div>
                <div className="flex items-center space-x-3">
                    {lang && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded font-mono capitalize">
                            {lang}
                        </span>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition"
                        onClick={handleCopy}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>
            </div>
            <pre className={`overflow-x-auto p-5 font-mono text-base leading-relaxed my-0 ${className}`} {...props}>
                <code className={`hljs mb-8 ${className}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
        </div>
    );
}
function isReactElementWithStringChildren(child: unknown): child is React.ReactElement<{ children: string }> {
    return (
        typeof child === 'object' &&
        child !== null &&
        'props' in child &&
        typeof (child as { props: { children: unknown } }).props.children === 'string'
    );
}

export function MarkdownViewer({ content }: { content: string }) {
    return (
        <div className="prose max-w-none prose-neutral prose-lg font-sans prose-pre:bg-transparent">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeHighlight, { detect: false, ignoreMissing: true, hljs }]
                ]}
                components={{
                    code: CodeBlock
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
} 
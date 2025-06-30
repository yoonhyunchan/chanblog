import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { format } from 'date-fns';
import { useRef } from "react";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import hljs from '@/lib/highlight';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { getAllCategories } from "@/lib/api";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type ArticleFormValues = {
    title: string;
    excerpt: string;
    intro: string;
    content: string;
    category_id: number;
    date: string;
    image: string;
    tags: string;
    authorName: string;
    authorTitle: string;
    authorAvatar: string;
};

export default function ArticleForm({
    initialValues,
    onSubmit,
    mode = "create",
}: {
    initialValues?: Partial<ArticleFormValues>;
    onSubmit: (values: ArticleFormValues) => void;
    mode?: "create" | "edit";
}) {
    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState<ArticleFormValues>({
        title: initialValues?.title || "",
        excerpt: initialValues?.excerpt || "",
        intro: initialValues?.intro || "",
        content: initialValues?.content || "",
        category_id: initialValues?.category_id || 0,
        date: initialValues?.date || format(new Date(), 'yyyy-MM-dd'),
        image: initialValues?.image || "",
        tags: initialValues?.tags || "",
        authorName: initialValues?.authorName || "",
        authorTitle: initialValues?.authorTitle || "",
        authorAvatar: initialValues?.authorAvatar || "",
    });
    const [slugTouched, setSlugTouched] = useState(false);
    const [excerptTouched, setExcerptTouched] = useState(false);

    useEffect(() => {
        getAllCategories()
            .then(data => setCategories(data));
    }, []);

    // Auto-generate slug from title (unless user edits slug)
    useEffect(() => {
        if (mode === "create" && !slugTouched) {
            setForm(f => ({
                ...f, slug: f.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
            }));
        }
    }, [form.title, mode, slugTouched]);

    // Auto-generate excerpt from intro or content (unless user edits excerpt)
    useEffect(() => {
        if (!excerptTouched) {
            const base = form.intro || form.content;
            let autoExcerpt = base.slice(0, 120);
            if (base.length > 120) {
                // Try to end at a word boundary
                const lastSpace = autoExcerpt.lastIndexOf(' ');
                if (lastSpace > 0) autoExcerpt = autoExcerpt.slice(0, lastSpace);
                autoExcerpt += '...';
            }
            setForm(f => ({ ...f, excerpt: autoExcerpt }));
        }
    }, [form.intro, form.content, excerptTouched]);

    function handleChange(field: keyof ArticleFormValues, value: string) {
        setForm(f => ({ ...f, [field]: value }));
        if (field === "excerpt") setExcerptTouched(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(form);
    }

    // Custom renderer for code blocks with copy button and language detection
    function CodeBlock({ children, className = '', ...props }: React.HTMLAttributes<HTMLElement>) {
        const [copied, setCopied] = useState(false);

        // Safely extract code string from children
        let code = '';
        if (Array.isArray(children)) {
            code = children.map(child => {
                if (typeof child === 'string') return child;
                if (typeof child === 'object' && child && 'props' in child && typeof (child as any).props.children === 'string') {
                    return (child as any).props.children;
                }
                return '';
            }).join('');
        } else if (typeof children === 'string') {
            code = children;
        } else if (typeof children === 'object' && children && 'props' in children && typeof (children as any).props.children === 'string') {
            code = (children as any).props.children;
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
            <div className="relative my-8 rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-[#23272e]">
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
                <pre className={`overflow-x-auto p-5 bg-transparent font-mono text-base leading-relaxed ${className}`} {...props}>
                    <code className={`hljs ${className}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
                </pre>
            </div>
        );
    }

    return (
        <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <Input
                    placeholder="Title"
                    className="placeholder:text-gray-400 text-lg font-semibold border-0 border-b border-gray-300 focus:border-black rounded-none bg-transparent px-0"
                    value={form.title}
                    onChange={e => handleChange("title", e.target.value)}
                    required
                />
                <Input
                    placeholder="Intro"
                    className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                    value={form.intro}
                    onChange={e => handleChange("intro", e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-2 font-medium text-gray-700">Category</label>
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            type="button"
                            variant={form.category_id === cat.id ? "default" : "outline"}
                            className={
                                (form.category_id === cat.id ? "bg-black text-white hover:bg-black/90 " : "bg-gray-100 text-gray-500 hover:bg-gray-200 ") +
                                "rounded-full px-5 py-2 font-medium transition-all duration-150 border-none shadow-sm"
                            }
                            onClick={() => handleChange("category_id", cat.id)}
                        >
                            {cat.title}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                <Input
                    placeholder="Author Name"
                    className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                    value={form.authorName}
                    onChange={e => handleChange("authorName", e.target.value)}
                />
                <Input
                    placeholder="Author Title"
                    className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                    value={form.authorTitle}
                    onChange={e => handleChange("authorTitle", e.target.value)}
                />
                <Input
                    placeholder="Author Avatar URL"
                    className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                    value={form.authorAvatar}
                    onChange={e => handleChange("authorAvatar", e.target.value)}
                />
            </div>
            <Input
                placeholder="Image URL"
                className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                value={form.image}
                onChange={e => handleChange("image", e.target.value)}
            />
            <Input
                placeholder="Tags (comma separated)"
                className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                value={form.tags}
                onChange={e => handleChange("tags", e.target.value)}
            />
            <div>
                <label className="block mb-2 font-medium text-gray-700">Content (Markdown supported)</label>
                <div className="flex gap-6">
                    {/* Editor */}
                    <div className="flex-1 min-w-0 max-w-md">
                        <MDEditor
                            value={form.content}
                            onChange={val => handleChange("content", val || "")}
                            height={500}
                            preview="edit"
                            previewOptions={{
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [
                                    rehypeRaw,
                                    [rehypeHighlight, { detect: false, ignoreMissing: true, hljs }]
                                ]
                            }}
                            textareaProps={{
                                placeholder: "Content (Markdown supported)",
                            }}
                        />
                    </div>
                    {/* Preview */}
                    <div className="flex-1 min-w-0 bg-white border rounded-xl p-3 shadow-inner max-w-3xl">
                        <div className="font-semibold mb-2 text-gray-700">Preview:</div>
                        <div className="prose max-w-none prose-neutral prose-lg">
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
                                {form.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
                <Button type="submit" variant="default" className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-2 text-base font-semibold shadow-md">
                    {mode === "edit" ? "Save Changes" : "Save"}
                </Button>
            </div>
        </form>
    );
} 
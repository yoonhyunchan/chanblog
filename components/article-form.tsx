import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { format } from 'date-fns';
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import hljs from '@/lib/highlight';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { getAllCategories } from "@/lib/api/category";
import { uploadImage } from "@/lib/api/image";
import type { Category } from '@/lib/types/category';
import { commands, ICommand, TextState, TextAreaTextApi } from "@uiw/react-md-editor";
import { MarkdownViewer } from "@/components/markdown-viewer"
import { fetchUserData } from "@/lib/api/login";


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
    author_name: string;
    author_title: string;
    author_avatar_path: string;
};

// Custom image upload command for MDEditor
const imageUploadCommand: ICommand = {
    name: "imageUpload",
    keyCommand: "imageUpload",
    buttonProps: { "aria-label": "Upload Image" },
    icon: (
        <svg width="12" height="12" viewBox="0 0 20 20">
            <path fill="currentColor" d="M4 16l4-4 4 4 4-4v6H0v-6l4 4zM4 4h12v2H4V4zm0 4h12v2H4V8z" />
        </svg>
    ),
    execute: async (state: TextState, api: TextAreaTextApi) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
            if (input.files && input.files[0]) {
                try {
                    const url = await uploadImage(input.files[0]);
                    if (url) {
                        api.replaceSelection(`![image](${url})`);
                    } else {
                        alert("Image upload failed: No URL returned.");
                    }
                } catch (err) {
                    alert("Image upload failed.");
                }
            }
        };
        input.click();
    }
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<ArticleFormValues>({
        title: initialValues?.title || "",
        excerpt: initialValues?.excerpt || "",
        intro: initialValues?.intro || "",
        content: initialValues?.content || "",
        category_id: initialValues?.category_id || 0,
        date: initialValues?.date || format(new Date(), 'yyyy-MM-dd'),
        image: initialValues?.image || "",
        tags: initialValues?.tags || "",
        author_name: initialValues?.author_name || "",
        author_title: initialValues?.author_title || "",
        author_avatar_path: initialValues?.author_avatar_path || "",
    });
    const [slugTouched] = useState(false);
    const [excerptTouched, setExcerptTouched] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getAllCategories()
            .then(data => setCategories(data));
    }, []);

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await fetchUserData();
                if (user) {
                    setForm(f => ({
                        ...f,
                        author_name: user.name || "",
                        author_title: user.title || "",
                        author_avatar_path: user.avatar_path || "",
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        }
        loadUser();
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

    function handleChange(field: keyof ArticleFormValues, value: string | number) {
        setForm(f => ({ ...f, [field]: value }));
        if (field === "excerpt") setExcerptTouched(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(form);
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
                    {categories.map((cat: Category) => (
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

            <div>
                <label className="block mb-2 font-medium text-gray-700">Article Image</label>
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="black"
                        className="px-4 py-2 rounded shadow"
                    >
                        {uploading ? "Uploading..." : form.image ? "Change Image" : "Upload Image"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                                setUploading(true);
                                try {
                                    const url = await uploadImage(e.target.files[0]);
                                    handleChange("image", url);
                                } catch {
                                    alert("Image upload failed.");
                                }
                                setUploading(false);
                            }
                        }}
                    />
                    {form.image ? (
                        <div className="relative w-16 h-16">
                            <img
                                src={form.image}
                                alt="Article Image"
                                className="w-16 h-16 object-cover rounded shadow border rounded-xl"
                            />
                            <Button
                                type="button"
                                onClick={() => handleChange("image", "")}
                                variant="black"
                                className="absolute top-0 right-0 rounded-full p-0.5 text-xs leading-none w-5 h-5 flex items-center justify-center"
                            >
                                ×
                            </Button>
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-gray-100 border rounded-xl" />
                    )
                    }
                </div>
            </div>
            <div className="flex items-baseline gap-7">
                <label className="block mb-2 font-medium text-gray-700">Tags</label>
                <Input
                    placeholder="comma separated (ex. tag1, tag2, tag3)"
                    className="placeholder:text-gray-400 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent px-0"
                    value={form.tags}
                    onChange={e => handleChange("tags", e.target.value)}
                />
            </div>

            <div>
                <label className="block mb-2 font-medium text-gray-700">Content (Markdown supported)</label>
                <div className="flex gap-6">
                    {/* Editor */}
                    <div className="flex-1 min-w-0 max-w-md" data-color-mode="light">
                        <MDEditor
                            value={form.content}
                            onChange={val => handleChange("content", val || "")}
                            height={500}
                            preview="edit"
                            commands={[
                                imageUploadCommand,
                                commands.bold,
                                commands.link,
                                commands.code,

                                // ...(commands?.getCommands ? commands.getCommands() : [])
                            ]}
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
                        <MarkdownViewer content={form.content || ''} />
                    </div>
                </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
                <Button type="submit" variant="default" className="bg-black text-white hover:bg-black/90 rounded px-8 py-2 text-base font-semibold shadow-md">
                    {mode === "edit" ? "Save Changes" : "Save"}
                </Button>
            </div>
        </form>
    );
} 
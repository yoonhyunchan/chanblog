"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import ArticleForm, { ArticleFormValues } from "@/components/article-form";
import { toast } from "@/components/ui/use-toast"
import { getAllArticles, createArticle } from "@/lib/api/article";
import { format } from 'date-fns';

export default function CreateArticlePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        slug: "",
        excerpt: "",
        intro: "",
        content: "",
        category: "",
        author_name: "",
        author_title: "",
        author_avatar_path: "",
        publishedDate: format(new Date(), 'yyyy-MM-dd'),
        readTime: "",
        featuredImage: "",
        image: "",
        tags: "",
    });

    useEffect(() => {
        getAllArticles()
        // categories are not used, so this can be removed
    }, []);

    // Auto-generate slug from title
    useEffect(() => {
        setForm(f => ({
            ...f, slug: f.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
        }));
    }, [form.title]);

    function handleSubmit(data: ArticleFormValues) {
        createArticle(data)
            .then(() => {
                toast({ title: 'Article created successfully!', description: '', })
                router.push("/admin");
            })
            .catch(err => {
                toast({ title: 'Error', description: err.message })
            });
    }

    return (
        <Layout>
            <div className="flex justify-center items-start min-h-[80vh] bg-gradient-to-br from-white to-gray-100 py-16">
                <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
                    <div className="absolute left-0 top-8 bottom-8 w-1 bg-black rounded-full" style={{ opacity: 0.08 }} />
                    <h1 className="text-4xl font-extrabold tracking-tight mb-10 font-serif text-gray-900">Create Article</h1>
                    <ArticleForm mode="create" onSubmit={handleSubmit} />
                </div>
            </div>
        </Layout>
    );
} 
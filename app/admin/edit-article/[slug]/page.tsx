"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import ArticleForm, { ArticleFormValues } from "@/components/article-form";
import { toast } from "@/components/ui/use-toast"
import { getArticleBySlug, updateArticle } from "@/lib/api/article";
import { format } from 'date-fns';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<ArticleFormValues | undefined>();

    useEffect(() => {
        getArticleBySlug(slug)
            .then(data => {
                if (!data) {
                    // data가 null일 때 처리
                    return;
                }
                setInitialValues({
                    title: data.title || "",
                    excerpt: data.excerpt || "",
                    intro: data.intro || "",
                    content: data.content || "",
                    category_id: data.category_id,
                    date: data.date || format(new Date(), 'yyyy-MM-dd'),
                    image: data.image || "",
                    tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
                    authorName: data.author_name || "",
                    authorTitle: data.author_title || "",
                    authorAvatar: data.author_avatar_path || "",
                });
            })
            .finally(() => setLoading(false));
    }, [slug]);

    function handleSubmit(data: ArticleFormValues) {
        const payload = {
            ...data,
            slug: data.title.toLowerCase().replace(/\s+/g, "-")
        }
        updateArticle(payload)
            .then(() => {
                toast({ title: 'Article updated successfully!', description: '', })
                router.push("/admin");
            })
            .catch(err => {
                toast({ title: 'Error', description: err.message })
            });
    }

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-lg">Loading...</div>;

    return (
        <Layout>
            <div className="flex justify-center items-start min-h-[80vh] bg-gradient-to-br from-white to-gray-100 py-16">
                <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
                    <div className="absolute left-0 top-8 bottom-8 w-1 bg-black rounded-full" style={{ opacity: 0.08 }} />
                    <h1 className="text-4xl font-extrabold tracking-tight mb-10 font-serif text-gray-900">Edit Article</h1>
                    <ArticleForm mode="edit" initialValues={initialValues} onSubmit={handleSubmit} />
                </div>
            </div>
        </Layout>
    );
} 
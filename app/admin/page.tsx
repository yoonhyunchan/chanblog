"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/data";
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

import { deleteCategory, deleteArticle, getAllArticles, getAllCategories, updateCategory, addCategory } from "@/lib/api";
import type { Article } from "@/lib/data"

const TABS = [
    { key: "articles", label: "Articles" },
    { key: "categories", label: "Categories" },
]

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [tab, setTab] = useState("articles")
    const [articles, setArticles] = useState<Article[]>([])
    const [loadingArticles, setLoadingArticles] = useState(false)

    const router = useRouter()
    // Category management state
    const [categories, setCategories] = useState<Category[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [newCategory, setNewCategory] = useState({ title: "", slug: "", image: "" })
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [categoryForm, setCategoryForm] = useState({ title: "", slug: "", image: "" })
    const categoryMap = Object.fromEntries(categories.map(cat => [cat.id, cat.title]));

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const tokenType = localStorage.getItem("tokenType");
        setIsAuthenticated(!!(token && tokenType));
    }, [])

    useEffect(() => {
        if (tab === "articles" && isAuthenticated) {
            setLoadingArticles(true)
            getAllArticles()
                .then(data => setArticles(data))
                .finally(() => setLoadingArticles(false))
        }
    }, [tab, isAuthenticated])

    function refreshArticles() {
        setLoadingArticles(true)
        getAllArticles()
            .then(data => setArticles(data))
            .finally(() => setLoadingArticles(false))
    }

    useEffect(() => {
        if (isAuthenticated) {
            setLoadingCategories(true)
            getAllCategories()
                .then(data => setCategories(data))
                .finally(() => setLoadingCategories(false))
        }
    }, [tab, isAuthenticated])

    function refreshCategories() {
        setLoadingCategories(true)
        getAllCategories()
            .then(data => setCategories(data))
            .finally(() => setLoadingCategories(false))
    }

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="px-6 max-w-md mx-auto mt-32 text-center">
                    <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                    <p className="mb-6">You must be logged in as admin to view this page.</p>
                    <Button onClick={() => router.push("/")} className="bg-black text-white hover:bg-black/90">Go Home</Button>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                </div>

                <div className="bg-white rounded-lg">
                    <div className="border-b">
                        <nav className="flex" aria-label="Tabs">
                            {TABS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setTab(key)}
                                    className={`px-4 py-2 text-sm font-medium ${tab === key
                                        ? "border-b-2 border-black text-black"
                                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {tab === "articles" && (
                            <div>
                                <h2 className="text-3xl font-semibold mb-4 mt-8">Articles</h2>
                                <div className="mb-4 flex justify-end">
                                    <Button onClick={() => router.push('/admin/create-article')} variant="default" className="bg-black text-white hover:bg-black/90">Create Article</Button>
                                </div>
                                {loadingArticles ? (
                                    <p>Loading articles...</p>
                                ) : (
                                    <table className="w-full border text-left">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 px-3">Title</th>
                                                <th className="py-2 px-3">Category</th>
                                                <th className="py-2 px-3">Date</th>
                                                <th className="py-2 px-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map(article => (
                                                <tr key={article.slug} className="border-b hover:bg-gray-50">
                                                    <td className="py-2 px-3">{article.title}</td>
                                                    <td className="py-2 px-3">{categoryMap[article.category_id] || "Unknown"}</td>
                                                    <td className="py-2 px-3">{article.date}</td>
                                                    <td className="py-2 px-3">
                                                        <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90 mr-2" onClick={() => router.push(`/admin/edit-article/${article.slug}`)}>Edit</Button>
                                                        <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90"
                                                            onClick={async () => {
                                                                try {
                                                                    await deleteArticle(article.slug);
                                                                    toast({ title: "Article deleted!" });
                                                                    refreshArticles()
                                                                } catch (err: unknown) {
                                                                    toast({ title: "Error", description: err as string });
                                                                }
                                                            }}
                                                        >Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        {tab === "categories" && (
                            <div>
                                <h2 className="text-3xl font-semibold mb-4 mt-8">Categories</h2>
                                {loadingCategories ? (
                                    <p>Loading categories...</p>
                                ) : (
                                    <>
                                        <table className="w-full border text-left mb-6">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="py-2 px-3">Title</th>
                                                    <th className="py-2 px-3">Image</th>
                                                    <th className="py-2 px-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map(cat => (
                                                    <tr key={cat.slug} className="border-b hover:bg-gray-50">
                                                        <td className="py-2 px-3">{editingCategory?.slug === cat.slug ? (
                                                            <Input value={categoryForm.title} onChange={e => setCategoryForm(f => ({ ...f, title: e.target.value }))} />
                                                        ) : cat.title}</td>
                                                        <td className="py-2 px-3">{editingCategory?.slug === cat.slug ? (
                                                            <Input value={categoryForm.image || ""} onChange={e => setCategoryForm(f => ({ ...f, image: e.target.value }))} required />
                                                        ) : cat.image}</td>
                                                        <td className="py-2 px-3">
                                                            {editingCategory?.slug === cat.slug ? (
                                                                <>
                                                                    <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90 mr-2" onClick={async () => {
                                                                        if (!categoryForm.image) {
                                                                            toast({ title: 'Image path is required', description: '', })
                                                                            return;
                                                                        }
                                                                        try {
                                                                            await updateCategory({
                                                                                slug: editingCategory!.slug,
                                                                                updates: {
                                                                                    title: categoryForm.title,
                                                                                    image: categoryForm.image
                                                                                }
                                                                            });
                                                                            setEditingCategory(null)
                                                                            refreshCategories()
                                                                            toast({ title: 'Category updated!', description: '', })
                                                                        } catch (err: unknown) {
                                                                            toast({ title: 'Error', description: err as string })
                                                                        }
                                                                    }}>Save</Button>
                                                                    <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90" onClick={() => setEditingCategory(null)}>Cancel</Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90 mr-2" onClick={() => { setEditingCategory(cat); setCategoryForm({ title: cat.title, slug: cat.slug, image: cat.image }) }}>Edit</Button>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90">Delete</Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    This action cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction asChild>
                                                                                    <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90" onClick={async () => {
                                                                                        try {
                                                                                            await deleteCategory(cat.slug);
                                                                                            refreshCategories(); // 카테고리 목록 리프레시 함수
                                                                                            toast({ title: "Category deleted!" });
                                                                                        } catch (err: unknown) {
                                                                                            toast({ title: "Error", description: err as string });
                                                                                        }
                                                                                    }}>Delete</Button>
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <form className="flex gap-2 items-end" onSubmit={async e => {
                                            e.preventDefault();
                                            if (!newCategory.image) {
                                                toast({ title: 'Image path is required', description: '', })
                                                return;
                                            }
                                            try {
                                                await addCategory(newCategory)
                                                setNewCategory({ title: "", slug: "", image: "" });
                                                refreshCategories();
                                                toast({ title: 'Category added!', description: '', })
                                            } catch (err: unknown) {
                                                toast({ title: 'Error', description: err as string })
                                            }
                                        }}>
                                            <Input className="w-32" placeholder="Title" value={newCategory.title} onChange={e => setNewCategory(f => ({ ...f, title: e.target.value }))} required />
                                            <Input className="w-64" placeholder="Image path (e.g. /images/categories/it.jpg)" value={newCategory.image || ""} onChange={e => setNewCategory(f => ({ ...f, image: e.target.value }))} required />
                                            <Button type="submit" variant="default" className="bg-black text-white hover:bg-black/90">Add</Button>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
} 
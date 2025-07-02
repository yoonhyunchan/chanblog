"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { deleteArticle, getAllArticles } from "@/lib/api/article";
import { deleteCategory, getAllCategories, updateCategory, addCategory } from "@/lib/api/category";
import type { Article } from '@/lib/types/article';
import type { Category } from '@/lib/types/category';
import { uploadImage } from '@/lib/api/image';
import { fetchUserData, updateUserData } from "@/lib/api/login";
import { User } from "@/lib/types/login";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TABS = [
    { key: "articles", label: "Articles" },
    { key: "categories", label: "Categories" },
    { key: "user_data", label: "UserData" },
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

    // Users
    const [loadingUserData, setLoadingUserData] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);

    // User profile form state
    const [userForm, setUserForm] = useState<User | null>(null);
    const [isEditingUser, setIsEditingUser] = useState(false);

    // Category tab header and add button
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

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


    // Users
    useEffect(() => {
        setLoadingUserData(true);
        fetchUserData()
            .then(data => {
                setUserData(data);
            })
            .catch(console.error)
            .finally(() => setLoadingUserData(false));
    }, []);

    function refreshUserData() {
        setLoadingUserData(true)
        fetchUserData()
            .then(data => setUserData(data))
            .finally(() => setLoadingUserData(false))
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
            <div className="container mx-auto px-4 py-8 mt-8">
                <div className="flex justify-center items-center mb-8">
                    <h1 className="text-8xl font-bold font-[Fashion]">Admin Dashboard</h1>
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
                            <div className="py-10">
                                <h2 className="text-3xl font-semibold mb-4 mt-8">Articles</h2>
                                {loadingArticles ? (
                                    <p>Loading articles...</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded shadow-md">
                                            <thead>
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {articles.map(article => (
                                                    <tr key={article.slug} className="border-b hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">{article.title}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{categoryMap[article.category_id] || "Unknown"}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{article.date}</td>
                                                        <td className="flex justify-end px-6 py-4 whitespace-nowrap text-right">
                                                            <Button size="sm" className="bg-blue-700 text-white flex items-center gap-1 rounded mr-2" onClick={() => router.push(`/admin/edit-article/${article.slug}`)}>
                                                                <Pencil className="w-4 h-4" /> Edit
                                                            </Button>
                                                            <Button size="sm" className="bg-red-600 text-white flex items-center gap-1 rounded"
                                                                onClick={async () => {
                                                                    try {
                                                                        await deleteArticle(article.slug);
                                                                        toast({ title: "Article deleted!" });
                                                                        refreshArticles();
                                                                    } catch (err: unknown) {
                                                                        toast({ title: "Error", description: err instanceof Error ? err.message : String(err) });
                                                                    }
                                                                }}
                                                            >
                                                                <Trash className="w-4 h-4" /> Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="mt-8 flex justify-end">
                                    <Button onClick={() => router.push('/admin/create-article')} className="bg-black text-white hover:bg-gray-700 px-6 py-2 rounded flex items-center gap-2">
                                        + Create Article
                                    </Button>
                                </div>
                            </div>
                        )}
                        {tab === "categories" && (
                            <div className="py-10 grid grid-cols-1 gap-6">
                                <div className="flex items-center justify-between mb-4 mt-8">
                                    <h2 className="text-3xl font-semibold">Categories</h2>
                                    <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
                                        <Button onClick={() => setShowAddCategoryModal(true)} className="bg-black text-white hover:bg-gray-700 px-6 py-2 rounded flex items-center gap-2">
                                            + Add Category
                                        </Button>
                                        <DialogContent className="max-w-md w-full bg-white">
                                            <DialogHeader>
                                                <DialogTitle>Add Category</DialogTitle>
                                            </DialogHeader>
                                            <form
                                                onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    if (!newCategory.title || !newCategory.image) {
                                                        toast({ title: 'Title and image are required' });
                                                        return;
                                                    }
                                                    try {
                                                        await addCategory(newCategory);
                                                        setNewCategory({ title: '', slug: '', image: '' });
                                                        refreshCategories();
                                                        setShowAddCategoryModal(false);
                                                        toast({ title: 'Category added!' });
                                                    } catch (err: unknown) {
                                                        toast({ title: 'Error', description: err instanceof Error ? err.message : String(err) });
                                                    }
                                                }}
                                                className="flex flex-col items-center gap-4 mt-4"
                                            >
                                                <div className="flex gap-7">
                                                    <Input
                                                        className="w-1/2 text-lg font-semibold text-center border-gray-300 bg-gray-50 text-gray-600"
                                                        placeholder="Category title"
                                                        value={newCategory.title}
                                                        onChange={e => setNewCategory(f => ({ ...f, title: e.target.value }))}
                                                        required
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <label htmlFor="new-cat-image-upload" className="bg-black text-white px-2 py-1 rounded cursor-pointer text-xs hover:bg-gray-700 transition">
                                                            Upload
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id="new-cat-image-upload"
                                                                onChange={async (e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        const url = await uploadImage(e.target.files[0]);
                                                                        setNewCategory(f => ({ ...f, image: url }));
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        {newCategory.image ? (
                                                            <img src={newCategory.image} alt="Category" className="w-12 h-12 object-cover rounded-full border shadow" />
                                                        ) : <div className="w-12 h-12 object-cover rounded-full border shadow" />}

                                                    </div>
                                                </div>
                                                <Button type="submit" className="bg-black text-white hover:bg-gray-700 px-6 py-2 rounded flex items-center gap-2 w-full justify-center">
                                                    + Add Category
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {loadingCategories ? (
                                    <p>Loading categories...</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categories.map(cat => (
                                            <div key={cat.slug} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
                                                {editingCategory?.slug === cat.slug ? (
                                                    <>
                                                        <label htmlFor={`cat-image-upload-${cat.slug}`} className="mb-2 bg-black text-white px-3 py-1 rounded cursor-pointer text-xs hover:bg-blue-700 transition">Change Image
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id={`cat-image-upload-${cat.slug}`}
                                                                onChange={async (e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        const url = await uploadImage(e.target.files[0]);
                                                                        setCategoryForm(f => ({ ...f, image: url }));
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        {categoryForm.image && (
                                                            <img src={categoryForm.image} alt="Category" className="w-20 h-20 object-cover rounded-full border-2 border-gray-400 mb-3" />
                                                        )}
                                                        <Input
                                                            value={categoryForm.title}
                                                            onChange={e => setCategoryForm(f => ({ ...f, title: e.target.value }))}
                                                            placeholder="Category title"
                                                            className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-100 bg-gray-50 text-lg font-medium shadow-sm transition placeholder-gray-400 mt-2"
                                                        />
                                                        <div className="flex gap-2 mt-4">
                                                            <Button size="sm" className="bg-black text-white hover:bg-gray-700 flex items-center gap-1 px-5 rounded"
                                                                onClick={async () => {
                                                                    if (!categoryForm.image) {
                                                                        toast({ title: 'Image path is required', description: '', });
                                                                        return;
                                                                    }
                                                                    try {
                                                                        await updateCategory({
                                                                            slug: editingCategory.slug,
                                                                            updates: {
                                                                                title: categoryForm.title,
                                                                                image: categoryForm.image
                                                                            }
                                                                        });
                                                                        setEditingCategory(null);
                                                                        refreshCategories();
                                                                        toast({ title: 'Category updated!', description: '', });
                                                                    } catch (err: unknown) {
                                                                        toast({ title: 'Error', description: err instanceof Error ? err.message : String(err) });
                                                                    }
                                                                }}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button size="sm" className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-5 rounded" onClick={() => setEditingCategory(null)}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <img src={cat.image} alt={cat.title} className="w-20 h-20 object-cover rounded-full border-2 border-gray-400 mb-3" />
                                                        <h3 className="text-lg font-bold mb-1 truncate">{cat.title}</h3>
                                                        <div className="flex gap-2 mt-2">
                                                            <Button size="sm" className="bg-blue-700 text-white flex items-center gap-1 rounded" onClick={() => { setEditingCategory(cat); setCategoryForm({ title: cat.title, slug: cat.slug, image: cat.image }); }}>
                                                                <Pencil className="w-4 h-4" /> Edit
                                                            </Button>
                                                            <Button size="sm" className="bg-red-600 text-white flex items-center gap-1 rounded"
                                                                onClick={async () => {
                                                                    try {
                                                                        await deleteCategory(cat.slug);
                                                                        refreshCategories();
                                                                        toast({ title: "Category deleted!" });
                                                                    } catch (err: unknown) {
                                                                        toast({ title: "Error", description: err instanceof Error ? err.message : String(err) });
                                                                    }
                                                                }}
                                                            >
                                                                <Trash className="w-4 h-4" /> Delete
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {tab === "user_data" && (
                            <div className="flex justify-center items-start py-10">
                                <div className="relative max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="h-24 bg-black"></div>
                                    <div className="flex flex-col items-center -mt-12 pb-6">
                                        <img
                                            src={isEditingUser && userForm?.avatar_path ? userForm.avatar_path : userData?.avatar_path || '/placeholder-user.jpg'}
                                            alt="Avatar"
                                            className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg object-cover transition-transform hover:scale-105 bg-gray-100"
                                        />
                                        {isEditingUser && userForm ? (
                                            <>
                                                <label htmlFor="edit-user-avatar-upload" className="mt-2 bg-black text-white px-3 py-1 rounded cursor-pointer text-xs hover:bg-blue-700 transition">Change Avatar
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="edit-user-avatar-upload"
                                                        onChange={async (e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const url = await uploadImage(e.target.files[0]);
                                                                setUserForm(f => f ? { ...f, avatar_path: url } : f);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center place-items-center">
                                                    <div className="flex mx-4 my-4">
                                                        <h2 className="mt-6 mr-2">Name</h2>
                                                        <Input
                                                            value={userForm.name}
                                                            onChange={e => setUserForm(f => f ? { ...f, name: e.target.value } : f)}
                                                            placeholder="Name"
                                                            className="mt-4 w-2/3 px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-100 bg-gray-50 text-lg font-medium shadow-sm transition placeholder-gray-400 text-center text-gray-500"
                                                        />
                                                    </div>
                                                    <div className="flex mx-4 my-4">
                                                        <h2 className="mt-6 mr-2">Title</h2>
                                                        <Input
                                                            value={userForm.title}
                                                            onChange={e => setUserForm(f => f ? { ...f, title: e.target.value } : f)}
                                                            placeholder="Title"
                                                            className="mt-4 w-2/3 px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-100 bg-gray-50 text-lg font-medium shadow-sm transition placeholder-gray-400 text-center text-gray-500"
                                                        />
                                                    </div>


                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    <Button
                                                        size="sm"
                                                        className="rounded bg-black text-white hover:bg-gray-700 flex items-center gap-1 px-5"
                                                        onClick={async () => {
                                                            try {
                                                                await updateUserData({
                                                                    name: userForm.name,
                                                                    title: userForm.title,
                                                                    avatar_path: userForm.avatar_path,
                                                                });
                                                                setIsEditingUser(false);
                                                                refreshUserData();
                                                                toast({ title: "User profile updated!" });
                                                            } catch (err: unknown) {
                                                                toast({ title: "Error", description: err instanceof Error ? err.message : String(err) });
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="rounded bg-gray-200 text-gray-700 hover:bg-gray-400 px-5"
                                                        onClick={() => setIsEditingUser(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="mt-4 text-2xl font-bold">{userData?.name}</h2>
                                                <p className=" text-lg">{userData?.title}</p>
                                                <Button
                                                    className="mt-4 flex rounded items-center gap-2 bg-black text-white hover:bg-gray-700 px-5"
                                                    onClick={() => { setUserForm(userData); setIsEditingUser(true); }}
                                                >
                                                    <Pencil className="w-4 h-4" /> Edit Profile
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
} 
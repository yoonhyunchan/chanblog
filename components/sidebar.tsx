"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { X, Home, Monitor, ImageIcon, Utensils, Shirt, LogIn, LogOut, Mail, Lock, UserCog, UserPlus } from "lucide-react"
import { getAllCategories } from "@/lib/api";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CATEGORIES_API = process.env.NEXT_PUBLIC_CATEGORIES_API_URL;
const LOGIN_API = process.env.NEXT_PUBLIC_LOGIN_API_URL;

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState<{ slug: string, title: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authError, setAuthError] = useState("")
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    const handleToggleSidebar = () => {
      setIsOpen((prev) => !prev)
    }

    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("toggleSidebar", handleToggleSidebar)

    // Check authentication status on mount
    const token = localStorage.getItem("authToken");
    const tokenType = localStorage.getItem("tokenType");
    setIsAuthenticated(!!(token && tokenType));

    getAllCategories().then(setCategories)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("toggleSidebar", handleToggleSidebar)
    }
  }, [isOpen])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${LOGIN_API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('tokenType', data.token_type);
        document.cookie = `authToken=${data.access_token}; path=/; max-age=2592000`;
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setLoginForm({ email: "", password: "" });
        router.refresh();
      } else {
        setAuthError(data.message || data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsLoading(true)

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${LOGIN_API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('tokenType', data.token_type);
        document.cookie = `authToken=${data.access_token}; path=/; max-age=2592000`;
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setRegisterForm({ email: "", password: "", confirmPassword: "" });
        router.refresh();
      } else {
        setAuthError(data.message || data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    // Remove the cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
    if (pathname.startsWith('/admin')) {
      router.push('/');
    }
    router.refresh();
  };

  // Map slugs to icons if you want
  const iconMap: Record<string, any> = {
    it: Monitor,
    exhibition: ImageIcon,
    food: Utensils,
    fashion: Shirt,
  }

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 w-70 h-full bg-white shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-[999] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)]">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className={`flex items-center px-6 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${pathname === "/" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <Home size={20} className="mr-3 flex-shrink-0" />
                <span>Home</span>
              </Link>
            </li>
            {categories.map((cat) => {
              const Icon = iconMap[cat.slug] || Monitor
              const href = `/category/${cat.slug}`
              const isActive = pathname === href || pathname.startsWith(href + "/")
              return (
                <li key={cat.slug}>
                  <Link
                    href={href}
                    className={`flex items-center px-6 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${isActive ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} className="mr-3 flex-shrink-0" />
                    <span>{cat.title}</span>
                  </Link>
                </li>
              )
            })}
            {isAuthenticated && (
              <li key="/admin">
                {(() => {
                  const Icon = iconMap["admin"] || UserCog
                  const isActive = pathname === "/admin"
                  return (
                    <Link
                      href="/admin"
                      className={`flex items-center px-6 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${isActive ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={20} className="mr-3 flex-shrink-0" />
                      <span>Admin</span>
                    </Link>
                  )
                })()}
              </li>
            )}
          </ul>
          <div className="mt-auto p-4 border-t">
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowAuthModal(true)}
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register/Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Account Access</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

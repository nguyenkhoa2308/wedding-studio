"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, Heart, Camera, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
// import { useLoginUserMutation } from "@/lib/redux/services/authApi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // const [loginUser, { data, isError, isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const { login, isLoading, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const success = await login(email, password);

    if (success) {
      router.push("/");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center mobile-padding py-12 relative z-100">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
              <Image
                width={100}
                height={100}
                className="w-full h-full rounded-2xl"
                src="/images/plannie-logo.jpg"
                alt="Logo Plannie"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl text-gray-900">
              Plannie Studio
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Đăng nhập vào hệ thống quản lý
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-card shadow-xl border-0">
          <div className="space-y-1 pb-6">
            <div className="text-xl sm:text-2xl text-center text-gray-900 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5 text-rose-600" />
              Đăng nhập
            </div>
          </div>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="border-red-200 bg-red-50">
                  <div className="text-red-700 text-sm">{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className="mobile-input border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mobile-input border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white pr-12"
                    disabled={isLoading}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mobile-button bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-0 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Quản lý studio chụp ảnh cưới chuyên nghiệp</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 Wedding Studio Management. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, Heart, Camera, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/lib/redux/services/authApi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginUser, { data, isError, isLoading }] = useLoginUserMutation();
  const router = useRouter();
  // const { login, isLoading, user } = useAuth();

  // useEffect(() => {
  //   if (user) {
  //     onNavigate("dashboard");
  //   }
  // }, [user, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const success = await loginUser({ email, password });
    console.log(success);

    if (success.data) {
      router.push("/");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  // if (user) {
  //   return null; // Will redirect
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center mobile-padding py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl text-gray-900">
              Wedding Studio
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

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => onNavigate("register")}
                  className="text-rose-600 hover:text-rose-700 font-medium transition-colors underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        {/* <Card className="glass border-amber-200/50 bg-amber-50/30">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-amber-800 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tài khoản demo (mật khẩu: 123456)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <p className="text-amber-700">
                  <span className="font-medium">Admin:</span> admin@studio.com
                </p>
                <p className="text-amber-700">
                  <span className="font-medium">Manager:</span>{" "}
                  manager@studio.com
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-amber-700">
                  <span className="font-medium">Staff:</span> staff@studio.com
                </p>
                <p className="text-amber-700">
                  <span className="font-medium">Viewer:</span> viewer@studio.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

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

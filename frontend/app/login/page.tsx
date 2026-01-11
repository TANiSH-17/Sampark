'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/useTranslation';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Hardcoded authentication
    if (email === 'admin@mcd.gov.in' && password === 'delhi2026') {
      // Set a dummy cookie
      document.cookie = 'mcd_auth_token=dummy_token_12345; path=/; max-age=86400';
      
      toast({
        title: `✅ ${t.common.success}`,
        description: t.login.title,
        variant: 'success',
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      toast({
        title: `❌ ${t.common.error}`,
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-government p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 fade-in">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sampark</h1>
              <p className="text-blue-100 text-sm font-medium">Municipal Corporation of Delhi</p>
            </div>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              AI-Powered Civic<br />
              <span className="text-blue-100">Grievance Management</span>
            </h2>
            <p className="text-blue-50 text-lg max-w-md leading-relaxed">
              Streamline complaint resolution with intelligent automation, 
              real-time tracking, and data-driven insights for efficient governance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all hover-lift">
              <p className="text-4xl font-bold text-white mb-1">98%</p>
              <p className="text-blue-100 text-xs font-medium">Resolution Rate</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all hover-lift">
              <p className="text-4xl font-bold text-white mb-1">24h</p>
              <p className="text-blue-100 text-xs font-medium">Avg Response</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all hover-lift">
              <p className="text-4xl font-bold text-white mb-1">15L+</p>
              <p className="text-blue-100 text-xs font-medium">Citizens Served</p>
            </div>
          </div>
        </div>

        <div className="text-blue-100 text-sm relative z-10 fade-in" style={{ animationDelay: '300ms' }}>
          © 2026 Municipal Corporation of Delhi. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center fade-in">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sampark</h1>
              <p className="text-slate-500 text-sm font-medium">Admin Panel</p>
            </div>
          </div>

          <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm fade-in" style={{ animationDelay: '150ms' }}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">{t.login.title}</CardTitle>
              <CardDescription className="text-slate-600 text-base">
                {t.login.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">{t.login.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.login.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">{t.login.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.login.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{t.login.rememberMe}</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    {t.login.forgotPassword}
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all hover-lift"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.login.signingIn}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {t.login.signIn}
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-center text-sm text-slate-500 mb-2">
                  {t.login.demoCredentials}
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <code className="text-xs text-slate-700 font-mono">
                    admin@mcd.gov.in / delhi2026
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

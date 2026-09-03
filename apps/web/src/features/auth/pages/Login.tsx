import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/features/auth';
import { useAuthStore, authApi } from '@/features/auth';
import { useOAuthPopup } from '../hooks/use-oauth-popup';
import { Button, Card, CardContent, CardHeader, Checkbox, Input, Label } from '@/shared/components/ui';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const me = useAuthStore(state => state.fetchCurrentUser);
  const { openPopup: openGooglePopup, isLoading: isGoogleLoading, error: googleLoginError } = useOAuthPopup('google');
  // const user = useAuthStore(state => state.user)

  const handleGoogleLogin = () => {
    openGooglePopup();
  };
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {

    try {
      const response = await authApi.login(data)
      
      login(response.data.user, response.data.accessToken);

      const user = await me()
      if (!user) return;

      const invitations = user.invitations ?? [];
      if (invitations.length) {
        // setInvitaitons(invitations)
      }

      if (!user.organizations?.length) {
        navigate('/onboarding')
      }
      else { 
        // navigate('/')
      }
    }
    catch(e) {
      console.log(e);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            T
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground">
            Sign in to continue to TeamFlow
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                {...register('email')}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="remember"
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />

                <Label
                  htmlFor="remember"
                  className="cursor-pointer font-normal"
                >
                  Remember me
                </Label>
              </div>

              {/*<Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>*/}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
            {googleLoginError && (
              <p className="text-center text-sm text-destructive">
                {googleLoginError}
              </p>
            )}

            {/* Register */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
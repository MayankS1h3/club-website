import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminLogin = () => {
  const { admin, login } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // If already logged in, redirect to dashboard
  if (admin) {
    const from = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setLoginError('');

    const result = await login(data);
    
    if (result.success) {
      // Redirect will happen automatically via the Navigate above
    } else {
      setLoginError(result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-nightclub-600 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-dark-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-dark-600">
            Sign in to manage the nightclub
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  {...register('username')}
                  type="text"
                  autoComplete="username"
                  className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Login Error */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{loginError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size={20} />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-dark-500">
              This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
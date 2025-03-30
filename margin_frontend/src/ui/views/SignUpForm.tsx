import { Button } from '../core/button';
import { Card } from '../core/card';
import { Input } from '../core/input';
import { useState } from 'react';

// Form schema includes confirm password
type SignUpFormData = {
  userName: string;
  password: string;
  confirmPassword: string;
  email: string;
};

// API schema excludes confirm password
type SignUpApiData = {
  userName: string;
  password: string;
  email: string;
};

// Add this new component above the SignUpForm component
const PasswordVisibilityIcon = ({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) => (
  <svg
    onClick={onClick}
    className='shrink-0 size-3.5 absolute right-4 cursor-pointer'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path
      className='hs-password-active:hidden'
      d='M9.88 9.88a3 3 0 1 0 4.24 4.24'
    ></path>
    <path
      className='hs-password-active:hidden'
      d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68'
    ></path>
    <path
      className='hs-password-active:hidden'
      d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61'
    ></path>
    <line
      className={isVisible ? 'hidden' : ''}
      x1='2'
      x2='22'
      y1='2'
      y2='22'
    ></line>
    <path
      className={!isVisible ? 'hidden' : ''}
      d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'
    ></path>
    <circle
      className={!isVisible ? 'hidden' : ''}
      cx='12'
      cy='12'
      r='3'
    ></circle>
  </svg>
);

const SignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    const apiData: SignUpApiData = {
      userName: formData.userName,
      password: formData.password,
      email: formData.email,
    };

    console.log({ apiData });
  };

  return (
    <Card className='text-white flex gap-5 flex-col px-8'>
      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold '>Sign Up</h1>
        <p>And lets get started with your free trial</p>
      </div>

      <div className='flex flex-col'>
        <label>Username</label>
        <Input
          className={`w-100 ${errors.userName ? 'border-red-500' : ''}`}
          type='text'
          name='userName'
          placeholder='Enter your username'
          onChange={handleChange}
          value={formData.userName}
        />
        {errors.userName && (
          <span className='text-red-500 text-xs mt-1'>{errors.userName}</span>
        )}
      </div>

      <div className='flex flex-col'>
        <label>Email</label>
        <Input
          className={`w-100 ${errors.email ? 'border-red-500' : ''}`}
          type='email'
          name='email'
          placeholder='Enter your email'
          onChange={handleChange}
          value={formData.email}
        />
        {errors.email && (
          <span className='text-red-500 text-xs mt-1'>{errors.email}</span>
        )}
      </div>

      <div className='flex flex-col'>
        <label>Password</label>
        <div className='w-100 relative flex items-center justify-center'>
          <Input
            className={`w-100 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            type={passwordVisibility.password ? 'text' : 'password'}
            name='password'
            placeholder='Enter your password'
            onChange={handleChange}
            value={formData.password}
          />
          <PasswordVisibilityIcon
            isVisible={passwordVisibility.password}
            onClick={() => togglePasswordVisibility('password')}
          />
        </div>
        {errors.password && (
          <span className='text-red-500 text-xs mt-1'>{errors.password}</span>
        )}
      </div>

      <div className='flex flex-col'>
        <label>Confirm Password</label>
        <div className='w-100 relative flex items-center justify-center'>
          <Input
            className={`w-100 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            type={passwordVisibility.confirmPassword ? 'text' : 'password'}
            name='confirmPassword'
            placeholder='Confirm your password'
            onChange={handleChange}
            value={formData.confirmPassword}
          />
          <PasswordVisibilityIcon
            isVisible={passwordVisibility.confirmPassword}
            onClick={() => togglePasswordVisibility('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <span className='text-red-500 text-xs mt-1'>
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <Button variant={'outline'} onClick={onSignUp}>
        Sign Up
      </Button>
      <div className='flex justify-center gap-2 text-xs'>
        <span>Already have an account? </span>
        <a href='/login' className='underline'>
          Sign In
        </a>
      </div>
    </Card>
  );
};

export default SignUpForm;

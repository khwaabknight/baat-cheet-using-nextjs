'use client';

import React,{useCallback, useState} from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {Input} from '@/app/components/Inputs/Input';
import { Button } from '@/app/components/Button';
import { AuthSocialButton } from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
// import {Input} from '../../components/Inputs/Input';

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const [variant, setVariant] = React.useState<Variant>('LOGIN')
    const [loading, setLoading] = useState<boolean>(false)

    const toggleVariant = useCallback(() => {
        if(variant === 'LOGIN') {
            setVariant('REGISTER')
        } else {
            setVariant('LOGIN')
        }
    }, [variant]);

    const { 
        register,
        handleSubmit, 
        formState: { errors } 
    } = useForm<FieldValues>({
        defaultValues:{
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        setLoading(true);

        if(variant === 'REGISTER') {
            // Axios register
            console.log('Registering with: ', data);
        }

        if(variant === 'LOGIN') {
            // Next Auth sign in
            console.log('Logging in with: ', data);
        }
    }

    const socialAction = (action : string) => {
        setLoading(true);
        console.log(`social action: ${action} performed`)

        // NextAuth social login
        setLoading(false);
    }

  return (
    <div
    className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
    >
        <div
        className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'
        >
            <form
            className='space-y-6'
            onSubmit={handleSubmit(onSubmit)}
            >
                {variant === 'REGISTER' && (
                    <Input
                        label='Name'
                        id='name'
                        type='text'
                        // required ?
                        register={register}
                        errors={errors}
                        disabled = {loading}
                    />
                )}
                <Input
                    label='Email address'
                    id='email'
                    type='email'
                    // required ?
                    register={register}
                    errors={errors}
                    disabled = {loading}
                />
                <Input
                    label='Password'
                    id='password'
                    type='password'
                    // required ?
                    register={register}
                    errors={errors}
                    disabled = {loading}
                />
                <div>
                    <Button
                        disabled={loading}
                        fullWidth
                        type='submit'
                    >{variant === 'LOGIN' ? 'Sign In' : 'Register'}</Button>
                </div>

            </form>

            <div className='mt-6'>
                <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-300'/>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className=' bg-white px-2 text-gray-500'>
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className='mt-6 flex gap-2'>
                    <AuthSocialButton
                        icon={BsGithub}
                        onClick={() => socialAction('github')}
                    />
                    <AuthSocialButton
                        icon={BsGoogle}
                        onClick={() => socialAction('google')}
                    />
                </div>
            </div>

            <div
                className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'
            >
                <div>
                    {variant === 'LOGIN' ? 'Don\'t have an account?' : 'Already have an account?'}
                </div>
                <div
                    onClick={toggleVariant}
                    className='underline cursor-pointer'
                >
                    {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                </div>

            </div>

        </div>
    </div>
  )
}

export default AuthForm;
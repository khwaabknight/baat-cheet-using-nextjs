'use client';

import React,{useCallback, useEffect, useState} from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {Input} from '@/app/components/Inputs/Input';
import { Button } from '@/app/components/Button';
import { AuthSocialButton } from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import {Input} from '../../components/Inputs/Input';

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = React.useState<Variant>('LOGIN')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(session?.status === 'authenticated') {
            router.push('/users');
            toast.success('Logged in successfully!!')
        }
    },[session?.status,router])

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

    const onSubmit : SubmitHandler<FieldValues> = async(data) => {
        setLoading(true);

        if(variant === 'REGISTER') {
            // Axios register
            console.log('Registering with: ', data);
            axios.post('/api/register', data).then((res) => {
                signIn('credentials', data);
                toast.success('Registered successfully')
                setVariant('LOGIN')
            }).catch((error)=>{
                console.log(error);
                toast.error('Something went wrong!!')
            }).finally(()=> {
                setLoading(false);
            })
        }

        if(variant === 'LOGIN') {
            // Next Auth sign in
            console.log('Logging in with: ', data);
            signIn('credentials', {
                ...data,
                redirect: false,
            }).then((callback) => {
                console.log(callback);
                if(callback?.error) {
                    console.log(callback.error)
                    toast.error('Invalid credentials')
                }
                if(callback?.ok ) {
                    router.push('/users');
                    toast.success('Logged in successfully!!')
                }
            }).catch((error) => { 
                console.log(error);
                toast.error('Something went wrong!!')
            }).finally(()=> {
                setLoading(false);
            })
        }
    }

    const socialAction = (action : string) => {
        setLoading(true);
        // NextAuth social login
        signIn(action, {
            redirect:false,
        }).then((callback) => {
            if(callback?.error) {
                console.log(callback.error)
                toast.error('Invalid Credentials!!')
            }
            if(callback?.ok ) {
                router.push('/users');
                toast.success('Logged in successfully!!')
            }
        }).catch((error : any) => {
            console.log(`Social Login error ${action}`,error);
            toast.error('Something went wrong!!')
        }).finally(()=> {
            setLoading(false);
        })        
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
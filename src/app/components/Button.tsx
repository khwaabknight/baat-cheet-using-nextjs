'use client'

import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined,
    fullWidth?: boolean,
    children?: React.ReactNode,
    onClick?: () => void,
    secondary?: boolean,
    danger?: boolean,
    disabled?: boolean,
}



export const Button : React.FC<ButtonProps> = ({
    type,fullWidth,children,onClick,secondary,danger,disabled
}) => {
  return (
    <button
    type={type}    
    onClick={onClick}
    disabled={disabled}
    className={clsx(`
        flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
        disabled && `opacity-50 cursor-default`,
        fullWidth && `w-full`,
        secondary ? 'text-gray-900' : 'text-white',
        danger && 'bg-red-500 hover:bg-red-600 focus-visible:outline-red-600 ',
        !secondary && !danger && 'bg-[#fbc905] hover:bg-[#f5b647] focus-visible:outline-[#f5b647]',
        )}
    >
        {children}
    </button>
  )
}

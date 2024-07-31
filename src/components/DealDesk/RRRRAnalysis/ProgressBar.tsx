import React from 'react';

export default function ProgressBar({ progress, color,amount } :any){
    return(
        <div className='flex items-center'>
        <div
          style={{ width: `${progress}%`, backgroundColor: `${color}` }}
          className="h-1.5 rounded-full w-2/3"
        ></div>
        <div className='text-xs font-bold w-1/3'>{amount}</div>
        </div>
    )
}
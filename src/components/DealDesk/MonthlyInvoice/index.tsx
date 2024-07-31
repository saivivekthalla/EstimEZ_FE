import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AppDispatch } from '@/features/store';
import { fetchMonthlyInvoice, postMonthlyInvoice } from '@/features/dealDesk/linechartSlice';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MonthlyInvoice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedDate, setSelectedDate] = useState(null);
    const [month, setMonth] = useState('');
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const projectId: string | null = searchParams.get('projectId');
    const invoiceData = useSelector(fetchMonthlyInvoice);
    const componentPDF: any = useRef();
    const generatePDF =  () => {
        html2canvas(componentPDF.current, {scale: 2}).then((canvas)=>{
        const imgData = canvas.toDataURL('img/png');
        const doc = new jsPDF();
        const componentWidth = doc.internal.pageSize.getWidth();
        const componentHeight = (canvas.height * componentWidth)/canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
        doc.save(`${month} Month Report.pdf`);
        })
    }

    const data = [
        { description: 'Sub Total', total: `$${(invoiceData.subTotalAmount) || 0}` },
        { description: `Tax (18%)`, total: `$${(invoiceData.tax) || 0}` },
        { description: 'Total Amount', total: `$${(invoiceData.taxedAmount) || 0}` },
    ];

    const rows = selectedDate && data.map((item, index) => (
        <tr key={index} className='text-base font-bold'>
            <td colSpan={3} className="px-6 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"></td>
            <td className="px-6 py-2 whitespace-nowrap text-gray-800 dark:text-grey-400">{item.description}</td>
            <td className="px-6 py-2 whitespace-nowrap text-gray-800 dark:text-gray-400">{item.total}</td>
        </tr>
    ));

    const CustomInputWithIcon = ({ value, onClick }: any) => (
        <div className="relative w-48">
            <input
                type="text"
                value={value}
                onClick={onClick}
                readOnly
                className="w-full p-1 pl-3 border border-gray-300 rounded-xl"
                placeholder="Select a month"
            />
            <span
                className="absolute top-1 right-2 cursor-pointer"
                onClick={onClick}
            >
                &#x1F4C6; {/* Unicode for calendar icon */}
            </span>
        </div>
    );
    return (
        <div>
            <div className='flex justify-between p-3'>
                <h1 className='text-2xl font-bold'>Monthly Invoice</h1>
                <button onClick={generatePDF} disabled={selectedDate == null ? true : false}
                    className={`group relative bg-[#2B205F] hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-2xl inline-flex items-center 
                        ${selectedDate == null && 'cursor-not-allowed'}`}>
                    <svg className="text-white fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    <span className='text-white'>Download</span>
                    <div className={`absolute w-[20rem] z-50 right-[9rem] rounded-lg bg-gray-200 scale-0 p-2 -top-15 ${selectedDate == null && 'group-hover:scale-100'}`}>
                        Choose a month to download invoice
                    </div>
                </button>
            </div>
            <div ref={componentPDF} className='bg-gray-200 w-full p-8 rounded-3xl'>
                <div>
                    <h2 className='text-base font-bold'>Invoice to:
                        <span className='font-normal'> {selectedDate ? invoiceData.accountName : "Select Month"}</span>
                    </h2>
                    <div className='flex justify-between py-3 text-base font-bold'>
                        <div className='flex items-center justify-center'>
                            <h2 className='pr-3'>Choose Date:</h2>
                            <div className="text-black">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: any) => {
                                        setSelectedDate(date);
                                        setMonth(date.toLocaleString('default', { month: 'long' }))
                                        const data: any = {
                                            projectId: projectId,
                                            date: {
                                                month: date.toLocaleString('default', { month: 'short' }),
                                                year: date.getFullYear()
                                            }
                                        };
                                        dispatch(postMonthlyInvoice(data))
                                    }}
                                    dateFormat="MMM yyyy"
                                    showMonthYearPicker
                                    placeholderText="Select month and year"
                                    customInput={<CustomInputWithIcon />}
                                />
                            </div>
                        </div>
                        <h2>Total Amount:
                            <span className='font-medium'> ${selectedDate ? invoiceData.totalAmount : 0}</span>
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col ">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div style={{ width: "100%" }} className="overflow-hidden rounded-3xl">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead
                                        className="border-b bg-[#2B205F] text-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Roles</th>
                                            <th scope="col" className="px-6 py-4">Region</th>
                                            <th scope="col" className="px-6 py-4">Cost/Hr</th>
                                            <th scope="col" className="px-6 py-4">Total Hours</th>
                                            <th scope="col" className="px-6 py-4">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className='font-medium'>
                                        <>
                                            {selectedDate ?
                                                (invoiceData?.resourcesBillableRecords?.length > 0 ?
                                                    invoiceData?.resourcesBillableRecords.map((data: any) => {
                                                        return (
                                                            <>
                                                                <tr className="even:bg-white odd:bg-gray-200 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{data.role}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{data.region}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{data.costPerHour}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{data.totalHours}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{data.cost}</td>
                                                                </tr>
                                                            </>
                                                        )

                                                    }) : (
                                                        <tr>
                                                            <td colSpan={5} className='py-4 text-center text-[1.5em]'>
                                                                No Data
                                                            </td>
                                                        </tr>
                                                    )) :
                                                (
                                                    <tr>
                                                        <td colSpan={5} className='py-4 text-center text-[1.5em]'>
                                                            Choose a month to view invoice data
                                                        </td>
                                                    </tr>
                                                )

                                            }
                                            {rows}
                                        </>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthlyInvoice
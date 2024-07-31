import Link from "next/link";

const BudgetSummary = ({selected, configured, details, otherCost, discount, projectId}:any) => {

    const list = [
        { name: "Resource Approach amount", value: details?.totalCost},
        { name: "Other costs", value: otherCost },
        { name: `Discount ${discount}%`, value: details?.discountAmount }
    ]
    return (
        <div className="h-[50vh] py-6 px-14 bg-[#2B205FE5] rounded-md text-white">
        <p className="font-semibold text-xl">Budget Summary</p>
        {
            selected && configured ?
                <div className="h-full">
                    <div className="grid pr-4 py-6 gap-y-2 h-[60%]">
                        {list.map((data: any) => {
                            return (
                                <div className="flex justify-between">
                                    <p className="font-extralight">{data.name}</p>
                                    <p className="font-semibold whitespace-break-spaces">$  {data.value}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid gap-y-3 px-3 pt-3 text-md border-t-2 font-bold">
                        <div className="flex justify-between">
                            <p>TOTAL AMOUNT (Without Discount)</p>
                            <p className="text-[#FCFF75]">${details?.totalAmountWithoutDiscount}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>FINAL AMOUNT (With Discount)</p>
                            <p className="text-[#FCFF75]">${details?.finalAmountWithDiscount}</p>
                        </div>
                    </div>
                </div>
                :
                <div className="h-full">
                    <div className="flex justify-center items-center text-center align-middle h-[75%]">
                        {
                            !selected ?
                                'Please choose an Approach for consolidated summary'
                                :
                                <p>
                                    Please configure other costs and discounts <br /> for consolidated summary
                                    <br /><br />
                                    <Link href={`/othercost?projectId=${projectId}`}>
                                        <button className="border bg-[#BBE7ED] py-2 px-6 rounded-md text-black mr-2 font-medium">Other Costs</button>
                                    </Link>
                                    <Link href={`/discount?projectId=${projectId}`}>
                                        <button className="border bg-[#BBE7ED] py-2 px-6 rounded-md text-black font-medium">Discount</button>
                                    </Link>
                                </p>
                        }
                    </div>
                    <div className="flex justify-between border-t-2 p-3 text-lg">
                        <p className="font-semibold">FINAL AMOUNT</p>
                        <p className="text-[#FCFF75] w-20 text-center">{selected ? `$ ${details?.totalCost}` : `NA`}</p>
                    </div>
                </div>
        }
    </div>
    )
}

export default BudgetSummary
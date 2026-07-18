import { formatCurrency } from "@/src/util"

type LabelAndAmountType = {
    label : string
    amount : number
}

export default function Amount({label, amount} : LabelAndAmountType) {
  return (
    <p className="text-2xl font-bold">
        {label}: {''}
        <span className=" text-amber-500">{formatCurrency(amount)}</span>
    </p>
  )
}

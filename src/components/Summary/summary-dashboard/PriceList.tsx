const PriceItem = ({
  label,
  value,
  isPercentage = false,
}: {
  label: string;
  value: number;
  isPercentage?: boolean;
}) => (
  <div className="col-span-1 flex items-center justify-between">
    <p>{label}</p>
    {isPercentage ? null : <p>${value?.toFixed(2)}</p>}
    {isPercentage && <p>{value?.toFixed(2)}%</p>}
  </div>
);
const PriceList = ({
  cCost = 0,
  sCost = 0,
}: {
  cCost?: number;
  sCost?: number;
}) => {
  const getDifferencePercentage = () =>
    ((sCost - cCost) / (cCost + sCost)) * 100;
  return (
    <div className="grid grid-cols-1 price-list-container py-2.5">
      <PriceItem label="Standard Total Cost" value={cCost} />
      <PriceItem label="Custom Total Cost" value={sCost} />
      <PriceItem
        label="Margin"
        value={getDifferencePercentage() || 0}
        isPercentage
      />
    </div>
  );
};
export default PriceList;

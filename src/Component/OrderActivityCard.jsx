
import { LuRefreshCcw } from "react-icons/lu";
const OrderActivityCard = ({ data }) => {
  return (
    <div className="grediant-img2 h-60 w-full rounded-3xl p-4 flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xs font text-(--text-main) flex items-center gap-1 ">
           <LuRefreshCcw className=" text-(--bs-black) " /> {data.title}
          </h3>
          <p className="text-[10px] text-(--text-third)">
            {data.subtitle}
          </p>
        </div>

        <span className="text-[10px] font-semibold text-(--bg-green) bg-green-100 px-2 py-1 rounded-full">
          {data.growth}
        </span>
      </div>

      {/* List */}
      <div className="space-y-3 mt-20">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-xs ${item.color}`}
              ></span>
              <span className="text-[9px] text-(--text-main)">
                {item.label}
              </span>
            </div>
            <span className="text-xs font-normal text-(--text-main)">
              {item.value}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderActivityCard;

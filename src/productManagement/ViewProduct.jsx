
import Button from '../Component/Btn';
import { Heading, MainHeading } from '../Component/Heading'
import InputBox, { InputField } from '../Component/InputBox'
import BannerImg from "../assets/Bannerone.png";

const ViewProduct = () => {
const images = [
  { src: BannerImg },
  { src: BannerImg },
  { src: BannerImg },
  { src: BannerImg },
];



  return (
    <div>



        <MainHeading
        title={"Products Management"}
        subtitle={"Real-time overview of orders, payments, customers & operations"}
        />

        <div className='rounded-xl shadow-2xl mt-5 bg-(--bg-box) p-5 space-y-5'>
            <p className='font-bold text-sm'>Product ID - <span className='text-(--bs-purple) text-sm'> ATP15PM </span> ( INH AIRFLOW 250 )</p>

            <div className='grid grid-cols-4 gap-4 mt-5'>
                <InputField 
                label={"Product Category"}
                defaultValue='Asthmetic'

                />
                <InputField 
                label={"Product Type"}
                defaultValue='Pills'

                />
                <InputField 
                label={"Brand"}
                defaultValue='Bionova Healthcare Limited'

                />
                <InputField 
                label={"Product Name or Model"}
                defaultValue='INH AIRFLOW 250'

                />
                <InputField 
                label={"Product ID"}
                defaultValue='A156PMHHJ'

                />
                <InputField 
                label={"Product Price"}
                defaultValue='500'

                />
                <InputField 
                label={"Discount"}
                defaultValue='10%'

                />
                <InputField 
                label={"Product Variant"}
                defaultValue='250 mg'

                />
                <InputField 
                label={"GST in Percentage"}
                defaultValue='10'

                />
                <InputField 
                label={"GST in Amont"}
                defaultValue='99'

                />
                <InputField 
                label={"Product Items Per Unit"}
                defaultValue='12'

                />
                <InputField 
                label={"Items Per Unit Price"}
                defaultValue='10,000'

                />
                <InputField 
                label={"Manufacturer by"}
                defaultValue='Smart Chain Studio'

                />
            </div>
             
            <Heading
            title={"Detailed Description  (Words Limit 1000)"}
            titleSize='text-xs'/>

        <textarea
  defaultValue={`Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page.Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page.
`}
  rows={4}
  maxLength={1000}
  className="w-full border border-(--input-border) rounded-md p-2 text-xs text-(--text-second)"
/>



<Heading
            title={"Product Images"}
            titleSize='text-xs'/>

            <div className='grid grid-cols-4 gap-5'>

{images.map((item, index) => {
  return (
    <img
      key={index}
      src={item.src}
      alt={`banner-${index}`}
      className='rounded-2xl '
    />
  );
})}

</div>




<div className='flex  gap-3 items-center justify-center mt-10'>
<Button
title={"Delete Product"}
className='p-2 text-xs rounded-sm shadow-2xl px-3'
/>

<Button
title={"Edit Product"}
className='p-2 text-xs rounded-sm shadow-2xl bg-(--bs-btn-third) px-5'
/>
</div>


        </div>
    </div>
  )
}

export default ViewProduct
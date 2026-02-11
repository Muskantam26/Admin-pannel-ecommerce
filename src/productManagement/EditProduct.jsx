
import Button from '../Component/Btn';
import { Heading, MainHeading } from '../Component/Heading'
import InputBox, { InputField } from '../Component/InputBox'
import BannerImg from "../assets/Bannerone.png";

const EditProduct = () => {
const images = [
  { src: BannerImg },
  { src: BannerImg },
  { src: BannerImg },
  { src: BannerImg },
];



  return (
    <div>



       

        <div className='rounded-xl shadow-2xl mt-5 bg-(--bg-box) p-5 space-y-5'>
          <Heading
          title={"Edit Products"}/>

            <div className='grid grid-cols-4 gap-4 mt-5'>
                <InputField 
                label={"Select Product Category"}
                defaultValue='Asthmetic'

                />
                <InputField 
                label={"Select Product Type"}
                defaultValue='Pills'

                />
                <InputField 
                label={"Select Brand"}
                defaultValue='Bionova Healthcare Limited'

                />
                <InputField 
                label={"Select  Product Name or Model"}
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
                label={"Product Color"}
                defaultValue='Green'

                />
                 <InputField 
                label={"Product Material"}
                defaultValue='Metal'

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
  defaultValue={`Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page. Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page.
`}
  rows={4}
  maxLength={1000}
  className="w-full border border-(--input-border) rounded-md p-2 text-xs text-(--text-second)"
/>
 <Heading
            title={"Product Key Feature  (Words Limit 500)"}
            titleSize='text-xs'/>

 <textarea
  defaultValue={`Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page. Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page.
`}
  rows={4}
  maxLength={500}
  className="w-full border border-(--input-border) rounded-md p-2 text-xs text-(--text-second)"
/>
 <Heading
            title={"Menufecturer Details  (Words Limit 500)"}
            titleSize='text-xs'/>

 <textarea
  defaultValue={`Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page. Organize your data in familiar spreadsheets and workbooks, with all changes saved automatically. Create modern visuals that turn numbers into valuable insights. Work together in real time knowing that everyone is on the same page.
`}
  rows={4}
  maxLength={500}
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
title={"Cancle"}
className='p-2 text-xs rounded-sm shadow-2xl px-5'
/>

<Button
title={"Save Product"}
className='p-2 text-xs rounded-sm shadow-2xl bg-(--bs-btn-third) px-5'
/>
</div>


        </div>
        
    </div>
  )
}

export default EditProduct
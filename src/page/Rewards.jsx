import React from 'react'
import { Heading, MainHeading } from '../Component/Heading'

const Rewards = () => {
  return (
    <div>
        <div className='flex justify-between'>
            <MainHeading
                title={"Rewards"}
                subtitle={"Manage and view user rewards"}
            />
        </div>
        <div className="justify-between bg-(--bg-box) rounded-2xl p-5 mt-5 shadow-2xl">
            <Heading title={"Rewards List"} />
            <div className='p-5'>
                <p>Rewards content will go here.</p>
            </div>
        </div>
    </div>
  )
}

export default Rewards

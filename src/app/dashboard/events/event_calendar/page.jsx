"use client";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { Alert, Calendar } from 'antd';
import dayjs from 'dayjs';


const itemsPerPage = 10;

export default function EventTable() {

    const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
    };
    const onPanelChange = (newValue) => {
    setValue(newValue);
  };
   

 
  return (
    <div className="overflow-x-auto">
        <section className="flex justify-between items-center pb-5">
            <h3 className="font-semibold text-xl leading-[25px]">Event History</h3>
           
            <div>
            <section className="flex justify-end w-full h-[48px]">
                <DatePicker onChange={() => {}} placeholder={new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit" })} suffixIcon={<DownOutlined />} picker="month" className="custom-datepicker" />
            </section>
            </div>
        </section>

        <section>

        <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
        </section>
      
    </div>
  );
}

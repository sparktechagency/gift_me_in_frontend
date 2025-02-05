"use client";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import Table from "../../../components/Table";
import { HistoryData } from "../../../../utils/CustomData";




const head = ["Date","Event","User","Gift","Status","Action"]

const itemsPerPage = 10;

export default function EventTable() {

    const [selectedDate, setSelectedDate] = useState(null);
  const placeholder = dayjs().format("MMM YYYY"); // Default placeholder (Jan 2025)

    const onChange = (date) => {
    setSelectedDate(date ? date.format("MMM YYYY") : null);
  };



 
  return (
    <div className="overflow-x-auto p-6 bg-white shadow-lg rounded-lg">
        <section className="flex justify-between items-center pb-5">
            <h3 className="font-semibold text-xl leading-[25px]">Event History</h3>
           
            <div>
            <section className="flex justify-end w-full h-[48px]">
                <DatePicker onChange={() => {}} placeholder={new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit" })} suffixIcon={<DownOutlined />} picker="month" className="custom-datepicker" />
            </section>
            </div>

        </section>
        <Table bodyData={HistoryData} head={head} />
    </div>
  );
}

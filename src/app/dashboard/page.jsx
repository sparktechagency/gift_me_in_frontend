"use client";
import React, { useState } from "react";
import { DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  ReferenceLine,
  Area,
  CartesianGrid,
  BarChart,
  Legend,
  Bar,
  Rectangle,
} from "recharts";
import { User, Gift, ShoppingCart, DollarSign } from "lucide-react";

const data = [{ value: 200 }, { value: 1500 }, { value: 350 }, { value: 1500 }];

const revinueData = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 1000 },
  { month: "Mar", value: 1500 },
  { month: "Apr", value: 2000 },
  { month: "May", value: 2200 },
  { month: "Jun", value: 2800 },
  { month: "Jul", value: 3200 },
  { month: "Aug", value: 4150 },
  { month: "Sep", value: 4100 },
  { month: "Oct", value: 5200 },
  { month: "Nov", value: 5800 },
  { month: "Dec", value: 6000 },
];

const giftData = [
  { xValue: 50, yValue: 80, month: "Jan" },
  { xValue: 100, yValue: 120, month: "Feb" },
  { xValue: 150, yValue: 160, month: "Mar" },
  { xValue: 180, yValue: 200, month: "Apr" },
  { xValue: 200, yValue: 220, month: "May" },
  { xValue: 250, yValue: 270, month: "Jun" },
  { xValue: 230, yValue: 250, month: "Jul" },
  { xValue: 200, yValue: 230, month: "Aug" },
  { xValue: 300, yValue: 320, month: "Sep" },
  { xValue: 400, yValue: 420, month: "Oct" },
  { xValue: 500, yValue: 550, month: "Nov" },
  { xValue: 600, yValue: 650, month: "Dec" },
];

const getChartColor = (data) => {
  if (!data || data.length === 0) return "#16a34a"; // Default green
  const lastValue = data[data.length - 1].value;
  return lastValue > 500 ? "#16a34a" : "#dc2626";
};

const Card = ({ title, icon: Icon, value, data }) => {
  const chartColor = getChartColor(data);
  return (
    <div className="p-4 rounded-[10px] w-[340px] shadow-lg bg-white">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-pink-500 text-white rounded-lg">
          <Icon size={20} />
        </div>
        <p className="text-gray-700 font-medium">{title}</p>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
        <ResponsiveContainer width={100} height={60}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#F82BA9] p-2 border border-gray-300 shadow-md px-6 py-2 rounded-xl">
        <p className="text-white font-semibold text-[20px] leading-[27px]">{`$${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-gray-300 shadow-md rounded-xl">
        <p className="text-white font-semibold text-[20px] rounded-t-lg bg-[#F82BA9] px-6 py-2 leading-[27px]">
          {`Gift Delivery: $${payload[0].value}`}
        </p>
        <p className="text-white font-semibold text-[20px] bg-[#B01F78] rounded-b-lg  px-6 py-2 leading-[27px]">
          {`Order: $${payload[1].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const Page = () => {
  const [year, setYear] = useState("2024");
  const highlightData = data.find((d) => d.month === "Jun");
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYear = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <main className="w-full flex flex-col gap-8 ">
      <section className="flex justify-end w-full h-[48px]">
        <DatePicker
          onChange={() => {}}
          placeholder={new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
          })}
          suffixIcon={<DownOutlined />}
          className="custom-datepicker"
        />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <Card
            title="Active Subscriber"
            icon={User}
            value={1500}
            data={data}
          />
          <Card title="Gift Sent" icon={Gift} value={1500} data={data} />
          <Card title="Order" icon={ShoppingCart} value={1500} data={data} />
          <Card title="Revenue" icon={DollarSign} value={500} data={data} />
        </div>
      </section>
      {/*  revenue charts */}

      <div className="shadow-lg bg-white rounded-[10px]">
        <div className="flex items-center justify-between py-6 px-10">
          <h3 className="font-semibold w-full text-[24px] leading-[36px] text-[#160E4B] ">
            Revenue Analytics
          </h3>
          <section className="flex justify-end w-full h-[48px]">
            <DatePicker
              onChange={handleYear}
              picker="year"
              placeholder={new Date().getFullYear().toString()}
              suffixIcon={<DownOutlined />}
              className="custom-datepicker"
            />
          </section>
        </div>
        <ResponsiveContainer width="100%" height={400} className="p-0 m-0">
          <LineChart
            data={revinueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="1 0" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(tick) => `${tick / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#F82BA9"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Last Charts */}

      <section className="shadow-lg flex flex-col gap-10 bg-white rounded-[10px] p-6">
        <div>
        <h3 className="font-semibold text-[24px] leading-[36px]">
          Gift Delivery and Subscriber Trends
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex w-[150px] items-center gap-2">
            <div className="w-[16px] h-[16px] rounded-[2px] bg-[#F82BA9]"></div>
            <h3 className="font-normal text-base leading-[24px] text-[#65728E]">
              Gift Delivery
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[16px] h-[16px] rounded-[2px] bg-[#B01F78]"></div>
            <h3 className="font-normal text-base leading-[24px] text-[#65728E]">
              Order
            </h3>
          </div>
          <section className="flex justify-end w-full h-[48px]">
            <DatePicker
              onChange={handleYear}
              picker="year"
              placeholder={new Date().getFullYear().toString()}
              suffixIcon={<DownOutlined />}
              className="custom-datepicker"
            />
          </section>
        </div>
        </div>
        <ResponsiveContainer width="100%" height={400} className="p-0 m-0">
  <BarChart data={giftData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis domain={[0, 700]} tickCount={8} />
    <Tooltip content={<CustomBarTooltip />} />
    <Bar dataKey="xValue" fill="#F82BA9" name="Bar 1" />
    <Bar dataKey="yValue" fill="#B01F78" name="Bar 2" />
  </BarChart>
</ResponsiveContainer>

      </section>
    </main>
  );
};

export default Page;

"use client";
import { useEffect, useState } from "react";

import { Table } from "antd";
import dayjs from "dayjs";
import { useGetEventsQuery } from "../../../../redux/apiSlice/eventSlice";

const EventTable = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: eventHistory, isLoading } = useGetEventsQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const events = eventHistory?.data;
  // //console.log(events);

  const columns = [
    {
      title: "Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (text) => <p>{dayjs(text).format("MMM DD, YYYY")}</p>,
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: "Recipient Name",
      dataIndex: "RecipientName",
      key: "RecipientName",
    },
    {
      title: "Gift Preferences",
      dataIndex: "giftPreferences",
      key: "giftPreferences",
      render: (text) => <p>{text.join(", ")}</p>,
    },
  ];

  return (
    <div className="overflow-x-auto p-6 bg-white shadow-lg rounded-lg">
      <section className="flex justify-between items-center pb-5">
        <h3 className="font-semibold text-xl leading-[25px]">Event History</h3>

        <div>
          <section className="flex justify-end w-full h-[48px]">
            {/* <DatePicker
              onChange={() => {}}
              placeholder={new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
              })}
              suffixIcon={<DownOutlined />}
              picker="month"
              className="custom-datepicker"
            /> */}
          </section>
        </div>
      </section>
      <Table dataSource={events} columns={columns} />
    </div>
  );
};

export default EventTable;

"use client";
import { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { DatePicker, Calendar, Badge } from "antd";
import dayjs from "dayjs";
import { useGetEventsQuery } from "../../../../redux/apiSlice/eventSlice";

export default function EventTable() {
  const { data: eventData, isLoading } = useGetEventsQuery();
  const events = eventData?.data || [];
  const [value, setValue] = useState(dayjs());

  useEffect(() => {
    if (events.length > 0) {
      const today = dayjs();
      const closestEvent = events
        .map((event) => dayjs(event.eventDate))
        .filter((eventDate) => eventDate.isAfter(today))
        .sort((a, b) => a.diff(today) - b.diff(today))[0];

      if (closestEvent) {
        setValue(closestEvent);
      }
    }
  }, [events]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const dateCellRender = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const eventList = events.filter(
      (event) => dayjs(event.eventDate).format("YYYY-MM-DD") === formattedDate
    );

    return (
      <ul className="list-none m-0 p-0">
        {eventList.map((event) => (
          <li key={event._id}>
            <Badge status="success" text={event.eventName} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-x-auto">
      <section className="flex justify-between items-center pb-5">
        <h3 className="font-semibold text-xl leading-[25px]">Event History</h3>

        <div>
          <section className="flex justify-end w-full h-[48px]">
            <DatePicker
              onChange={() => {}}
              placeholder={new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
              })}
              suffixIcon={<DownOutlined />}
              picker="month"
              className="custom-datepicker"
            />
          </section>
        </div>
      </section>

      <section>
        <Calendar
          value={value}
          onSelect={setValue}
          dateCellRender={dateCellRender}
        />
      </section>
    </div>
  );
}

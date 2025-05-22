"use client";

import { ConfigProvider, Table } from "antd";
import dayjs from "dayjs";
import { useGetEventsQuery } from "../../../../redux/apiSlice/eventSlice";

export default function EventTable() {
  // const [selectedDate, setSelectedDate] = useState(null);

  const { data: eventData, isLoading } = useGetEventsQuery();

  if (isLoading) {
    <h1>Loading...</h1>;
  }

  const events = eventData?.data;
  //console.log(events);

  const placeholder = dayjs().format("MMM YYYY");
  const onChange = (date) => {
    setSelectedDate(date ? date.format("MMM YYYY") : null);
  };

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
        <h3 className="font-semibold text-xl leading-[25px]">
          Upcoming Events List
        </h3>

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

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#feedf7",
            },
          },
        }}
      >
        <Table dataSource={events} columns={columns} />
      </ConfigProvider>
    </div>
  );
}

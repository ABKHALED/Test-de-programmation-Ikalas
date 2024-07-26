import { useEffect, useState } from "react";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function App() {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]; // days array
  const months = [
    "janv",
    "fév",
    "mars",
    "avr",
    "mai",
    "juin",
    "juil",
    "août",
    "sept",
    "oct",
    "nov",
    "déc",
  ]; // months array
  const [data, setData] = useState(null); // state to hold the api data
  const [startDate, setStartDate] = useState(""); // start date or today
  const [endDate, setEndDate] = useState(""); // the last day of the week
  const [day, setDay] = useState([]); // data containe the slots
  const [test, setTest] = useState({}); // filtering the api data
  const [finelData, setFinelData] = useState([]); // findel data that i will work with

  //////
  // seting the last date of the week by adding 7 days in ms
  useEffect(() => {
    setEndDate(new Date(startDate + 7 * 24 * 60 * 60 * 1000));
  }, [startDate]);

  /////////
  // seting the days with there month day
  useEffect(() => {
    if (startDate) {
      days.map((ele, i) => {
        return setDay((prev) => [
          ...prev,
          {
            id: i,
            day: days[new Date(startDate + i * 24 * 60 * 60 * 1000).getDay()],
            month:
              months[new Date(startDate + i * 24 * 60 * 60 * 1000).getMonth()],
            fullDate: new Date(
              startDate + i * 24 * 60 * 60 * 1000
            ).toLocaleDateString(),
            DayNumber: new Date(startDate + i * 24 * 60 * 60 * 1000).getDate(),
          },
        ]);
      });
    }
  }, [startDate]);

  ////
  // sating up the first day
  useEffect(() => {
    setStartDate(new Date().getTime());
  }, []);

  /////
  //calling the api whene the end daye is ready
  useEffect(() => {
    if (endDate) {
      getdata();
    }

    setPoint(new Date(endDate).getTime());
    setPoint2(new Date(endDate).getTime());
  }, [endDate]);

  /////////
  //geting the data from the api using axios
  const getdata = async () => {
    let data = JSON.stringify({
      startDate: `${new Date(startDate).getFullYear()}-${
        new Date(startDate).getMonth() + 1
      }-${new Date(startDate).getDate()}`,
      endDate: `${endDate.getFullYear()}-${
        endDate.getMonth() + 1
      }-${endDate.getDate()}`,
    });

    let config = {
      method: "post",
      url: " https://ikalas.com/api/v1/ik-slots ",
      headers: {
        apikey: "IK-HJQT0XWDYA2I2B000NVD",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  ///// filltring the data when the api call is done
  useEffect(() => {
    if (data) {
      const d = data.reduce((acc, obj) => {
        const property = new Date(obj["start"]).toLocaleDateString();
        acc[property] = acc[property] || [];
        acc[property].push(obj);
        return acc;
      }, {});
      setTest(d);
    }
  }, [data]);
  ////// adding the slots to the days data
  useEffect(() => {
    if (test && day) {
      day.map((ele) => {
        return setFinelData((e) => [
          ...e,
          { ...ele, slot: test[ele.fullDate] },
        ]);
      });
    }
  }, [test]);
  const [point, setPoint] = useState("");
  const [point2, setPoint2] = useState("");

  ////////
  //handiling the next week
  const nextSevenDays = () => {
    setData(null);
    setEndDate("");
    setTest([]);
    setDay([]);
    setFinelData([]);

    setStartDate(new Date(point).getTime());
  };
  ////////
  //handling the prev week
  const prevSevenDays = () => {
    setData(null);

    setTest([]);
    setDay([]);
    setFinelData([]);
    setStartDate(new Date().getTime());
  };

  ////////
  //using html and tailwindcss for the client side
  return (
    <div className="flex justify-center items-center w-full h-[100vh] ">
      <div className="md:w-[70%] w-[90%] border border-black rounded-lg h-[350px] relative">
        <div
          onClick={() => nextSevenDays()}
          className="w-[50px] h-[50px] text-[30px] border cursor-pointer flex justify-center items-center absolute top-[50%] translate-y-[-50%] right-[-80px] rounded-full border-blue-600 text-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white "
        >
          <FaAngleRight />
        </div>
        <div
          onClick={() => prevSevenDays()}
          className="w-[50px] h-[50px] text-[30px] border cursor-pointer flex justify-center items-center absolute top-[50%] translate-y-[-50%] left-[-80px] rounded-full border-blue-600 text-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white "
        >
          <FaAngleLeft />
        </div>
        <ul className="flex items-center justify-between   mb-3">
          {finelData &&
            finelData
              .sort((a, b) => a.id - b.id)
              .slice(-finelData.length, 7)
              .map((ele, i) => {
                return (
                  <li
                    key={i}
                    className="  flex w-full h-[350px] justify-between items-center flex-col gap-2 border-r border-gray-400"
                  >
                    <div className="flex  items-center flex-col h-[20%] pt-1">
                      <p className=" font-bold text-[18px] text-gray-600   ">
                        {ele.day}
                      </p>
                      <p className="font-extrabold  text-[16px] text-black   ">
                        {ele.DayNumber} {ele.month}
                      </p>
                    </div>
                    <div className="flex h-[80%] flex-col gap-2 bt-3 border-t border-t-gray-500 items-center pt-3">
                      {ele.slot ? (
                        ele.slot.map((el, i) => {
                          return el ? (
                            <p
                              key={i}
                              className="w-[90px] h-[35px] rounded-xl flex justify-center items-center bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:text-white hover:bg-black"
                            >
                              {`${new Date(el.start).getHours()}:${
                                new Date(el.start).getMinutes() === 0
                                  ? `${new Date(el.start).getMinutes()}0`
                                  : new Date(el.start).getMinutes()
                              }  `}
                            </p>
                          ) : (
                            <p>-</p>
                          );
                        })
                      ) : (
                        <p
                          key={i}
                          className="w-[90px] h-[35px] rounded-xl flex justify-center items-center bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:text-white hover:bg-black"
                        >
                          -
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
}

export default App;

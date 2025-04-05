import { useEffect, useState } from "react";
import { UserApi } from "../service/UserApi";
import { toast } from "react-toastify";

const PollsStats = () => {
  const [newPoll, setNewPoll] = useState("");
  const [polls, setPolls] = useState<string[]>([]);

  useEffect(()=>{
    const fetchPolls = async () => {
      const response = await UserApi.getPull();
      setPolls(response);
    };
    fetchPolls();
  },[])

  const handleAddPoll = async () => {
    if (newPoll.trim() !== "") {
      try {
        const response = await UserApi.AddPull(newPoll);
        setPolls([...polls, response]);
        setNewPoll("");
        toast.success("Poll added successfully!");
      } catch (error) {
        console.error("Error adding poll:", error);
      }
    }
  };

  return (
    <div className=" bg-gray-100 p-8  h-[85vh] overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Add Poll Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add a New Poll
          </h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={newPoll}
              onChange={(e) => setNewPoll(e.target.value)}
              placeholder="Enter a new poll question..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddPoll}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Add Poll
            </button>
          </div>
        </div>

        {/* Polls List Section */}
        <div className="bg-white  rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            All Polls
          </h2>
            {polls?.length > 0 ? (
            <ul className="space-y-4 p-2">
              {polls?.map((poll: any, index) => {
              const totalVotes = poll.accept_count + poll.refuse_count;
              const acceptPercentage = totalVotes > 0 ? (poll.accept_count / totalVotes) * 100 : 0;
              const refusePercentage = totalVotes > 0 ? (poll.refuse_count / totalVotes) * 100 : 0;

              return (
              <li
              key={poll.id}
              className="p-4 border border-gray-300 rounded-lg bg-gray-50"
              >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{poll.question}</span>
                <span className="text-[#a78200] font-semibold">
                {acceptPercentage.toFixed(1)}% Accept
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                className="bg-[#a78200] h-2 rounded-full"
                style={{ width: `${acceptPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#606c38] font-semibold">
                {refusePercentage.toFixed(1)}% Refuse
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                className="bg-[#606c38] h-2 rounded-full"
                style={{ width: `${refusePercentage}%` }}
                ></div>
              </div>
              </li>
              );
              })}
            </ul>
            ) : (
            <p className="text-gray-500">No polls available. Add a new poll!</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default PollsStats;
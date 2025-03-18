import { useEffect, useState } from "react";
import { UserApi } from "../service/UserApi";
import Layout from "../layouts/layout";

export default function Polls() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    UserApi.getPull()
      .then((response) => setPolls(response))
      .catch((error) => console.error("Error fetching polls:", error));
  }, []);

  const handleVote = (pollId, voteType) => {
    UserApi.AddVote(pollId, voteType)
      .then(() => {
        // Refresh polls after voting
        UserApi.getPull()
          .then((response) => setPolls(response))
          .catch((error) =>
            console.error("Error fetching polls:", error.response.data)
          );
      })
      .catch((error) => {
        console.error("Error voting:", error.response.data);
        alert(error.response.data.message);
      });
  };

  const calculatePercentage = (count, total) => {
    return total === 0 ? 0 : ((count / total) * 100).toFixed(1);
  };

  return (
    <>
      <Layout>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            Polls
          </h2>
          {polls?.length === 0 ? (
            <p className="text-gray-500 text-center">No polls available.</p>
          ) : (
            <ul className="space-y-6">
              {polls?.map((poll) => {
                const totalVotes = poll?.accept_count + poll?.refuse_count;
                const acceptPercentage = calculatePercentage(
                  poll?.accept_count,
                  totalVotes
                );
                const refusePercentage = calculatePercentage(
                  poll?.refuse_count,
                  totalVotes
                );

                return (
                  <li
                    key={poll?.id}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      {poll?.question}
                    </h3>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-green-600 font-medium">
                          Accept: {acceptPercentage}%
                        </p>
                        <p className="text-red-600 font-medium">
                          Refuse: {refusePercentage}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-500 h-4 rounded-l-full"
                          style={{ width: `${acceptPercentage}%` }}
                        ></div>
                        <div
                          className="bg-red-500 h-4 rounded-r-full"
                          style={{ width: `${refusePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleVote(poll?.id, "accept")}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleVote(poll?.id, "refuse")}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        Refuse
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Layout>
    </>
  );
}
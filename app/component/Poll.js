"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProfile } from "@farcaster/auth-kit";

const PollCreator = () => {
  const [pollTitle, setPollTitle] = useState("");
  const [choices, setChoices] = useState([{ id: 1, value: "" }]);
  const [polls, setPolls] = useState([]);
  const {
    isAuthenticated,
    profile: { bio, displayName, fid, pfpUrl, username },
  } = useProfile();

  useEffect(() => {
    getPolls();
  }, []);

  const getPolls = async () => {
    // async function GET(req, res) {
    //   const pollLink = req;
    //   console.log(pollLink, "pollLink");
    // }
    // GET();
    await axios
      .get("https://frame-backend-z2b9.onrender.com/polls")
      .then((res) => {
        console.log(res, "res");
        setPolls(res.data.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const handleAddChoice = () => {
    const newChoice = { id: choices.length + 1, value: "" };
    setChoices([...choices, newChoice]);
  };

  const handleRemoveChoice = (id) => {
    setChoices(choices.filter((choice) => choice.id !== id));
  };

  const handleChangeChoice = (id, value) => {
    const updatedChoices = choices.map((choice) =>
      choice.id === id ? { ...choice, value } : choice
    );
    setChoices(updatedChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("https://frame-backend-z2b9.onrender.com/polls/add", {
        title: pollTitle,
        choices: choices,
        fid: fid,
      })
      .then((res) => {
        alert("Poll Created!");
        console.log(res, "res");
      })
      .catch((err) => {
        alert("Something went wrong!");
        console.log(err, "err");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* {isAuthenticated && (
    
      )} */}
      <>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pollTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Poll Title
            </label>
            <input
              type="text"
              id="pollTitle"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            {choices.map((choice) => (
              <div key={choice.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) =>
                    handleChangeChoice(choice.id, e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={`Choice ${choice.id}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveChoice(choice.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddChoice}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Choice
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Poll
            </button>
          </div>
        </form>
        <div>
          <h1>Polls:</h1>
          {polls.map((poll, index) => {
            return (
              <>
                <p>
                  {index}.{poll.title}
                </p>
                <p> {`https://poll-frame.vercel.app/${poll._id}`}</p>
              </>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default PollCreator;

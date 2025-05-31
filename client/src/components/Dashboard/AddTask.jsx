import React, { useState } from "react";
import axios from "axios";

const AddTask = ({ setAddTaskDiv }) => {

  
  const [values, setValues] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "yetToStart",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/addTask",
        values,
        { withCredentials: true }
      );
      if (res.data && res.data.success) {
        setAddTaskDiv("hidden");
        // Reset the form values
        setValues({
          title: "",
          description: "",
          priority: "low",
          status: "yetToStart",
        });

        // Hide the add task UI

        alert(res.data.success);
      }

      // Or just log the useful part
      console.log("Response data:", res.data);
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  return (
    <div className="bg-white rounded px-4 py-4 w-[40%]">
      <h1 className="text-center font-semibold text-xl">Add Task{""}</h1>
      <hr className="mb-4 mt-2" />
      <form className="flex flex-col gap-4">
        <input
          type="text"
          className="border px-2 py-1 rounded border-zinc-300 outline-none"
          placeholder="Title"
          name="title"
          value={values.title}
          onChange={change}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <h3 className="mb-2">Select Priority</h3>
            <select
              name="priority"
              id=""
              className="border px-2 py-1 rounded border-zinc-300 outline-none w-full"
              onChange={change}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <div className="w-full">
              <h3 className="mb-2">Select Status</h3>
              <select
                name="status"
                id=""
                className="border px-2 py-1 rounded border-zinc-300 outline-none w-full"
                onChange={change}
              >
                <option value="yetToStart">Yet to Start</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <textarea
          name="description"
          placeholder="Description"
          className="border px-2 py-1 rounded border-zinc-300 outline-none h-[25vh]"
          value={values.description}
          onChange={change}
        ></textarea>

        <div className="flex items-center justify-between gap-4">
          <button
            className="w-full bg-blue-800 py-2 hover:bg-blue-700 transition-all duration-300 text-white rounded "
            onClick={addTask}
          >
            Add Task{""}
          </button>
          <button
            className="w-full border border-black  py-2 hover:bg-zinc-300 transition-all duration-300 text-black rounded "
            onClick={() => setAddTaskDiv("hidden")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;

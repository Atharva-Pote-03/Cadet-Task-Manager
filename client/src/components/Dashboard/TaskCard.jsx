import React from "react";
import axios from "axios";


const TaskCard = ({data}) => {

  const showEditDiv = (e,id) =>{
    e.preventDefault();
    window.sessionStorage.setItem("editTaskId",id);
    window.location.reload();
  }

  return (
    <button className="bg-white rounded px-4 w-[100%] py-2 hover:shadow transition-all duration-300"
     onClick={(event=>showEditDiv(event, data._id))}>
      <div className="flex item-center justify-between ">
        <h1 className="">{data.title}</h1>
        <div className = {`text-sm ${data.priority === "low" ? "text-green-500 bg-green-100" : data.priority === "medium" ? "text-yellow-500 bg-yellow-100" : "text-red-500 bg-red-100" } px-2 rounded-full`}>
          <p>{data.priority}</p>
        </div>
      </div>
      <hr className="my-2" />
      <p className="text-sm text-zinc-500 text-start">{data.description}</p>
    </button>
  );
};

export default TaskCard;

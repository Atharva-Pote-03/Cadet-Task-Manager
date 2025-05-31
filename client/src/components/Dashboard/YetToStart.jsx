import React from 'react'
import TaskCard from './TaskCard';

const YetToStart = ({task}) => {
  // console.log(task,"Yet to start");
  return (
    <div className='flex flex-col gap-2'>
      {task && task.map((items, i) => (
  <TaskCard key={i} data={items} />
))}
    
    </div>
  )
}

export default YetToStart
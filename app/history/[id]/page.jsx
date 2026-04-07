"use client"

import React  from 'react'
import { format } from "date-fns";
import { ChevronDownIcon, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getHistoryByDate } from '@/app/actions';
import {convertToRealFormat} from '@/components/Logger';


const page = () => {

    // const id = params.id ;
    const [date, setDate] = React.useState(new Date());
    const [isRunning , setIsRunning] = React.useState(false);
    const [historyData , setHistoryData] = React.useState([]) ;



    const showHistory = async (day) => {
        setIsRunning(true) ;
        setDate(day);
        const formattedDate = format(day, "yyyy-MM-dd");
        const res = await getHistoryByDate(formattedDate) ;
        console.log("selected date :" , formattedDate) ;
        console.log("history data :" , res) ;
        setHistoryData(res);
        setIsRunning(false);
        
    }
 
  return (
    <>
    <header className='flex flex-row justify-end mt-5'><Button variant="ghost" size="lg"
        className="bg-violet-200 hover:bg-violet-300 mr-5 "
        onClick={() => window.history.back()}>
         Back to Logger </Button></header>
    

    <div className=' m-10'>
      
        <div className='mx-auto text-lg bg-red-100 p-8 rounded-full'>
            pick a day :  
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => showHistory(selectedDate)}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </div>

    <div className='mt-10'>
      {isRunning ? <p>Loading...</p> : historyData.length > 0 ? (
        <div className='mt-5 bg-violet-100 p-5 rounded-lg mx-auto w-full max-w-3/4'>
          <div className='flex flex-row  text-xl font-bold text-violet-500 mb-5'>
            <p className="basis-1/2 ml-5"> name </p>
          <p className="  basis-1/2 text-end mr-5 "> duration </p>
          </div>
          
        {historyData.map((task) =>(
        <div key={task.id} className=' flex p-2' >
          <div className="flex flex-row basis-1/2 items-center flex flex-col ">
                <Timer className="mx-3 text-gray-500" />
                <p className="text-2xl mr-5">{task.name} </p>
                {task.tag && (
                  <span className="text-sm text-gray-700 bg-red-200 rounded-full px-2 py-1">
                    {task.tag}
                  </span>
                )}
                
              </div>
              <div className='text-xl flex flex-col items-end mr-10 basis-1/2'>
                  <p>{
                  convertToRealFormat(task.duration)}</p>
                  </div>
                

        </div>))}
        </div>
        
        
        
      ) : (
        <p>No tasks found for the selected date.</p>
      )}
    </div>
    </div>
    </>
  )

}

export default page;


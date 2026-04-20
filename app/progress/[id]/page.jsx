"use client";

import {  getCategories, getTasksInWeek } from "@/app/actions";
import ProgressChart from "@/components/ProgressChart";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import React, { useEffect } from "react";


const page =  () => {
    const [taskData, setTaskData] = React.useState([]);
    const [categories, setCategories] = React.useState([]);



    useEffect(() => {
        const fetchTasks = async () => {
            const Data = await getTasksInWeek();
            const cats = await getCategories();
            setCategories(cats);
            setTaskData(Data);
            
        };
        fetchTasks();
        
    }, []);
      
  return (
    <>
      <header className="flex flex-row justify-end mt-5">
        <Button
          variant="ghost"
          size="lg"
          className="bg-violet-200 hover:bg-violet-300 mr-5 "
          onClick={() => window.history.back()}
        >
          Back to Logger{" "}
        </Button>
      </header>

      <div className=" m-10 ">
        <ProgressChart tasks={taskData} categories={categories} />
        
      </div>
    </>
  );
};

export default page;

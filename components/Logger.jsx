"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleCheck, Pause, Play, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addTask } from "@/app/actions";

const Logger = ({ user, userTasks }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [stoppedAt, setStoppedAt] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [counter, setCounter] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [currentTaskName, setCurrentTaskName] = useState("");

  useEffect(() => {
    if (!isRunning) return;

    let interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTasks(userTasks);
  }, [userTasks]);

  const convertToRealFormat = (time) => {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!user) {
      alert("Sign in first");
      return;
    }
    if (isRunning) return;
    let startTime = Date.now();
    setStartedAt(startTime);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (!isRunning) return null;
    console.log("STOPPING TIMER...");
    setIsRunning(false);
    let stopTime = Date.now();
    console.log("=====> Started at:", startedAt);
    console.log("=====> Stopped at:", stopTime);
    setStoppedAt(stopTime);
    console.log("stoppedAt state updated:", stoppedAt);
    let duration = (stopTime - startedAt) / 1000;
    console.log("=====> Duration in seconds:", duration);
    const newTimeEntries = [...timeEntries, duration];
    setTimeEntries(newTimeEntries);
    console.log("Current time entries:", newTimeEntries);
    return duration;
  };

  const calculateTime = async () => {
    if (!startedAt) return;
    if (!currentTaskName) {
      alert("set a name for your task asshole");
      return;
    }
    // console.log(isRunning);
    let currentDuration = 0;
    if (isRunning) {
      currentDuration = stopTimer();
    }
    console.log("Stopped at:", stoppedAt);
    console.log("Calculating total time...");

    let sum = 0;
    // Add all existing time entries
    for (let time of timeEntries) {
      sum += time;
    }
    // Add the current session duration if we just stopped
    if (currentDuration) {
      sum += currentDuration;
    }

    console.log("TOTAL DURATION:", sum);

    saveTask(sum);

    setCounter(0);
    setStartedAt(null);
    setTimeEntries([]);
  };

  const saveTask = async (duration) => {
    let newTask = { name: currentTaskName, duration: duration };
    setCurrentTaskName("");
    const res = await addTask(newTask);
    setTasks([...tasks, { name: res.name, duration: res.duration }]);
    console.log(res);
    console.log(newTask);
  };

  const showTime = () => {
    return convertToRealFormat(counter);
  };

  return (
    <div className="mx-auto max-w-7xl mx-auto  my-10 text-2xl">
      <div className="text-center">
        <div className=" ">{!startedAt ? "00:00:00" : showTime()}</div>

        <Input
          required
          value={currentTaskName}
          onChange={(e) => setCurrentTaskName(e.target.value)}
          placeholder={"Task's name ..."}
          className="w-64 m-10"
        ></Input>
        <Button
          onClick={startTimer}
          size="lg"
          className="rounded-full bg-green-500"
          variant="outline"
        >
          <Play />
        </Button>
        <Button
          onClick={stopTimer}
          size="lg"
          className="rounded-full bg-red-500"
          variant="outline"
        >
          <Pause />
        </Button>
        <Button
          onClick={calculateTime}
          size="lg"
          className="rounded-full bg-purple-500"
          variant="outline"
        >
          <CircleCheck />
        </Button>
      </div>

      <div className=" flex flex-col text-xl bg-gray-100 p-5 rounded-lg mx-auto">
        <p className=" text-center bg-rose-100 font-bold text-red-500">
          {tasks.length > 0
            ? "total time : " +
              convertToRealFormat(
                tasks
                  .map((task) => task.duration)
                  .reduce((acc, duration) => acc + duration),
              )
            : ""}
        </p>
        <p className="font-bold text-violet-500 mb-5">Tasks : </p>

        <div className="flex flex-col ml-5 gap-2">
          {tasks.map(({ duration, name }) => (
            <div className="flex flex-row" key={name}>
              <div className="flex flex-row basis-1/2 items-center">
                <Timer className="mx-3 text-gray-500" />

                  <p className="  text-2xl mr-5  ">{name} </p>
                </div>
                <div className="flex flex-col">
                  <p className=" text-2xl  ">
                duration : {convertToRealFormat(duration)}
              </p></div>
                  
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logger;

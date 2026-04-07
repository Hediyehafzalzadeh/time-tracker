"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleCheck, Edit, Pause, Play, Timer, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addTask, deleteTask } from "@/app/actions";
import ManualDialog from "./ManualDialog";
import ConfirmationDialog from "./ConfirmationDialog";

const Logger = ({ user, userTasks }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [stoppedAt, setStoppedAt] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [counter, setCounter] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [currentTaskName, setCurrentTaskName] = useState("");
  const [currentTaskTag, setCurrentTaskTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);


  useEffect(() => {
    if (!isRunning) return;

    let interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTasks(userTasks);
  }, []);

  const startTimer = () => {
    if (!user) {
      toast("You need to sign in first");
      return null;
    }
    if (isRunning) return;
    let startTime = Date.now();
    setStartedAt(startTime);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (!isRunning) return null;

    setIsRunning(false);
    let stopTime = Date.now();

    setStoppedAt(stopTime);
    let duration = (stopTime - startedAt) / 1000;
    const newTimeEntries = [...timeEntries, duration];

    setTimeEntries(newTimeEntries);
    return duration;
  };

  const calculateTime = async () => {
    if (!startedAt) return;
    if (!currentTaskName) {
      toast("set a name for your task ");
      return null;
    }
    let currentDuration = 0;
    if (isRunning) {
      currentDuration = stopTimer();
    }
    let sum = timeEntries.reduce((acc, t) => acc + t, 0);
   
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
    let newTask = {
      name: currentTaskName,
      duration: duration,
      tag: currentTaskTag,
    };
    setCurrentTaskName("");
    setCurrentTaskTag("");
    setLoading(true);
    const res = await addTask(newTask);
    setTasks([
      ...tasks,
      { name: res.name, duration: res.duration, tag: res.tag },
    ]);
    toast("Task saved successfully");

    console.log(res);
    console.log(newTask);
    setLoading(false);
  };

  const showTime = () => {
    return convertToRealFormat(counter);
  };

  const deleteTaskHandler = async (task) => {
    setLoading(true);
    const res = await deleteTask(task);
    console.log(res);
    setTasks(
      tasks.filter(
        (t) =>
          t.name !== task.name ||
          t.duration !== task.duration ||
          t.tag !== task.tag,
      ),
    );
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl mx-auto my-10 text-2xl">
      <div className="flex flex-row text-center mx-auto mb-5 bg-mauve-100 p-5 rounded-lg w-full max-w-1/2 ">
        <div>
          <Field className="w-64 m-10">
            <FieldLabel htmlFor="input-demo-api-key">Task's Name</FieldLabel>
            <Input
              required
              value={currentTaskName}
              onChange={(e) => setCurrentTaskName(e.target.value)}
              placeholder={"Task's name ..."}
            ></Input>
          </Field>
          <Field className="w-64 m-10">
            <FieldLabel htmlFor="input-demo-api-key">
              Task's Category
            </FieldLabel>
            <Input
              required
              value={currentTaskTag}
              onChange={(e) => setCurrentTaskTag(e.target.value)}
              placeholder={"Task's category ..."}
            ></Input>
          </Field>
            <ManualDialog
              onAdd={(task) => {
                setManualDialogOpen(false);
                saveTask((task.finishedAt.getTime() - task.startedAt.getTime()) / 1000);
                console.log(task);
              }}
            />
          
        </div>
        <div className="my-auto ml-5">
          <div className="mb-5 ">{!startedAt ? "00:00:00" : showTime()}</div>
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
            className="rounded-full bg-violet-400"
            variant="outline"
            disabled={loading}
          >
            <CircleCheck />
          </Button>
        </div>
      </div>

      <div className=" flex flex-col text-xl bg-mauve-100 p-5 rounded-lg mx-auto w-full max-w-3/4">
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
        <div className="font-bold flex flex-row text-violet-500 mb-5">
          <p className="basis-1/2 ml-10">Task </p>
          <p className="basis-1/2 text-right mr-10">Duration </p>
        </div>

        <div className="flex flex-col ml-5 gap-2">
          {tasks.map((task) => (
            <div className="flex flex-row bg-white p-2 rounded-lg" key={task.name+task.duration}>
              <div className="flex flex-row basis-1/2 items-center">
                <Timer className="mx-3 text-gray-500" />

                <p className="text-2xl mr-5">{task.name} </p>
                {task.tag && (
                  <span className="text-sm text-gray-700 bg-red-200 rounded-full px-2 py-1">
                    {task.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end basis-1/2">
                <p className=" text-2xl  ">{convertToRealFormat(task.duration)}</p>
              </div>
              <ConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => deleteTaskHandler(task)}
                
              />
              <Button
                onClick={() => editTaskHandler(task)}
                size="lg"
                className="mx-3 rounded-full bg-green-100"
                variant="outline"
              >
                <Edit />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logger;


export function convertToRealFormat(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
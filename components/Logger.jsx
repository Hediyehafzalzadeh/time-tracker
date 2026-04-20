"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleCheck, Edit, Pause, Play, Timer, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addTask, deleteTask, updateTask } from "@/app/actions";
import ManualDialog from "./ManualDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import { set } from "date-fns";
import EditTaskDialog from "./EditTaskDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AddCategories from "./AddCategories";

const Logger = ({ user, userTasks, categories }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [counter, setCounter] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [currentTaskName, setCurrentTaskName] = useState("");
  const [currentTaskTag, setCurrentTaskTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    let interval = setInterval(() => {
      setCounter(
        (Date.now() - parseInt(localStorage.getItem("startedAt"))) / 1000,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTasks(userTasks);
  }, []);

  useEffect(() => {
    const startTime = localStorage.getItem("startedAt");
    const saved = localStorage.getItem("saved");
    const c = localStorage.getItem("counter");
    const timeEntries = localStorage.getItem("timeEntries");
    if (c) {
      setCounter(parseInt(c));
    }

    if (!timeEntries) {
      localStorage.setItem("timeEntries", JSON.stringify([]));
    }
    if (startTime && saved === "false") {
      console.log(
        "start time found in localStorage, resuming timer",
        startTime,
      );
      setIsRunning(true);
    }
  }, []);

  const startTimer = () => {
    if (!user) {
      toast("You need to sign in first");
      return null;
    }
    if (isRunning) return;

    console.log("start timer");
    let startTime = Date.now();
    localStorage.setItem("startedAt", startTime);
    localStorage.setItem("saved", false);

    setIsRunning(true);
  };

  const stopTimer = () => {
    if (!isRunning) return null;

    setIsRunning(false);
    let stopTime = Date.now();
    let startedAt = parseInt(localStorage.getItem("startedAt"));
    let timeEntries = JSON.parse(localStorage.getItem("timeEntries"));
    console.log(timeEntries);
    let duration = (stopTime - startedAt) / 1000;
    const newTimeEntries = [...timeEntries, duration];
    localStorage.removeItem("startedAt");
    localStorage.setItem("timeEntries", JSON.stringify(newTimeEntries));
    localStorage.setItem("counter", counter);

    return duration;
  };

  const calculateTime = async () => {

    if (localStorage.getItem("saved") === "true") return null;

    if (!currentTaskName) {
      toast("set a name for your task ");
      return null;
    }

    if (totalTime + counter > 24 * 3600) {
      toast("Total time for the day cannot exceed 24 hours");
      return null;
    }

    let currentDuration = 0;
    if (isRunning) {
      currentDuration = stopTimer();
    }
    let timeEntries = JSON.parse(localStorage.getItem("timeEntries"));
    console.log("time entries :", timeEntries);
    let sum = timeEntries.reduce((acc, t) => acc + t, 0);

    // if (currentDuration) {
    //   sum += currentDuration;
    // }

    console.log("TOTAL DURATION:", sum);
    saveTask(sum);
    localStorage.removeItem("startedAt");
    localStorage.setItem("timeEntries", JSON.stringify([]));
    localStorage.setItem("saved", true);
    localStorage.removeItem("counter");
    setCounter(0);
  };

  const calculateTotalTime = () => {
    const total = tasks
      .map((task) => task.duration)
      .reduce((acc, duration) => acc + duration, 0);
    setTotalTime(total);
    return total;
  };

  const saveTask = async (duration) => {
    if (!currentTaskName) {
      toast("set a name for your task ");
      return null;
    }
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
    const checkSaved = localStorage.getItem("saved");

    if (isRunning || checkSaved === "false") {
      return convertToRealFormat(counter);
    }

    return "00:00:00";
  };

  const deleteTaskHandler = async (task) => {
    setLoading(true);
    const res = await deleteTask(task);
    if (!res) {
      toast("Failed to delete task");
      setLoading(false);
      return;
    } else {
      setTasks(
        tasks.filter(
          (t) =>
            t.name !== task.name ||
            t.duration !== task.duration ||
            t.tag !== task.tag,
        ),
      );
    }

    setLoading(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    localStorage.removeItem("startedAt");
    localStorage.setItem("timeEntries", JSON.stringify([]));
    localStorage.setItem("saved", true);
    localStorage.removeItem("counter");
    setCounter(0);
  };

  const editTaskHandler = async (task, updatedTask) => {
    setLoading(true);
    console.log("task id :", task.id);
    const res = await updateTask(task, updatedTask);
    // const updated = tasks.filter((t) => t.id !== task.id);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, ...updatedTask } : t)),
    );
    console.log(updatedTask, res);
    setLoading(false);
  };

  const findCategortyColor = (categoryName) => {
    const category = categories.find((c) => c.name === categoryName);
    console.log(category);
    return category ? category.color : "hsl(0, 0%, 80%)";
  }


  return (
    <div className="mx-auto flex max-w-7xl mx-auto items-stretch my-10 text-2xl gap-5 h-auto flex-col md:flex-row">
      <div className="flex basis-1/2 h-full text-center mx-auto mb-5 bg-mauve-100 p-5 rounded-lg  ">
        <div>
          <Field className="w-64 m-10 ">
            <FieldLabel className="font-semibold" htmlFor="input-demo-api-key">
              Task's Name
            </FieldLabel>

            <Input
              required
              value={currentTaskName}
              onChange={(e) => setCurrentTaskName(e.target.value)}
              placeholder={"Task's name ..."}
            ></Input>
          </Field>
          <AddCategories
            categories={categories}
            currentTaskTag={currentTaskTag}
            setCurrentTaskTag={setCurrentTaskTag}
          />
          <ManualDialog
            className=""
            open={!!manualDialogOpen}
            onClose={setManualDialogOpen}
            onAdd={(task) => {
              saveTask(
                (task.finishedAt.getTime() - task.startedAt.getTime()) / 1000,
              );

              console.log(task);
            }}
          />
        </div>
        <div className="my-auto ml-5">
          <div className="mb-5 ">{showTime()}</div>
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
          <div className="mt-3">
            <Button
              onClick={() => resetTimer()}
              size="lg"
              className="bg-red-400"
              variant="outline"
            >
              Reset Timert
            </Button>
          </div>
        </div>
      </div>

      <div className="md:text-left md:text-xl text-sm flex flex-col basis-1/2 h-full my-auto text-xl bg-mauve-100 p-5 rounded-lg mx-auto  ">
        <p className="text-center    bg-rose-100 font-bold text-red-500">
          {tasks.length > 0
            ? "total time : " + convertToRealFormat(calculateTotalTime())
            : ""}
        </p>
        <div className="font-bold flex flex-row text-violet-500 mb-5">
          <p className="basis-1/2 ml-10">Task </p>
          <p className="basis-1/2 text-right mr-10">Duration </p>
        </div>

        <div className="flex flex-col ml-5 gap-2">
          {tasks.map((task) => (
            <div
              className="flex flex-row bg-white p-2 rounded-lg"
              key={task.name + task.duration}
            >
              <div className="flex flex-row basis-1/2 items-center">
                <Timer className="mx-3 text-gray-500" />

                <p className="text-2xl mr-5">{task.name} </p>
                {
                task.tag && (
                  <span style={{ backgroundColor: findCategortyColor(task.tag) }} className={`text-sm text-gray-700 rounded-full px-2 py-1`}>
                    {task.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end basis-1/2">
                <p className="text-2xl ">
                  {convertToRealFormat(task.duration)}
                </p>
              </div>
              <ConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => deleteTaskHandler(task)}
              />
              <EditTaskDialog
                task={task}
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => setConfirmOpen(false)}
                onAdd={(updatedTask) => {
                  editTaskHandler(task, updatedTask);
                }}
              />
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
}

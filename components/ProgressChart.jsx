"use client";

import React from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
export const description = "A stacked bar chart with a legend";
export const iframeHeight = "600px";
export const containerClassName =
  "[&>div]:w-full [&>div]:max-w-md flex items-center justify-center min-h-svh";

const chartConfig = {};

const ProgressChart = ({ tasks, categories }) => {
  const categoryMap = {};
  const taskMap ={};

  const [activeButton, setActiveButton] = React.useState(null);
  const chartData = tasks.map((t) => ({
    date: new Date(t.created_at),
    name: t.name,
    duration: t.duration / 1000,
    category: t.tag,
  }));

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const initializedDataForNameBased = days.map((day) => ({
    date: day,
    dayTasks: {},
  }));

  for (const task of chartData) {
    const dayIndex = new Date(task.date).getDay();
    const dayName = days[dayIndex];
    const target = initializedDataForNameBased.find((d) => d.date === dayName);

    if (target) {
      target.dayTasks[task.name] = {
        duration: task.duration,
        category: task.category,
      };
   
    }
  }

  const initializedDataForCategoryBased = days.map((day) => ({
    date: day,
    categories: {},
  }));

  for (const task of chartData) {
    const dayIndex = new Date(task.date).getDay();
    const dayName = days[dayIndex];
    const target = initializedDataForCategoryBased.find(
      (d) => d.date === dayName,
    );
    const catName = task.category?.trim().toLowerCase();
    const catColor =
      categories.find((c) => c.name === catName)?.color || getRandomColor();

    if (!target.categories[catName]) {
      target.categories[catName] = {
        duration: task.duration,
        color: catColor,
      };
    } else {
      const existing = target.categories[catName];
      existing.duration += task.duration;
    }
  }

  initializedDataForCategoryBased.forEach((day) => {
    Object.entries(day.categories).forEach(([name, value]) => {
      categoryMap[name] = value.color;
    });
  });
  initializedDataForNameBased.forEach((day) => {
    Object.entries(day.dayTasks).forEach(([name, value]) => {
      taskMap[name] = value.duration;
    });
  });


  const taskDataFinal = initializedDataForNameBased.map((day) => {
    const row = { date: day.date };

    Object.entries(day.dayTasks).forEach(([name, value]) => {
      row[name] = value.duration;
    });

    return row;
  });


  const chartDataFinal = initializedDataForCategoryBased.map((day) => {
    const row = { date: day.date };

    Object.entries(day.categories).forEach(([name, value]) => {
      row[name] = value.duration;
    });

    return row;
  });

  const makeChartBasedOnCategories = () => {
    setActiveButton("category");
  };
  const makeChartBasedOnNames = () => {
    setActiveButton("name");
  };

  return (
    <div>
      <Button
        onClick={() => {
          makeChartBasedOnCategories();
        }}
        className="m-4 p-2 bg-violet-100 hover:bg-violet-200 text-black mx-auto"
      >
        Progress Chart - Based on categories
      </Button>

      <Button
        onClick={() => {
          makeChartBasedOnNames();
        }}
        className="m-4  p-2 bg-violet-100 hover:bg-violet-200 text-black mx-auto"
      >
        Progress Chart - Based on names
      </Button>

      {(!tasks || tasks.length === 0) && <div>Loading...</div>}
      {activeButton === "name" && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Progress chart - Based on task name</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={taskDataFinal}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                {Object.entries(taskMap).map(([task]) => (
                  <Bar key={task} dataKey={task} stackId="a" fill={getRandomColor()} />
                ))}

               

                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                  defaultIndex={1}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {activeButton === "category" && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Progress chart - Based on task category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartDataFinal}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />

                {Object.entries(categoryMap).map(([cat, color]) => (
                  <Bar key={cat} dataKey={cat} stackId="a" fill={color} />
                ))}
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                  defaultIndex={1}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressChart;

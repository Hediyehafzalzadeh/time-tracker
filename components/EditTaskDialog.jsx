import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import AddCategories from "./AddCategories";

const EditTaskDialog = ({task , onAdd , onClose , onConfirm , categories}) => {
    const [startedAt, setStartedAt] = React.useState("");
    const [finishedAt, setFinishedAt] = React.useState("");
    const [currentTaskName, setCurrentTaskName] = React.useState("");
    const [currentTaskTag, setCurrentTaskTag] = React.useState("");


    const edit = async() =>{

        console.log("edit task with data :" , {startedAt, finishedAt, currentTaskName, currentTaskTag});

        if (!startedAt || !finishedAt || new Date(startedAt) >= new Date(finishedAt)) return null;
        onConfirm();

        onAdd({

            name : currentTaskName ,
            tag : currentTaskTag ,
            duration : (new Date(finishedAt) - new Date(startedAt)) / 1000
           
        })
    }

  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-orange-200"
            >
              <Edit />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Name</Label>
                <Input onChange={(e) => setCurrentTaskName(e.target.value)} id="name-1" name="name" defaultValue={task.name} />
              </Field>
              <Field>
                <AddCategories categories={categories} currentTaskTag={currentTaskTag} setCurrentTaskTag={setCurrentTaskTag} />
              </Field>
              <Field>
                <Label htmlFor="started-at">Started at</Label>
                <Input
                  onChange={(e) => setStartedAt(e.target.value)}
                  id="started-at"
                  name="started-at"
                  type="datetime-local"
                />
              </Field>

              <Field>
                <Label htmlFor="finished-at">Finished at</Label>
                <Input
                  onChange={(e) => setFinishedAt(e.target.value)}
                  id="finished-at"
                  name="finished-at"
                  type="datetime-local"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={() => edit()}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default EditTaskDialog;

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ManualDialog = ({onAdd}) => {
    const [startedAt, setStartedAt] = React.useState("");
    const [finishedAt, setFinishedAt] = React.useState("");


    const saveTaskManually = async () => {
        if (!startedAt || !finishedAt) return null;

        onAdd({
            startedAt : new Date(startedAt),
            finishedAt : new Date(finishedAt)
        }) 

        }
  return (
    <div><Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Add Time Manually</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Time</DialogTitle>
            <DialogDescription>
                Enter the start and end time to add a time entry manually.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="started-at">Started at</Label>
              <Input onChange={(e) => setStartedAt(e.target.value)} id="started-at" name="started-at" type="datetime-local" />
            </Field>
            
            <Field>
              <Label htmlFor="finished-at">Finished at</Label>
              <Input onChange={(e) => setFinishedAt(e.target.value)} id="finished-at" name="finished-at" type="datetime-local" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={() => saveTaskManually()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog></div>
  )
}

export default ManualDialog


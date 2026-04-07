import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from 'lucide-react';


const ConfirmationDialog = ({  onClose, onConfirm }) => {
  return (
     <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button size="lg"
                className="mx-3 rounded-full bg-red-300"
                variant="outline">
            <Trash />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => onClose()} variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => onConfirm()} type="submit">Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    
  )
}

export default ConfirmationDialog


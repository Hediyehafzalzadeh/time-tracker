"use client"

import React from 'react'
import { Button } from './ui/button'

const ShowProgressButton = () => {
  return (
    <div>
        <Button
              variant="ghost"
              onClick = {() => {}}
              size="lg"
              className=" bg-pink-200 hover:bg-pink-400 mx-2"
            >
               Show Progress
            </Button></div>
  )
}

export default ShowProgressButton
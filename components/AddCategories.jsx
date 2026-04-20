import React, { useEffect } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { addCategory } from "@/app/actions";

const AddCategories = ({ categories, currentTaskTag, setCurrentTaskTag }) => {
  const [currentCategories, setCurrentCategories] = React.useState([]);
  const [newCategory , setNewCategory ] = React.useState("") ;
  const inputRef = React.useRef(null);

  useEffect(() => {
    setCurrentCategories(categories.map((category) => category.name));
     }, [categories])

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return null;

    let newCat = {
      name : newCategory ,
      color : getRandomColor() ,
    }
    const res = await addCategory(newCat);
    if(currentCategories.includes(newCategory)) {
    setNewCategory("");
    inputRef.current?.blur()
    return null ;} 
    let updatedCategories = [...currentCategories , newCat];
    setCurrentCategories(updatedCategories);
    setNewCategory("");
    inputRef.current?.blur();

  };

    const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  };



  return (
    <div>
      <Field className="w-64 m-10">
        <FieldLabel htmlFor="input-demo-api-key" className="font-semibold">
          Task's Category
        </FieldLabel>
        <Combobox items={currentCategories} onValueChange={(value) => setCurrentTaskTag(value)}>
          <ComboboxInput ref={inputRef} placeholder="Select a category" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <div className="flex gap-3 ">
          <Input className="flex-col basis-3/4" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}></Input>
          <Button variant="outline" size="sm" className="bg-white text-black text-xs" onClick={handleAddCategory}>+ Add a category</Button></div>
      </Field>
    </div>
  );
};

export default AddCategories;

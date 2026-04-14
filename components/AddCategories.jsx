import React from "react";
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
  const [currentCategories, setCurrentCategories] = React.useState([...categories , "general"] || []);
  const [newCategory , setNewCategory ] = React.useState("") ;

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;
    const res = await addCategory(newCategory);
    let updatedCategories = [...currentCategories , newCategory];
    setCurrentCategories(updatedCategories);
    setNewCategory("");
  };

  return (
    <div>
      <Field className="w-64 m-10">
        <FieldLabel htmlFor="input-demo-api-key" className="font-semibold">
          Task's Category
        </FieldLabel>
        <Combobox items={currentCategories} onValueChange={(value) => setCurrentTaskTag(value)}>
          <ComboboxInput placeholder="Select a category" />
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
          <Button variant="outline" size="sm" className="bg-white text-black text-xs" onClick={() => handleAddCategory(newCategory)}>+ Add a category</Button></div>
      </Field>
    </div>
  );
};

export default AddCategories;

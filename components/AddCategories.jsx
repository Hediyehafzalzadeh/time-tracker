import React from "react";
import { Field, FieldLabel } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
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

const AddCategories = ({ categories, currentTaskTag, setCurrentTaskTag }) => {
  const [addNew, setAddNew] = React.useState(false);
  return (
    <div>
      <Field className="w-64 m-10">
        <FieldLabel htmlFor="input-demo-api-key" className="font-semibold">
          Task's Category
        </FieldLabel>
        <Combobox items={categories} onValueChange={(value) => setCurrentTaskTag(value)}>
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
        <Button variant="outline" size="sm" className="bg-white text-black text-xs" onClick={() => setAddNew(!addNew)}>+ Add a category</Button>

        {/* <RadioGroup defaultValue="comfortable" className="w-fit" onValueChange={(value) => setCurrentTaskTag(value)}>
              <div className="grid grid-cols-3 grid-rows-3 items-center gap-3 mb-2 ">
                {categories.map((category) => {
                  return (
                    <div className="flex items-center gap-3" key={category}>
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category}>{category}</Label>
                    </div>
                  );
                })}
                <Button variant="outline" size="sm" className="bg-white text-black text-xs" onClick={() => setAddNew(!addNew)}>+ Add</Button>
                
              </div>
            </RadioGroup>  */}
        {addNew && (
          <Input
            required
            value={currentTaskTag}
            onChange={(e) => setCurrentTaskTag(e.target.value)}
            placeholder={"Task's category ..."}
          ></Input>
        )}
      </Field>
    </div>
  );
};

export default AddCategories;

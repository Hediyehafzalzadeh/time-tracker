"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { createClient } from "@/utils/supabase/server";


export async function getTasks(){
        try{
            const supabase = await createClient();
            const { data , error } = await supabase.from("tasks").select("*").order("created_at" , {ascending : false});
            if (error) throw error ; 
            return data || [] ; 

        }catch ( error) {
            console.error("Get tasks error :" , error) ;
            return [] ; 
        }
    }

export async function getTodaysTasks(){

        try{
            const supabase = await createClient();
            const today = new Date().toISOString().split("T")[0];
            const { data , error } = await supabase.from("tasks").select().gte("created_at", today).order("created_at" , {ascending : false});
            if (error) throw error ; 
            return data || [] ; 

        }catch ( error) {
            console.error("Get today's tasks error :" , error) ;
            return [] ; 
        }
    }

export async function getHistoryByDate(date){
    const tomorrow = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
try{
            const supabase = await createClient();
            const { data , error } = await supabase.from("tasks").select().gte("created_at", date).lt("created_at", tomorrow).order("created_at" , {ascending : false});
            if (error) throw error ; 
            return data || [] ; 

        }catch ( error) {
            console.error("Get history by date error :" , error) ;
            return [] ; 
        }
    }

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    redirect("/");
    
}

export async function addTask(task ) {
    if(!task) throw new Error("no task provided");

    try{
    const supabase = await createClient();
    const {
            data : { user}, } 
            = await supabase.auth.getUser(); 
            if (!user) {
                throw new Error("Not authenticated");
            }
    const { data , error } = await supabase.from("tasks").upsert({
        user_id : user.id,
        name : task.name , 
        duration : task.duration,
        created_at : new Date().toISOString() ,
        tag : task.tag || null

    })
    .select()
    .single();
    return {name: data.name , duration: data.duration, tag: data.tag} ;
 
    

    }catch (error){
        console.error("error in saveTask :", error);
            return {error : error.message || "Failed to save task"}
    }


    
    
}

export async function deleteTask(task ) {
    if(!task) throw new Error("no task provided");

    try{
    const supabase = await createClient();
    const {
            data : { user}, } 
            = await supabase.auth.getUser(); 
            if (!user) {
                throw new Error("Not authenticated");
            }
    const { data , error } = await supabase.from("tasks").delete().eq("id" , task.id)
    .select()
    .single();
 
    

    }catch (error){
        console.error("error in deleteTask :", error);
            return {error : error.message || "Failed to delete task"}
    }


    
    
}

import  Logger from "@/components/Logger"
import LoginButton  from "@/components/LoginButton"
import { createClient } from "@/utils/supabase/server";
import { getTasks , getTodaysTasks} from "@/app/actions";
import { Toaster } from "@/components/ui/sonner"
import {TaskHistoryButton} from "@/components/TaskHistoryButton";
import ShowProgressButton from "@/components/ShowProgressButton";


export default async function Home() {
   
   const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const taskData = user ? await getTasks() : [] ;
   const todaysTaskData = user ? await getTodaysTasks() : [] ;
  const userTasks = taskData.map(({name , duration}) => ({name , duration})) || [] ;
  

  return (
     <div className='main-h-screen'>
      <header>
         <div className="m-5 flex flex-row justify-end">
            {user &&
             <TaskHistoryButton />
             }
             {user && <ShowProgressButton/>
              
             
             }
            <LoginButton user={user} />
            
            </div>
            
      </header>
        <Logger user={user} userTasks={todaysTaskData} />
        <Toaster />
     </div>
    
  );
}


import  Logger from "@/components/Logger"
import LoginButton  from "@/components/LoginButton"
import { createClient } from "@/utils/supabase/server";
import { getTasks } from "@/app/actions";

export default async function Home() {
   const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const taskData = user ? await getTasks() : [] ;
  const userTasks = taskData.map(({name , duration}) => ({name , duration})) || [] ;
  
  return (
     <div className='main-h-screen'>
      <header>
         <div className="m-5">
            <LoginButton user={user} /></div>
      </header>
        <Logger user={user} userTasks={userTasks} />
     </div>
    
  );
}

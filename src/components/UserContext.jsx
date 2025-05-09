import { createContext, useState,useEffect } from 'react';

export const UserContext = createContext(null);


export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        // On first load, try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      });
      const [timetable, setTimeTable] = useState(() => {
        const storedTimetable = localStorage.getItem('timetable');
        return storedTimetable ? JSON.parse(storedTimetable) : null;
      });
      const[staff,setStaff]=useState(()=>{
        const storedStaff=localStorage.getItem("staff");
        return storedStaff ? JSON.parse(storedStaff):null;
      });

      const [users, setUsers] = useState(() => {
       
        const storedUser = localStorage.getItem('users');
        return storedUser ? JSON.parse(storedUser) : null;
      });
      const [staffs,setStaffs]=useState(()=>{
        const storedUser = localStorage.getItem('staffs');
        return storedUser ? JSON.parse(storedUser) : null;
      })
      useEffect(() => {
        if (user) {
          // When user changes, save it to localStorage
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          // If user logs out, remove from localStorage
          localStorage.removeItem('user');
        }
      }, [user]);

      useEffect(() => {
        if (timetable) {
          localStorage.setItem('timetable', JSON.stringify(timetable));
        } else {
          localStorage.removeItem('timetable');
        }
      }, [timetable]);

      useEffect(()=>{
        if(staff){
          localStorage.setItem("staff",JSON.stringify(staff));
        }
        else{
          localStorage.removeItem("staff");
        }
      })
      useEffect(()=>{
        if(users){
          localStorage.setItem("users",JSON.stringify(users));
        }
        else{
          localStorage.removeItem("users");
        }
      })

      useEffect(()=>{
        if(staffs){
          localStorage.setItem("staffs",JSON.stringify(staffs));
        }
        else{
          localStorage.removeItem("staffs");
        }
      })
      

  return (
    <UserContext.Provider value={{ user, setUser,timetable,setTimeTable,staff,setStaff,users,setUsers ,staffs,setStaffs}}>
      {children}
    </UserContext.Provider>
  );
}

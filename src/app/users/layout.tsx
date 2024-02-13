import getUsers from "../actions/getUsers";
import Sidebar  from "../components/sidebar/Sidebar";
import { UserList } from "./components/UserList";

export default async function UsersLayout({ children } : { children: React.ReactNode; }) {
    const users = await getUsers();
    const plainUsers = users.map((user) => (JSON.parse(JSON.stringify(user))));


    return (
        <Sidebar>
            <div className="h-full">
                <UserList items={plainUsers} />
                {children}
            </div>
        </Sidebar>
    )
}
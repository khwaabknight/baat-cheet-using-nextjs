import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from '@/app/actions/getCurrentUser'

async function Sidebar({children} : {children:React.ReactNode;}){

    const currentuser = await getCurrentUser();
    const plaincurrentuser = JSON.parse(JSON.stringify(currentuser));

    return (
      <div className="h-full">
        <DesktopSidebar currentuser = {plaincurrentuser} />
        <MobileFooter />
        <main className="lg:pl-20 h-full">
            {children}
        </main>
      </div>
    )
  }
  
  export default Sidebar;
import Sidebar from '../components/sidebar/Sidebar'
import getConversations from '../actions/getConversations'
import ConversationList from './components/ConversationList';
import { ConversationType } from '@/models/conversationModel';

export default async function ConversationsLayout({children} : {children : React.ReactNode}) {
  try {
    const conversations = await getConversations();
    console.log("layout",conversations);

    return (
      <Sidebar >
          <div className='h-full'>
              {/* <ConversationList
                initialItems={conversations}
              ></ConversationList> */}
              {children}
          </div>
      </Sidebar>
    )
    
  } catch (error) {
    console.log(error)
    return <div>error</div>
  }

  
}
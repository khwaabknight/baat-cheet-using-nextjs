import Sidebar from '../components/sidebar/Sidebar'
import getConversations from '../actions/getConversations'
import ConversationList from './components/ConversationList';
import getUsers from '../actions/getUsers';

export default async function ConversationsLayout({children} : {children : React.ReactNode}) {
  try {
    const conversations = await getConversations();
    const users = await getUsers();
    const plainConversations = conversations.map((conversation) => (JSON.parse(JSON.stringify(conversation))));
    const plainUsers = users.map((user) => (JSON.parse(JSON.stringify(user))))

    return (
      <Sidebar >
          <div className='h-full'>
              <ConversationList
                users = {plainUsers}
                initialItems={plainConversations}
              ></ConversationList>
              {children}
          </div>
      </Sidebar>
    )
    
  } catch (error) {
    console.log(error)
    return <div>error</div>
  }

  
}
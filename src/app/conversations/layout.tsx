import Sidebar from '../components/sidebar/Sidebar'
import getConversations from '../actions/getConversations'
import ConversationList from './components/ConversationList';

export default async function ConversationsLayout({children} : {children : React.ReactNode}) {
  try {
    const conversations = await getConversations();
    const plainConversations = conversations.map((conversation) => (JSON.parse(JSON.stringify(conversation))));

    console.log("conversations :",conversations)

    return (
      <Sidebar >
          <div className='h-full'>
              <ConversationList
                initialItems={plainConversations}
              ></ConversationList>
              <div>
                
              </div>
              {children}
          </div>
      </Sidebar>
    )
    
  } catch (error) {
    console.log(error)
    return <div>error</div>
  }

  
}
import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
    conversationId: string;
}

const ConversationId = async ({params} : {params: IParams}) => {

    const conversation = await getConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId);
    const plainConversation = await JSON.parse(JSON.stringify(conversation));
    const plainMessages = await JSON.parse(JSON.stringify(messages));
    console.log('plain Messages',plainMessages)

    if(!plainConversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full fles flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }



    return (
        <div className="lg:pl-80 h-full ">
            <div className=" h-full flex flex-col">
                <Header conversation={plainConversation}/>
                <Body initialMessages={plainMessages}/>
                <Form />
            </div>
        </div>
    )
}

export default ConversationId;
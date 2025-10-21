import { useChatContext } from "../../utilities/ChatContext";

export const IncomingCallModal = () => {
    const { incomingCall, acceptCall, hangup } = useChatContext();

    if (!incomingCall) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                        {incomingCall.toName}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">
                        Incoming {incomingCall.callType} call
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {incomingCall.toName} is calling you
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => hangup()}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                        >
                            Decline
                        </button>
                        <button 
                            onClick={() => acceptCall(incomingCall.to, incomingCall.callType)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
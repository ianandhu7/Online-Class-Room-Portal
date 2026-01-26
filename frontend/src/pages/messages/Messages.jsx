import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMessages, sendMessage, markAsRead } from '../../api/messages';
import client from '../../api/client';

const Messages = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(data);
            groupIntoConversations(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const groupIntoConversations = (msgList) => {
        const convoMap = {};
        msgList.forEach(m => {
            const otherUser = m.sender === user.id ? { id: m.receiver, name: m.receiver_name } : { id: m.sender, name: m.sender_name };
            if (!convoMap[otherUser.id]) {
                convoMap[otherUser.id] = {
                    user: otherUser,
                    lastMessage: m,
                    messages: []
                };
            }
            convoMap[otherUser.id].messages.push(m);
        });
        setConversations(Object.values(convoMap));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const data = await sendMessage({
                receiver: selectedConversation.user.id,
                content: newMessage
            });
            setMessages([data, ...messages]);
            setNewMessage('');
            fetchMessages(); // Refresh conversations
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const response = await client.get(`/auth/search-users?search=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const startNewChat = (otherUser) => {
        const existing = conversations.find(c => c.user.id === otherUser.id);
        if (existing) {
            setSelectedConversation(existing);
        } else {
            setSelectedConversation({ user: otherUser, messages: [] });
        }
        setIsSearchModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const currentConvoMessages = selectedConversation
        ? messages.filter(m => (m.sender === selectedConversation.user.id) || (m.receiver === selectedConversation.user.id)).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        : [];

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Chat...</div>;

    return (
        <div className="flex h-screen bg-white dark:bg-slate-900 font-display">
            {/* Sidebar: Conversation List */}
            <aside className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">Messages</h2>
                    <button onClick={() => setIsSearchModalOpen(true)} className="p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-primary">
                        <span className="material-symbols-outlined">add_comment</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm italic">No conversations yet. Start a new chat!</div>
                    ) : (
                        conversations.map((convo) => (
                            <div
                                key={convo.user.id}
                                onClick={() => setSelectedConversation(convo)}
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${selectedConversation?.user.id === convo.user.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {convo.user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-sm dark:text-white truncate">{convo.user.name}</h4>
                                            <span className="text-[10px] text-slate-400">{new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{convo.lastMessage.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {selectedConversation.user.name.charAt(0)}
                                </div>
                                <h3 className="font-bold dark:text-white">{selectedConversation.user.name}</h3>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">more_vert</span></button>
                        </header>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                            {currentConvoMessages.length === 0 && (
                                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">Send a message to start the conversation!</div>
                            )}
                            {currentConvoMessages.map((m, idx) => (
                                <div key={m.id || idx} className={`flex ${m.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${m.sender === user.id ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none'}`}>
                                        <p>{m.content}</p>
                                        <p className={`text-[10px] mt-1 ${m.sender === user.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><span className="material-symbols-outlined">attach_file</span></button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white text-sm"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-50">
                        <span className="material-symbols-outlined text-8xl text-primary mb-4">forum</span>
                        <h3 className="text-xl font-bold dark:text-white">Your Workspace Messages</h3>
                        <p className="max-w-xs dark:text-slate-400">Select a conversation or start a new one to begin messaging your teachers or students.</p>
                        <button onClick={() => setIsSearchModalOpen(true)} className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20">Find Users</button>
                    </div>
                )}
            </main>

            {/* Search User Modal */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">New Conversation</h3>
                            <button onClick={() => setIsSearchModalOpen(false)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {searchResults.map(u => (
                                    <div
                                        key={u.id}
                                        onClick={() => startNewChat(u)}
                                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-3 transition-colors"
                                    >
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{u.name.charAt(0)}</div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{u.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-medium">{u.role}</p>
                                        </div>
                                    </div>
                                ))}
                                {searchQuery && searchResults.length === 0 && (
                                    <p className="text-center text-slate-400 text-sm py-4">No users found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;

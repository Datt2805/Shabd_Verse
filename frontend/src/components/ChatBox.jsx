// ChatBox — real-time chat with membership restriction
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import { 
  MessageCircle, 
  Send, 
  UserPlus, 
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatBox = ({ communityId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Check membership and fetch initial chat history
  const checkAccessAndFetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/communities/${communityId}/chat`);
      setMessages(res.data.data || []);
      
      // Update membership state if logged in
      if (user) {
        const communityRes = await API.get(`/communities/${communityId}`);
        const community = communityRes.data.data;
        setIsMember(community.members?.some(m => m._id === user._id || m === user._id));
      } else {
        setIsMember(false);
      }
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccessAndFetchHistory();
  }, [communityId]);

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io('http://localhost:5000');

    // Identify user to the socket
    if (user) {
        socketRef.current.emit('registerUser', user._id);
    }

    // Join the community chat room
    socketRef.current.emit('joinCommunity', communityId);

    // Listen for incoming messages
    socketRef.current.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [communityId, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await API.post(`/communities/${communityId}/join`);
      toast.success('Welcome to the tribe!');
      setIsMember(true);
      checkAccessAndFetchHistory();
    } catch (err) {
      toast.error('Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    
    const msgData = {
      communityId,
      userId: user?._id,
      message: text,
    };
    
    socketRef.current.emit('sendMessage', msgData);
    setText('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 border rounded-xl bg-muted/10">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }


  return (
    <Card className="flex flex-col h-[650px] border-none shadow-2xl overflow-hidden animate-fade-in bg-[#efeae2] dark:bg-[#0b141a] rounded-xl relative">
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: "url('https://transparenttextures.com/patterns/pinstripe-light.png')" }} 
      />
      
      {/* WhatsApp Header */}
      <div className="flex items-center gap-4 bg-[#008069] dark:bg-[#202c33] text-white py-3 px-5 shrink-0 shadow-sm z-10">
        <div className="bg-white/20 rounded-full flex items-center justify-center p-2.5">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[16px] font-semibold leading-tight tracking-wide">Tribe Chat</h2>
          <p className="text-[13px] text-white/80 leading-tight mt-0.5">
            {messages.length} messages secured
          </p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="chat-scroll-area">
        {messages.length === 0 ? (
          <div className="chat-encrypt-banner">
            Messages are end-to-end encrypted. Nobody outside of this chat, not even ShabdVerse, can read or listen to them.
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.user?._id === user?._id;
            const prevMsg = messages[i - 1];
            const isNewSection = !prevMsg || prevMsg.user?._id !== msg.user?._id;
            return (
              <div
                key={msg._id || i}
                className={`chat-row chat-row--${isOwn ? 'own' : 'other'}${isNewSection ? ' chat-row--section-start' : ''}`}
              >
                <div className={`chat-msg-col chat-msg-col--${isOwn ? 'own' : 'other'}`}>
                  {!isOwn && isNewSection && (
                    <span className="chat-sender-name">{msg.user?.name}</span>
                  )}
                  <div className={`chat-bubble chat-bubble--${isOwn ? 'own' : 'other'}`}>
                    <span className="chat-bubble-text">{msg.message || msg.text}</span>
                    <span className="chat-bubble-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Footer */}
      <div className="chat-footer">
        {user ? (
          isMember ? (
            <form className="chat-input-container" onSubmit={sendMessage}>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
                className="chat-input-field"
                required
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="chat-send-btn"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border border-dashed border-accent/30 mx-4 mb-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle size={16} className="text-accent" />
                Join the tribe to participate in the chat.
              </p>
              <Button size="sm" onClick={handleJoin} disabled={joining} className="bg-accent hover:bg-accent-dark h-8">
                {joining ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <UserPlus className="h-3 w-3 mr-1" />}
                Join Now
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-3 bg-muted/30 p-4 rounded-t-xl border-t border-accent/20">
            <p className="text-sm font-medium text-muted-foreground">
              You are viewing in read-only mode. Please login to join the discussion.
            </p>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" asChild className="h-8">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="bg-accent hover:bg-accent-dark h-8">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatBox;

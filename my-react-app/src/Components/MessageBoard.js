import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import SideBar from './SideBar';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import { io } from 'socket.io-client';
export default function MessageBoard() {

    const { isAuthenticated, token, userid } = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef(null);
    const socket = io('http://localhost:4000');
    const navigate = useNavigate();


    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
            });

            setMessages((prv) => {
                const updated = [...prv, newMessage];
                return updated;
            });
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage); // Better than disconnecting socket entirely
        };
    }, [socket]); // messages removed from dependency array


    if (!isAuthenticated) {
        navigate('/');
    }

    useEffect(() => {
        const fetchdata = async () => {
            await axios.get('http://localhost:4000/api/use/allmessages', {
                params: { to: userid },
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })
                .then((response) => {
                    setMessages(response.data.messagesList);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        if (userid && token) {  // Make sure both exist before fetching
            fetchdata();
        }
    }, [userid, token]);

    console.log(messages);

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        try {
            await axios.post('http://localhost:4000/api/use/message',
                { message: inputValue, to: userid },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "auth-token": token
                    }
                })
                .then(() => {

                    setInputValue('');
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const styles = {
        layout: {
            display: 'flex',
            flexDirection: 'row',
            height: '100vh', // full height
        },
        wrapper: {
            flex: 1, // take remaining space
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#e5ddd5',
            margin: '20px', // small margin around chat
        },
        header: {
            backgroundColor: '#075e54',
            color: 'white',
            padding: '16px',
            fontSize: '20px',
            fontWeight: 'bold',
        },
        chatContainer: {
            flex: 1,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            backgroundColor: '#ece5dd',
            height: "400px"
        },
        message: {
            maxWidth: '75%',
            padding: '10px',
            margin: '6px 0',
            borderRadius: '8px',
            fontSize: '15px',
            lineHeight: '1.4',
            boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        },
        inputArea: {
            display: 'flex',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderTop: '1px solid #ccc',
        },
        input: {
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #ccc',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '15px',
        },
        sendButton: {
            marginLeft: '10px',
            padding: '10px 18px',
            backgroundColor: '#128c7e',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '15px',
        },
    };

    return (
        <div style={styles.layout}>
            <SideBar />

            <div style={styles.wrapper}>
                <div style={styles.header}>💬 Chat</div>

                <div style={styles.chatContainer}>
                    {messages.map((element, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.message,
                                alignSelf: element.to === userid ? 'flex-end' : 'flex-start',
                                // alignSelf: "flex-end",
                                backgroundColor: element.from === userid ? '#ffffff' : '#dcf8c6',
                            }}
                        >
                            {element.message}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div style={styles.inputArea}>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.sendButton}>Send</button>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import Foto1 from '../assets/images/Foto1.jpg';
import Foto2 from '../assets/images/Foto2.jpg';
import Foto3 from '../assets/images/Foto3.jpg';

import './index.css';

function Home() {
  const users = [
    { name: 'Go Yoon Jung', handle: '@go_yoon_jung', avatar: Foto1 },
    { name: 'Marsha', handle: '@Maca_chan', avatar: Foto2 },
    { name: 'Shah Rukh Khan', handle: '@Shaka_khan', avatar: Foto3 }
  ];

  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(users[0]);
  const [showUserList, setShowUserList] = useState(false); 
  const [commentImage, setCommentImage] = useState(null);  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() || commentImage) {  
      const newComment = {
        text: input,
        name: activeUser.name,
        handle: activeUser.handle,
        avatar: activeUser.avatar,
        image: commentImage, 
        timestamp: new Date().toLocaleString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };
      setComments([...comments, newComment]);
      setInput('');
      setCommentImage(null); 
    }
  };

  return (
    <div className="home-container">
      <div
        className="user-select"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setShowUserList(!showUserList)}
      >
        <img
          src={activeUser.avatar}
          alt="active user avatar"
          className="avatar-icon"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
        <span style={{ fontWeight: '600', fontSize: 16 }}>{activeUser.name}</span>

        {showUserList && (
          <div
            className="user-list-dropdown"
            style={{
              position: 'absolute',
              top: '50px',
              left: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              width: 150,
              padding: 8
            }}
          >
            {users.map(user => (
              <div
                key={user.handle}
                onClick={() => {
                  setActiveUser(user);
                  setShowUserList(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  borderRadius: 6,
                  backgroundColor: user.handle === activeUser.handle ? '#f0f0f0' : 'transparent'
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{user.handle}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      

      <div className="comments-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-box">
            <img src={comment.avatar} alt="avatar" className="avatar" />
            <div className="comment-body">
              <div className="comment-header">
                <span className="name">{comment.name}</span>
                <span className="handle">{comment.handle}</span>
                <span className="dot">·</span>
                <span className="timestamp">{comment.timestamp}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
              {comment.image && (
                <img
                  src={comment.image}
                  alt="comment attachment"
                  style={{ marginTop: 8, maxWidth: '300px', borderRadius: 8 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pesan.."
          className="comment-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setCommentImage(URL.createObjectURL(e.target.files[0]));
            } else {
              setCommentImage(null);
            }
          }}
          style={{ marginTop: 8 }}
        />
        {commentImage && (
          <img
            src={commentImage}
            alt="preview"
            style={{ maxWidth: '100px', marginTop: 8, borderRadius: 8 }}
          />
        )}
        <div className="form-footer">
          <button type="submit" className="submit-button">Kirim</button>
        </div>
      </form>
    </div>
  );
}

export default Home;

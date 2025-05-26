import React, { useState, useRef } from 'react';
import { FaImage } from 'react-icons/fa';

import Foto1 from '../assets/images/Foto1.jpg';
import Foto2 from '../assets/images/Foto2.jpg';
import Foto3 from '../assets/images/Foto3.jpg';

import './index.css';

function Home() {
  const users = [
    { name: 'Go Yoon Jung', handle: '@go_yoon_jung', avatar: Foto1 },
    { name: 'Marsha', handle: '@Maca_chan', avatar: Foto2 },
    { name: 'Shah Rukh Khan', handle: '@Shaka_khan', avatar: Foto3 },
  ];

  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(users[0]);
  const [showUserList, setShowUserList] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const fileInputRef = useRef(null);

  const [isFollowing, setIsFollowing] = useState(false);

  const generateTimestamp = () =>
    new Date().toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() && !commentImage) return;

    const newComment = {
      id: Date.now(),
      text: input,
      name: activeUser.name,
      handle: activeUser.handle,
      avatar: activeUser.avatar,
      image: commentImage,
      timestamp: generateTimestamp(),
      replies: [],
      loveCount: 0,
      shareCount: 0,
      chartCount: 0,
    };

    if (replyTo) {
      setComments((prevComments) =>
        addReplyToComment(prevComments, replyTo, newComment)
      );
      setReplyTo(null);
    } else {
      setComments((prev) => [...prev, newComment]);
    }

    setInput('');
    setCommentImage(null);
  };

  // Fungsi menambah balasan
  const addReplyToComment = (commentList, targetId, reply) => {
    return commentList.map((comment) => {
      if (comment.id === targetId) {
        return { ...comment, replies: [...comment.replies, reply] };
      } else if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, targetId, reply),
        };
      }
      return comment;
    });
  };

  // Fungsi menambah count love/share/chart
  const addCountToComment = (commentList, targetId, type) => {
    return commentList.map((comment) => {
      if (comment.id === targetId) {
        const updatedComment = { ...comment };
        if (type === 'love') updatedComment.loveCount = (updatedComment.loveCount || 0) + 1;
        else if (type === 'share') updatedComment.shareCount = (updatedComment.shareCount || 0) + 1;
        else if (type === 'chart') updatedComment.chartCount = (updatedComment.chartCount || 0) + 1;
        return updatedComment;
      } else if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: addCountToComment(comment.replies, targetId, type),
        };
      }
      return comment;
    });
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const handleCount = (commentId, type) => {
    setComments((prevComments) => addCountToComment(prevComments, commentId, type));
  };

  const renderReplies = (replies, depth = 1) => {
    return replies.map((reply) => (
      <div
        key={reply.id}
        className="comment-box reply-box"
        style={{ marginLeft: depth * 20 }}
      >
        <img src={reply.avatar} alt="avatar" className="avatar" />
        <div className="comment-body">
          <div className="comment-header">
            <span className="name">{reply.name}</span>
            <span className="handle">{reply.handle}</span>
            <span className="dot">·</span>
            <span className="timestamp">{reply.timestamp}</span>
          </div>
          <div className="comment-text">{reply.text}</div>
          {reply.image && (
            <img
              src={reply.image}
              alt="reply"
              style={{ marginTop: 8, maxWidth: 300, borderRadius: 8 }}
            />
          )}
          <div
            className="comment-actions"
            style={{ display: 'flex', gap: 20, marginTop: 8 }}
          >
            <button
              onClick={() => handleReply(reply.id)}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
              title="Balas"
            >
              💬 Balas
            </button>
            <button
              onClick={() => handleCount(reply.id, 'love')}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
              title="Love"
            >
              ❤️ {reply.loveCount ? reply.loveCount.toLocaleString('id-ID') : '0'}
            </button>
            <button
              onClick={() => handleCount(reply.id, 'share')}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
              title="Share"
            >
              🔁 {reply.shareCount ? reply.shareCount.toLocaleString('id-ID') : '0'}
            </button>
            <button
              onClick={() => handleCount(reply.id, 'chart')}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
              title="Chart"
            >
              📊 {reply.chartCount ? reply.chartCount.toLocaleString('id-ID') : '0'}
            </button>
          </div>
          {reply.replies.length > 0 && renderReplies(reply.replies, depth + 1)}
        </div>
      </div>
    ));
  };

  return (
    <div className="home-container" style={{ position: 'relative' }}>
      {/* User Picker */}
      <div
       className="user-picker"
        style={{
           cursor: 'pointer',
           marginBottom: 12,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'space-between',
           padding: '0 8px',
           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', // <-- ini tambahan bayangan
           borderRadius: 2, // opsional, biar agak membulat
           backgroundColor: '#fff', // kalau perlu, supaya shadow terlihat jelas di background
        }}
       >
        <div
          onClick={() => setShowUserList(!showUserList)}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src={activeUser.avatar}
            alt="user avatar"
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
          <span style={{ marginLeft: 10 }}>{activeUser.name}</span>
        </div>
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          style={{
            padding: '6px 12px',
            backgroundColor: isFollowing ? '#ccc' : '#1da1f2',
            color: isFollowing ? '#000' : '#fff',
            border: 'none',
            borderRadius: 20,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* User List Dropdown */}
      {showUserList && (
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            border: '1px solid #ccc',
            marginTop: 4,
            zIndex: 1000,
            width: 200,
          }}
        >
          {users.map((user) => (
            <div
              key={user.handle}
              onClick={() => {
                setActiveUser(user);
                setShowUserList(false);
              }}
              style={{
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
              />
              {user.name}
            </div>
          ))}
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-box">
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
                  alt="attachment"
                  style={{ marginTop: 8, maxWidth: 300, borderRadius: 8 }}
                />
              )}
              <div
                className="comment-actions"
                style={{ display: 'flex', gap: 20, marginTop: 8 }}
              >
                <button
                  onClick={() => handleReply(comment.id)}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                  title="Balas"
                >
                  💬 Balas
                </button>
                <button
                  onClick={() => handleCount(comment.id, 'love')}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                  title="Love"
                >
                  ❤️ {comment.loveCount ? comment.loveCount.toLocaleString('id-ID') : '0'}
                </button>
                <button
                  onClick={() => handleCount(comment.id, 'share')}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                  title="Share"
                >
                  🔁 {comment.shareCount ? comment.shareCount.toLocaleString('id-ID') : '0'}
                </button>
                <button
                  onClick={() => handleCount(comment.id, 'chart')}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                  title="Chart"
                >
                  📊 {comment.chartCount ? comment.chartCount.toLocaleString('id-ID') : '0'}
                </button>
              </div>
              {/* Nested Replies */}
              {renderReplies(comment.replies)}
            </div>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form" style={{ display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={replyTo ? 'Balas komentar...' : 'Pesan..'}
          className="comment-input"
          style={{ marginBottom: 8 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaImage
            size={20}
            style={{ cursor: 'pointer', color: '#555' }}
            onClick={() => fileInputRef.current?.click()}
            title="Tambahkan gambar"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setCommentImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
            style={{ display: 'none' }}
          />

          <div style={{ flexGrow: 1 }}>
            {commentImage && (
              <img
                src={commentImage}
                alt="preview"
                style={{ maxWidth: 100, borderRadius: 8 }}
              />
            )}
          </div>

          <div>
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                style={{ color: 'red', marginRight: 10 }}
              >
                Batal Balas
              </button>
            )}
            <button type="submit" className="submit-button">
              {replyTo ? 'Balas' : 'Kirim'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Home;

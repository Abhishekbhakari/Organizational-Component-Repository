import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComponentById,updateComponent, addComment } from '../services/componentService'; // Update import
import { addNotification } from '../utils/notifications';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../App.css';

const ComponentDetailsPage = () => {
  const { id } = useParams();
  const [component, setComponent] = useState(null);
  // const [snippet, setSnippet] = useState({ language: '', code: '' });
  const [rating, setRating] = useState(0);
  const [copied, setCopied] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [newComment, setNewComment] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComponent = async () => {
      const data = await getComponentById(id);
      setComponent(data);
    };
    fetchComponent();
  }, [id]);

  // const handleAddSnippet = async () => {
  //   try {
  //     const updatedComponent = await addSnippet(id, snippet);
  //     setComponent(updatedComponent);
  //     addNotification('Snippet added successfully!', 'success');
  //   } catch (error) {
  //     addNotification('Error adding snippet.', 'error');
  //   }
  // };

  const handleRatingChange = (newRating) => {
    setRating(newRating); 
  };
  const saveRating = async () => {
    try {
      const updatedComponent = await updateComponent(id, { ratings: [...component.ratings, rating] }); 
      setComponent(updatedComponent); 
      addNotification('Rating saved successfully!', 'success');
    } catch (error) {
      addNotification('Error saving rating', 'error');
      console.error('Error saving rating:', error);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      addNotification('Comment cannot be empty', 'error');
      return;
    }
    try {
      const updatedComponent = await addComment(id, newComment, replyTo);
      setComponent(updatedComponent);
      setNewComment('');
      setReplyTo(null);
      addNotification('Comment added successfully!', 'success');
    } catch (error) {
      addNotification('Error adding comment.', 'error');
    }
  };

  const renderComments = (comments, parentId = null) => {
    return comments.map((comment) => (
      <div key={comment._id} className="mb-2 p-2 border border-gray-300 rounded">
        <p>{comment.text}</p>
        <button onClick={() => setReplyTo(comment._id)} className="text-blue-500">Reply</button>
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4">
            {renderComments(comment.replies, comment._id)}
          </div>
        )}
      </div>
    ));
  };

  if (!component) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
       <button 
          className="absolute left-2 text-xl text-green-500"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft />
        </button>
      <div className="w-full max-w-lg glass-card">
        <h2 className=' text-3xl font-extrabold align-middle flex justify-center pb-4'>{component.name}</h2>
        <p className="p-2 mb-2"><span className=' text-slate-400 font-bold'>Use -</span>{component.use}</p>
        <p className="p-2 mb-2"><span className='text-slate-400 font-bold'>Technologies -</span>{component.technologies}</p>
        {component.image && ( 
          <img src={component.image} alt={component.name} className="w-full max-h-48 object-contain" />
        )}
        <div>
          {component.codeSnippets.map((snippet, index) => (
            <div key={index} className="relative mb-4">
              <h3>{snippet.language}</h3>
              <CopyToClipboard text={snippet.code} onCopy={() => setCopied(true)}>
                <button className="absolute right-0 top-0 m-2 p-1 bg-gray-800 text-white rounded">
                  Copy
                </button>
              </CopyToClipboard>
              <SyntaxHighlighter language={snippet.language} style={dracula} wrapLines={true} showLineNumbers={true}>
                {snippet.code}
              </SyntaxHighlighter>
              {copied && <span className="text-green-500">Copied!</span>}
            </div>
          ))}
        </div>
        {/* <div>
          <input
            type="text"
            placeholder="Language"
            value={snippet.language}
            onChange={(e) => setSnippet({ ...snippet, language: e.target.value })}
            className="w-full p-2 mb-2 glass-input"
          />
          <textarea
            placeholder="Code"
            value={snippet.code}
            onChange={(e) => setSnippet({ ...snippet, code: e.target.value })}
            className="w-full p-2 mb-2 glass-input"
          ></textarea>
          <button onClick={handleAddSnippet} className="w-full p-2 bg-blue-500 text-white rounded-lg glass-button">
            Add Snippet
          </button>
        </div> */}
        <div className="mt-4">
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={handleRatingChange}
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="5px"
          />
          <button onClick={saveRating} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Save Rating
          </button>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Comments/Questions</h3>
          {component.comments && renderComments(component.comments)}
          <form onSubmit={handleSubmitComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment or ask a question..."
              className="w-full p-2 mb-2 glass-input"
            ></textarea>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg glass-button">
              {replyTo ? 'Reply' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetailsPage;
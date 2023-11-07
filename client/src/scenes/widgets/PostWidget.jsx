import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { IconButton, Typography, useTheme, TextField, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import Comment from "components/Comment";
import React, { useState, useEffect } from "react"; // Importe o useEffect
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // Use o estado para armazenar os comentários

  useEffect(() => {
    // Obtenha os comentários associados a este post
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/${postId}/comments`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments); // Armazene os comentários no estado
        } else {
          console.error("Erro ao buscar os comentários");
        }
      } catch (error) {
        console.error("Erro ao buscar os comentários:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const postComment = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: commentText }),
    });
  
    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setCommentText(''); // Limpa o campo de comentário após o envio
    } else {
      // Lida com erros na resposta, se necessário
    }
  };

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setShowComments(!showComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>

        {showComments && (
          <FlexBetween className="comments-section">
            {comments.map((comment) => (
              <Comment
                key={comment._id} // Certifique-se de que cada comentário tenha uma propriedade única, como _id
                text={comment.text}
                username={comment.username}
              />
            ))}
          </FlexBetween>
        )}

        <TextField
          id="comment"
          label="Comentar"
          placeholder="Digite seu comentário aqui..."
          multiline
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={postComment}>
          Comentar
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;

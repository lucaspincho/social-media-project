import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Outros campos relacionados a comentários, como data e hora, podem ser adicionados aqui
});

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema], // Adicione um array de objetos de comentários ao modelo de post
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

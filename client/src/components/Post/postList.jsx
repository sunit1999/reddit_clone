import Post from "./post";

const PostList = ({ posts }) => {
  return (
    <>
      {posts.map((post) => (
        <Post post={post} key={post.postId} />
      ))}
    </>
  );
};

export default PostList;

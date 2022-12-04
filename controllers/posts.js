const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then((createdPost) => {
   // console.log(createdPost);
    res.status(201).json({
      message:"Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    });
  });
};

exports.updatePost = (req,res,next) => {
  let imagePath = req.body.image; // not updating image here and upoading it.(default image path)
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;  // updating image and then uploading it.
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id:req.params.id, creator: req.userData.userId},post).then((result) => {
    if(result.matchedCount > 0){
      res.status(200).json({message: "Update successful!"});
    }
    else{
      res.status(401).json({message: "Not authorized!"});
    }

  });
};

exports.getPost = (req,res,next) => {
  Post.findById(req.params.id).then((post) => {
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: "Post not found!"});
    }
  });
};

exports.getPosts = (req,res,next) => {
  const itemsPerPage = +req.query.itemsPerPage;
  const currPage = +req.query.currPage;

  const postQuery = Post.find();

  if(itemsPerPage && currPage){
    postQuery
      .skip(itemsPerPage * (currPage - 1))
      .limit(itemsPerPage);
  }

  let fetchedPosts;

postQuery
  .then(documents =>{
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message:"Post fetching was succesful",
      posts:fetchedPosts,
      maxPosts:count
  });
});

};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result) => {
    if(result.deletedCount > 0){
      res.status(200).json({
        message: "Post deleted"
      });
    }
    else{
      res.status(401).json({
        message: "Not authorized!"
      });
    }

  });

};

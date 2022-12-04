const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const postController = require('../controllers/posts');

// image upload
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]; // Though we have added this security in frontend but for extra security layer here also we are checking if we get any mimetype other than the mimetype defined in MIME_TYPE_MAP, it will throw error.
    let error = new Error("invalid-mime-type");
    if(isValid){
      error = null;
    }
    callBack(error, "images");
  },
  filename: (req, file, callBack) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callBack(null, name + '-' + Date.now() + '.' + extension);
  }
});


router.post("", checkAuth, multer({storage: storage}).single("image"), postController.createPost);

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), postController.updatePost);

router.get("/:id", postController.getPost);

router.get('', postController.getPosts);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;

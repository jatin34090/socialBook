const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const requireLogin = require("../middleware/requireLogin")


router.get("/api/allpost", requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then((result) => {
            res.json({ posts: result })
        }).catch((err) => {
            return res.status(422).json({ error: err })

        })

})
router.get("/api/getsubpost", requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then((result) => {
            res.json({ posts: result })
        }).catch((err) => {
            return res.status(422).json({ error: err })

        })

})

router.get("/api/mypost", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name pic")
        .then((result) => {
            res.json({ posts: result })
        }).catch((err) => {
            return res.status(422).json({ error: err })

        })
})

router.post("/api/createpost", requireLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user,
        photo
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            return res.status(422).json({ error: err })

        })
})

router.put('/api/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .then((result) => res.json(result)
        ).catch((err) => {
            return res.status(422).json({ error: err })

        })
})
router.put('/api/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .then((result) => res.json(result)
        ).catch((err) => {
            return res.status(422).json({ error: err })

        })
})


router.put('/api/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            comments: comment
        }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .then((result) => res.json(result)
        ).catch((err) => {
            return res.status(422).json({ error: err })
        })
})


router.delete('/api/deletepost/:id', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate("postedBy", "_id")
        .then((post) => {
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                // console.log("POST IN delete", post);
                post.deleteOne()
                    .then((result) => {
                        // console.log("Result then in delte", result)
                        res.json(result)
                    }).catch((err) => {
                        console.log("Result catch in delte", result)
                        return res.status(422).json({ error: err })
                    })
            }
        })
        .catch((err) => {
            return res.status(422).json({ error: err })
        })
})

module.exports = router
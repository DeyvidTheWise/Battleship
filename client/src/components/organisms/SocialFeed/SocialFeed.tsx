"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/atoms/Button/Button"
import { Textarea } from "../../../components/atoms/TextArea/TextArea"
import { formatDate } from "../../../utils/DateUtils"
import "./SocialFeed.css"

interface Post {
  id: string
  author: string
  content: string
  timestamp: Date
  likes: number
  comments: Comment[]
  userLiked: boolean
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  likes: number
  userLiked: boolean
}

interface SocialFeedProps {
  username?: string
  posts?: Post[]
  onCreatePost?: (content: string) => void
  onLikePost?: (postId: string) => void
  onCommentPost?: (postId: string, content: string) => void
  onLikeComment?: (postId: string, commentId: string) => void
  userId?: number
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  username = "User",
  posts = [],
  onCreatePost,
  onLikePost,
  onCommentPost,
  onLikeComment,
  userId,
}) => {
  const [newPostContent, setNewPostContent] = useState("")
  const [commentContents, setCommentContents] = useState<Record<string, string>>({})
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  // Mock posts if none provided
  const displayPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: "1",
            author: "BattleshipMaster",
            content: "Just won my 10th game in a row! Who wants to challenge me?",
            timestamp: new Date(Date.now() - 3600000),
            likes: 5,
            comments: [
              {
                id: "1-1",
                author: "SeaBattleKing",
                content: "Challenge accepted! Let's play tomorrow.",
                timestamp: new Date(Date.now() - 3000000),
                likes: 2,
                userLiked: false,
              },
            ],
            userLiked: false,
          },
          {
            id: "2",
            author: "NavalCommander",
            content: "Just discovered a new strategy for placing ships. Will share tips after testing it more!",
            timestamp: new Date(Date.now() - 86400000),
            likes: 12,
            comments: [],
            userLiked: true,
          },
        ]

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !onCreatePost) return

    onCreatePost(newPostContent)
    setNewPostContent("")
  }

  const handleLikePost = (postId: string) => {
    if (!onLikePost) return
    onLikePost(postId)
  }

  const handleCommentPost = (postId: string) => {
    if (!commentContents[postId]?.trim() || !onCommentPost) return

    onCommentPost(postId, commentContents[postId])
    setCommentContents({
      ...commentContents,
      [postId]: "",
    })
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    if (!onLikeComment) return
    onLikeComment(postId, commentId)
  }

  const toggleComments = (postId: string) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId],
    })
  }

  return (
    <div className="social-feed">
      <div className="create-post">
        <h3>Create Post</h3>
        <Textarea
          value={newPostContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
        />
        <Button onClick={handleCreatePost} className="post-btn">
          Post
        </Button>
      </div>

      <div className="posts-container">
        {displayPosts.length === 0 ? (
          <div className="no-posts">No posts yet. Be the first to post!</div>
        ) : (
          displayPosts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <div className="post-author">{post.author}</div>
                <div className="post-timestamp">{formatDate(post.timestamp)}</div>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-actions">
                <Button onClick={() => handleLikePost(post.id)} className={`like-btn ${post.userLiked ? "liked" : ""}`}>
                  {post.userLiked ? "Liked" : "Like"} ({post.likes})
                </Button>
                <Button onClick={() => toggleComments(post.id)} className="comments-btn">
                  Comments ({post.comments.length})
                </Button>
              </div>

              {expandedComments[post.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-author">{comment.author}</div>
                          <div className="comment-timestamp">{formatDate(comment.timestamp)}</div>
                        </div>
                        <div className="comment-content">{comment.content}</div>
                        <div className="comment-actions">
                          <Button
                            onClick={() => handleLikeComment(post.id, comment.id)}
                            className={`like-btn ${comment.userLiked ? "liked" : ""}`}
                          >
                            {comment.userLiked ? "Liked" : "Like"} ({comment.likes})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="add-comment">
                    <Textarea
                      value={commentContents[post.id] || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCommentContents({
                          ...commentContents,
                          [post.id]: e.target.value,
                        })
                      }
                      placeholder="Write a comment..."
                      rows={2}
                    />
                    <Button onClick={() => handleCommentPost(post.id)} className="comment-btn">
                      Comment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SocialFeed

import React, {FC, useEffect, useState} from 'react'
import {Avatar, Box, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material"
import {Link} from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import ReactionComponent from "./ReactionComponent";
import Tooltip from "@mui/material/Tooltip"
import FlagIcon from '@mui/icons-material/Flag'
import ReplyIcon from '@mui/icons-material/Reply'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import DeleteCommentModal from "./DeleteCommentModal"
import ReportCommentModal from "./ReportCommentModal"
import EditIcon from '@mui/icons-material/Edit'
import {dislikeCommentRequest, likeCommentRequest} from "../utils/authRequests";
import {useCookies} from "react-cookie";
import {Role, UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";

export type CommentType = {
    id: string
    nickname: string
    linkNickname: string
    userId: string
    image: string
    text: string
    repliedTo?: string
    repliedText?: string
    repliedNickname?: string
    time: number
    likes: number
    dislikes: number
    status: LikeStatus
    deleteComment?: (commentId: string) => void
    replyComment?: (commentId: string) => void
    editComment?: (commentId: string) => void
}

export enum LikeStatus {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
    NONE = 'NONE'
}


const Comment: FC<CommentType> = ({
                                      id,
                                      nickname,
                                      linkNickname,
                                      userId,
                                      image,
                                      text,
                                      repliedTo,
                                      repliedText,
                                      repliedNickname,
                                      time,
                                      status,
                                      likes,
                                      dislikes,
                                      deleteComment,
                                      replyComment,
                                      editComment
                                  }: CommentType) => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [likesNumber, setLikesNumber] = useState<number>(likes)
    const [dislikesNumber, setDislikesNumber] = useState<number>(dislikes)
    const [currentStatus, setCurrentStatus] = useState<LikeStatus>(status)
    const [progressNumber, setProgressNumber] = useState(0)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [reportModal, setReportModal] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    useEffect(() => {
        if (likesNumber + dislikesNumber) setProgressNumber(100 * likesNumber / (likesNumber + dislikesNumber))
        else setProgressNumber(50)
    }, [likesNumber, dislikesNumber])

    function handleLike() {
        if (currentUser) {
            likeCommentRequest(id)
            if (currentStatus == LikeStatus.DISLIKE) {
                setDislikesNumber((prevState) => prevState - 1)
                setLikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.LIKE)
            } else if (currentStatus == LikeStatus.LIKE) {
                setLikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.NONE)
            } else {
                setLikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.LIKE)
            }
        }
    }

    function handleDislike() {
        if (currentUser) {
            dislikeCommentRequest(id)
            if (currentStatus == LikeStatus.LIKE) {
                setDislikesNumber((prevState) => prevState + 1)
                setLikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.DISLIKE)
            } else if (currentStatus == LikeStatus.DISLIKE) {
                setDislikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.NONE)
            } else {
                setDislikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.DISLIKE)
            }
        }
    }

    function handleDeleteModalClickOpen() {
        setDeleteModal(true)
    }

    function handleDeleteModalClose() {
        setDeleteModal(false)
    }

    function handleReportModalClickOpen() {
        setReportModal(true)
    }

    function handleReportModalClose() {
        setReportModal(false)
    }

    return (
        <ListItem alignItems="flex-start" sx={{boxShadow: 1, mb: 4, p: 3, pr: 4, pt: 2}}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={image}/>
            </ListItemAvatar>
            <ListItemText
                primary={<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        <Link to={`/users/${linkNickname}/profile`} style={{ "textDecoration": "none" }}>{nickname}</Link>
                        <em>&nbsp;{new Date(time).getDate()}.{new Date(time).getMonth() + 1}.{new Date(time).getFullYear()} {String(new Date(time).getHours()).padStart(2, '0')}:{String(new Date(time).getMinutes()).padStart(2, '0')}</em>
                    </Box>
                    <Box>
                        {currentUser && <Tooltip title={"Report"}><IconButton onClick={handleReportModalClickOpen}><FlagIcon /></IconButton></Tooltip>}
                        {currentUser && (currentUser.role == Role.ADMIN || currentUser.role == Role.MODERATOR || currentUser.id == userId) && <Tooltip title={"Delete"}><IconButton onClick={handleDeleteModalClickOpen}><CancelPresentationIcon/></IconButton></Tooltip>}
                        {editComment && currentUser && currentUser.id == userId && <Tooltip title={"Edit comment"}><IconButton onClick={() => editComment(id)}><EditIcon/></IconButton></Tooltip>}
                    </Box>
                </Box>}
                secondary={
                    <>
                        {repliedTo &&
                            <Box>
                                <Typography
                                    component="div"
                                    variant="body2"
                                    color="text.primary"
                                    align="justify"
                                    sx={{display: "flex", alignItems: "center"}}
                                >
                                    <ReplyIcon/>&nbsp;{repliedNickname}
                                </Typography>
                                <Typography
                                    component="div"
                                    variant="caption"
                                    color="text.secondary"
                                    align="justify"
                                    sx={{
                                        whiteSpace: 'pre-line',
                                        mb: 1,
                                        fontStyle: 'oblique',
                                        WebkitLineClamp: 2,
                                        display: "-webkit-box",
                                        px: 1,
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {repliedText}
                                </Typography>
                            </Box>
                        }
                        <Typography
                            component="div"
                            variant="body2"
                            color="text.primary"
                            align="justify"
                            sx={{whiteSpace: 'pre-line', mt: 0.5}}
                        >
                            {text}
                        </Typography>
                        <Grid container sx={{
                            p: 1,
                            bgcolor: 'background.paper',
                        }}>
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                                <ListItem sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                    <ListItem><ReactionComponent numberOfReaction={likesNumber}
                                                                 handleReaction={handleLike} status={currentStatus}
                                                                 type={"like"}/></ListItem>
                                    <ListItem><ReactionComponent numberOfReaction={dislikesNumber}
                                                                 handleReaction={handleDislike} status={currentStatus}
                                                                 type={"dislike"}/></ListItem>
                                </ListItem>
                                <Tooltip title={`${likesNumber} / ${dislikesNumber}`}><LinearProgress
                                    variant="determinate" value={progressNumber}/></Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8} lg={9} xl={9}
                                  sx={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                      alignItems: 'center'
                                  }}>
                                <ListItem sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}>
                                    {replyComment && <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => replyComment(id)}
                                    >
                                        Reply
                                    </Typography>}
                                </ListItem>
                            </Grid>
                        </Grid>
                    </>
                }
            />
            {deleteComment && <DeleteCommentModal open={deleteModal} onClose={handleDeleteModalClose} commentId={id}
                                                  deleteComment={deleteComment}/>}
            <ReportCommentModal open={reportModal} onClose={handleReportModalClose} userId={userId} commentId={id} linkNickname={linkNickname}/>
        </ListItem>
    );
};

export default Comment;
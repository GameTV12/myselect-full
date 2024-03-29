import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle} from "@mui/material"
import {deletePostRequest} from "../../utils/authRequest";

type DeletePostModalProps = {
    deletePost: (commentId: string) => void
    commentId: string
}


const DeletePostModal = ({onClose, open, deletePost, commentId}: DialogProps & DeletePostModalProps) => {
    const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
        deletePost(commentId)
        deletePostRequest(commentId)
        if (onClose) {
            onClose(e, "backdropClick")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleDelete(e)
    }

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
            onKeyDown={handleKeyDown}
        >
            <DialogTitle sx={{ textAlign: "center" }}>{"Del`ete this post?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                   Do you really want to delete this post?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {onClose && <Button onClick={(e) => onClose(e, "backdropClick")}>No</Button>}
                {onClose && <Button onClick={(e) => handleDelete(e)}>Yes</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default DeletePostModal;
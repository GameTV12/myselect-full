import React, { useState } from 'react';
import Post, {PostInterface} from "../components/post/Post"
import {Grid, List} from "@mui/material"

const ReservedPostList = () => {
    const [postList, setPostList] = useState<PostInterface[]>([]);

    function deletePost(postId: string) {
        setPostList(postList.filter((post) => post.id != postId))
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                {/*<List sx={{bgcolor: 'background.paper'}}>*/}
                {/*    {postList.map((post) => {*/}
                {/*        return <Post key={post.id} id={post.id} nickname={post.nickname}*/}
                {/*                     linkNickname={post.linkNickname}*/}
                {/*                     userPhoto={post.userPhoto} text={post.text} createdAt={post.createdAt}*/}
                {/*                     status={post.status}*/}
                {/*                     userId={post.userId} photos={post.photos} video={post.video}*/}
                {/*                     likes={post.likes} dislikes={post.dislikes} commentsAllowed={post.commentsAllowed}*/}
                {/*                     title={post.title} variants={post.variants} isVoted={post.isVoted}*/}
                {/*                     variantsAllowed={post.variantsAllowed}*/}
                {/*                     deletePost={deletePost}/>*/}
                {/*    })}*/}
                {/*</List>*/}
            </Grid>
        </Grid>
    );
};

export default ReservedPostList;
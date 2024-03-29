import React, {useEffect, useState} from 'react';
import {Variant} from "./Post";
import VariantBar from "./VariantBar";
import {Divider, IconButton, InputBase, Paper} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import {useCookies} from "react-cookie";
import {UserI} from "../../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";

interface PollBlockProps {
    variants: Variant[]
    postId: string
    isVoted?: boolean
    fullPost?: boolean
    voteForVariant: (id: string) => void
}

const PollBlock = ({variants, postId, isVoted, voteForVariant, fullPost}: PollBlockProps) => {
    const totalVotes = variants.reduce((x, y) => (x + y.votes), 0)
    const [wordFilter, setWordFilter] = useState('')
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    let numberOfVariants = 5
    if (fullPost) numberOfVariants = 25

    console.log(variants)
    return <>
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 1 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search option"
                inputProps={{ 'aria-label': 'search google maps' }}
                value={wordFilter}
                onChange={(e) => setWordFilter(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
        {isVoted==false ?
            variants.filter(item=> item.text.toLowerCase().includes(wordFilter.toLowerCase())).slice(0, numberOfVariants).map((item, index) => <VariantBar postId={postId} voteForVariant={voteForVariant} percentage={0} id={item.id} title={item.text} numberOfVotes={'You haven\'t been voted yet'} key={index} />)
            :
            variants.sort((a, b) => b.votes - a.votes).filter(item=> item.text.toLowerCase().includes(wordFilter.toLowerCase())).slice(0, numberOfVariants).map((item, index) => <VariantBar postId={postId} percentage={totalVotes != 0 ? Number((item.votes/totalVotes * 100).toFixed(2)) : 0} id={item.id} title={item.text} numberOfVotes={item.votes.toString()} key={index} />)
        }
        </>
}

export default PollBlock
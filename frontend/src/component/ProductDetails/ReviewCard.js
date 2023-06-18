import React from 'react'
import { Rating } from '@material-ui/lab'
import { profilePng } from '../../constants/assets'

const ReviewCard = ({ review }) => {

    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5
    }

    return (
        <div className='review-card'>
            <img src={profilePng} alt='User' />
            <p>{review.name}</p>
            <Rating {...options} />
            <span className='review-card-comment'>{review.comment}</span>
        </div>
    )
}

export default ReviewCard

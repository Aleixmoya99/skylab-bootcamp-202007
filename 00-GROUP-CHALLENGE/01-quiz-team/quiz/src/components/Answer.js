import React from 'react';
import './../css/Answer.css'

function Answer(props){
    console.log(props.answer)
    
    
    return(
        <>
            <div className="answer_container" >
                <p>{props.answer}</p>
            </div>
    </>
    )
}

export default Answer;
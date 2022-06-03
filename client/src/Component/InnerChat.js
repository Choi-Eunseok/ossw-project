import React from 'react';

function InnerChat(props) {
    return (
        <div>
            <div style={{fontSize:20, borderWidth:0}}>{props.value}</div>
            <div style={{color: 'gray', textAlign: 'right', borderWidth:0}}>{props.time}</div>
        </div>
    );
}

export default InnerChat;

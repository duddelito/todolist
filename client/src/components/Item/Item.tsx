import React from "react";
import {Draggable} from 'react-beautiful-dnd';

import './Item.css';

const Item = (props: any) => {

    // Some style on the items while being dragged
    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        background: isDragging ? "cornflowerblue" : "#ffffff",
        color: isDragging ?  "#ffffff": "#000000",
        ...draggableStyle
    })

    return(
        <Draggable key={props.item.id} draggableId={props.item.id} index={props.index}>
            {(provided, snapshot) => (
                <li key={props.item.id} className="item" data-name={props.item.id} onClick={props.handleEdit}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                    <span className="edit" data-itemid={props.item.id} data-listid={props.currentList}></span>
                    <h3>{props.item.title}</h3>
                    <p>{props.item.description}</p>
                    <p className="dueDate">{props.item.dueDate}</p>
                    <i className="keyprop">keyprop: {props.item.id}</i>
                </li>
            )}
        </Draggable>
    );
}

export default Item;
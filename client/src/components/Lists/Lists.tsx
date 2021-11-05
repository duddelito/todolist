import React from "react";
import {Droppable} from 'react-beautiful-dnd';

import './Lists.css';

import I18n from "../../services/I18n";
import Item from '../Item/Item';



const Lists = (props: any) => {

    const columnLists = props.lists.map(function(column:any, id: number) {
        return (
            <Droppable droppableId={id.toString()}>
                {(provided) => (
                    <ul className="column" {...provided.droppableProps} ref={provided.innerRef}>
                        <h2>{I18n.get.lists[id]}</h2>

                        {column.map((item:any, index: number) => (
                            <Item item={item} index={index} handleEdit={props.handleEdit} currentList={id.toString()} />
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        );

    });

    return(columnLists);
}

export default Lists;
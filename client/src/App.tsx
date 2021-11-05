import React, {useEffect, useState} from "react";
import {DragDropContext, DropResult} from "react-beautiful-dnd";

import './App.css';

import Lists from "./components/Lists/Lists";
import Form from "./components/Form/Form";
import I18n from "./services/I18n";


const App = () => {
    const [loading, setLoading] = useState(false);

    const handleLoader = (loading: boolean) => {
        setLoading(loading);
    }

    let initialLists = [];
    const [lists, setLists] = useState(initialLists);

    const handleLists = (data: any) => {
        setLists(data);
    }

    useEffect(() => {
        let requestUrl = 'http://localhost:3001/';
        requestUrl += 'todo/get';

        fetch(requestUrl)
            .then((response) => response.json())
            .then((data) => {
                setLists(data);
            });
    }, []);

    const updateServer = (data) => {
        let requestUrl = 'http://localhost:3001/';
        requestUrl += 'todo/update';
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch(requestUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {});
    }

    const handleEdit = (event: any) => {
        const indexId = event.target.dataset.indexid;
        const listId = event.target.dataset.listid;
        const item = lists[listId][indexId];
        console.log('editing...');
        console.log(item);
    }

    const onDragEnd = ({ source, destination }: DropResult) => {

        // Don't proceed if we are not moving an item
        if (!destination) return;

        // If we are moving items within the same list
        if (source.droppableId === destination.droppableId) {

            let currentList = lists[source.droppableId];

            // Remove item from old index in the list
            const [removedItem] = currentList.splice(source.index, 1);

            // Add the item to the new index in the list
            currentList.splice(destination.index, 0, removedItem);
        }
        // If we're moving from one list to another
        else {
            let sourceList = lists[source.droppableId];
            let destinationList = lists[destination.droppableId];

            // Remove item from the source list
            const [removedItem] = sourceList.splice(source.index, 1);

            // Add the item to the destination list
            destinationList.splice(destination.index, 0, removedItem);
        }

        // Update state and store latest in the backend
        setLists(lists);
        updateServer(lists);
    }

    return (
        <div className="app">
            <h1>To do list app</h1>
            <DragDropContext onDragEnd={onDragEnd}>
                <Lists lists={lists} handleEdit={handleEdit} />
            </DragDropContext>
            <Form value={I18n.get.labels.search} loading={handleLoader} buttonValue={I18n.get.labels.add} handleLists={handleLists} />
            {loading && (<div className="loader"></div>)}
        </div>
    );
}

export default App
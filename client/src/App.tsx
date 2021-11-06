import React, {useEffect, useState} from "react";
import {DragDropContext, DropResult} from "react-beautiful-dnd";

import './App.css';

import Search from "./components/Search/Search";
import Lists from "./components/Lists/Lists";
import Form from "./components/Form/Form";
import I18n from "./services/I18n";
import Button from "./components/Button/Button";


const App = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: ''
    };

    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState({
        id: "",
        title: "",
        dueDate: "",
        description: ""
    });

    const handleEdit = (event: any) => {
        const indexId = event.target.dataset.indexid;
        const listId = event.target.dataset.listid;

        const currentItem = lists[listId][indexId];
        setSelectedItem(currentItem);
    }

    const handleLoader = (loading: boolean) => {
        setLoading(loading);
    }

    const [lists, setLists] = useState([]);

    const handleLists = (data: any) => {
        setLists(data);
    }

    const setDummyListsContent = () => {
        const sampleData: any = [
            [
                {id: '0', dueDate: '2021-11-31', title: 'Item 0', description: 'Item 0'},
                {id: '1', dueDate: '2021-11-31', title: 'Item 1', description: 'Item 1'},
                {id: '2', dueDate: '2021-11-31', title: 'Item 2', description: 'Item 2'},
                {id: '3', dueDate: '2021-11-31', title: 'Item 3', description: 'Item 3'},
                {id: '4', dueDate: '2021-11-31', title: 'Item 4', description: 'Item 4'},
                {id: '5', dueDate: '2021-11-31', title: 'Item 5', description: 'Item 5'},
                {id: '6', dueDate: '2021-11-31', title: 'Item 6', description: 'Item 6'},
                {id: '7', dueDate: '2021-11-31', title: 'Item 7', description: 'Item 7'},
                {id: '8', dueDate: '2021-11-31', title: 'Item 8', description: 'Item 8'},
                {id: '9', dueDate: '2021-11-31', title: 'Item 9', description: 'Item 9'},
            ],
            [],
            []
        ];
        setLists(sampleData);
    }

    const [searchValue, setSearchValue] = useState('');
    const handleSearchValue = (data: any) => {
        setSearchValue(data);
    }

    const filteredLists = () => {

        if (!searchValue) {
            return lists;
        }

        let filteredLists: any = [];
        lists.forEach((list: any, listKey: number) => {

            // Filter list based on searchValue
            const filteredList = list.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
            filteredLists.push(filteredList);
        });

        return filteredLists;
    }

    // On app load get data from backend
    useEffect(() => {
        const requestUrl = baseUrl + 'todo/get';

        fetch(requestUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data[0].length !== 0 || data[1].length !== 0 && data[2].length !== 0) {
                    setLists(data);
                }
            });
    }, []);

    const updateServer = (data) => {
        const requestUrl = baseUrl + 'todo/update';
        requestOptions.body = JSON.stringify(data);

        fetch(requestUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {});
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
            {lists.length === 0 ? <Button value="Add sample content" onClick={setDummyListsContent} /> : ''}

            <Search handleSearchValue={handleSearchValue} />

            <DragDropContext onDragEnd={onDragEnd}>
                <Lists lists={filteredLists()} handleEdit={handleEdit} />
            </DragDropContext>
            <Form value={I18n.get.labels.search} loading={handleLoader} handleLists={handleLists} lists={lists} selectedItem={selectedItem} requestOptions={requestOptions} baseUrl={baseUrl} />
            {loading && (<div className="loader"></div>)}
        </div>
    );
}

export default App
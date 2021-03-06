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
        const listId = event.target.dataset.listid;
        const itemId = event.target.dataset.itemid;
        const list: any = lists[listId];

        if (!list) {
            return;
        }

        const itemIndex = list.findIndex(item => item.id === itemId);

        const currentItem = lists[listId][itemIndex];
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
                {id: '0', dueDate: '2021-11-10', title: 'Item 0', description: 'Item 0'},
                {id: '1', dueDate: '2021-11-11', title: 'Item 1', description: 'Item 1'},
                {id: '2', dueDate: '2021-11-12', title: 'Item 2', description: 'Item 2'},
                {id: '3', dueDate: '2021-11-13', title: 'Item 3', description: 'Item 3'},
                {id: '4', dueDate: '2021-11-14', title: 'Item 4', description: 'Item 4'},
                {id: '5', dueDate: '2021-11-15', title: 'Item 5', description: 'Item 5'},
                {id: '6', dueDate: '2021-11-16', title: 'Item 6', description: 'Item 6'},
                {id: '7', dueDate: '2021-11-17', title: 'Item 7', description: 'Item 7'},
                {id: '8', dueDate: '2021-11-18', title: 'Item 8', description: 'Item 8'},
                {id: '9', dueDate: '2021-11-19', title: 'Item 9', description: 'Item 9'},
            ],
            [],
            []
        ];
        setLists(sampleData);
        updateServer(sampleData);
    }

    const [searchValue, setSearchValue] = useState('');
    const handleSearchValue = (data: any) => {
        setSearchValue(data);
    }

    const filteredLists = () => {

        // Only filter when there is a search string
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
                // Only setLists if there is at least one item
                if (data[0].length === 0 && data[1].length === 0 && data[2].length === 0) {
                    // All empty
                }
                else {
                    setLists(data);
                }
            });
    }, []);

    // Update the lists on the server
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

        let sourceList = lists[source.droppableId];
        let destinationList = lists[destination.droppableId];

        // Remove item from the source list
        const [removedItem] = sourceList.splice(source.index, 1);

        // Make sure there is an item, fixes crash on drag n drop after search
        if (!removedItem) {
            return;
        }

        // Add the item to the destination list
        destinationList.splice(destination.index, 0, removedItem);

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

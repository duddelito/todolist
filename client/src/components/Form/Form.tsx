import React, {useEffect, useState} from "react";

import './Form.css';

import I18n from "../../services/I18n";
import Input from '../Input/Input';
import Button from '../Button/Button';

const Form = (props: any) => {

    const [search, setSearch] = useState('');
    const [orgList, setOrgList] = useState(props.lists);

    const handleSearch = (event: any) => {
        setSearch(event.target.value);
        console.log(props.lists);
    }

    const [itemData, setItemData] = useState({
        id: "",
        title: "",
        dueDate: "",
        description: ""
    });

    useEffect(() => {

        if (props.selectedItem) {
            setItemData(props.selectedItem);
        }

    }, [props.selectedItem]);

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        setItemData({
            ...itemData,
            [event.target.name]: value
        });

    }

    const handleClick = (event: any) => {
        event.preventDefault();
        props.loading(true);

        // Require title
        if (itemData.title.length < 1) {
            return;
        }

        let requestUrl = props.baseUrl;
        if (event.target.name === 'delete') {
            requestUrl += 'todo/delete';
        }
        else if (itemData.id.length < 1) {
            requestUrl += 'todo/add';
        }
        else {
            requestUrl += 'todo/edit';
        }

        props.requestOptions.body = JSON.stringify(itemData);

        fetch(requestUrl, props.requestOptions)
            .then((response) => response.json())
            .then((data) => {
                props.handleLists(data);

                setItemData({
                    id: "",
                    title: "",
                    dueDate: "",
                    description: ""
                });
            });




        props.loading(false);
    }

    return(
        <div className="form">
            <h4>{I18n.get.labels.addDescription}</h4>
            <form>
                <Input type="hidden" name="id" value={itemData.id} />
                <Input type="text" name="title" value={itemData.title} onChange={handleChange} title={I18n.get.labels.title} />
                <label>{I18n.get.labels.dueDate}
                    <Input type="date" name="dueDate" value={itemData.dueDate} onChange={handleChange} />
                </label>
                <textarea name="description" value={itemData.description} onChange={handleChange} placeholder={I18n.get.labels.description}>{itemData.description}</textarea>
                <Button value={itemData.id ? I18n.get.labels.save : I18n.get.labels.add} onClick={handleClick} />
                {itemData.id && <Button class="delete" value={I18n.get.labels.delete} onClick={handleClick} />}
            </form>
            <div className="search">
                <form>
                    <Input type="text" name="search" value={search} onChange={handleSearch} placeholder={I18n.get.labels.search} />
                </form>
            </div>
        </div>
    );
}

export default Form;

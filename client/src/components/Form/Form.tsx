import React, {useState} from "react";

import './Form.css';

import I18n from "../../services/I18n";
import Input from '../Input/Input';
import Button from '../Button/Button';

const Form = (props: any) => {

    const [itemData, setItemData] = useState({
        title: "",
        dueDate: "",
        description: ""
    });

    // const handleItem = (data: any) => {
    //     console.log('denna datan först att kolla: ');
    //     console.log(data);
    //     setItemData(data);
    // }

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        setItemData({
            ...itemData,
            [event.target.name]: value
        });
    }

    const handleButtonClick = (event: any) => {
    // const handleButtonClick = (param: any) => (event: any) => {
        event.preventDefault();
        props.loading(true);

        // Require title
        if (itemData.title.length < 1) {
            return;
        }

        let requestUrl = 'http://localhost:3001/todo/add';
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        };

        fetch(requestUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                props.handleLists(data);
            });

        setItemData({
            title: "",
            dueDate: "",
            description: ""
        });
        props.loading(false);
    }

    return(
        <div className="form">
            <h4>{I18n.get.labels.addDescription}</h4>
            <form>
                <Input type="text" name="title" value={itemData.title} onChange={handleChange} title={I18n.get.labels.title} />
                <label>{I18n.get.labels.dueDate}
                    <Input type="date" name="dueDate" value={itemData.dueDate} onChange={handleChange} />
                </label>
                <textarea name="description" value={itemData.description} onChange={handleChange} placeholder={I18n.get.labels.description}>{itemData.description}</textarea>
                <Button value={props.buttonValue} onClick={handleButtonClick} />
            </form>
        </div>
    );
}

export default Form;

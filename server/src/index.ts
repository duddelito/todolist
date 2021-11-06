
// https://learn.coderslang.com/0021-nodejs-require-is-not-defined-error/

// const express = require("express");
// import express from 'express';
import express, {Request,Response,Application} from 'express';
import cors from 'cors';
// import { writeFileSync, readFileSync } as fs from 'fs';
import * as fs from "fs";
// import fetch from 'node-fetch';

const PORT = process.env.PORT || 3001;

const app:Application = express();
const crossDomain = cors();
app.use(crossDomain);

app.use(express.json());


// Returns complete "todos" list
app.get("/todo/get", (request:Request,  response:Response) => {

    fs.readFile('./todos.json', 'utf8', (error, data) => {
        try {
            let todos = JSON.parse(data);
            response.json(todos);
            console.log('Returned current list');
        } catch (error) {
            console.log('No todo list found');
        }
    });

});


app.post('/todo/add', function(request:Request, response:Response) {

    // Prepare new to do item
    const newTodo = {
        id: '0',
        dueDate: request.body.dueDate,
        title: request.body.title,
        description: request.body.description,
    };

    // Read to see if there already is a to do list
    fs.readFile('./todos.json', 'utf8', (error, data) => {

        // If no list, then create one
        if (error) {
            console.log('No list found');

            // Put item in a list
            const lists = [
                [newTodo], // Todo list
                [], // Doing list
                [] // Done list
            ];
            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (error) {
                    console.log('Error creating file', error);
                } else {
                    console.log('Successfully created file');
                    response.json(lists);
                }
            });
            return;
        }

        // Else try to update the list with the new item
        try {

            // let todos: any = [];
            let lists: any;
            if (data.length > 0) {
                lists = JSON.parse(data);
            }

            let itemsCount = 0;
            lists.forEach((element: any) => {
                itemsCount += element.length;
            });

            newTodo.id = itemsCount.toString();
            lists[0].push(newTodo);

            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (error) {
                    console.log('Error updating file', error);
                } else {
                    console.log('Successfully updated file with new todo');
                    response.json(lists);
                }
            });

        } catch (err) {
            console.log('Error parsing JSON:', err);
        }
    });
});


app.post('/todo/edit', function(request:Request, response:Response) {

    // Prepare new to do item
    const editedTodo = {
        id: request.body.id,
        dueDate: request.body.dueDate,
        title: request.body.title,
        description: request.body.description,
    };

    // Read to see if there already is a to do list
    fs.readFile('./todos.json', 'utf8', (error, data) => {

        // If no list, then create one
        if (error) {
            console.log('No list found');
            return;
        }

        // Else try to update the list with the new item
        try {

            // let todos: any = [];
            let lists: any;
            if (data.length > 0) {
                lists = JSON.parse(data);
            }

            lists.forEach((list: any, listKey: number) => {
                list.forEach((item: any, itemKey: number) => {
                    if (item.id === editedTodo.id) {
                        lists[listKey][itemKey] = editedTodo;
                    }
                });
            });

            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (error) {
                    console.log('Error updating file', error);
                } else {
                    console.log('Successfully updated file with the edited todo');
                    response.json(lists);
                }
            });

        } catch (err) {
            console.log('Error parsing JSON:', err);
        }
    });
});


app.post('/todo/delete', function(request:Request, response:Response) {

    // Prepare new to do item
    const toDelete = request.body.id;

    // Read to see if there already is a to do list
    fs.readFile('./todos.json', 'utf8', (error, data) => {

        // If no list, then create one
        if (error) {
            console.log('No list found');
            return;
        }

        // Else try to update the list with the new item
        try {

            // let todos: any = [];
            let lists: any;
            if (data.length > 0) {
                lists = JSON.parse(data);
            }

            lists.forEach((list: any, listKey: number) => {
                list.forEach((item: any, itemKey: number) => {
                    if (item.id === toDelete) {
                        lists[listKey].splice(itemKey, 1);
                    }
                });
            });

            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (error) {
                    console.log('Error updating file', error);
                } else {
                    console.log('Successfully updated file deleting a todo');
                    response.json(lists);
                }
            });

        } catch (err) {
            console.log('Error parsing JSON:', err);
        }
    });
});


app.post('/todo/update', function(request:Request, response:Response) {
    try {

        const lists = request.body;
        fs.writeFile('./todos.json', JSON.stringify(lists), error => {
            if (error) {
                console.log('Error updating file', error);
            } else {
                console.log('Successfully updated file with new order');
                response.json(lists);
            }
        });

    } catch (err) {
        console.log('Error parsing JSON:', err);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
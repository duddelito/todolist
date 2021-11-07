import express, {Request,Response,Application} from 'express';
import cors from 'cors';
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get("/get", (request:Request,  response:Response) => {

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


router.post('/add', function(request:Request, response:Response) {

    // Prepare new to do item
    const newTodo = {
        id: uuidv4(),
        dueDate: request.body.dueDate,
        title: request.body.title,
        description: request.body.description,
        archived: ''
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

            newTodo.id = uuidv4();;
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


router.put('/edit', function(request:Request, response:Response) {

    // Prepare new to do item
    const editedTodo = {
        id: request.body.id,
        dueDate: request.body.dueDate,
        title: request.body.title,
        description: request.body.description,
        archived: ''
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


router.delete('/delete', function(request:Request, response:Response) {

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


router.post('/update', function(request:Request, response:Response) {
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

export default router;
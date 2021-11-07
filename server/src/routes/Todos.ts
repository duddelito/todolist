import express, {Request,Response,Application} from 'express';
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


router.get("/get", (request:Request,  response:Response) => {
    fs.readFile('./todos.json', 'utf8', (error, data) => {
        if (!error) {
            let todos = JSON.parse(data);
            response.json(todos);
            console.log('Returned current list');
        }
    });
});


router.post('/add', function(request:Request, response:Response) {

    // Prepare new to-do item
    const newTodo = {
        id: uuidv4(),
        dueDate: request.body.dueDate,
        title: request.body.title,
        description: request.body.description,
    };

    // Read to see if there already is a to-do list
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

            // Store lists
            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (!error) {
                    response.json(lists);
                    console.log('Successfully created file');
                }
            });
        }
        // Else try to update the list with the new item
        else {
            // let todos: any = [];
            let lists: any;
            if (data.length > 0) {
                lists = JSON.parse(data);
            }

            // Add the new item to the to-do list and give it a unique id
            newTodo.id = uuidv4();
            lists[0].push(newTodo);

            // Store the lists
            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (!error) {
                    response.json(lists);
                    console.log('Successfully updated file with new todo');
                }
            });
        }
    });
});


router.put('/edit', function(request:Request, response:Response) {

    // Prepare new to-do item
    const editedTodo = {
        id: request.body.id,
        dueDate: request.body.dueDate,
        title: request.body.title,
        description: request.body.description,
    };

    // Read to see if there already is a to-do list
    fs.readFile('./todos.json', 'utf8', (error, data) => {

        if (!error) {
            let lists: any;
            if (data.length > 0) {
                lists = JSON.parse(data);
            }

            // Updated the edited item
            lists.forEach((list: any, listKey: number) => {
                list.forEach((item: any, itemKey: number) => {
                    if (item.id === editedTodo.id) {
                        lists[listKey][itemKey] = editedTodo;
                    }
                });
            });

            // Store the lists
            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (!error) {
                    response.json(lists);
                    console.log('Successfully updated file with the edited todo');
                }
            });

        }
    });
});


router.delete('/delete', function(request:Request, response:Response) {

    // Prepare new to-do item
    const toDelete = request.body.id;

    // Read to see if there already is a to-do list
    fs.readFile('./todos.json', 'utf8', (error, data) => {

        if (!error) {
            let lists: any;
            if (data.length > 0) {
                lists = JSON.parse(data);
            }

            // Remove the item to be deleted from the list
            lists.forEach((list: any, listKey: number) => {
                list.forEach((item: any, itemKey: number) => {
                    if (item.id === toDelete) {
                        lists[listKey].splice(itemKey, 1);
                    }
                });
            });

            // Store the lists
            fs.writeFile('./todos.json', JSON.stringify(lists), error => {
                if (!error) {
                    response.json(lists);
                    console.log('Successfully updated file deleting a todo');
                }
            });
        }
    });
});


router.post('/update', function(request:Request, response:Response) {

    const lists = request.body;

    // Store the updated lists order
    fs.writeFile('./todos.json', JSON.stringify(lists), error => {
        if (!error) {
            response.json(lists);
            console.log('Successfully updated file with new order');
        }
    });

});

export default router;

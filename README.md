#Todo list app



##Install
`git clone https://github.com/duddelito/todolist.git`

I've used node version 16.10.0 for both frontend - React and backend Node.js with Express.js.
You should be able to set it up by running `npm install` in both the client and server folders. 
I'm using Typescript on both frontend and backend to try to learn and become used to it :)

The React frontend runs on http://localhost:3000 and the backend on http://localhost:3001

In client/package.json there is a proxy making this possible to work. 
`"proxy": "http://localhost:3001",`

##Backend
Just as an "easy" solution the backend stores the todos in a json file. Obviously it might have been a better idea to use a database for a real app, but just to be able to save down some data and to have some fun playing with Node.js a bit.

##Frontend
The todos are sortable using react beautiful dnd, and so the app is quite inspired by trello which I like to use.
Regarding the styling, I just put in a little bit of love so that the app does not look like crap. My focus has been on the logic to make the app work the way I want.

##Sample content
If you haven't added any todos you're able to use the button "Add sample content".

##Warnings in the console
I am experiencing a warning in the app: `Warning: Each child in a list should have a unique "key" prop`

I've double-checked that the `<li>` element has a unique key prop and I also 
found this link where they have the same problem with react beautiful dnd:
https://github.com/atlassian/react-beautiful-dnd/issues/2084
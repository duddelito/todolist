const Request = (endpoint: string, data: object) => {
    return new Promise((resolve: any, reject: any) => {
        // if (value && value.length < 3) {
        //     resolve('');
        // }

        let requestUrl = 'http://localhost:3001/todo/create';
        // let requestUrl = 'http://localhost:3001/api';


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };


        fetch(requestUrl, requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default Request;

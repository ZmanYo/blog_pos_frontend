import React from 'react';
import {Redirect} from 'react-router-dom';
import {ORDER_ITEM_ENDPOINT, ORDER_ITEMS_ENDPOINT} from "./endpoints";

function lookupOptionsPOST(data) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
}

let lookupOptionsGET = {
    method: "GET",
    headers: {
        'Content-Type': 'application/json'
    }
};

let lookupOptionsDEL = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
};

function lookupOptionsPUT(data) {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
}


function postData(endpoint, data) {
    fetch(endpoint, lookupOptionsPOST).then(
        function(response) {
            return response.json()
        }
    ).then(
        function(responseData) {
            console.log(responseData)
        }
    )
}

function putData(endpoint, data) {
    let lookupOptions = {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(endpoint, lookupOptions).then(
        function(response) {
            return response.json()
        }
    ).then(
        function(responseData) {
            return <Redirect to='/' />;
        }
    )
}

function fetchData(endpoint, thisComp, state, doneLoading) {
    fetch(endpoint, lookupOptionsGET).then(
      function (response) {
          return response.json()
      }
    ).then(
        function (responseData) {
            thisComp.setState({
                [state]: responseData,
                doneLoading: doneLoading
            })

        }
    )
}

function postQtyChange(action, id, thisComp) {
    let item;
    let data;
    const endpoint = ORDER_ITEM_ENDPOINT + `${id}/`;
    switch (action){
        case 'ADD':
            fetch(endpoint, lookupOptionsGET).then(
                function(response) {
                    return response.json()
                }
                ).then(
                    function(responseData) {
                        item = responseData;
                        data = {
                            id: item.id,
                            product_related: item.product_related,
                            order_related: item.order_related,
                            qty: item.qty + 1
                        };
                        fetch(endpoint, lookupOptionsPUT(data)).then(
                            function(response){
                                return response.json()
                            }
                        ).then(
                            function(responseData){
                                thisComp.getOrderItems(item.order_related);
                                thisComp.getOrder(item.order_related)
                            }
                        )
                    }
            );
            break;
        case 'REMOVE':
            fetch(endpoint, lookupOptionsGET).then(
                function(response) {
                    return response.json()
                }
                ).then(
                    function(responseData) {
                        item = responseData;
                        data = {
                            id: item.id,
                            product_related: item.product_related,
                            order_related: item.order_related,
                            qty: item.qty - 1
                        };
                        fetch(endpoint, lookupOptionsPUT(data)).then(
                            function(response){
                                return response.json()
                            }
                        ).then(
                            function(responseData){
                                thisComp.getOrderItems(item.order_related);
                                thisComp.getOrder(item.order_related)
                            }
                        )
                    }
            );
            break;
        case 'DELETE':
            fetch(endpoint, lookupOptionsDEL).then(
                function(){
                    thisComp.componentDidMount()
                }
            );
            break;
        default:
            thisComp.componentDidMount()
    }
}


function addOrEditProduct(order_id, product_id, thisComp) {
    const endpoint = ORDER_ITEMS_ENDPOINT + `?product_related=${product_id}&order_related=${order_id}`;
    fetch(endpoint, lookupOptionsGET).then(
        function(response){
            return response.json()
        }
    ).then(function(responseData){
        let data = {};
        if (responseData.length > 0){
            console.log('edit product', responseData);
            data = {
                id: responseData[0].id,
                product_related: responseData[0].product_related,
                order_related: responseData[0].order_related,
                qty: responseData[0].qty + 1
            };
            console.log('edit product data', data);

            fetch(ORDER_ITEM_ENDPOINT + `${responseData[0].id}/`, lookupOptionsPUT(data)).then(
                function(response){
                    return response.json()
                }
            ).then(function(responseData){thisComp.componentDidMount()})
        } else {
            console.log('new product');
            const data = {
                product_related: product_id,
                order_related: order_id,
                qty: 1
            };
            
            fetch(ORDER_ITEMS_ENDPOINT, lookupOptionsPOST(data)).then(
                function(response){
                    return response.json()
                }
            ).then(function(responseData){
                thisComp.componentDidMount()
            })
        }
    })
}



export {fetchData, postData, postQtyChange, putData, addOrEditProduct, lookupOptionsGET, lookupOptionsPOST}
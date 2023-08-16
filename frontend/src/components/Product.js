import { Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../store';


export default function Product(props) {
    const { product } = props;
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        //req for backend
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({ type: 'CARD_ADD_ITEM', payload: { ...item, quantity }, });
    };
    return (
        <Card className="product">
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} className='card-img-top' />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>Rs {product.price}</Card.Text>
                {product.countInStock === 0? <Button variant='light' disabled>Out of Stock</Button>
                :<Button id='add_cart' onClick={() => addToCartHandler(product)}>Add To Cart</Button>}
            </Card.Body>
        </Card>
    )
}

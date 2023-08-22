import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import React,{ useContext } from 'react';
import { Store } from '../store';
import { toast } from 'react-toastify';

function Product(props) {
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
      toast.error('Sorry. Product is out of stock',{
        position:toast.POSITION.TOP_CENTER,
      });
      return;
    }
    ctxDispatch({
      type: 'CARD_ADD_ITEM',
      payload: { ...item, quantity },
    });
    toast.success("Added Successfully!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
  };

  return (
    <div >
    <Card id="custom-card">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body className="custom-card-body">
        <Link to={`/product/${product.slug}`} id="product-name">
          <Card.Title id="product-name">{product.name}</Card.Title>
        </Link>
        <div id="product-rating"><Rating  rating={product.rating} numReviews={product.numReviews}  /></div>
        
        <Card.Text id="product-price">1Kg Price: ${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled id="product-button">
            Out of stock
          </Button>
        ) : (
          <Button  onClick={() => addToCartHandler(product)} variant='light' className="custom-card-button" id="product-button">Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
    </div>
  );
}
export default Product;


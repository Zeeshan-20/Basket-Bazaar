import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge, Button, Card, ListGroup } from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../store';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function ProductScreen() {
    // slug from url and show it on screen to do that we use hook from reacter router dom the name of this is use param 
    const navigate=useNavigate(); 
    const params = useParams();
    const { slug } = params;

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',

    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }

        };
        fetchData();
    }, [slug]);
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    //ADD TO CARD HANDLER 105 LINE YOU WILL FIND
    const addToCartHandler = async () => {
        //for cart if qunatity is less or many more
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
        }
        ctxDispatch({ type: 'CARD_ADD_ITEM', payload: { ...product, quantity: 1 }, });
        navigate('/cart');
    };
    return (
        loading ? <LoadingBox />
            :
            error ? <MessageBox variant="danger">{error}</MessageBox>
                :
                <div>
                    <Row>
                        <Col md={6}>
                            <img className="img-large" src={product.image} alt={product.name}>
                            </img>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>Price : Rs {product.price}</ListGroup.Item>
                                <ListGroup.Item>
                                    <p>Description:<p>{product.description}</p></p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>Rs {product.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>{product.countInStock > 0 ?
                                                    <Badge bg="success">In Stock</Badge>
                                                    : <Badge bg="danger">Unavilable</Badge>}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <div className='d-grid'>
                                                    <Button onClick={addToCartHandler} variant='primary'>
                                                        Add To Cart
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>
                </div>
    )


}

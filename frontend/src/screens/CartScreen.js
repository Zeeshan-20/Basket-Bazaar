import { useContext } from 'react'
import { Store } from '../store';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartScreen() {
    const navigate=useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const updateCartHandler = async (item, quantity) => {
        //req for backend
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({ type: 'CARD_ADD_ITEM', payload: { ...item, quantity}, });
    };
    const removeItemHandler = (item)=>{
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload:item  });
    }
    const checkoutHandler =()=>{
        navigate('/signin?redirect=/shipping')
    }
    return (
        <div className="footer-avoiding">
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1 id="heading-of-all-section">Shopping Cart</h1>
            <Row>
                <Col md={12} id="extra-sub-heading-of-all-section">
                    {cartItems.length === 0 ?
                        <MessageBox variant="light" id="extra-sub-heading-of-all-section">
                            Cart is Empty. <Link to="/" id="link-color"><strong>Go Shopping</strong></Link>
                        </MessageBox>
                        :
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item Key={item._id} >
                                    <Row className='align-items-center'>
                                    <Link to={`/product/${item.slug}`} id="product-link-color"> <strong id="product-heading">{item.name}</strong></Link>
                                        <Col md={4} >
                                            
                                            <img
                                                src={item.image}
                                                alt={item.image}
                                                className='img-fluid rounded img-thumbnail'
                                                style={{ width: '150px', height: '150px' }}
                                            ></img>{' '}
                                            {/* <Link to={`/product/${item.slug}`} id="product-link-color"> <strong>{item.name}</strong></Link> */}
                                        </Col>
                                        <Col md={3}>
                                            <Button variant='light'id="cartScreen-fa-btn" disabled={item.quantity === 1} onClick={() => updateCartHandler(item, item.quantity - 1)}>
                                                <i className='fas fa-solid fa-minus' id="cartScreen-fa"> </i>
                                            </Button>{' '}
                                            <span>{item.quantity}</span>{' '}
                                            <Button variant='light'id="cartScreen-fa-btn" disabled={item.quantity === item.countInStock} onClick={() => updateCartHandler(item, item.quantity + 1)}>
                                                {/* <i className='fas fa-plus-circle' id="cartScreen-fa"> </i> */}
                                                <i className='fas fa-solid fa-plus' id="cartScreen-fa"> </i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button variant='light' id="trash-button" onClick={()=>removeItemHandler(item)} >
                                                <i className='fas fa-solid fa-trash'> </i>
                                                
                                            </Button>
                                        </Col>
                                    </Row>

                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    }
                {/* </Col> */}
                {/* <Col md={4}> */}
                    <Card className='my-3 mb-4'>
                        <Card.Body >
                            <ListGroup.Item variant='flush' display="inline-block">
                                <Row>
                                <Col md={6}>
                                <h3 id="extra-heading-of-all-section">
                                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                    items):{' '}$
                                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                </h3>
                                </Col>
                                
                            {/* </ListGroup.Item>
                            <ListGroup.Item variant='flush'> */}
                            <Col md={6}>
                                <div className='d-grid'>
                                    <Button type="button" 
                                    variant='light' id="product-button"
                                    onClick={checkoutHandler}
                                     disabled={cartItems.length === 0}>
                                        Proceed to Checkout
                                    </Button>
                                </div>
                                </Col>
                                </Row>
                            </ListGroup.Item>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

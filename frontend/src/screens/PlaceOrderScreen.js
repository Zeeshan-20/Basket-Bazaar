import React, { useContext, useEffect, useReducer } from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import { Helmet } from 'react-helmet-async'
import { Card, Col, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { Store } from '../store'
import { Link, useNavigate } from 'react-router-dom'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import Axios  from 'axios'
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
    const navigate = useNavigate();
    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
      });
    
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;



    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 20 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = async () => {
        try {
          dispatch({ type: 'CREATE_REQUEST' });
    
          const { data } = await Axios.post(
            '/api/orders',
            {
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: cart.paymentMethod,
              itemsPrice: cart.itemsPrice,
              shippingPrice: cart.shippingPrice,
              taxPrice: cart.taxPrice,
              totalPrice: cart.totalPrice,
            },
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          ctxDispatch({ type: 'CART_CLEAR' });
          dispatch({ type: 'CREATE_SUCCESS' });
          localStorage.removeItem('cartItems');
          navigate(`/order/${data.order._id}`);
        } catch (err) {
          dispatch({ type: 'CREATE_FAIL' });
          toast.error(getError(err));
        }
      };
 
    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);
    return (
        <div className="footer-avoiding">
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>Preview Order</Helmet>
            <h1 className="mb-3 my-3" id="heading-of-all-section">Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title id="extra-heading-of-all-section">Shipping</Card.Title>
                            <Card.Text id="extra-sub-heading-of-all-section">
                                <strong>Name:</strong>{cart.shippingAddress.fullName} <br />
                                <strong>Address:</strong>{cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{cart.shippingAddress.country}
                            </Card.Text>
                            <Link to='/shipping' id="edit-link-style">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3 my-3">
                        <Card.Body>
                            <Card.Title id="extra-heading-of-all-section">Payment</Card.Title>
                            <Card.Text id="extra-sub-heading-of-all-section">
                                <strong>Method:</strong> {Card.paymentMethod}
                            </Card.Text>
                            <Link to="/payment" id="edit-link-style">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3 my-3'>
                        <Card.Body>
                            <Card.Title id="extra-heading-of-all-section">Items</Card.Title>
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item) => (
                                    <Row className='align-items-center'>
                                        <Link to={`/product/${item.slug}`}id="product-link-color"><div id="product-heading-placeorder">{item.name}</div></Link>
                                        <Col md={6}>
                                            <img src={item.image} alt={item.name}
                                                className='img-fluid rounded img-thumbnail' style={{ width: '190px', height: '190px' }}
                                            ></img>{''}
                                            {/* <Link to={`/product/${item.slug}`}><strong id="product-heading">{item.name}</strong></Link> */}
                                        </Col>
                                        <Col md={3}><span id="extra-sub-heading-of-all-section">{item.quantity}Kg</span></Col>
                                        <Col md={3} id="number-styling">${item.price}</Col>
                                    </Row>
                                ))}
                            </ListGroup>
                            <Link to='/cart'id="edit-link-style">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col >
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title id="extra-heading-of-all-section">Order Summary</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroup.Item >
                                    <Row id="extra-sub-heading-of-all-section">
                                        <Col>Items</Col>
                                        <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row id="extra-sub-heading-of-all-section">
                                        <Col>Shipping</Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row id="extra-sub-heading-of-all-section"> 
                                        <Col>Tax Price</Col>
                                        <Col>${cart.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row id="extra-sub-heading-of-all-section">
                                        <Col>
                                            <strong>Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${cart.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button type="button" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0} id="product-button" variant='light'>
                                            Place Order
                                        </Button>
                                    </div>
                                    {loading && <LoadingBox></LoadingBox>}
                                </ListGroup.Item>


                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

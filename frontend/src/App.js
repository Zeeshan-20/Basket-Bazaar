import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import * as React from "react";
import ProductScreen from "./screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap'
import { Badge, Button, Nav, NavDropdown } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Store } from "./store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from './screens/ProfileScreen';
import axios from "axios";
import { getError } from "./utils";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter >
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        } id="whole-body"
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header >
        {/* bg="dark" variant="dark"  */}
          <Navbar expand="lg" id="navbar-color">
            <Container>
              {/* for sidebar variant="dark" */}
              <Button id="navbar-btn" className="navbar-hov"
                
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              {/* side bar end  */}
              <LinkContainer to="/"><Navbar.Brand id="navbar-heading">Basket Bazaar</Navbar.Brand></LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                {/* search box */}
                <SearchBox />
                {/* search box end */}
                <Nav className="me-auto w-100 justify-content-end" >
                  <Link to='/cart' className="nav-link">
                  <ShoppingCartIcon id="cart-icon"/>
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.length}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ?
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item id="basic-nav-dropdown-item">User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/orderhistory'>
                        <NavDropdown.Item id="basic-nav-dropdown-item">Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className="dropdown-item" to="#signout" onClick={signoutHandler} id="basic-nav-dropdown-item">
                        <strong>Sign Out</strong>
                      </Link>
                    </NavDropdown> :
                    <Link className='nav-link' to='/signin'>
                      Sign In
                    </Link>}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item id="basic-nav-dropdown-item">Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

        </header>
        {/* side bar start  */}
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  // to={`/search/category=${category}`}
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        {/* side bar end */}
        <main id="body-color">
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>}></Route>
              <Route path="/orderhistory" element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }></Route>
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer className="text-center">
          <div><h1>All Rights Reserved</h1></div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
